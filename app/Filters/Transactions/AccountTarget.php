<?php

namespace App\Filters\Transactions;

class AccountTarget
{
    public function filter($builder, $value)
    {
        return $builder->where('account_target', $value);
    }
}
