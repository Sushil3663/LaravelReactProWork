<?php

namespace App\Domains\Auth\Services;

use App\Http\Responses\ResponseHandler;
use App\Models\Customer;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(private readonly ResponseHandler $responseHandler, private readonly Customer $customer, private readonly Profile $profile)
    {
        // You can inject any dependencies here if needed
    }

    public function login(array $credentials): JsonResponse
    {

        // Determine if login is email or phone
        $field = filter_var($credentials['userName'], FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $customer = $this->customer
            ->where($field, $credentials['userName'])
            ->first(['id', 'name', 'email', 'phone', 'password']);
        if (!$customer || !password_verify($credentials['password'], $customer->password)) {
            return $this->responseHandler->toJson(404, 'Invalid credentials');
        }

        try {
            $token = JWTAuth::fromUser($customer);
        } catch (JWTException $e) {
            return $this->responseHandler->toJson(500, 'Could not create token');
        }

        return $this->responseHandler->toJson(200, 'Login successful', ['token' => $token]);
    }

    public function register(array $data): JsonResponse
    {
        $data['password'] = bcrypt($data['password']);
        $creatableData = $this->customer->create($data);
        if ($creatableData) {
            $this->profile->create(['user_id' => $creatableData->id, 'name' => $creatableData->name, 'mobile' => $creatableData->phone]);
        }
        try {
            $token = JWTAuth::fromUser($creatableData);
            // $token = auth()->login($creatableData);
        } catch (JWTException $e) {
            return $this->responseHandler->toJson(500, 'Could not create token');
        }

        return $this->responseHandler->toJson(200, 'User registered successfully', ['token' => $token]);
    }

    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return $this->responseHandler->toJson(200, 'Logged out successfully');
        } catch (JWTException $e) {
            return $this->responseHandler->toJson(500, 'Could not log out');
        }
    }

    public function refresh(): JsonResponse
    {
        try {
            $newToken = JWTAuth::refresh();

            return $this->responseHandler->toJson(200, 'Token refreshed', ['token' => $newToken]);
        } catch (TokenExpiredException $e) {
            return $this->responseHandler->toJson(401, 'Token cannot be refreshed, please login again');
        } catch (JWTException $e) {
            return $this->responseHandler->toJson(401, 'Token cannot be refreshed');
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            return $this->responseHandler->toJson(200, 'Successfully retrieved Auth information', ['user' => $user]);
        } catch (\Exception $e) {
            return $this->responseHandler->toJson(401, $e->getMessage());
        }
    }

    public function changePassword(array $data): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!password_verify($data['prevPassword'], $user->password)) {
                return $this->responseHandler->toJson(400, 'Previous password is incorrect');
            }
            if ($data['prevPassword'] === $data['newPassword']) {
                return $this->responseHandler->toJson(400, 'New password cannot be the same as the previous password');
            } elseif ($data['newPassword'] !== $data['newPassword_confirmation']) {
                return $this->responseHandler->toJson(400, 'New password confirmation does not match');
            } else {
                $user->password = $data['newPassword'];
                $user->save();

                return $this->responseHandler->toJson(200, 'Password changed successfully', ['user' => $user]);
            }
        } catch (\Exception $e) {
            return $this->responseHandler->toJson(500, 'Internal Server Error');
        }
    }
}