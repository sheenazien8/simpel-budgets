<?php

namespace App\Http\Controllers;

use App\Enums\DebtType;
use App\Http\Requests\StoreDebtRequest;
use App\Models\Debt;
use Illuminate\Http\Request;

class DebtController extends Controller
{
    public function index(Request $request)
    {
        $debts = Debt::
            select("debts.*")
            ->selectSub("SELECT SUM(amount) FROM debt_payments WHERE debt_id = debts.id", "paid")
            ->byCurrentUser()
            ->orderBy("created_at", "desc")
            /* ->limit($request->input("limit") ?? 20) */
            /* ->offset($request->input("offset") ?? 0) */
            ->get();

        return response()->json([
            'data' => $debts->load("payments:debt_id,amount,date"),
        ]);
    }

    public function store(StoreDebtRequest $request)
    {
        $request->created();

        return response()->json([
            'data' => [],
            'message' => 'debt has been created',
        ]);
    }

    public function destroy(Debt $debt)
    {
        if ($debt->payments()->count() > 0) {
            return response()->json([
                'data' => [],
                'message' => 'debt has payments',
            ], 400);
        }

        // reset account total balance
        match ((int) $debt->type) {
            DebtType::debt->value => $debt->account->total -= $debt->amount,
            DebtType::receivable->value => $debt->account->total += $debt->amount,
        };
        $debt->account->save();

        $debt->delete();

        return response()->json([
            'data' => [],
            'message' => 'debt has been deleted',
        ]);
    }
}
