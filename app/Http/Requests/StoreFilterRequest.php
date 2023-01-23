<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "key" => ["required", "string"],
            "model" => ["required", "string"],
            "default" => ["required"],
        ];
    }

    public function createOrUpdate(): void
    {
        $filter = $this->user()->filters()->where("key", $this->key)->first();

        if ($filter) {
            $filter->update([
                "model" => $this->model,
                "default" => $this->default,
            ]);
        } else {
            $this->user()->filters()->create([
                "key" => $this->key,
                "model" => $this->model,
                "default" => $this->default,
            ]);
        }
    }
}
