<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentsReview extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'agent_id',
        'user_id',
        'rating',
        'review',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}