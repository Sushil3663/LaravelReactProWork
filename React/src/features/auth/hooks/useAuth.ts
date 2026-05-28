import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { authApi } from '@/features/auth/api/authApi';
import { setToken, setUser, clearAuth } from '@/features/auth/store/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((s) => s.auth);

  const isAuthenticated = !!token;

  const login = async (userName: string, password: string) => {
    const res = await authApi.login({ userName, password });
    dispatch(setToken(res.data.token));
    if (res.data.user) dispatch(setUser(res.data.user));
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(clearAuth());
    }
  };

  const fetchMe = async () => {
    const res = await authApi.me();
    dispatch(setUser(res.data.user));
    return res;
  };

  return { isAuthenticated, user, token, login, logout, fetchMe };
}
