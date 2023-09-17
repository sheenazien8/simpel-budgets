<?php

namespace App\Models;

use App\Filters\Accounts\Filter;
use App\Traits\AssignToAuth;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperAccount
 */
class Account extends Model
{
    use HasFactory, AssignToAuth, Filterable;

    protected $filter = Filter::class;

    protected $fillable = [
        'name',
        'total',
        'hide',
        'saving'
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class)->latest();
    }
}
