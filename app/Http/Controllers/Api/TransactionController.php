<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Month;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $currentMonth = __('month.' . now()->format('F'));
        $currentYear = now()->format('Y');
        $month = Month::whereIn('name', [$currentMonth])
            ->byCurrentUser()
            ->where('year', $currentYear)
            ->first();
        // $budgetIds = Budget::query()->where("month_id", $month->id)->get()->pluck("id")->toArray();
        $transactionAttrbite = Transaction::query()
            ->addSelect([
                "sum_expense_month" => Transaction::selectRaw("SUM(nominal)")
                    ->byCurrentUser()
                    ->when(
                        !$request->filled("date") &&
                        !($request->filled("start_date") && $request->filled("end_date")) &&
                        !$request->filled("month"), function ($query) use ($month) {
                            $query->whereMonth("date", now()->format("m"))
                                  ->whereYear("date", $month?->year);
                        })
                    ->when($request->filled("date"), function ($query) use ($request) {
                        $query->where("date", $request->date);
                    })
                    ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                        $query->whereBetween("date", [$request->start_date, $request->end_date]);
                    })
                    ->when($request->filled("month"), function ($query) use ($request) {
                        $query->whereMonth("date", $request->month);
                    })
                    ->where('type', 1),
                "sum_income_month" => Transaction::query()
                    ->selectRaw("sum(nominal)")
                    ->byCurrentUser()
                    ->when(
                        !$request->filled("date") &&
                        !($request->filled("start_date") && $request->filled("end_date")) &&
                        !$request->filled("month"), function ($query) use ($month) {
                            $query->whereMonth("date", now()->format("m"))
                                  ->whereYear("date", $month?->year);
                        })
                    ->when($request->filled("date"), function ($query) use ($request) {
                        $query->where("date", $request->date);
                    })
                    ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                        $query->whereBetween("date", [$request->start_date, $request->end_date]);
                    })
                    ->when($request->filled("month"), function ($query) use ($request) {
                        $query->whereMonth("date", $request->month);
                    })
                    ->where('type', 2),
            ])
            ->first();

        $total_transactions = Transaction::byCurrentUser()
            ->filter($request)
            ->when($request->filled("date"), function ($query) use ($request) {
                $query->where("date", $request->date);
            })
            ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                $query->whereBetween("date", [$request->start_date, $request->end_date]);
            })
            ->when($request->filled("month"), function ($query) use ($request) {
                $query->whereMonth("date", $request->month);
            })
            ->selectRaw("count(id) as total")
            ->first()
            ->total;

        $transactions = Transaction::query()
                ->selectRaw(DB::raw("IF(type = 1, nominal, 0) as expense"))
                ->addSelect([
                    "transactions.*",
                    "budget_name" => Budget::select("plan")->whereColumn("budget_id", "budgets.id"),
                    "account_name" => Account::select("name")->whereColumn("account_id", "accounts.id"),
                    "account_target_name" => Account::select("name")->whereColumn("account_target", "accounts.id"),
                ])
                ->filter($request)
                ->byCurrentUser()
                ->when($request->filled("date"), function ($query) use ($request) {
                    $query->where("date", $request->date);
                })
                ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                    $query->whereBetween("date", [$request->start_date, $request->end_date]);
                })
                ->when($request->filled("month"), function ($query) use ($request) {
                    $query->whereMonth("date", $request->month);
                })
                ->orderBy("created_at", "desc")
                ->limit(20)
                ->offset($request->input("offset") ?? 0)
                ->get();
        $budgets = Budget::query()
            ->selectRaw("SUM(nominal) as total_plan")
            ->byCurrentUser()
            ->where("month_id", $month->id)
            ->first();

        return response()->json([
            'data' => [
                'data' => $transactions,
                'transaction_sum_nominal_expense' => $transactionAttrbite->sum_expense_month,
                'transaction_sum_nominal_income' => $transactionAttrbite->sum_income_month,
                'total_transactions' => $total_transactions,
                'total_plan' => $budgets->total_plan,
            ],
        ]);
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $request->created();

        return response()->json([
            'data' => [],
            'message' => 'transaction has been created'
        ]);
    }

    public function show(Transaction $transaction)
    {
        return response()->json([
            'data' => $transaction,
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $request->updated($transaction);

        return response()->json([
            'data' => [],
            'message' => 'transaction has been updated'
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        $this->transaction = $transaction;
        switch ($transaction->type) {
        case 1:
            $this->expenseAccount();
            break;
        case 2:
            $this->incomeAccount();
            break;
        case 3:
            $this->transferAccount();
            break;
        default:
            throw new ValidationException("Invalid Type");
            break;
        }
        $transaction->delete();

        return response()->json([
            'data' => [],
            'message' => 'transaction has been deleted'
        ]);
    }

    private function expenseAccount(): void
    {
        $previousTotal = $this->transaction->account->total + $this->transaction->nominal;

        $this->transaction->account->update([
            'total' => $previousTotal
        ]);
    }

    private function incomeAccount(): void
    {
        $previousTotal = $this->transaction->account->total - $this->transaction->nominal;

        $this->transaction->account->update([
            'total' => $previousTotal
        ]);
    }

    private function transferAccount(): void
    {
        $account_from = $this->transaction->account;
        $account_from->total += $this->transaction->nominal;
        $account_from->save();

        $account_target = $this->transaction->account_target_data;
        $account_target->total -= $this->transaction->nominal;
        $account_target->save();
    }
}
