<?php

namespace App\Filters\Transactions;

use App\Models\Month;

class MonthId
{
    public function filter($builder, $value)
    {
        return $builder
            ->whereMonth("date", now()
                ->parse(Month::find($value)
                ->getEnglishMonthVersion())
            ->format('m'));
    }
}

