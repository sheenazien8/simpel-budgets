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

    public function goalDetails(): HasMany
    {
        return $this->hasMany(GoalDetail::class);
    }
}
