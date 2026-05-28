# New React + Laravel Project Architecture
### Inspired by NMB CFA API — Adapted Without Microservices

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Laravel Backend Architecture](#3-laravel-backend-architecture)
4. [Folder Structure — Laravel](#4-folder-structure--laravel)
5. [JWT Authentication Setup](#5-jwt-authentication-setup)
6. [API Helper — Adapted for No-Microservice](#6-api-helper--adapted-for-no-microservice)
7. [Profile Module Deep Dive](#7-profile-module-deep-dive)
8. [Response Handler Pattern](#8-response-handler-pattern)
9. [Base Service Pattern](#9-base-service-pattern)
10. [Middleware Stack](#10-middleware-stack)
11. [React Frontend Architecture](#11-react-frontend-architecture)
12. [Folder Structure — React](#12-folder-structure--react)
13. [API Layer in React](#13-api-layer-in-react)
14. [Route Map (Profile Module)](#14-route-map-profile-module)
15. [Environment Configuration](#15-environment-configuration)
16. [Key Differences from CFA API](#16-key-differences-from-cfa-api)

---

## 1. Project Overview

This is a monolithic Laravel REST API + React SPA project. Unlike the NMB CFA project (which uses multiple microservices for Customer Identity, Proxy, Notifications), **all business logic in this new project lives inside a single Laravel application backed by one database**.

The architecture borrows the following proven CFA patterns:
- Domain-driven folder layout inside Laravel
- Base Service and Base Controller pattern
- ResponseHandler for consistent JSON responses
- JWT authentication middleware
- ApiHelper (adapted for optional third-party HTTP calls)
- Rate limiting on sensitive endpoints

---

## 2. Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Backend      | Laravel 11.x                        |
| Auth         | JWT — `php-open-source-saler/jwt-auth` or `tymon/jwt-auth` |
| Database     | MySQL / PostgreSQL                  |
| Cache        | Redis                               |
| File Storage | Laravel Storage (local / S3)        |
| Frontend     | React 18 + Vite                     |
| State Mgmt   | Redux Toolkit                       |
| HTTP Client  | Axios                               |
| UI           | Tailwind CSS + shadcn/ui            |
| API Testing  | Postman / Insomnia                  |

---

## 3. Laravel Backend Architecture

### Architecture Pattern: Domain-Driven Monolith

```
Request
  └─► Route (api.php)
        └─► JWT Middleware (validates Bearer token)
              └─► Controller (thin — validate, delegate)
                    └─► Service (business logic)
                          ├─► Eloquent Model (DB operations)
                          ├─► ApiHelper (optional 3rd-party calls)
                          └─► ResponseHandler (format response)
                                └─► JSON Response ──► Client
```

### Why this pattern?
- **Controller stays thin**: only handles HTTP validation and calls the Service
- **Service owns business logic**: testable, reusable across commands/jobs
- **ResponseHandler**: every endpoint returns the same JSON envelope — frontend always knows what to expect
- **ApiHelper**: keeps all outgoing HTTP calls in one place, with retry logic and error handling

---

## 4. Folder Structure — Laravel

```
app/
├── Domains/
│   ├── Auth/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── AuthController.php
│   │   ├── Services/
│   │   │   └── AuthService.php
│   │   └── Dto/
│   │       └── Requests/
│   │           ├── LoginRequest.php
│   │           └── RegisterRequest.php
│   │
│   └── Profile/
│       ├── Http/
│       │   └── Controllers/
│       │       └── ProfileController.php
│       ├── Services/
│       │   └── ProfileService.php
│       ├── Transformers/
│       │   └── ProfileTransformer.php
│       └── Dto/
│           └── Requests/
│               ├── UpdateProfileRequest.php
│               └── UploadImageRequest.php
│
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── Controller.php          ← Base API controller
│   ├── Middleware/
│   │   ├── JwtMiddleware.php           ← Validates JWT, sets request()->auth
│   │   └── SignResponse.php            ← Optional: sign sensitive responses
│   └── Responses/
│       └── ResponseHandler.php         ← Fluent JSON response builder
│
├── Models/
│   ├── User.php
│   └── Profile.php
│
├── Services/
│   └── BaseService.php                 ← Query builder helpers
│
├── Helpers/
│   └── ApiHelper.php                   ← HTTP client for 3rd-party APIs
│
└── Exceptions/
    ├── Handler.php
    └── GeneralException.php

routes/
└── api.php
```

---

## 5. JWT Authentication Setup

### Installation

```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### config/auth.php

```php
'defaults' => [
    'guard'     => 'api',
    'passwords' => 'users',
],

'guards' => [
    'api' => [
        'driver'    => 'jwt',
        'provider'  => 'users',
    ],
],
```

### User Model — implement JWTSubject

```php
// app/Models/User.php
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'email'  => $this->email,
            'name'   => $this->name,
            'role'   => $this->role,
        ];
    }
}
```

### AuthController (Login / Refresh / Logout)

```php
// app/Domains/Auth/Http/Controllers/AuthController.php

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return $this->responseHandler
                ->toJson(401, ['message' => 'Invalid credentials']);
        }

        return $this->responseHandler->toJson(200, [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => auth('api')->user(),
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
}
```

### JwtMiddleware

```php
// app/Http/Middleware/JwtMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['message' => 'User not found'], 401);
            }

            // Make auth data available anywhere — mirrors CFA pattern
            $request->merge(['auth' => [
                'user_id' => $user->id,
                'email'   => $user->email,
                'name'    => $user->name,
                'role'    => $user->role,
            ]]);

        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token invalid'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        return $next($request);
    }
}
```

### Register Middleware — bootstrap/app.php (Laravel 11)

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'jwt.auth'    => \App\Http\Middleware\JwtMiddleware::class,
        'signResponse' => \App\Http\Middleware\SignResponse::class,
    ]);
})
```

### Routes — api.php

```php
// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware('jwt.auth')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout',  [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me',       [AuthController::class, 'me']);
    });

    Route::prefix('profiles')->group(function () {
        Route::post('/',                    [ProfileController::class, 'get']);
        Route::put('/{userId}',             [ProfileController::class, 'update']);
        Route::post('/upload-image',        [ProfileController::class, 'uploadImage']);
        Route::post('/change-password',     [AuthController::class, 'changePassword']);
        Route::post('/verify-mobile',       [ProfileController::class, 'verifyMobileNumber']);
        Route::post('/verify-mobile-otp',   [ProfileController::class, 'verifyMobileOtp'])->middleware('signResponse');
    });
});
```

### .env JWT Settings

```env
JWT_SECRET=your_generated_secret_here
JWT_TTL=60              # minutes (access token lifetime)
JWT_REFRESH_TTL=20160   # minutes (14 days refresh window)
JWT_ALGO=HS256
```

---

## 6. API Helper — Adapted for No-Microservice

In CFA, `ApiHelper` is used to call external microservices (CI API, Proxy API, Notify API). In the new project, **you may not need microservices**, but you will still need to call third-party APIs (payment gateways, SMS providers, email services, etc.).

The pattern is identical — just the URL targets change.

### app/Helpers/ApiHelper.php

```php
namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use App\Exceptions\GeneralException;

class ApiHelper
{
    /**
     * Make an HTTP call to a third-party API.
     * Drop-in replacement for CFA's apiCall — no microservice required.
     *
     * @param string $method  GET | POST | PUT | DELETE
     * @param string $url     Full URL of the external endpoint
     * @param array  $data    Request payload
     * @param array  $options ['headers' => [], 'content_type' => 'json|form|urlencoded']
     * @param bool   $useSSL  Whether to verify SSL certificate
     */
    public function apiCall(
        string $method,
        string $url,
        array  $data    = [],
        array  $options = [],
        bool   $useSSL  = false
    ): array {
        try {
            $http = Http::timeout(30)
                ->connectTimeout(10)
                ->retry(2, 500)
                ->withoutVerifying(!$useSSL);

            // Attach headers
            if (!empty($options['headers'])) {
                $http = $http->withHeaders($options['headers']);
            }

            // Bearer token support
            if (!empty($options['bearer'])) {
                $http = $http->withToken($options['bearer']);
            }

            $contentType = $options['content_type'] ?? 'json';

            $response = match (strtoupper($method)) {
                'GET'    => $http->get($url, $data),
                'POST'   => $contentType === 'form'
                            ? $http->asForm()->post($url, $data)
                            : $http->post($url, $data),
                'PUT'    => $http->put($url, $data),
                'DELETE' => $http->delete($url, $data),
                default  => throw new GeneralException('Unsupported HTTP method', 400),
            };

            if ($response->failed()) {
                throw new GeneralException(
                    'External API call failed: ' . $response->body(),
                    $response->status()
                );
            }

            return $response->json() ?? [];

        } catch (GeneralException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new GeneralException('External API error: ' . $e->getMessage(), 500);
        }
    }
}
```

### How to Use ApiHelper in a Service

```php
// Example: Sending OTP via external SMS provider

class ProfileService extends BaseService
{
    public function __construct(
        private readonly Profile   $model,
        private readonly ApiHelper $apiHelper,
    ) {}

    public function sendSmsOtp(string $mobile, string $otp): void
    {
        $this->apiHelper->apiCall('POST', config('services.sms.url'), [
            'mobile'  => $mobile,
            'message' => "Your OTP is: {$otp}",
            'api_key' => config('services.sms.key'),
        ]);
    }
}
```

### services.php — Register external service URLs

```php
// config/services.php
return [
    'sms' => [
        'url' => env('SMS_API_URL'),
        'key' => env('SMS_API_KEY'),
    ],
    'payment' => [
        'url'    => env('PAYMENT_API_URL'),
        'secret' => env('PAYMENT_SECRET'),
    ],
];
```

> **When you do NOT need ApiHelper**: For all operations that only touch your own database (CRUD, profile updates, image uploads), just use Eloquent directly in the Service. ApiHelper is only needed when calling **external HTTP APIs**.

---

## 7. Profile Module Deep Dive

### ProfileController (thin)

```php
// app/Domains/Profile/Http/Controllers/ProfileController.php

class ProfileController extends Controller
{
    public function __construct(private readonly ProfileService $service) {}

    public function get(Request $request): JsonResponse
    {
        $userId  = $request->auth['user_id'];
        $profile = $this->service->getProfile($userId);

        return $this->responseHandler
            ->transformWith(new ProfileTransformer())
            ->toItem($profile)
            ->toJson(200);
    }

    public function update(UpdateProfileRequest $request, int $userId): JsonResponse
    {
        $profile = $this->service->update($userId, $request->validated());

        return $this->responseHandler
            ->transformWith(new ProfileTransformer())
            ->toItem($profile)
            ->toJson(200);
    }

    public function uploadImage(UploadImageRequest $request): JsonResponse
    {
        $userId = $request->auth['user_id'];
        $path   = $this->service->uploadImage($userId, $request->file('image'));

        return $this->responseHandler->toJson(200, ['image_path' => $path]);
    }

    public function verifyMobileNumber(Request $request): JsonResponse
    {
        $request->validate(['mobile' => 'required|string']);
        $userId = $request->auth['user_id'];
        $this->service->sendMobileOtp($userId, $request->mobile);

        return $this->responseHandler->toJson(200, ['message' => 'OTP sent']);
    }

    public function verifyMobileOtp(Request $request): JsonResponse
    {
        $request->validate(['mobile' => 'required', 'otp' => 'required']);
        $userId  = $request->auth['user_id'];
        $result  = $this->service->verifyMobileOtp($userId, $request->mobile, $request->otp);

        return $this->responseHandler->toJson(200, $result);
    }
}
```

### ProfileService (business logic)

```php
// app/Domains/Profile/Services/ProfileService.php

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
        return $this->model
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    public function update(int $userId, array $data): Profile
    {
        $profile = $this->model->where('user_id', $userId)->firstOrFail();
        $profile->update($data);

        // Clear cache on name change — mirrors CFA pattern
        if (isset($data['name'])) {
            cache()->forget("profile_name_{$userId}");
        }

        return $profile->fresh();
    }

    public function uploadImage(int $userId, \Illuminate\Http\UploadedFile $file): string
    {
        $profile = $this->model->where('user_id', $userId)->firstOrFail();

        // Delete old image
        if ($profile->image) {
            \Storage::delete($profile->image);
        }

        $path = $file->store("profiles/{$userId}", 'public');
        $profile->update(['image' => $path]);

        return $path;
    }

    public function sendMobileOtp(int $userId, string $mobile): void
    {
        $otp = rand(100000, 999999);

        // Store OTP in cache with 5-min TTL
        cache()->put("mobile_otp_{$userId}", [
            'otp'    => $otp,
            'mobile' => $mobile,
        ], now()->addMinutes(5));

        // Send via SMS third-party (uses ApiHelper internally)
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

### Profile Eloquent Model

```php
// app/Models/Profile.php

class Profile extends Model
{
    use SoftDeletes;

    protected $table    = 'profiles';
    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'date_of_birth',
        'occupation_type',
        'image',
        'mobile',
        'mobile_verified_at',
    ];

    protected $casts = [
        'mobile_verified_at' => 'datetime',
        'date_of_birth'      => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 8. Response Handler Pattern

All API endpoints return the same JSON envelope. This matches CFA exactly.

```php
// app/Http/Responses/ResponseHandler.php

class ResponseHandler
{
    private mixed $data       = null;
    private mixed $transformer = null;

    public function transformWith($transformer): static
    {
        $this->transformer = $transformer;
        return $this;
    }

    public function toItem($item): static
    {
        $this->data = $this->transformer
            ? $this->transformer->transform($item)
            : $item;
        return $this;
    }

    public function toCollection($collection): static
    {
        $this->data = $this->transformer
            ? $collection->map(fn ($item) => $this->transformer->transform($item))
            : $collection;
        return $this;
    }

    public function toJson(int $status, mixed $extra = null): JsonResponse
    {
        return response()->json([
            'resCode' => (string) $status,
            'resDesc' => $this->getDesc($status),
            'data'    => $extra ?? $this->data,
        ], $status);
    }

    private function getDesc(int $status): string
    {
        return match (true) {
            $status >= 500 => 'Internal server error',
            $status >= 400 => 'Request error',
            $status >= 200 => 'Success',
            default        => 'Unknown',
        };
    }
}
```

### Response Envelope Example

```json
{
  "resCode": "200",
  "resDesc": "Success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "image": "/storage/profiles/1/avatar.jpg"
  }
}
```

---

## 9. Base Service Pattern

```php
// app/Services/BaseService.php

abstract class BaseService
{
    public function __construct(protected Model $model) {}

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    public function getById(int|string $id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function updateById(int|string $id, array $data): Model
    {
        $record = $this->getById($id);
        $record->update($data);
        return $record->fresh();
    }

    public function deleteById(int|string $id): bool
    {
        return $this->getById($id)->delete();
    }
}
```

---

## 10. Middleware Stack

| Middleware      | Purpose                                           | Applied to        |
|-----------------|---------------------------------------------------|-------------------|
| `jwt.auth`      | Validates Bearer JWT, sets `request()->auth`      | All protected routes |
| `throttle:60,1` | Rate limits to 60 req/min per IP                 | All API routes    |
| `signResponse`  | Adds HMAC signature header to sensitive responses | OTP verify routes |

### GeneralException — consistent error response

```php
// app/Exceptions/GeneralException.php

class GeneralException extends \RuntimeException
{
    public function __construct(string $message, private int $statusCode = 500)
    {
        parent::__construct($message);
    }

    public function getStatusCode(): int { return $this->statusCode; }
}
```

### Handler.php — catch GeneralException globally

```php
// app/Exceptions/Handler.php

public function register(): void
{
    $this->renderable(function (GeneralException $e, Request $request) {
        return response()->json([
            'resCode' => (string) $e->getStatusCode(),
            'resDesc' => $e->getMessage(),
            'data'    => null,
        ], $e->getStatusCode());
    });
}
```

---

## 11. React Frontend Architecture

### Pattern: Feature-Sliced (mirrors backend domains)

```
src/
├── features/
│   ├── auth/
│   │   ├── api/        ← axios calls for login/logout/refresh
│   │   ├── hooks/      ← useAuth, useLogin
│   │   ├── pages/      ← LoginPage, RegisterPage
│   │   └── store/      ← authSlice (Redux Toolkit)
│   │
│   └── profile/
│       ├── api/        ← axios calls for profile endpoints
│       ├── hooks/      ← useProfile, useUpdateProfile
│       ├── pages/      ← ProfilePage, EditProfilePage
│       └── components/ ← ProfileCard, AvatarUpload
│
├── shared/
│   ├── api/
│   │   └── axiosInstance.ts   ← base axios with JWT interceptors
│   ├── components/            ← Button, Modal, Input, etc.
│   ├── hooks/                 ← useDebounce, usePagination
│   └── types/                 ← shared TypeScript types
│
├── app/
│   ├── router/
│   │   └── index.tsx          ← React Router v6 routes
│   ├── store/
│   │   ├── index.ts           ← Redux store (configureStore)
│   │   └── hooks.ts           ← useAppDispatch, useAppSelector
│   └── App.tsx
│
└── main.tsx
```

---

## 12. Folder Structure — React

```
features/auth/
├── api/
│   └── authApi.ts
│       ├── login(email, password) → { access_token, user }
│       ├── logout()
│       ├── refresh()
│       └── me()
│
├── hooks/
│   └── useAuth.ts
│       ├── isAuthenticated: boolean
│       ├── user: User | null
│       ├── login(credentials)
│       └── logout()
│
└── store/
    └── authSlice.ts       ← Redux slice: token, user, setToken, setUser, clearAuth

features/profile/
├── api/
│   └── profileApi.ts
│       ├── getProfile()
│       ├── updateProfile(userId, data)
│       ├── uploadImage(file)
│       ├── verifyMobile(mobile)
│       └── verifyMobileOtp(mobile, otp)
│
└── hooks/
    ├── useProfile.ts      ← fetch + cache profile
    └── useUpdateProfile.ts
```

---

## 13. API Layer in React

### shared/api/axiosInstance.ts — JWT auto-attach + refresh

```typescript
import axios from 'axios';
import { store } from '@/app/store';
import { setToken, clearAuth } from '@/features/auth/store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — try refresh, else logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${store.getState().auth.token}` } }
        );

        store.dispatch(setToken(data.data.access_token));
        original.headers.Authorization = `Bearer ${data.data.access_token}`;
        return api(original);
      } catch {
        store.dispatch(clearAuth());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### features/profile/api/profileApi.ts

```typescript
import api from '@/shared/api/axiosInstance';

export const profileApi = {
  get: () =>
    api.post('/profiles').then(r => r.data.data),

  update: (userId: number, data: Partial<Profile>) =>
    api.put(`/profiles/${userId}`, data).then(r => r.data.data),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/profiles/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },

  verifyMobile: (mobile: string) =>
    api.post('/profiles/verify-mobile', { mobile }).then(r => r.data),

  verifyMobileOtp: (mobile: string, otp: string) =>
    api.post('/profiles/verify-mobile-otp', { mobile, otp }).then(r => r.data),

  changePassword: (data: ChangePasswordPayload) =>
    api.post('/profiles/change-password', data).then(r => r.data),
};
```

### features/auth/store/authSlice.ts (Redux Toolkit)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user:  User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') ?? null,
  user:  null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.token = null;
      state.user  = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

### app/store/index.ts (Redux store)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### app/store/hooks.ts (typed hooks)

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
```

### Wrap app with Provider — main.tsx

```tsx
import { Provider } from 'react-redux';
import { store } from '@/app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Protected Route Component

```tsx
// app/router/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
```

---

## 14. Route Map (Profile Module)

| Method | Endpoint                               | Controller Method       | Auth     | Note                      |
|--------|----------------------------------------|-------------------------|----------|---------------------------|
| POST   | `/api/auth/login`                      | `AuthController@login`  | Public   | Returns JWT               |
| POST   | `/api/auth/register`                   | `AuthController@register` | Public |                           |
| POST   | `/api/auth/logout`                     | `AuthController@logout` | JWT      |                           |
| POST   | `/api/auth/refresh`                    | `AuthController@refresh`| JWT      | Refresh token             |
| GET    | `/api/auth/me`                         | `AuthController@me`     | JWT      | Current user              |
| POST   | `/api/profiles`                        | `ProfileController@get` | JWT      | Get own profile           |
| PUT    | `/api/profiles/{userId}`               | `ProfileController@update` | JWT   | Update profile fields     |
| POST   | `/api/profiles/upload-image`           | `ProfileController@uploadImage` | JWT | Max 2MB, jpeg/png  |
| POST   | `/api/profiles/verify-mobile`          | `ProfileController@verifyMobileNumber` | JWT | Sends OTP  |
| POST   | `/api/profiles/verify-mobile-otp`      | `ProfileController@verifyMobileOtp`    | JWT | Validates OTP |
| POST   | `/api/profiles/change-password`        | `AuthController@changePassword`        | JWT |               |

---

## 15. Environment Configuration

### Laravel .env

```env
APP_NAME="My App"
APP_ENV=local
APP_KEY=base64:...
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret

# JWT
JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160
JWT_ALGO=HS256

# Redis (cache + queue)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# External Services (if any)
SMS_API_URL=
SMS_API_KEY=
PAYMENT_API_URL=
PAYMENT_SECRET=

# Storage
FILESYSTEM_DISK=public
```

### React .env

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="My App"
```

---

## 16. Key Differences from CFA API

| Aspect              | CFA API                                             | New Project                                    |
|---------------------|-----------------------------------------------------|------------------------------------------------|
| **Microservices**   | CI API, Proxy API, Notify API (separate services)   | None — everything in one Laravel app           |
| **ApiHelper usage** | Heavy — every profile op calls external services    | Light — only for 3rd-party (SMS, payment, etc.)|
| **Auth token**      | Custom JwtGuard with external validation            | `tymon/jwt-auth` — standard Laravel JWT        |
| **Database**        | Shared models via `core-packages` composer package  | Direct Eloquent models in `app/Models`          |
| **Auth data**       | `request()->auth['username']` from CI JWT           | `request()->auth` set by local JwtMiddleware    |
| **OTP**             | Calls external Notify API microservice              | Cache + external SMS provider via ApiHelper     |
| **Cards/CBS**       | Proxy API calls for banking data                    | Not applicable — use your own DB tables         |
| **Response format** | `{ resCode, resDesc, data }` (kept same)            | `{ resCode, resDesc, data }` (same envelope)    |
| **State Mgmt**      | N/A (mobile)                                        | Redux Toolkit (authSlice + feature slices)      |
| **Frontend**        | Mobile app (Flutter/React Native assumed)           | React SPA with Vite                             |

---

*Architecture document generated from NMB CFA API pattern analysis. Dated 2026-05-26.*
