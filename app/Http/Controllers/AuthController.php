<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $token =  $request->login();

        // set the jwt token is expired in 1 year
        return response()->json([
            "data" => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL()
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
        return response()->json(Auth::user());
    }

    public function logout()
    {
        Auth::logout();

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
