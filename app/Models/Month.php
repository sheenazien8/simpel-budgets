<?php

namespace App\Models;

use App\Filters\Months\Filter as MonthFilter;
use App\Traits\AssignToAuth;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Month extends Model
{
    use HasFactory,
        AssignToAuth,
        Filterable;

    protected $filter = MonthFilter::class;

    protected $guarded = [];

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class)->withSum("transactions", "nominal");
    }

    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(Transaction::class, Budget::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 0);
    }

    protected function firstDateInMonthYear(): Attribute
    {
        // replace string month with number
        $month = str_replace([
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ], [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
        ], $this->name);

        return Attribute::make(
            get: fn () => $this->year . "-" . $month . "-01",
        );
    }
}
