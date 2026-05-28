import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/features/profile/api/profileApi';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
  });
}
