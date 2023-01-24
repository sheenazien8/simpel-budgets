<?php

namespace App\Filters\Budgets;

class Month
{
    public function filter($builder, $value)
    {
        return $builder->where("month_id", $value);
    }
}


