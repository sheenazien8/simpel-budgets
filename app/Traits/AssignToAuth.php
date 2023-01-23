<?php

namespace App\Traits;

trait AssignToAuth
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->user_id = auth()->id();
        });
    }
}
