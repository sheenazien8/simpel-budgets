<?php

namespace App\Rules;

use App\Models\Month;
use Illuminate\Contracts\Validation\Rule;

class ExistMonthInYear implements Rule
{
    private string $year;

    public function __construct(string $year)
    {
        $this->year = $year;
    }

    public function passes($attribute, $value)
    {
        $exists = in_array($value, Month::query()
            ->byCurrentUser()
            ->where('year', $this->year)
            ->get()
            ->pluck('name')
            ->toArray());

        return ! $exists;
    }

    public function message()
    {
        return 'Bulan ditahun ini sudah ada';
    }
}
