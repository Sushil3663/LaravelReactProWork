import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export function useLoginMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userName, password }: { userName: string; password: string }) =>
      login(userName, password),
    onSuccess: () => {
      message.success('Login successful');
      navigate('/', { replace: true });
    },
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Login failed';
      message.error(desc);
    },
  });
}

export function useRegisterMutation() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      age?: number;
    }) => authApi.register(data),
    onSuccess: async (res) => {
      message.success('Registration successful');
      navigate('/login', { replace: true });
    },
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Registration failed';
      message.error(desc);
    },
  });
}

export function useLogoutMutation() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
    onError: () => {
      navigate('/login', { replace: true });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: {
      prevPassword: string;
      newPassword: string;
      newPassword_confirmation: string;
    }) => authApi.changePassword(data),
    onSuccess: () => {
      message.success('Password changed successfully');
    },
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Failed to change password';
      message.error(desc);
    },
  });
}
