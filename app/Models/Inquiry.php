<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'inquirer_id',
        'agent_id',
        'subject',
        'message',
        'status',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function inquirer()
    {
        return $this->belongsTo(User::class, 'inquirer_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function messages()
    {
        return $this->hasMany(InquiryMessage::class);
    }
}