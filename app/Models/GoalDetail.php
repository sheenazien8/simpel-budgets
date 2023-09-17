<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperGoalDetail
 */
class GoalDetail extends Model
{
    use HasFactory, AssignToAuth;

    protected $fillable = [
        'date',
        'goal_id',
        'date',
        'nominal',
    ];
}
