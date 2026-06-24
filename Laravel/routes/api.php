<?php

use App\Domains\AccountOpening\Http\Controllers\OnBoardingController;
use App\Domains\UserManagement\Http\Controllers\UserController;
use App\Http\Controllers\Api\MasterDataController;
use Illuminate\Support\Facades\Route;
use App\Domains\Auth\Http\Controllers\AuthController;
use App\Domains\Profile\Http\Controllers\ProfileController;

// Public routes
Route::get('/master-data', [MasterDataController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/user-exists', [AuthController::class, 'checkUserExists']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// Protected routes
Route::middleware('jwt.custom')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/auth-information', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    Route::prefix('profiles')->group(function () {
        Route::get('/', [ProfileController::class, 'get']);
        Route::put('/{userId}', [ProfileController::class, 'update']);
        Route::post('/upload-image', [ProfileController::class, 'uploadImage']);
        Route::post('/send-otp', [ProfileController::class, 'sendOtp']);
        Route::post('/verify-otp', [ProfileController::class, 'verifyOtp']);
        Route::post('/resend-otp', [ProfileController::class, 'resendOtp']);
    });

    Route::prefix('onboarding')->group(function () {
        Route::post('/case-initiation', [OnBoardingController::class, 'caseInitiation']);
        Route::get('/latest-onboarding', [OnBoardingController::class, 'getLatestOnboarding']);
        Route::get('/show/{formId}', [OnBoardingController::class, 'getOnboardingForm']);
        Route::post('/upload-image', [OnBoardingController::class, 'uploadImage']);
        Route::post('/case-upload', [OnBoardingController::class, 'UploadCaseDocuments']);
        Route::post('/basic-information', [OnBoardingController::class, 'updateBasicInformation']);
        Route::post('/other-information', [OnBoardingController::class, 'updateOtherInformation']);
    });

    Route::middleware('permission:usermanagement.list')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    Route::middleware('permission:usermanagement.view')->group(function () {
        Route::get('/users/{id}', [UserController::class, 'show']);
    });

    Route::middleware('permission:usermanagement.edit')->prefix('users')->group(function () {
        Route::post('/{id}/assign-role', [UserController::class, 'assignRole']);
        Route::post('/{id}/remove-role', [UserController::class, 'removeRole']);
        Route::get('/{id}/permissions', [UserController::class, 'userPermissions']);
        Route::post('/{id}/sync-permissions', [UserController::class, 'syncPermissions']);
    });

    Route::middleware('role:Super Admin')->get('/permissions', [UserController::class, 'permissions']);

    Route::middleware('permission:usermanagement.edit')->prefix('roles')->group(function () {
        Route::get('/', [UserController::class, 'roles']);
        Route::post('/{roleId}/sync-permissions', [UserController::class, 'syncRolePermissions']);
    });
});