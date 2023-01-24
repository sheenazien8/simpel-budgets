<?php

use App\Models\Filter;
use App\Models\Month;
use Illuminate\Database\Eloquent\Builder;

trait DefaultFilter
{
    public function scopeWithDefaultFilter(Builder $builder, Filter $filter, callable $bypass): Builder
    {
        return $builder->when($filter?->default, function (Builder $query) use ($filter, $bypass) {
            if ($bypass()) {
                return;
            }

            $query->when($filter->default->show_active_month, function (Builder $query) {
                $query->whereIn("month_id", Month::active()
                    ->byCurrentUser()
                    ->get()
                    ->pluck("id")
                );
            });

            $query->when($filter->default->show_current_and_next_month, function (Builder $query) {
                $currentMonth = __('month.' . now()->format('F'));
                $currentYear = now()->format('Y');
                $nextMonth = __('month.' . now()->addMonth()->format('F'));
                $month = Month::whereIn('name', [$currentMonth, $nextMonth])
                    ->byCurrentUser()
                    ->where('year', $currentYear)
                    ->get();

                $query->whereIn('month_id', $month->pluck('id'));
            });
        });
    }
}
