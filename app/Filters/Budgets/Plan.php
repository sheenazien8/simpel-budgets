<?php

namespace App\Filters\Budgets;

class Plan
{
    public function filter($builder, $value)
    {
        return $builder->where("plan", "LIKE", "%%$value%%");
    }
}



