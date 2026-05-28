<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Auth\Http\Controllers\AuthController;
use App\Domains\Profile\Http\Controllers\ProfileController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware('jwt.auth')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/auth-information', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    Route::prefix('profiles')->group(function () {
        Route::post('/', [ProfileController::class, 'get']);
        Route::put('/{userId}', [ProfileController::class, 'update']);
        Route::post('/upload-image', [ProfileController::class, 'uploadImage']);
        Route::post('/verify-mobile', [ProfileController::class, 'verifyMobileNumber']);
        Route::post('/verify-mobile-otp', [ProfileController::class, 'verifyMobileOtp']);
    });
});