<?php

namespace App\Http\Requests;

use App\Models\Budget;
use App\Models\Transaction;
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
        $keys = [
            [
                'keys' => 'budgets',
                'model' => Budget::class,
                'default' => [
                    "show_current_month" => true,
                    "show_current_and_next_month" => false,
                    "show_active_month" => true,
                ]
            ],
            [
                'keys' => 'transactions',
                'model' => Transaction::class,
                'default' => [
                    "show_current_month" => true,
                    "show_current_and_next_month" => false,
                    "show_active_month" => true,
                ]
            ]
        ];

        foreach ($keys as $key) {
            $filter = $user->filters()->where("key", $key["keys"])->first();
            if (!$filter) {
                $user->filters()->create([
                    "key" => $key["keys"],
                    "model" => $key["model"],
                    "default" => $key["default"],
                ]);
            }
        }
        // buat 12 bulan untuk tahun ketika dia setelah mendaftar bulan menggunakan bahasa indonesia
        $months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        $year = now()->format("Y");
        foreach ($months as $month) {
            $user->months()->create([
                "name" => $month,
                "year" => $year,
            ]);
        }
    }
}
