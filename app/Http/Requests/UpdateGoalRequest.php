<?php

namespace App\Http\Requests;

use App\Models\Goal;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "title" => ["required", "string", "max:255"],
            "description" => ["nullable", "string"],
            "target_date" => ["required", "date"],
            "nominal_target" => ["required", "numeric"],
            "reminder_per" => ["required", "string", "in:dayly,weekly,monthly,yearly"],
            "reminder_day" => ["requiredIf:reminder_per,weekly", "nullable", "string", "in:monday,tuesday,wednesday,thursday,friday,saturday,sunday"],
            "reminder_time" => ["required", "date_format:Y-m-d H:i:s"],
        ];
    }

    public function updated(Goal $goal): void
    {
       $goal->update($this->request->all());
    }
}
