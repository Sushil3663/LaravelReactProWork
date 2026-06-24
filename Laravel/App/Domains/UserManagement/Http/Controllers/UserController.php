<?php

namespace App\Domains\UserManagement\Http\Controllers;

use App\Domains\UserManagement\Dto\Requests\AssignRoleRequest;
use App\Domains\UserManagement\Services\UserManagementService;
use App\Http\Controllers\Api\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function permissions(): JsonResponse
    {
        return $this->userManagementService->getAllPermissions();
    }

    public function userPermissions(string $id): JsonResponse
    {
        return $this->userManagementService->getUserDirectPermissions($id);
    }

    public function syncPermissions(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        return $this->userManagementService->syncUserPermissions($id, $request->input('permissions', []));
    }

    public function roles(): JsonResponse
    {
        return $this->userManagementService->getRolesWithPermissions();
    }

    public function syncRolePermissions(Request $request, string $roleId): JsonResponse
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        return $this->userManagementService->syncRolePermissions($roleId, $request->input('permissions', []));
    }
}
