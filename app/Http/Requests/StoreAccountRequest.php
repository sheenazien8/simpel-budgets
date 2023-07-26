<?php

namespace App\Http\Requests;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => "required",
            "total" => ["required", "numeric"]
        ];
    }

    public function created(): void
    {
        $this->request->add([
            "hide" => $this->hide ?? false,
            "saving" => $this->saving ?? false,
        ]);
        Account::create($this->request->all());
    }
}
