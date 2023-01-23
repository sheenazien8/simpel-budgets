<?php

namespace App\Filters\Transactions;

class BudgetId
{
    public function filter($builder, $value)
    {
        return $builder->where('budget_id', $value);
    }
}
