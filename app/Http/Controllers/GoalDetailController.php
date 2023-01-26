<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalDetailRequest;
use App\Models\Goal;
use Illuminate\Http\Request;

class GoalDetailController extends Controller
{
    public function index(Request $request, Goal $goal)
    {
        return response()->json([
            "data" => $goal->load("goalDetails"),
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
}
