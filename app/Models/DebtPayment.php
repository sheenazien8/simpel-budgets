<?php

namespace App\Models;

use App\Traits\AssignToAuth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperDebtPayment
 */
class DebtPayment extends Model
{
    use HasFactory, AssignToAuth;

    protected $fillable = [
        'debt_id',
        'amount',
        'date',
    ];

    public function debt()
    {
        return $this->belongsTo(Debt::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
