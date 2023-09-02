<?php

namespace App\Http\Controllers\Api;

use App\Enums\BudgetType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Month;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    private function getThisMonth(Request $request, Month $month = null)
    {
        return [!$request->filled("date") &&
            !($request->filled("start_date") && $request->filled("end_date")) &&
            !$request->filled("month_id"), function ($query) use ($month) {
            $query->whereMonth("date", now()->format("m"))
                ->whereYear("date", $month?->year);
        }];
    }

    public function index(Request $request): JsonResponse
    {
        $currentMonth = __('month.' . now()->format('F'));
        $currentYear = now()->format('Y');
        $month = Month::whereIn('name', [$currentMonth])
            ->byCurrentUser()
            ->where('year', $currentYear)
            ->first();

        $transactionAttrbite = Transaction::query()
            ->select("id")
            ->addSelect([
                "sum_expense_month" => Transaction::selectRaw("SUM(nominal)")
                    ->filter($request)
                    ->byCurrentUser()
                    ->when(...$this->getThisMonth($request, $month))
                    ->when($request->filled("date"), function ($query) use ($request) {
                        $query->where("date", $request->date);
                    })
                    ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                        $query->whereBetween("date", [$request->start_date, $request->end_date]);
                    })
                    ->where('type', 1)
                    ->whereHas('budget', function ($query) {
                        $query->where('type', BudgetType::Expense);
                    }),
                "sum_income_month" => Transaction::query()
                    ->filter($request)
                    ->selectRaw("sum(nominal)")
                    ->byCurrentUser()
                    ->when(...$this->getThisMonth($request, $month))
                    ->when($request->filled("date"), function ($query) use ($request) {
                        $query->where("date", $request->date);
                    })
                    ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                        $query->whereBetween("date", [$request->start_date, $request->end_date]);
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
            ->select(DB::raw("count(id) as total"))
            ->first();

        $transactions = Transaction::query()
            ->selectRaw(DB::raw("IF(type = 1, nominal, 0) as expense"))
            ->addSelect([
                "transactions.*",
                "budget_name" => Budget::select("plan")->whereColumn("budget_id", "budgets.id"),
                "account_name" => Account::select("name")->whereColumn("account_id", "accounts.id"),
                "account_target_name" => Account::select("name")->whereColumn("account_target", "accounts.id"),
                "total_nominal" => Transaction::selectRaw("SUM(nominal)")->whereColumn("id", "transactions.id"),
            ])
            ->filter($request)
            ->byCurrentUser()
            ->when($request->filled("date"), function ($query) use ($request) {
                $query->where("date", $request->date);
            })
            ->when($request->filled("start_date") && $request->filled("end_date"), function ($query) use ($request) {
                $query->whereBetween("date", [$request->start_date, $request->end_date]);
            })
            ->orderBy("date", "desc")
            ->orderBy("created_at", "desc")
            ->limit(20)
            ->offset($request->input("offset") ?? 0)
            ->get();

        $budgets = Budget::query()
            ->selectRaw("SUM(nominal) as total_plan")
            ->byCurrentUser()
            ->where("month_id", $month?->id)
            ->first();

        return response()->json([
            'data' => [
                'data' => $transactions->load("debtPayment.debt"),
                'transaction_sum_nominal_expense' => $transactionAttrbite->sum_expense_month,
                'transaction_sum_nominal_income' => $transactionAttrbite->sum_income_month,
                'total_transactions' => $total_transactions,
                'total_plan' => $budgets->total_plan,
                'total_saving' => $transactionAttrbite->sum_income_month - $transactionAttrbite->sum_expense_month,
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
        DB::beginTransaction();
        $previousTotal = $this->transaction->account->total + $this->transaction->nominal;

        $this->transaction->account->update([
            'total' => $previousTotal
        ]);
        if ($this->transaction->budget->type == 2) {
            $previousTotal = $this->transaction->budget->account->total - $this->transaction->nominal;
            $this->transaction->budget->account->update([
                'total' => $previousTotal
            ]);
        }
        DB::commit();
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
