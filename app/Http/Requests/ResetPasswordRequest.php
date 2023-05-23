<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "email" => ["required", "email", "exists:users,email"],
            "password" => ["required", "confirmed"]
        ];
    }

    public function sendToEmail(): void
    {
        Password::sendResetLink($this->request->all(), function($ok) {
        });
    }

    public function resetPassword(): void
    {
        if ($this->request->has("token")) {
            Password::reset($this->request->all(), function($user, $password) {
                $user->password = bcrypt($password);
                $user->save();
            });
        } else {
            $user = auth()->user();
            $user->password = bcrypt($this->password);
            optional($user)->save();
        }
    }
}
