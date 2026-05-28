<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Dto\Requests\ChangePasswordRequest;
use App\Http\Controllers\Api\Controller;
use App\Domains\Auth\Services\AuthService;
use App\Domains\Auth\Dto\Requests\LoginRequest;
use App\Domains\Auth\Dto\Requests\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
        parent::__construct();
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->authService->register($request->validated());
    }
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->authService->login($request->validated());
    }

    public function logout(): JsonResponse
    {
        return $this->authService->logout();
    }

    public function refresh(): JsonResponse
    {
        return $this->authService->refresh();
    }

    public function me(): JsonResponse
    {
        return $this->authService->me();
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        return $this->authService->changePassword($request->validated());
    }
}