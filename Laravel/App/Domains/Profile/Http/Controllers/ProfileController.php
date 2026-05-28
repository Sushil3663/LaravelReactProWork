<?php

namespace App\Domains\Profile\Http\Controllers;

use App\Http\Controllers\Api\Controller;
use App\Domains\Profile\Services\ProfileService;
use App\Domains\Profile\Dto\Requests\UpdateProfileRequest;
use App\Domains\Profile\Dto\Requests\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $profileService)
    {
        parent::__construct();
    }

    public function get(Request $request): JsonResponse
    {
        // TODO: Implement get profile
    }

    public function update(UpdateProfileRequest $request, int $userId): JsonResponse
    {
        // TODO: Implement update profile
    }

    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        // TODO: Implement upload image
    }

    public function verifyMobileNumber(Request $request): JsonResponse
    {
        // TODO: Implement verify mobile
    }

    public function verifyMobileOtp(Request $request): JsonResponse
    {
        // TODO: Implement verify mobile OTP
    }
}
