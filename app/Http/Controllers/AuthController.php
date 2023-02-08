<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $token =  $request->login();

        return response()->json([
            "data" => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ]
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $request->register();

        return response()->json([
            'data' => [],
            'message' => "Register is successfully"
        ]);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function resetToken(ResetPasswordRequest $request)
    {
        $request->sendToEmail();

        return response()->json(['message' => 'Success and link has been send to your email!']);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $request->resetPassword();

        return response()->json(['message' => 'Sukses mengganti kata sandi']);
    }
}
