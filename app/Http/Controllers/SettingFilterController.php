<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFilterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingFilterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            "data" => [],
        ]);
    }

    public function store(StoreFilterRequest $request): JsonResponse
    {
        $request->createOrUpdate();

        return response()->json([
            "data" => [],
            "message" => "filter has been created",
        ]);
    }
}
