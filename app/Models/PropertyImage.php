<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'property_id',
        'image_url',
        'is_cover',
        'sort_order',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}