<?php

namespace App\Domains\Profile\Services;

use App\Mail\OtpMail;
use App\Http\Responses\ResponseHandler;
use App\Services\BaseService;
use App\Models\Profile;
use App\Models\Notification;
use App\Helpers\ApiHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    public function sendEmailOtp(): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            $profile = $this->profile->where('user_id', $authUser->id)->first();
            $email = $authUser->email;

            if (!$email) {
                return $this->responseHandler->toJson(400, 'Email not found for the user');
            }

            $cooldownKey = 'otp_cooldown_' . $authUser->id;
            if (Cache::has($cooldownKey)) {
                return $this->responseHandler->toJson(429, 'Please wait before requesting a new OTP');
            }

            $otp = random_int(100000, 999999);
            $requestId = (string) Str::uuid();

            Notification::create([
                'customer_id' => $authUser->id,
                'user_id' => $profile?->id,
                'name' => $authUser->name,
                'email' => $email,
                'phone' => $authUser->phone,
                'request_id' => $requestId,
                'otp' => $otp,
                'resend_count' => 0,
                'type' => 'email',
                'expires_at' => now()->addMinutes(3),
            ]);

            Mail::to($email)->send(new OtpMail($otp));

            Cache::put($cooldownKey, true, 60);

            return $this->responseHandler->toJson(200, 'OTP sent successfully', [
                'request_id' => $requestId,
            ]);

        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'An error occurred while sending OTP', $e->getMessage());
        }
    }

    public function verifyEmailOtp(string $requestId, string $otp): JsonResponse
    {
        try {
            $attemptKey = 'otp_attempts_' . $requestId;
            $attempts = (int) Cache::get($attemptKey, 0);

            if ($attempts >= 5) {
                return $this->responseHandler->toJson(429, 'Too many attempts. Please request a new OTP.');
            }

            $notification = Notification::where('request_id', $requestId)
                ->whereNull('used_at')
                ->first();

            if (!$notification) {
                return $this->responseHandler->toJson(400, 'Invalid OTP');
            }

            if ($notification->expires_at->isPast()) {
                return $this->responseHandler->toJson(400, 'OTP has expired. Please request a new one.');
            }

            if (!hash_equals((string) $notification->otp, $otp)) {
                Cache::put($attemptKey, $attempts + 1, 300);
                return $this->responseHandler->toJson(400, 'Invalid OTP');
            }

            $notification->update(['used_at' => now()]);
            Cache::forget($attemptKey);

            $this->profile->where('user_id', $notification->customer_id)->update([
                'mobile_verified_at' => now(),
            ]);

            return $this->responseHandler->toJson(200, 'OTP verified successfully');

        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'An error occurred while verifying OTP', $e->getMessage());
        }
    }

    public function resendEmailOtp(string $requestId): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            $profile = $this->profile->where('user_id', $authUser->id)->first();
            $email = $authUser->email;

            if (!$email) {
                return $this->responseHandler->toJson(400, 'Email not found for the user');
            }

            $notification = Notification::where('request_id', $requestId)
                ->where('customer_id', $authUser->id)
                ->first();

            if (!$notification) {
                return $this->responseHandler->toJson(400, 'Invalid request ID');
            }

            if ($notification->resend_count >= 3) {
                return $this->responseHandler->toJson(429, 'Resend limit reached. Maximum 3 resends allowed.');
            }

            $cooldownKey = 'otp_cooldown_' . $authUser->id;
            if (Cache::has($cooldownKey)) {
                return $this->responseHandler->toJson(429, 'Please wait before requesting a new OTP');
            }

            $newOtp = random_int(100000, 999999);
            $newRequestId = (string) Str::uuid();

            $notification->update([
                'otp' => $newOtp,
                'request_id' => $newRequestId,
                'resend_count' => $notification->resend_count + 1,
                'expires_at' => now()->addMinutes(3),
                'used_at' => null,
            ]);

            Mail::to($email)->send(new OtpMail($newOtp));

            Cache::put($cooldownKey, true, 60);

            return $this->responseHandler->toJson(200, 'OTP resent successfully', [
                'request_id' => $newRequestId,
            ]);

        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'An error occurred while resending OTP', $e->getMessage());
        }
    }

}