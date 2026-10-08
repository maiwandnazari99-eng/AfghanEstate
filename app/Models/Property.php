<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'property_type_id',
        'title',
        'description',
        'listing_type',
        'price',
        'currency',
        'bedrooms',
        'bathrooms',
        'area_size',
        'area_unit',
        'city_id',
        'district_id',
        'address',
        'latitude',
        'longitude',
        'is_featured',
        'status',
        'created_by',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function creator()
    {
        return $this->belongsTo(Agent::class, 'created_by');
    }

    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities');
    }

    public function features()
    {
        return $this->hasMany(PropertyFeature::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function viewLogs()
    {
        return $this->hasMany(ViewLog::class);
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }
}