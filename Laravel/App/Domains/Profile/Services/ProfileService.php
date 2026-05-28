<?php

namespace App\Domains\Profile\Services;

use App\Services\BaseService;
use App\Models\Profile;
use App\Helpers\ApiHelper;

class ProfileService extends BaseService
{
    public function __construct(
        private readonly Profile   $model,
        private readonly ApiHelper $apiHelper,
    ) {
        parent::__construct($model);
    }

    public function getProfile(int $userId): Profile
    {
        // TODO: Implement get profile logic
    }

    public function update(int $userId, array $data): Profile
    {
        // TODO: Implement update profile logic
    }

    public function uploadImage(int $userId, \Illuminate\Http\UploadedFile $file): string
    {
        // TODO: Implement upload image logic
    }

    public function sendMobileOtp(int $userId, string $mobile): void
    {
        // TODO: Implement send mobile OTP logic
    }

    public function verifyMobileOtp(int $userId, string $mobile, string $otp): array
    {
        // TODO: Implement verify mobile OTP logic
    }
}
