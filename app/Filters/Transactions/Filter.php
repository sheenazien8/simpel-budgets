<?php

namespace App\Filters\Transactions;

use App\Filters\AbstractFilter;

class Filter extends AbstractFilter
{
    protected $filters = [
        'account_id' => AccountId::class,
        'account_target' => AccountTarget::class,
        'budget_id' => BudgetId::class,
        'type' => Type::class,
        'month_id' => MonthId::class,
    ];
}
