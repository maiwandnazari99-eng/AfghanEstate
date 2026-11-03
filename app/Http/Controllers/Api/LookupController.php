<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\City;
use App\Models\District;
use App\Models\PropertyType;

class LookupController extends Controller
{
    // فهرست نوع‌های ملک (خانه، آپارتمان، ...)
    public function propertyTypes()
    {
        return response()->json(
            PropertyType::orderBy('name')->get(['id', 'name'])
        );
    }

    // فهرست شهرها
    public function cities()
    {
        return response()->json(
            City::orderBy('name')->get(['id', 'name'])
        );
    }

    // فهرست امکانات ملک (پارکینگ، باغچه، ...)
    public function amenities()
    {
        return response()->json(
            Amenity::orderBy('name')->get(['id', 'name', 'icon'])
        );
    }

    // فهرست ناحیه‌های یک شهر
    public function districts($cityId)
    {
        return response()->json(
            District::where('city_id', $cityId)->orderBy('name')->get(['id', 'name'])
        );
    }
}