<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PropertyImageController extends Controller
{
    // آپلود عکس برای یک ملک (فقط صاحب ملک)
    public function store(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        if ((int) $property->agent_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You can only add images to your own properties',
            ], 403);
        }

        $request->validate([
            'images'   => 'required|array|min:1|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $hasCover  = $property->images()->where('is_cover', true)->exists();
        $nextOrder = (int) $property->images()->max('sort_order') + 1;
        $created   = [];

        foreach ($request->file('images') as $file) {
            $path = $file->store('properties/' . $property->id, 'public');

            $created[] = PropertyImage::create([
                'property_id' => $property->id,
                'image_url'   => '/storage/' . $path,
                'is_cover'    => ! $hasCover,
                'sort_order'  => $nextOrder++,
            ]);

            // فقط اولین عکس (اگر ملک عکس شاخص ندارد) شاخص می‌شود
            $hasCover = true;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images'  => $created,
        ], 201);
    }

    // حذف یک عکس (فقط صاحب ملک)
    public function destroy(Request $request, $id)
    {
        $image    = PropertyImage::findOrFail($id);
        $property = Property::findOrFail($image->property_id);

        if ((int) $property->agent_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete images of your own properties',
            ], 403);
        }

        $wasCover = $image->is_cover;

        Storage::disk('public')->delete(Str::after($image->image_url, '/storage/'));
        $image->delete();

        // اگر عکس شاخص حذف شد، اولین عکس باقی‌مانده شاخص می‌شود
        if ($wasCover) {
            $next = PropertyImage::where('property_id', $property->id)
                ->orderBy('sort_order')
                ->first();

            if ($next) {
                $next->update(['is_cover' => true]);
            }
        }

        return response()->json([
            'message' => 'Image deleted successfully',
        ]);
    }

    // انتخاب عکس شاخص (فقط صاحب ملک)
    public function setCover(Request $request, $id)
    {
        $image    = PropertyImage::findOrFail($id);
        $property = Property::findOrFail($image->property_id);

        if ((int) $property->agent_id !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You can only change images of your own properties',
            ], 403);
        }

        PropertyImage::where('property_id', $property->id)->update(['is_cover' => false]);
        $image->update(['is_cover' => true]);

        return response()->json([
            'message' => 'Cover image updated',
        ]);
    }
}