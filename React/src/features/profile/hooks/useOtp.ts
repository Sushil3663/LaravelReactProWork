import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { profileApi } from '../api/profileApi';

export function useSendOtp() {
  return useMutation({
    mutationFn: () => profileApi.sendOtp(),
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Failed to send OTP';
      message.error(desc);
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: { request_id: string; otp: string }) =>
      profileApi.verifyOtp(data),
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'OTP verification failed';
      message.error(desc);
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (request_id: string) =>
      profileApi.resendOtp(request_id),
    onError: (err: any) => {
      const desc = err?.response?.data?.resDesc || 'Failed to resend OTP';
      message.error(desc);
    },
  });
}

export function useResendTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (seconds <= 0) {
      setIsActive(false);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, seconds]);

  const start = useCallback(() => {
    setSeconds(60);
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsActive(false);
  }, []);

  return { seconds, isActive, start, reset };
}
