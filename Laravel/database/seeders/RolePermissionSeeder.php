<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create permissions
        $permissions = [
            'create',
            'read',
            'update',
            'delete',
            'list',
        ];
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }

        // 2. Create roles and assign permissions
        $roles = [
            'Super Admin' => ['create', 'read', 'update', 'delete', 'list'],
            'Admin' => ['create', 'read', 'update', 'delete', 'list'],
            'User' => ['read', 'list'],
        ];

        foreach ($roles as $roleName => $perms) {
            $role = Role::create(['name' => $roleName, 'guard_name' => 'api']);
            $role->syncPermissions($perms);
        }
        // 3. (Optional) Assign Super Admin role to an existing user
        // $customer = Customer::where('email', 'karkisushil309@gmail.com')->first();
        // if ($customer) {
        //     $customer->assignRole('Super Admin');
        // }
    }

}