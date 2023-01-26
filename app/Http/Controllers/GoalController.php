<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Models\Goal;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $goals = Goal::query()
            ->where("user_id", auth()->id())
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
        throw_if($goal->user_id !== auth()->id(), Exception::class, "Kamu tidak memiliki akses ke goal ini");

        return response()->json([
            "data" => $goal,
        ]);
    }

    public function update(UpdateGoalRequest $request, Goal $goal)
    {
        throw_if($goal->user_id !== auth()->id(), Exception::class, "Kamu tidak memiliki akses untuk mengubah data ini");
        $request->updated($goal);

        return response()->json([
            "data" => [],
            "message" => "goal has been updated",
        ]);
    }

    public function destroy(Goal $goal)
    {
        throw_if($goal->user_id !== auth()->id(), Exception::class, "Kamu tidak memiliki akses untuk menghapus tujuan ini");
        throw_if($goal->goalDetails()->exists(), Exception::class, "Kamu tidak dapat menghapus tujuan ini karena sudah memiliki detail tujuan");
        $goal->delete();

        return response()->json([
            "data" => [],
            "message" => "goal has been deleted",
        ]);
    }
}
