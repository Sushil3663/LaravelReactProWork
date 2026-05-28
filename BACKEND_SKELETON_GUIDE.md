# Backend Skeleton — What to Implement

## Foundation Layer (Already Complete — No Changes Needed)

### `app/Services/BaseService.php`
- Generic CRUD helpers: `all()`, `getById()`, `create()`, `updateById()`, `deleteById()`, `paginate()`
- All domain services extend this for base operations.

### `app/Http/Responses/ResponseHandler.php`
- Fluent JSON response builder: `transformWith()` → `toItem()`/`toCollection()` → `toJson(status)`
- Envelope: `{ resCode, resDesc, data }`

### `app/Exceptions/GeneralException.php`
- Custom exception with `$statusCode` — thrown from services, caught globally in `bootstrap/app.php`.

### `app/Helpers/ApiHelper.php`
- Wrapper around Laravel `Http` client for 3rd-party API calls (SMS, payment gateways).
- Retry (2x, 500ms), timeout (30s), bearer token, form/json content types.
- Only needed when calling external HTTP APIs.

---

## Auth Domain

### `app/Domains/Auth/Dto/Requests/LoginRequest.php` ✅ Rules Set
```php
'email'    => 'required|email',
'password' => 'required|string|min:6',
```

### `app/Domains/Auth/Dto/Requests/RegisterRequest.php` ✅ Rules Set
```php
'name'     => 'required|string|max:255',
'email'    => 'required|email|unique:users,email',
'password' => 'required|string|min:6|confirmed',
```

### `app/Domains/Auth/Services/AuthService.php` 🔧 IMPLEMENT
```php
public function login(array $credentials): JsonResponse
{
    // auth('api')->attempt($credentials)
    // On success: return $this->responseHandler->toJson(200, [token, user])
    // On fail:    return $this->responseHandler->toJson(401, ['message' => 'Invalid credentials'])
}

public function register(array $data): JsonResponse
{
    // Create User via User::create([name, email, hashed password])
    // Create Profile for the user
    // auth('api')->login($user)
    // Return token + user
}

public function logout(): JsonResponse
{
    // auth('api')->logout()
    // Return 200 with 'Logged out' message
}

public function refresh(): JsonResponse
{
    // $token = auth('api')->refresh()
    // Return ['access_token' => $token]
}

public function me(): JsonResponse
{
    // Return auth('api')->user()
}

public function changePassword(array $data): JsonResponse
{
    // Validate current password matches
    // Hash and save new password
    // Return success message
}
```

### `app/Domains/Auth/Http/Controllers/AuthController.php` ✅ Skeleton Complete
- Thin controller — each method calls the corresponding `AuthService` method.
- Already wired with `$this->responseHandler`.

---

## Profile Domain

### `app/Domains/Profile/Dto/Requests/UpdateProfileRequest.php` ✅ Rules Set
```php
'name'            => 'sometimes|string|max:255',
'gender'          => 'sometimes|string|in:male,female,other',
'date_of_birth'   => 'sometimes|date',
'occupation_type' => 'sometimes|string|max:255',
'mobile'          => 'sometimes|string',
```

### `app/Domains/Profile/Dto/Requests/UploadImageRequest.php` ✅ Rules Set
```php
'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
```

### `app/Domains/Profile/Transformers/ProfileTransformer.php` ✅ Already Complete
```php
public function transform(Profile $profile): array
{
    return [
        'id'              => $profile->id,
        'user_id'         => $profile->user_id,
        'name'            => $profile->name,
        'gender'          => $profile->gender,
        'date_of_birth'   => $profile->date_of_birth?->format('Y-m-d'),
        'occupation_type' => $profile->occupation_type,
        'image'           => $profile->image,
        'mobile'          => $profile->mobile,
        'mobile_verified' => !is_null($profile->mobile_verified_at),
    ];
}
```

