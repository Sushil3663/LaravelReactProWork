<?php

namespace App\Domains\UserManagement\Services;

use App\Http\Responses\ResponseHandler;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class UserManagementService
{
    public function __construct(
        private readonly ResponseHandler $responseHandler,
        private readonly Customer $customer
    ) {
    }

    public function getUsers(): JsonResponse
    {
        $users = $this->customer
            ->with('roles')
            ->paginate(10);

        return $this->responseHandler->toJson(200, 'Users retrieved successfully', $users);
    }

    public function getUser(string $id): JsonResponse
    {
        $user = $this->customer
            ->with('roles')
            ->find($id);

        if (!$user) {
            return $this->responseHandler->toJson(404, 'User not found');
        }

        return $this->responseHandler->toJson(200, 'User retrieved successfully', $user);
    }

    public function assignRoleToUser(string $userId, string $roleName): JsonResponse
    {
        $user = $this->customer->find($userId);

        if (!$user) {
            return $this->responseHandler->toJson(404, 'User not found');
        }

        $role = Role::where('name', $roleName)->where('guard_name', 'api')->first();

        if (!$role) {
            return $this->responseHandler->toJson(404, 'Role not found');
        }

        $user->syncRoles([$roleName]);

        return $this->responseHandler->toJson(200, 'Role assigned successfully', $role);
    }

    public function removeRoleFromUser(string $userId, string $roleName): JsonResponse
    {
        $user = $this->customer->find($userId);

        if (!$user) {
            return $this->responseHandler->toJson(404, 'User not found');
        }

        if (!$user->hasRole($roleName)) {
            return $this->responseHandler->toJson(400, 'User does not have this role');
        }

        $user->removeRole($roleName);

        return $this->responseHandler->toJson(200, 'Role removed successfully');
    }
}