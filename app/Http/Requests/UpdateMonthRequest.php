<?php

namespace App\Http\Requests;

use App\Models\Month;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMonthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => "required",
            "year" => "required|integer|min:1900|max:2100"
        ];
    }

    public function updated(Month $month): void
    {
       $month->update($this->request->all());
    }
}
