import api from '@/shared/api/axiosInstance';

export interface OtpResponse {
  resCode: string;
  resDesc: string;
  data?: { request_id: string };
}

export interface Profile {
  id: number;
  user_id: number;
  name: string;
  gender: string | null;
  date_of_birth: string | null;
  occupation_type: string | null;
  image: string | null;
  mobile: string | null;
  mobile_verified: boolean;
  email?: string;
  mobile_verified_at?: string | null;
}

export const profileApi = {
  get: () =>
    api.get('/profiles').then((r) => r.data.data),

  update: (userId: number, data: Partial<Profile>) =>
    api.put(`/profiles/${userId}`, data).then((r) => r.data.data),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/profiles/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  sendOtp: () =>
    api.post('/profiles/send-otp').then((r) => r.data),

  verifyOtp: (data: { request_id: string; otp: string }) =>
    api.post('/profiles/verify-otp', data).then((r) => r.data),

  resendOtp: (request_id: string) =>
    api.post('/profiles/resend-otp', { request_id }).then((r) => r.data),

  verifyMobile: (mobile: string) =>
    api.post('/profiles/verify-mobile', { mobile }).then((r) => r.data),

  verifyMobileOtp: (mobile: string, otp: string) =>
    api.post('/profiles/verify-mobile-otp', { mobile, otp }).then((r) => r.data),

  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    api.post('/profiles/change-password', data).then((r) => r.data),
};
