import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/features/profile/api/profileApi';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: Partial<Profile> }) =>
      profileApi.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
