<?php

namespace App\Http\Requests;

use App\Models\Month;
use App\Rules\ExistMonthInYear;
use Illuminate\Foundation\Http\FormRequest;

class StoreMonthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => ["required", new ExistMonthInYear($this->year)],
            "year" => ["required", "integer", "min:1900", "max:2100"]
        ];
    }

    public function created(): void
    {
        Month::create($this->request->all());
    }
}
