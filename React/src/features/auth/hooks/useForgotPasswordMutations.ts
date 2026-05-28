import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export function useCheckUserExistsMutation() {
  return useMutation({
    mutationFn: (userName: string) => authApi.checkUserExists({ userName }),
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Failed to check user';
      message.error(desc);
    },
  });
}

export function useForgotPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      id: string;
      newPassword: string;
      newPassword_confirmation: string;
    }) => authApi.forgotPassword(data),
    onSuccess: () => {
      message.success('Password reset successfully');
      navigate('/login', { replace: true });
    },
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Failed to reset password';
      message.error(desc);
    },
  });
}
