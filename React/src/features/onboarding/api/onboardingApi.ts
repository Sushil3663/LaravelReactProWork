import api from '@/shared/api/axiosInstance';

export interface OnboardingCase {
  form_id: string;
  status: string;
  name?: string;
  email?: string;
  phone?: string;
  formData?: Record<string, unknown>;
  path?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  resCode: string;
  resDesc: string;
  data: T;
}

export const onboardingApi = {
  caseInitiation: () =>
    api.post<ApiResponse<OnboardingCase>>('/onboarding/case-initiation').then(r => r.data),

  getLatest: () =>
    api.get<ApiResponse<{ form_id: string | null; status: string | null }>>('/onboarding/latest-onboarding').then(r => r.data),

  getForm: (formId: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/onboarding/show/${formId}`).then(r => r.data),

  uploadImage: (formId: string, file: File) => {
    const form = new FormData();
    form.append('identityCard', file);
    form.append('form_id', formId);
    return api.post<ApiResponse<{ image: string; form_id: string; status: string }>>('/onboarding/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  uploadCaseDocuments: (data: { form_id: string; documentPath: string; documentType: string }) =>
    api.post<ApiResponse<Record<string, unknown>>>('/onboarding/case-upload', data).then(r => r.data),

  updateBasicInformation: (data: { form_id: string; name?: string; email?: string; phone?: string }) =>
    api.post<ApiResponse<OnboardingCase>>('/onboarding/basic-information', data).then(r => r.data),

  updateOtherInformation: (data: { form_id: string } & Record<string, unknown>) =>
    api.post<ApiResponse<OnboardingCase>>('/onboarding/other-information', data).then(r => r.data),
};
