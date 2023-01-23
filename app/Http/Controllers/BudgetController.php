<?php

namespace App\Http\Controllers;

use App\Http\Requests\CopyBudgetRequest;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Models\Budget;
use App\Models\Month;
use Exception;
use Illuminate\Database\Eloquent\Builder;
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
            ->when($request->plan, function (Builder $query) use ($request) {
                $query->where("plan", "LIKE", "%%$request->plan%%");
            })
            ->when($request->month_id, function (Builder $query) use ($request) {
                $query->where("month_id", $request->month_id);
            })
            ->when($filter?->default, function (Builder $query) use ($filter) {
                $query->when($filter->default->show_active_month, function (Builder $query) {
                    $query->where("month_id", Month::active()->first()->id);
                });
                $query->when($filter->default->show_current_and_next_month, function (Builder $query) {
                    $currentMonth = __('month.' . now()->format('F'));
                    $currentYear = now()->format('Y');
                    $nextMonth = __('month.' . now()->addMonth()->format('F'));
                    $month = Month::whereIn('name', [$currentMonth, $nextMonth])
                        ->where('year', $currentYear)
                        ->get();
                    $query->whereIn('month_id', $month->pluck('id'));
                });
            })
            ->addSelect("budgets.*")
            ->withSum("transactions", "nominal")
            ->orderBy("month", "desc")
            ->where("user_id", auth()->id())
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
