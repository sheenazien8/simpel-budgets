<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }

    public function createOrUpdate()
    {
        $image = $this->file('photo');
        $image_name = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('images'), $image_name);
        if ($this->user()->profile()->exists()) {
            $this->user()->profile()->update($this->validated());
        } else {
            $this->user()->profile()->create($this->validated());
        }
    }
}
