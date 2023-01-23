<?php

namespace App\Filters\Transactions;

class Type
{
    public function filter($builder, $value)
    {
        return $builder->where('type', $value);
    }
}
