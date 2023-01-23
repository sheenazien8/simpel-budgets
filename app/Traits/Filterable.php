<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter(Builder $builder, $request)
    {
        return (new $this->filter($request))->filter($builder);
    }
}

