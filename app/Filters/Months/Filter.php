<?php

namespace App\Filters\Months;

use App\Filters\AbstractFilter;

class Filter extends AbstractFilter
{
    protected $filters = [
        'status' => Status::class,
    ];
}

