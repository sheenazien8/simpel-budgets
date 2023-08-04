<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait AssignToAuth
{
    protected static function boot()
    {
        parent::boot();

        if (auth()->id()) {
            static::creating(function ($model) {
                $model->user_id = auth()->id();
            });
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeByCurrentUser($query)
    {
        return $query->where('user_id', auth()->id());
    }
}
