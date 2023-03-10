<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Goal extends Model
{
    use HasFactory, AssignToAuth;

    protected $guarded = [];

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
