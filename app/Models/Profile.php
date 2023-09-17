<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperProfile
 */
class Profile extends Model
{
    use HasFactory,
        AssignToAuth;

    protected $fillable = [
        'user_id',
        'address',
        'phone',
        'photo',
    ];
}
