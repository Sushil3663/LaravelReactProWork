<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Dto\Requests\ChangePasswordRequest;
use App\Domains\Auth\Dto\Requests\ForgotPasswordRequest;
use App\Domains\Auth\Dto\Requests\LoginRequest;
use App\Domains\Auth\Dto\Requests\RegisterRequest;
use App\Domains\Auth\Services\AuthService;
use App\Http\Controllers\Api\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
        parent::__construct();
    }

    #[OA\Post(
        path: '/api/auth/register',
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'password', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'age', type: 'integer'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'User registered successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->authService->register($request->validated());
    }

    #[OA\Post(
        path: '/api/auth/login',
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'userName', type: 'string'),
                    new OA\Property(property: 'password', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login successful'),
            new OA\Response(response: 401, description: 'Invalid credentials'),
        ]
    )]
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->authService->login($request->validated());
    }

    #[OA\Post(
        path: '/api/auth/logout',
        tags: ['Auth'],
        summary: 'Logout user',
        responses: [
            new OA\Response(response: 200, description: 'Logged out successfully'),
        ]
    )]
    public function logout(): JsonResponse
    {
        return $this->authService->logout();
    }

    #[OA\Post(
        path: '/api/auth/refresh',
        tags: ['Auth'],
        summary: 'Refresh token',
        responses: [
            new OA\Response(response: 200, description: 'Token refreshed'),
        ]
    )]
    public function refresh(): JsonResponse
    {
        return $this->authService->refresh();
    }

    #[OA\Get(
        path: '/api/auth/auth-information',
        tags: ['Auth'],
        summary: 'Get authenticated user info',
        responses: [
            new OA\Response(response: 200, description: 'User info retrieved'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function me(): JsonResponse
    {
        return $this->authService->me();
    }

    #[OA\Post(
        path: '/api/auth/user-exists',
        tags: ['Auth'],
        summary: 'Check if user exists',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'userName', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'User exists status'),
        ]
    )]
    public function checkUserExists(Request $request): JsonResponse
    {
        return $this->authService->checkUserExists($request->validate([
            'userName' => 'required|string',
        ])['userName']);
    }

    #[OA\Post(
        path: '/api/auth/forgot-password',
        tags: ['Auth'],
        summary: 'Send forgot password email',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Password reset email sent'),
            new OA\Response(response: 404, description: 'User not found'),
        ]
    )]
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        return $this->authService->forgotPassword($request->validated());
    }

    #[OA\Post(
        path: '/api/auth/change-password',
        tags: ['Auth'],
        summary: 'Change user password',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'current_password', type: 'string'),
                    new OA\Property(property: 'new_password', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Password changed successfully'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        return $this->authService->changePassword($request->validated());
    }
}
