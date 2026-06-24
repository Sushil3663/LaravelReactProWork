import api from '@/shared/api/axiosInstance';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: { id: number; name: string; guard_name: string }[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const userApi = {
  getUsers: (page = 1) =>
    api.get<{ resCode: string; resDesc: string; data: PaginatedResponse<User> }>(`/users?page=${page}`)
      .then((r) => r.data.data),

  getUser: (id: string) =>
    api.get<{ resCode: string; resDesc: string; data: User }>(`/users/${id}`)
      .then((r) => r.data.data),

  assignRole: (id: string, role: string) =>
    api.post(`/users/${id}/assign-role`, { role }).then((r) => r.data),

  removeRole: (id: string, role: string) =>
    api.post(`/users/${id}/remove-role`, { role }).then((r) => r.data),

  getAllPermissions: () =>
    api.get<{ resCode: string; resDesc: string; data: Record<string, { id: number; name: string }[]> }>('/permissions')
      .then((r) => r.data.data),

  getUserPermissions: (id: string) =>
    api.get<{ resCode: string; resDesc: string; data: { direct_permissions: string[] } }>(`/users/${id}/permissions`)
      .then((r) => r.data.data.direct_permissions),

  syncPermissions: (id: string, permissions: string[]) =>
    api.post(`/users/${id}/sync-permissions`, { permissions }).then((r) => r.data),

  getRolesWithPermissions: () =>
    api.get<{ resCode: string; resDesc: string; data: { id: number; name: string; guard_name: string; permissions: { id: number; name: string }[] }[] }>('/roles')
      .then((r) => r.data.data),

  syncRolePermissions: (roleId: number, permissions: string[]) =>
    api.post(`/roles/${roleId}/sync-permissions`, { permissions }).then((r) => r.data),
};
