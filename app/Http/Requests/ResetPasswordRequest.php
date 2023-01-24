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
        ];
    }

    public function sendToEmail(): void
    {
        Password::sendResetLink($this->request->all(), function($ok) {
        });
    }
}
