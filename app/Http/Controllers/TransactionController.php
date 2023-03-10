<?php

namespace App\Http\Controllers;

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
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $currentMonth = __('month.' . now()->format('F'));
        $currentYear = now()->format('Y');
        $month = Month::whereIn('name', [$currentMonth])
            ->byCurrentUser()
            ->where('year', $currentYear)
            ->first();
        // $budgetIds = Budget::query()->where("month_id", $month->id)->get()->pluck("id")->toArray();
        $transactions = Transaction::query()
                ->selectRaw(DB::raw("IF(type = 1, nominal, 0) as expense"))
                ->addSelect([
                    "total_transactions" => Transaction::selectRaw("count(id)"),
                    "transactions.*",
                    "budget_name" => Budget::select("plan")->whereColumn("budget_id", "budgets.id"),
                    "account_name" => Account::select("name")->whereColumn("account_id", "accounts.id"),
                    "account_target_name" => Account::select("name")->whereColumn("account_target", "accounts.id"),
                    "transaction_sum_nominal_current_month" => Transaction::selectRaw("SUM(nominal)")
                        ->byCurrentUser()
                        ->filter($request)
                        // ->orWhereIn("budget_id", $budgetIds)
                        ->whereMonth("date", now()->format("m"))
                        ->whereYear("date", $month->year)
                        ->where('type', 1),
                ])
                //->orWhere("budget_id", null)
                ->filter($request)
                ->byCurrentUser()
                ->orderBy("created_at", "desc")
                ->limit(20)
                ->simplePaginate();

        // return response()->json([
        //     'data' => [
        //         'data' => $transactions,
        //         'transaction_sum_nominal' => $transactions->first()->transaction_sum_nominal_current_month,
        //         'total_transactions' => $transactions->first()->total_transactions,
        //     ],
        // ]);

        return Inertia::render("Cashflow", []);
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
        throw_if($transaction->user_id !== auth()->id(), Exception::class, "Kamu tidak memiliki akses untuk menghapus transaksi ini");
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
