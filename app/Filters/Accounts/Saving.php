<?php

namespace App\Filters\Accounts;

class Saving
{
    public function filter($builder, $value)
    {
        return $builder->where('saving', $value == "true");
    }
}

