<?php

namespace App\Domains\Profile\Http\Controllers;

use App\Domains\Profile\Dto\Requests\UpdateProfileRequest;
use App\Domains\Profile\Dto\Requests\UploadImageRequest;
use App\Domains\Profile\Services\ProfileService;
use App\Http\Controllers\Api\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $profileService)
    {
        parent::__construct();
    }

    #[OA\Get(
        path: '/api/profiles',
        tags: ['Profile'],
        summary: 'Get user profile',
        responses: [
            new OA\Response(response: 200, description: 'Profile retrieved'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function get(Request $request): JsonResponse
    {
        return $this->profileService->getProfile();
    }

    #[OA\Put(
        path: '/api/profiles/{userId}',
        tags: ['Profile'],
        summary: 'Update user profile',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'gender', type: 'string', enum: ['male', 'female', 'other']),
                    new OA\Property(property: 'date_of_birth', type: 'string', format: 'date'),
                    new OA\Property(property: 'occupation_type', type: 'string'),
                ]
            )
        ),
        parameters: [
            new OA\Parameter(name: 'userId', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Profile updated'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function update(UpdateProfileRequest $request, string $userId): JsonResponse
    {
        return $this->profileService->update($userId, $request->validated());
    }

    #[OA\Post(
        path: '/api/profiles/upload-image',
        tags: ['Profile'],
        summary: 'Upload profile image',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: 'image', type: 'string', format: 'binary'),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Image uploaded'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        return $this->profileService->uploadImage($request->validated());
    }

    #[OA\Post(
        path: '/api/profiles/send-otp',
        tags: ['Profile'],
        summary: 'Send OTP to email',
        responses: [
            new OA\Response(response: 200, description: 'OTP sent'),
        ]
    )]
    public function sendOtp(Request $request): JsonResponse
    {
        return $this->profileService->sendEmailOtp();
    }

    #[OA\Post(
        path: '/api/profiles/verify-otp',
        tags: ['Profile'],
        summary: 'Verify OTP',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'request_id', type: 'string'),
                    new OA\Property(property: 'otp', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'OTP verified'),
            new OA\Response(response: 422, description: 'Invalid OTP'),
        ]
    )]
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'request_id' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        return $this->profileService->verifyEmailOtp($request->request_id, $request->otp);
    }

    #[OA\Post(
        path: '/api/profiles/resend-otp',
        tags: ['Profile'],
        summary: 'Resend OTP',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'mobile', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'OTP resent'),
        ]
    )]
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'mobile' => 'required|string',
        ]);

        return $this->profileService->resendEmailOtp($request->request_id);
    }
}
