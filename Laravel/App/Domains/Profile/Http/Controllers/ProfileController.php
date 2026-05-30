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

    public function sendOtp(Request $request): JsonResponse
    {
        return $this->profileService->sendEmailOtp();
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'request_id' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        return $this->profileService->verifyEmailOtp($request->request_id, $request->otp);
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'mobile' => 'required|string',
        ]);

        return $this->profileService->resendEmailOtp($request->request_id);
    }


}