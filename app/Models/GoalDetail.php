<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoalDetail extends Model
{
    use HasFactory, AssignToAuth;

    protected $guarded = [];
}
