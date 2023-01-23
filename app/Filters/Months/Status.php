<?php

namespace App\Filters\Months;

class Status
{
    public function filter($builder, $value)
    {
        return $builder->where('status', $value == "true");
    }
}

