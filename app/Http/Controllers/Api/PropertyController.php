<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    // فهرست ملک‌ها (برای همه) با فیلتر
    public function index(Request $request)
    {
        $query = Property::with([
            'propertyType',
            'city',
            'district',
            'images',
            'agent.user:id,name',
        ])->where('status', 'available');

        if ($request->filled('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('property_type_id')) {
            $query->where('property_type_id', $request->property_type_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    // جزئیات یک ملک (برای همه)
    public function show($id)
    {
        $property = Property::with([
            'propertyType',
            'city',
            'district',
            'images',
            'amenities',
            'features',
            'agent.user:id,name',
        ])->findOrFail($id);

        return response()->json($property);
    }

    // اضافه کردن ملک جدید (فقط agent)
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'agent') {
            return response()->json([
                'message' => 'Only agents can add properties',
            ], 403);
        }

        $data = $request->validate([
            'property_type_id' => 'required|exists:property_types,id',
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'listing_type'     => 'required|in:sale,rent',
            'price'            => 'required|numeric|min:0',
            'currency'         => 'sometimes|string|max:10',
            'bedrooms'         => 'nullable|integer|min:0',
            'bathrooms'        => 'nullable|integer|min:0',
            'area_size'        => 'required|numeric|min:0',
            'area_unit'        => 'sometimes|string|max:20',
            'city_id'          => 'required|exists:cities,id',
            'district_id'      => 'nullable|exists:districts,id',
            'address'          => 'required|string|max:255',
            'latitude'         => 'nullable|numeric|between:-90,90',
            'longitude'        => 'nullable|numeric|between:-180,180',
        ]);

        $data['agent_id']   = $user->id;
        $data['created_by'] = $user->id;

        $property = Property::create($data);

        return response()->json([
            'message'  => 'Property created successfully',
            'property' => $property,
        ], 201);
    }

    // ویرایش ملک (فقط صاحب همان ملک)
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        if ((int) $property->agent_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You can only edit your own properties',
            ], 403);
        }

        $data = $request->validate([
            'property_type_id' => 'sometimes|exists:property_types,id',
            'title'            => 'sometimes|string|max:255',
            'description'      => 'sometimes|string',
            'listing_type'     => 'sometimes|in:sale,rent',
            'price'            => 'sometimes|numeric|min:0',
            'currency'         => 'sometimes|string|max:10',
            'bedrooms'         => 'nullable|integer|min:0',
            'bathrooms'        => 'nullable|integer|min:0',
            'area_size'        => 'sometimes|numeric|min:0',
            'area_unit'        => 'sometimes|string|max:20',
            'city_id'          => 'sometimes|exists:cities,id',
            'district_id'      => 'nullable|exists:districts,id',
            'address'          => 'sometimes|string|max:255',
            'latitude'         => 'nullable|numeric|between:-90,90',
            'longitude'        => 'nullable|numeric|between:-180,180',
            'status'           => 'sometimes|in:available,sold,rented',
        ]);

        $property->update($data);

        return response()->json([
            'message'  => 'Property updated successfully',
            'property' => $property,
        ]);
    }

    // حذف ملک (فقط صاحب همان ملک)
    public function destroy(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        if ((int) $property->agent_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own properties',
            ], 403);
        }

        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully',
        ]);
    }
}