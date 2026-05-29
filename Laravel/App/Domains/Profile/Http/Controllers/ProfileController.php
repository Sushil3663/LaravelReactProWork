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
        return $this->profileService->getProfile();
    }

    public function update(UpdateProfileRequest $request, string $userId): JsonResponse
    {
        return $this->profileService->update($userId, $request->validated());
    }

    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        return $this->profileService->uploadImage($request->validated());
    }

    public function verifyMobileNumber(Request $request): JsonResponse
    {
        return $this->profileService->sendMobileOtp();
    }

    public function verifyMobileOtp(Request $request): JsonResponse
    {
        // TODO: Implement verify mobile OTP
    }
}