<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'data' => $account = Account::byCurrentUser()
                    ->filter($request)
                    ->orderBy("name")
                    ->get(),
                'account_sum_total' => $account->sum('total'),
            ]
        ]);
    }

    public function store(StoreAccountRequest $request): JsonResponse
    {
        $request->created();

        return response()->json([
            'data' => [],
            'message' => 'account has been created'
        ]);
    }

    public function show(Account $account)
    {
        return response()->json([
            'data' => $account->load([
                "transactions:id,account_id,account_target,type,budget_id",
                "transactions.budget:id,plan",
                "transactions.account:id,name",
                "transactions.account_target_data:id,name",
            ]),
        ]);
    }

    public function update(UpdateAccountRequest $request, Account $account)
    {
        $request->updated($account);

        return response()->json([
            'data' => [],
            'message' => 'account has been updated'
        ]);
    }

    public function destroy(Account $account)
    {
        throw_if($account->transactions()->exists(), Exception::class, 'Akun ini tidak bisa dihapus karena masih memiliki transaksi');
        $account->delete();

        return response()->json([
            'data' => [],
            'message' => 'account has been deleted'
        ]);
    }
}
