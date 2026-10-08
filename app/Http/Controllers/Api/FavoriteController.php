<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // فهرست ملک‌های نشان‌دار کاربر
    public function index(Request $request)
    {
        $favorites = Favorite::with([
            'property.propertyType',
            'property.city',
            'property.images',
        ])
            ->where('user_id', $request->user()->id)
            ->latest('created_at')
            ->paginate(10);

        return response()->json($favorites);
    }

    // نشان‌دار کردن یک ملک (فقط خریدار و مستأجر)
    public function store(Request $request, $id)
    {
        $user = $request->user();

        if (! in_array($user->role, ['buyer', 'tenant'])) {
            return response()->json([
                'message' => 'Only buyers and tenants can save favorites',
            ], 403);
        }

        $property = Property::findOrFail($id);

        // اگر قبلاً نشان‌دار شده، دوباره ساخته نمی‌شود
        $favorite = Favorite::firstOrCreate([
            'user_id'     => $user->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'message'  => 'Property added to favorites',
            'favorite' => $favorite,
        ], 201);
    }

    // برداشتن نشان از یک ملک
    public function destroy(Request $request, $id)
    {
        $deleted = Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $id)
            ->delete();

        if (! $deleted) {
            return response()->json([
                'message' => 'This property is not in your favorites',
            ], 404);
        }

        return response()->json([
            'message' => 'Property removed from favorites',
        ]);
    }
}