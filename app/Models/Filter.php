<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperFilter
 */
class Filter extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'model',
        'default',
    ];

    protected $casts = [
        "default" => "object",
    ];
}
