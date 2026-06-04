import api from '@/shared/api/axiosInstance';

export interface OnboardingCase {
  form_id: string;
  status: string;
  name?: string;
  email?: string;
  phone?: string;
  path?: string;
  formData?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  resCode: string;
  resDesc: string;
  data: T;
}

export interface BasicInfoPayload {
  form_id: string;
  salutation: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  father_name: string;
  mother_name: string;
  place_of_birth: string;
}

export interface OtherInfoPayload {
  form_id: string;
  country: string;
  permanent_provience: string;
  permanent_district: string;
  permanent_municipality: string;
  permanent_ward: string;
  permanent_city: string;
  temporary_provience: string;
  temporary_district: string;
  temporary_municipality: string;
  temporary_ward: string;
  temporary_city: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  father_name: string;
  mother_name: string;
  place_of_birth: string;
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

  updateBasicInformation: (data: BasicInfoPayload) =>
    api.post<ApiResponse<OnboardingCase>>('/onboarding/basic-information', data).then(r => r.data),

  updateOtherInformation: (data: OtherInfoPayload) =>
    api.post<ApiResponse<OnboardingCase>>('/onboarding/other-information', data).then(r => r.data),
};
