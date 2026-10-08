<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use Illuminate\Support\Facades\Route;

// آدرس‌های عمومی (بدون نیاز به ورود)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// آدرس‌های محافظت‌شده (فقط کاربر واردشده با توکن)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    Route::post('/properties/{id}/images', [PropertyImageController::class, 'store']);
    Route::delete('/property-images/{id}', [PropertyImageController::class, 'destroy']);
    Route::patch('/property-images/{id}/cover', [PropertyImageController::class, 'setCover']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/properties/{id}/favorite', [FavoriteController::class, 'store']);
    Route::delete('/properties/{id}/favorite', [FavoriteController::class, 'destroy']);

    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::post('/properties/{id}/inquiries', [InquiryController::class, 'store']);
    Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
    Route::post('/inquiries/{id}/messages', [InquiryController::class, 'reply']);
    Route::patch('/inquiries/{id}/close', [InquiryController::class, 'close']);
});
