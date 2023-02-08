<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfileRequest;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profile = optional(auth()->user())->with('profile')->first();

        return response()->json([
            'data' => $profile,
        ]);
    }

    public function store(StoreProfileRequest $request)
    {
        $request->createOrUpdate();

        return response()->json([
            'data' => [],
            'message' => 'Profil berhasil disimpan',
        ]);
    }

    public function show(Profile $profile): JsonResponse
    {
        return response()->json([
            'data' => $profile
        ]);
    }

    public function destroy(Profile $profile): JsonResponse
    {
        $profile->delete();

        return response()->json([
            'data' => $profile
        ]);
    }
}
