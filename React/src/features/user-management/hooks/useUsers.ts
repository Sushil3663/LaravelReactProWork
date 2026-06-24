import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/user-management/api/userApi';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

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

export function useCurrentUser() {
  return useSelector((state: RootState) => state.auth.user);
}
