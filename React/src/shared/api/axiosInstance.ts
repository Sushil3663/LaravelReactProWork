import axios from 'axios';
import { store } from '@/app/store';
import { setToken, clearAuth } from '@/features/auth/store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${store.getState().auth.token}` } }
        );

        const newToken = data.data.token;
        store.dispatch(setToken(newToken));
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        store.dispatch(clearAuth());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
