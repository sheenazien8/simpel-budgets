<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperGoal
 */
class Goal extends Model
{
    use HasFactory, AssignToAuth;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'target_date',
        'reminder_per',
        'reminder_day',
        'reminder_time',
        'nominal_target',
    ];

    protected $appends = [
        "presentage",
        "less_days",
    ];

    public function goalDetails(): HasMany
    {
        return $this->hasMany(GoalDetail::class)->orderBy("created_at", "desc");
    }

    public function getPresentageAttribute(): float
    {
        return $this->goalDetails->sum("nominal") / $this->nominal_target  * 100;
    }

    public function getLessDaysAttribute(): int
    {
        return now()->diffInDays($this->target_date);
    }
}
