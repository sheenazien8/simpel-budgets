<?php

namespace App\Http\Controllers;

use App\Http\Requests\CopyBudgetRequest;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Models\Budget;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filter = $request->user()->filters()->where("key", "budgets")->first();
        $budgets = Budget::query()
            ->selectSub(
                "select concat(`name`, ' - ', `year`) from months where months.id = budgets.month_id ",
                "month"
            )
            ->filter($request)
            ->withDefaultFilter($filter, function () use ($request) {
                if (!in_array($request->get('month_id'), [""]) || !is_null($request->get("plan"))) {
                    return true;
                }
                return false;
            })
            ->addSelect("budgets.*")
            ->withSum("transactions", "nominal")
            ->orderBy("month", "desc")
            ->byCurrentUser()
            ->get();

        return response()->json([
            "data" => [
                "data" => $budgets,
                "total_nominal_budgets" => $budgets->sum("nominal"),
            ],
        ]);
    }

    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $request->created();

        return response()->json([
            "data" => [],
            "message" => "budget has been created",
        ]);
    }

    public function show(Budget $budget)
    {
        return response()->json([
            "data" => $budget,
        ]);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        $request->updated($budget);

        return response()->json([
            "data" => [],
            "message" => "budget has been updated",
        ]);
    }

    public function destroy(Budget $budget)
    {
        throw_if($budget->transactions()->exists(), Exception::class, "Anggaran ini mempunyai cashflow");
        $budget->delete();

        return response()->json([
            "data" => [],
            "message" => "budget has been deleted",
        ]);
    }

    public function copy(CopyBudgetRequest $request)
    {
        $request->copying();

        return response()->json([
            "data" => [],
            "message" => "budget has been copied",
        ]);
    }
}
