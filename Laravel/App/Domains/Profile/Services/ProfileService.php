<?php

namespace App\Domains\Profile\Services;

use App\Http\Responses\ResponseHandler;
use App\Services\BaseService;
use App\Models\Profile;
use App\Helpers\ApiHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileService extends BaseService
{
    public function __construct(
        private readonly Profile $profile,
        private readonly ApiHelper $apiHelper,
        private readonly ResponseHandler $responseHandler,
    ) {
        parent::__construct($profile);
    }

    public function getProfile(): JsonResponse
    {
        $profile = JWTAuth::parseToken()->authenticate();
        $user = $this->profile->where('user_id', $profile->id)->first();
        return $this->responseHandler->toJson(200, "Profile retrieved successfully", $user);
    }

    public function update(string $userId, array $data): JsonResponse
    {
        try {
            $user = $this->profile->where("id", $userId)->first();
            $user->update([
                'name' => $data['name'] ?? $user->name,
                'gender' => $data['gender'] ?? $user->gender,
                'date_of_birth' => $data['date_of_birth'] ?? $user->date_of_birth,
                'occupation_type' => $data['occupation_type'] ?? $user->occupation_type,
            ]);

            return $this->responseHandler->toJson(200, "Profile updated successfully", $user);
        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, "An error occurred while updating the profile", $e->getMessage());
        }
    }

    public function uploadImage(array $data): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            $profile = $this->profile->where('user_id', $authUser->id)->first();

            if (!$profile) {
                return $this->responseHandler->toJson(404, 'Profile not found');
            }

            /** @var UploadedFile $file */
            $file = $data['image'];

            if ($profile->image) {
                Storage::disk('public')->delete($profile->image);
            }

            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $filename = $originalName . '_' . now()->format('Y_m_d') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $filename, 'public');

            $profile->update(['image' => $path]);

            return $this->responseHandler->toJson(200, 'Image uploaded successfully', ['image' => $path]);
        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'An error occurred while uploading image', $e->getMessage());
        }
    }

    public function sendMobileOtp(): JsonResponse
    {
        // TODO: Implement send mobile OTP logic
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            $mobile = $authUser->mobile;
            if (!$mobile) {
                // Handle case where mobile number is not available
                return $this->responseHandler->toJson(400, 'Mobile number not found for the user');
            }
            // Generate 6-digit OTP and send to the mobile number
            $otp = rand(100000, 999999); // Example OTP generation
            return $this->responseHandler->toJson(200, 'OTP sent successfully', ['mobile' => $mobile, 'otp' => $otp]);
            // TODO: Implement actual OTP sending logic (e.g., via SMS service)
        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'An error occurred while sending OTP', $e->getMessage());
        }
    }

    public function verifyMobileOtp(string $userId, string $mobile, string $otp): array
    {
        // TODO: Implement verify mobile OTP logic
    }
}