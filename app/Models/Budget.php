<?php

namespace App\Models;

use App\Filters\Budgets\Filter as BudgetFilter;
use App\Traits\AssignToAuth;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperBudget
 */
class Budget extends Model
{
    use HasFactory, AssignToAuth, Filterable;

    protected $fillable = [
        'plan',
        'month_id',
        'nominal',
        'user_id',
        'type',
        'account_id',
    ];

    protected $filter = BudgetFilter::class;

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function scopeWithDefaultFilter(Builder $builder, ?Filter $filter, callable $bypass): Builder
    {
        return $builder->when($filter?->default, function (Builder $query) use ($filter, $bypass) {
            if ($bypass()) {
                return;
            }

            $query->when($filter->default->show_active_month, function (Builder $query) {
                $monthId = Month::active()
                    ->byCurrentUser()
                    ->get()
                    ->pluck("id");
                $query->whereIn("month_id", $monthId->toArray());
            });

            $query->when($filter?->default?->show_current_month, function (Builder $query) {
                $currentMonth = __('month.' . now()->format('F'));
                $currentYear = now()->format('Y');
                $month = Month::where('name', $currentMonth)
                    ->byCurrentUser()
                    ->where('year', $currentYear)
                    ->get();

                $query->whereIn('month_id', $month->pluck('id'));
            });

            $query->when($filter?->default?->show_current_and_next_month, function (Builder $query) {
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
