<?php

namespace App\Http\Requests;

use App\Models\Budget;
use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "plan" => "required",
            "month_id" => [ "required", "numeric", "min:1" ],
            "nominal" => [ "required", "numeric" ],
            "account_id" => [ "required_if:type,2"]
        ];
    }

    public function created(): void
    {
        Budget::create($this->request->all());
    }

    public function messages(): array
    {
        return [
            "month_id.min" => "Bulan harus dipilih",
            "account_id.required_if" => "Jika tipenya tabungan akun harus dipilih"
        ];
    }
}
