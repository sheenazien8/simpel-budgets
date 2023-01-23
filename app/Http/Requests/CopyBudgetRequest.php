<?php

namespace App\Http\Requests;

use App\Models\Budget;
use Illuminate\Foundation\Http\FormRequest;

class CopyBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "month_id" => "required",
            "ids" => ["required", "array"],
        ];
    }

    public function copying(): void
    {
        $budgets = Budget::query()
            ->whereIn("id", $this->ids)
            ->where("user_id", auth()->id())
            ->get();

        foreach ($budgets as $budget) {
            $budget->replicate()->fill([
                "month_id" => $this->month_id,
            ])->save();
        }
    }
}

