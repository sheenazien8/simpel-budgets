<?php

namespace App\Http\Controllers;

use App\Enums\DebtType;
use App\Http\Requests\StoreDebtPaymentRequest;
use App\Http\Requests\UpdateDebtPaymentRequest;
use App\Models\Debt;
use App\Models\DebtPayment;

class DebtPaymentController extends Controller
{
    public function index(Debt $debt)
    {
        $debt->load("payments");

        return response()->json([
            "data" => $debt,
        ]);
    }

    public function store(StoreDebtPaymentRequest $request)
    {
        $request->created();

        return response()->json([
            "data" => [],
            "message" => "debt payment has been created",
        ]);
    }

    public function show(Debt $debt, DebtPayment $payment)
    {
        if ($debt->id != $payment->debt_id) {
            return response()->json([
                "data" => [],
                "message" => "debt payment not found",
            ], 404);
        }

        return response()->json([
            "data" => $payment->load("debt"),
        ]);
    }

    public function update(UpdateDebtPaymentRequest $request)
    {
        $request->updated();

        return response()->json([
            "data" => [],
            "message" => "debt payment has been updated",
        ]);
    }

    public function destroy(Debt $debt, DebtPayment $payment)
    {
        if ($debt->id != $payment->debt_id) {
            return response()->json([
                "data" => [],
                "message" => "debt payment not found",
            ], 404);
        }
        $account = $payment->account;
        match ((int) $debt->type) {
            DebtType::debt->value => $account->total += $payment->amount,
            DebtType::receivable->value => $account->total -= $payment->amount,
        };
        $debt->status = 2;
        $debt->save();
        $account->save();
        $payment->transaction->delete();
        $payment->delete();

        return response()->json([
            "data" => [],
            "message" => "debt payment has been deleted",
        ]);
    }
}
