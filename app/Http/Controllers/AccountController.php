<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use Exception;
use Illuminate\Http\JsonResponse;

class AccountController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'data' => $account = Account::where("user_id", auth()->id())
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
            'data' => $account,
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
