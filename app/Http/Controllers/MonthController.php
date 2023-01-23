<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMonthRequest;
use App\Http\Requests\UpdateMonthRequest;
use App\Models\Month;
use Exception;
use Illuminate\Http\JsonResponse;

class MonthController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            "data" => Month::query()
                ->filter(request())
                ->withSum("budgets", "nominal")
                ->withSum("transactions", "nominal")
                ->selectSub(
                    "select if(transactions_sum_nominal > budgets_sum_nominal, 'melebihi', 'aman')",
                    "over_budget_desc"
                )
                ->selectSub(
                    "select if(transactions_sum_nominal > budgets_sum_nominal, true, false)",
                    "over_budget"
                )
                ->addSelect(["months.*"])
                ->where("user_id", auth()->id())
                ->get(),
        ]);
    }

    public function store(StoreMonthRequest $request): JsonResponse
    {
        $request->created();
        return response()->json([
            "data" => [],
            "message" => "month has been created",
        ]);
    }

    public function show(Month $month)
    {
        return response()->json([
            "data" => $month,
        ]);
    }

    public function update(UpdateMonthRequest $request, Month $month)
    {
        $request->updated($month);
        return response()->json([
            "data" => [],
            "message" => "month has been updated",
        ]);
    }

    public function destroy(Month $month)
    {
        $month->budgets->count() > 0 ? throw new Exception("Bulan ini mempunyai anggaran") : "";
        $month->transactions->count() > 0 ? throw new Exception("Bulan ini mempunyai transaksi") : "";
        $month->delete();
        return response()->json([
            "data" => [],
            "message" => "month has been deleted",
        ]);
    }
}
