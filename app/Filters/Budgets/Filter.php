<?php

namespace App\Filters\Budgets;

use App\Filters\AbstractFilter;

class Filter extends AbstractFilter
{
    protected $filters = [
        'plan' => Plan::class,
        'month_id' => Month::class
    ];
}

