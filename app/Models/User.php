<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @mixin IdeHelperUser
 */
class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'joined_at'
    ];

    public function getJoinedAtAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function filters()
    {
        return $this->hasMany(Filter::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function months()
    {
        return $this->hasMany(Month::class);
    }

    public function debts()
    {
        return $this->hasMany(Debt::class);
    }
}
