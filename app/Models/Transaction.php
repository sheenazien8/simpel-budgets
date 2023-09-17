<?php

namespace App\Models;

use App\Filters\Transactions\Filter as TransactionFilter;
use App\Traits\AssignToAuth;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @mixin IdeHelperTransaction
 */
class Transaction extends Model
{
    use HasFactory, AssignToAuth, Filterable;

    protected $filter = TransactionFilter::class;

    protected $fillable = [
        'account_id',
        'budget_id',
        'nominal',
        'date',
        'reccuring',
        'type',
        'notes',
        'account_target',
        'user_id',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function account_target_data(): BelongsTo
    {
        return $this->belongsTo(Account::class, "account_target");
    }

    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function debtPayment(): HasOne
    {
        return $this->hasOne(DebtPayment::class);
    }
}
