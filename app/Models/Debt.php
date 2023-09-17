<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperDebt
 */
class Debt extends Model
{
    use HasFactory, AssignToAuth;

    protected $fillable = [
        'name',
        'description',
        'amount',
        'date',
        'type',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function payments()
    {
        return $this->hasMany(DebtPayment::class);
    }
}
