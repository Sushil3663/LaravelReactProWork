# Laravel Backend — Step-by-Step Setup Guide

---

## Phase 1: Environment & Database

### Step 1 — Configure `.env`
Edit `Laravel/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Step 2 — Create the database
```sql
CREATE DATABASE myapp;
```
Or via MySQL Workbench / phpMyAdmin.

### Step 3 — Run migrations
```bash
php artisan migrate
```

---

## Phase 2: JWT Authentication

### Step 4 — Install JWT package
```bash
composer require tymon/jwt-auth
```

### Step 5 — Publish JWT config
```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

### Step 6 — Generate JWT secret
```bash
php artisan jwt:secret
```
This adds `JWT_SECRET=...` to your `.env`.

---

## Phase 3: Implement Business Logic

### Step 7 — Implement `AuthService.php`
File: `app/Domains/Auth/Services/AuthService.php`

```php
<?php

namespace App\Domains\Auth\Services;

use App\Models\User;
use App\Models\Profile;
use App\Http\Responses\ResponseHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(private readonly ResponseHandler $responseHandler) {}

    public function login(array $credentials): JsonResponse
    {
        if (!$token = auth('api')->attempt($credentials)) {
            return $this->responseHandler->toJson(401, ['message' => 'Invalid credentials']);
        }

        return $this->responseHandler->toJson(200, [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => auth('api')->user(),
        ]);
    }

    public function register(array $data): JsonResponse
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Profile::create(['user_id' => $user->id, 'name' => $user->name]);

        $token = auth('api')->login($user);

        return $this->responseHandler->toJson(201, [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => $user,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();
        return $this->responseHandler->toJson(200, ['message' => 'Logged out']);
    }

    public function refresh(): JsonResponse
    {
        $token = auth('api')->refresh();
        return $this->responseHandler->toJson(200, ['access_token' => $token]);
    }

    public function me(): JsonResponse
    {
        return $this->responseHandler->toJson(200, auth('api')->user());
    }

    public function changePassword(array $data): JsonResponse
    {
        $user = auth('api')->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return $this->responseHandler->toJson(422, ['message' => 'Current password is incorrect']);
        }

        $user->update(['password' => Hash::make($data['new_password'])]);

        return $this->responseHandler->toJson(200, ['message' => 'Password changed']);
    }
}
```

### Step 8 — Implement `ProfileService.php`
File: `app/Domains/Profile/Services/ProfileService.php`

```php
<?php

namespace App\Domains\Profile\Services;

use App\Services\BaseService;
use App\Models\Profile;
use App\Helpers\ApiHelper;
use App\Exceptions\GeneralException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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
        return $this->model->where('user_id', $userId)->firstOrFail();
    }

    public function update(int $userId, array $data): Profile
    {
        $profile = $this->model->where('user_id', $userId)->firstOrFail();
        $profile->update($data);

        if (isset($data['name'])) {
            cache()->forget("profile_name_{$userId}");
        }

        return $profile->fresh();
    }

    public function uploadImage(int $userId, UploadedFile $file): string
    {
        $profile = $this->model->where('user_id', $userId)->firstOrFail();

        if ($profile->image) {
            Storage::delete($profile->image);
        }

        $path = $file->store("profiles/{$userId}", 'public');
        $profile->update(['image' => $path]);

        return $path;
    }

    public function sendMobileOtp(int $userId, string $mobile): void
    {
        $otp = rand(100000, 999999);

        cache()->put("mobile_otp_{$userId}", [
            'otp'    => $otp,
            'mobile' => $mobile,
        ], now()->addMinutes(5));

        $this->apiHelper->apiCall('POST', config('services.sms.url'), [
            'mobile'  => $mobile,
            'message' => "Your verification OTP is: {$otp}",
        ]);
    }

    public function verifyMobileOtp(int $userId, string $mobile, string $otp): array
    {
        $cached = cache()->get("mobile_otp_{$userId}");

        if (!$cached || $cached['otp'] != $otp || $cached['mobile'] !== $mobile) {
            throw new GeneralException('Invalid or expired OTP', 422);
        }

        $this->model->where('user_id', $userId)->update(['mobile_verified_at' => now()]);
        cache()->forget("mobile_otp_{$userId}");

        return ['message' => 'Mobile verified successfully'];
    }
}
```

---

## Phase 4: Verify & Run

### Step 9 — Test that routes are loaded
```bash
php artisan route:list
```
You should see all auth + profile routes listed.

### Step 10 — Start the server
```bash
php artisan serve
```

### Step 11 — Test the API (via curl or Postman)

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123","password_confirmation":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'
```

**Get Profile (with token from login):**
```bash
curl -X POST http://localhost:8000/api/profiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Quick Command Summary (Copy-Paste Order)

```bash
# 1. DB setup
# Edit .env first with your DB credentials

# 2. Migrate
php artisan migrate

# 3. Install JWT
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

# 4. Implement AuthService.php and ProfileService.php (copy code from Steps 7-8)

# 5. Serve
php artisan serve
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Class "Tymon\JWTAuth\... not found` | Run `composer require tymon/jwt-auth` |
| `Target class [AuthController] does not exist` | Check namespace matches folder path in `routes/api.php` |
| `SQLSTATE[HY000] [1049] Unknown database` | Create the database first, or check `.env` DB name |
| `The only supported cipher is AES-128-CBC or AES-256-CBC` | Run `php artisan key:generate` |
