<?php

namespace App\Http\Requests;

use App\Models\Month;
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
            "name" => [
                "required",
                function($attr, $value, $fail) {
                    $exists = in_array($value, Month::query()
                        ->byCurrentUser()
                        ->where("year", $this->year)
                        ->get()
                        ->pluck("name")
                        ->toArray());

                    if ($exists) {
                        $fail("Bulan ditahun ini sudah ada");
                        return;
                    }
                    return;
                }
            ],
            "year" => "required|integer|min:1900|max:2100"
        ];
    }

    public function created(): void
    {
        Month::create($this->request->all());
    }
}
