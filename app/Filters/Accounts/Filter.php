<?php

namespace App\Filters\Accounts;

use App\Filters\AbstractFilter;

class Filter extends AbstractFilter
{
    protected $filters = [
        'saving' => Saving::class
    ];
}

