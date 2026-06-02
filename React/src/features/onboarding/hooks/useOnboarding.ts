import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '@/features/onboarding/api/onboardingApi';
import { message } from 'antd';

export function useLatestOnboarding() {
  return useQuery({
    queryKey: ['onboarding', 'latest'],
    queryFn: () => onboardingApi.getLatest(),
    retry: false,
  });
}

export function useOnboardingForm(formId: string | null) {
  return useQuery({
    queryKey: ['onboarding', 'form', formId],
    queryFn: () => onboardingApi.getForm(formId!),
    enabled: !!formId,
    retry: false,
  });
}

export function useCaseInitiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => onboardingApi.caseInitiation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'latest'] });
      message.success('Case initiated successfully');
    },
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, file }: { formId: string; file: File }) =>
      onboardingApi.uploadImage(formId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      message.success('Image uploaded successfully');
    },
  });
}

export function useUploadCaseDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { form_id: string; documentPath: string; documentType: string }) =>
      onboardingApi.uploadCaseDocuments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      message.success('Documents uploaded successfully');
    },
  });
}
