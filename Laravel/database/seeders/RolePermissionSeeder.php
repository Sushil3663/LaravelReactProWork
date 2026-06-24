<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = ['usermanagement', 'onboarding', 'profiles'];
        $actions = ['list', 'view', 'create', 'edit', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}", 'guard_name' => 'api']);
            }
        }

        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'api']);
        $superAdmin->syncPermissions(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $admin->syncPermissions([
            'usermanagement.list',
            'usermanagement.view',
            'onboarding.list',
            'onboarding.view',
            'onboarding.create',
            'onboarding.edit',
            'profiles.list',
            'profiles.view',
        ]);

        $user = Role::firstOrCreate(['name' => 'User', 'guard_name' => 'api']);
        $user->syncPermissions([
            'profiles.list',
            'profiles.view',
            'profiles.edit',
            'onboarding.list',
            'onboarding.view',
            'onboarding.create',
            'onboarding.edit',
        ]);
    }
}