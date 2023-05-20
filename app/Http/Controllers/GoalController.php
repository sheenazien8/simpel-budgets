<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Models\Goal;
use Exception;
use Illuminate\Http\JsonResponse;

class GoalController extends Controller
{
    public function index(): JsonResponse
    {
        $dateNow = now()->format("Y-m-d");
        $goals = Goal::query()
            ->select("goals.*")
            ->selectSub(
                "select if('${dateNow}' > target_date, true, false)",
                "over_target_date"
            )
            ->byCurrentUser()
            ->get();

        return response()->json([
            "data" => $goals,
        ]);
    }

    public function store(StoreGoalRequest $request): JsonResponse
    {
        $request->created();

        return response()->json([
            "data" => [],
            "message" => "goal has been created",
        ]);
    }

    public function show(Goal $goal)
    {
        throw_if($goal->user_id !== auth()->id(), new Exception("Unauthorized"));

        return response()->json([
            "data" => $goal,
        ]);
    }

    public function update(UpdateGoalRequest $request, Goal $goal)
    {
        $request->updated($goal);

        return response()->json([
            "data" => [],
            "message" => "goal has been updated",
        ]);
    }

    public function destroy(Goal $goal)
    {
        throw_if($goal->goalDetails()->exists(), new Exception("Kamu tidak bisa menghapus tujuan yang sudah memiliki detail"));
        $goal->delete();

        return response()->json([
            "data" => [],
            "message" => "goal has been deleted",
        ]);
    }
}
