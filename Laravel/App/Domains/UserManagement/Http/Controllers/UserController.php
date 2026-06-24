<?php

namespace App\Domains\UserManagement\Http\Controllers;

use App\Domains\UserManagement\Dto\Requests\AssignRoleRequest;
use App\Domains\UserManagement\Services\UserManagementService;
use App\Http\Controllers\Api\Controller;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private readonly UserManagementService $userManagementService)
    {
        parent::__construct();
    }

    public function index(): JsonResponse
    {
        return $this->userManagementService->getUsers();
    }

    public function show(string $id): JsonResponse
    {
        return $this->userManagementService->getUser($id);
    }

    public function assignRole(AssignRoleRequest $request, string $id): JsonResponse
    {
        return $this->userManagementService->assignRoleToUser($id, $request->validated()['role']);
    }

    public function removeRole(AssignRoleRequest $request, string $id): JsonResponse
    {
        return $this->userManagementService->removeRoleFromUser($id, $request->validated()['role']);
    }
}
