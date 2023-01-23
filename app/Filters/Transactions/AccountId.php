<?php

namespace App\Filters\Transactions;

class AccountId
{
    public function filter($builder, $value)
    {
        return $builder->where('account_id', $value);
    }
}
