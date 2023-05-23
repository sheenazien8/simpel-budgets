<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class LoginRequest extends FormRequest
{
    private User $auth;

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "username" => ["required", function($attr, $val, $fail) {
                $user = User::where("name", $val)->orWhere("email", $val)->first();
                if (!$user) {
                    $fail("User doesn't exist in database");
                    return false;
                }
                if (!$user->email_verified_at) {
                    $fail("User is not verified");
                    return false;
                }
                if (!Hash::check($this->request->get("password"), $user->password)) {
                    $fail("Password or username is invalid");
                    return false;
                }
                $this->auth = $user;
                return true;
            }],
            "password" => ["required"]
        ];
    }

    public function login(): string
    {
        if (! $token = auth()->login($this->auth)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $token;
    }

}
