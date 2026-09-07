<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from our API nasim jan😂',
        'team'    => 'Team Alpha',  // change to your team name
    ]);
});



Route::get('/greeting/{name}', [WelcomeController::class,'greet']);