### `app/Domains/Profile/Services/ProfileService.php` 🔧 IMPLEMENT
```php
public function getProfile(int $userId): Profile
{
    // return $this->model->where('user_id', $userId)->firstOrFail();
}

public function update(int $userId, array $data): Profile
{
    // Find profile by user_id
    // $profile->update($data)
    // Optional: cache forget on name change
    // Return $profile->fresh()
}

public function uploadImage(int $userId, UploadedFile $file): string
{
    // Find profile
    // Delete old image from storage if exists
    // $path = $file->store("profiles/{$userId}", 'public')
    // $profile->update(['image' => $path])
    // Return $path
}

public function sendMobileOtp(int $userId, string $mobile): void
{
    // Generate 6-digit OTP
    // Store in cache: cache()->put("mobile_otp_{$userId}", [...], now()->addMinutes(5))
    // Send via ApiHelper: $this->apiHelper->apiCall('POST', config('services.sms.url'), [...])
}

public function verifyMobileOtp(int $userId, string $mobile, string $otp): array
{
    // Get from cache: cache()->get("mobile_otp_{$userId}")
    // Validate OTP and mobile match
    // If valid: update mobile_verified_at, forget cache, return success
    // If invalid: throw new GeneralException('Invalid or expired OTP', 422)
}
```

### `app/Domains/Profile/Http/Controllers/ProfileController.php` ✅ Skeleton Complete
- Thin controller — delegates to `ProfileService`, uses `ResponseHandler` for responses.

---

## Infrastructure (Already Complete)

### `app/Http/Middleware/JwtMiddleware.php`
- Parses JWT via `JWTAuth::parseToken()->authenticate()`
- Sets `$request->auth` with `[user_id, email, name, role]`
- Returns 401 on expired/invalid/missing token

### `routes/api.php`
```
POST /api/auth/login                 (public)
POST /api/auth/register              (public)
POST /api/auth/logout                (jwt.auth)
POST /api/auth/refresh               (jwt.auth)
GET  /api/auth/me                    (jwt.auth)
POST /api/auth/change-password       (jwt.auth)
POST /api/profiles                   (jwt.auth) → get profile
PUT  /api/profiles/{userId}          (jwt.auth)
POST /api/profiles/upload-image      (jwt.auth)
POST /api/profiles/verify-mobile     (jwt.auth)
POST /api/profiles/verify-mobile-otp (jwt.auth)
```

### `bootstrap/app.php`
- Registers `api` routes file
- Registers `jwt.auth` middleware alias
- Global `GeneralException` handler for consistent error JSON

### `config/auth.php`
- Default guard: `api` (JWT driver)

### `app/Models/User.php`
- Implements `JWTSubject` (getJWTIdentifier, getJWTCustomClaims)
- Has `profile()` relationship

### `app/Models/Profile.php`
- `$fillable`, `$casts` (mobile_verified_at, date_of_birth)
- `SoftDeletes`, `belongsTo(User)`

### `database/migrations/...create_profiles_table.php`
- Run: `php artisan migrate`

---

## Quick Summary

| File | Status |
|------|--------|
| All Foundation files | ✅ Complete |
| Auth Request DTOs | ✅ Complete |
| AuthController | ✅ Complete |
| **AuthService** | 🔧 **Write login/register/logout/refresh/me/changePassword** |
| Profile Request DTOs | ✅ Complete |
| ProfileTransformer | ✅ Complete |
| ProfileController | ✅ Complete |
| **ProfileService** | 🔧 **Write getProfile/update/uploadImage/sendMobileOtp/verifyMobileOtp** |
| JwtMiddleware | ✅ Complete |
| routes/api.php | ✅ Complete |
| bootstrap/app.php | ✅ Complete |
| config/auth.php | ✅ Complete |
| User.php | ✅ Complete |
| Profile.php | ✅ Complete |
| Migration | ✅ Complete (run `php artisan migrate`) |

### Steps to go live:
1. Configure `.env` database credentials
2. Run `php artisan migrate`
3. Install JWT: `composer require tymon/jwt-auth` + `php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"` + `php artisan jwt:secret`
4. Implement the 2 **AuthService** methods
5. Implement the 5 **ProfileService** methods
6. `php artisan serve`
