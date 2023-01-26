<?php

namespace App\Http\Requests;

use App\Models\Goal;
use Illuminate\Foundation\Http\FormRequest;

class StoreGoalDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "date" => ["date_format:Y-m-d"],
            "nominal" => ["required", "numeric"],
        ];
    }

    public function created(Goal $goal): void
    {
        if ($this->request->has("date")) {
            $this->request->add([
                "date" => $this->request->get("date"),
            ]);
        } else {
            $this->request->add([
                "date" => now(),
            ]);
        }

        $goal->goalDetails()->create($this->request->all());
        $goal->update([
            "status" => $goal->goalDetails()->sum("nominal") >= $goal->nominal_target
        ]);
    }
}
