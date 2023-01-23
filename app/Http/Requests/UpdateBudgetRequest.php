<?php

namespace App\Http\Requests;

use App\Models\Budget;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "plan" => "required",
            "month_id" => "required",
            "nominal" => [ "required", "numeric" ],
        ];
    }

    public function updated(Budget $budget): void
    {
       $budget->update($this->request->all());
    }
}
