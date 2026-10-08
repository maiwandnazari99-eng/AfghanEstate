<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function agent()
    {
        return $this->hasOne(Agent::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function buyerTenant()
    {
        return $this->hasOne(BuyerTenant::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function viewLogs()
    {
        return $this->hasMany(ViewLog::class);
    }

    public function inquiriesSent()
    {
        return $this->hasMany(Inquiry::class, 'inquirer_id');
    }

    public function inquiryMessages()
    {
        return $this->hasMany(InquiryMessage::class, 'sender_id');
    }

    public function agentReviewsWritten()
    {
        return $this->hasMany(AgentsReview::class);
    }
}