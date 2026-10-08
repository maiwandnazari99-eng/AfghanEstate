<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryMessage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'inquiry_id',
        'sender_id',
        'message',
    ];

    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}