import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/user-management/api/userApi';
import { message } from 'antd';

export function useUsers(page: number) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => userApi.getUsers(page),
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userApi.assignRole(id, role),
    onSuccess: () => {
      message.success('Role assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Failed to assign role');
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userApi.removeRole(id, role),
    onSuccess: () => {
      message.success('Role removed successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Failed to remove role');
    },
  });
}

export function useAllPermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => userApi.getAllPermissions(),
  });
}

export function useUserPermissions(userId: string | null) {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: () => userApi.getUserPermissions(userId!),
    enabled: !!userId,
  });
}

export function useSyncPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      userApi.syncPermissions(id, permissions),
    onSuccess: () => {
      message.success('Permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
    onError: () => {
      message.error('Failed to update permissions');
    },
  });
}

export function useRolesWithPermissions() {
  return useQuery({
    queryKey: ['roles-with-permissions'],
    queryFn: () => userApi.getRolesWithPermissions(),
  });
}

export function useSyncRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: number; permissions: string[] }) =>
      userApi.syncRolePermissions(roleId, permissions),
    onSuccess: () => {
      message.success('Role permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: ['roles-with-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      message.error('Failed to update role permissions');
    },
  });
}
