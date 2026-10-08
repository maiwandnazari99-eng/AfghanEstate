<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerTenant extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'preferred_location',
        'preferred_type',
        'preferred_price_min',
        'preferred_price_max',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}