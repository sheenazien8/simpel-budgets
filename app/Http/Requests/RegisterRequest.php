<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            "email" => ["required", "email", "unique:users,email"],
            "name" => ["min:5", "unique:users,name", "regex:/\w*$/"],
            "password" => ["min:5", "confirmed"],
        ];
    }

    public function register()
    {
        $this->replace([
            'name' => $this->request->get('name'),
            'email' => $this->request->get('email'),
            'password' => bcrypt($this->request->get('password')),
        ]);

        $user = User::create($this->all());

        $user->filters()->create([
            "key" => "budgets",
            "model" => $this->model,
            "default" => $this->default,
        ]);
    }
}
