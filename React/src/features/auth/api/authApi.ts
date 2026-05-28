import api from '@/shared/api/axiosInstance';
import type { User } from '../store/authSlice';

interface ApiResponse<T> {
  resCode: string;
  resDesc: string;
  data: T;
}

interface LoginPayload {
  userName: string;
  password: string;
}

interface LoginData {
  token: string;
  user: User;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  age?: number;
}

interface ChangePasswordPayload {
  prevPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginData>>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<{ token: string }>>('/auth/register', payload).then((r) => r.data),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),

  refresh: () =>
    api.post<ApiResponse<{ token: string }>>('/auth/refresh').then((r) => r.data),

  me: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/auth-information').then((r) => r.data),

  changePassword: (payload: ChangePasswordPayload) =>
    api.post<ApiResponse<null>>('/auth/change-password', payload).then((r) => r.data),
};
