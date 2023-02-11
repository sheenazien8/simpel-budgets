<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalDetailRequest;
use App\Models\Goal;

class GoalDetailController extends Controller
{
    public function index(Goal $goal)
    {
        $goal = $goal
            ->loadSum("goalDetails", "nominal")
            ->load("goalDetails");

        return response()->json([
            "data" => $goal,
        ]);
    }

    public function store(StoreGoalDetailRequest $request, Goal $goal)
    {
        $request->created($goal);

        return response()->json([
            "data" => [],
            "message" => "goal detail has been created",
        ]);
    }

    public function destroy(Goal $goal, $goalDetailId)
    {
        $goalDetail = $goal->goalDetails()->findOrFail($goalDetailId);
        $goalDetail->delete();

        return response()->json([
            "data" => [],
            "message" => "goal detail has been deleted",
        ]);
    }
}
