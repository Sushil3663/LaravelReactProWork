import { useState } from 'react';
import { Button, Input, Typography, Flex } from 'antd';
import { MailOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSendOtp, useVerifyOtp, useResendOtp, useResendTimer } from '../hooks/useOtp';

const { Text } = Typography;

export default function OtpVerification({ onVerified }: { onVerified?: () => void }) {
  const [step, setStep] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [requestId, setRequestId] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendBlocked, setResendBlocked] = useState(false);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();
  const timer = useResendTimer();

  const handleSend = () => {
    setError('');
    sendOtp.mutate(undefined, {
      onSuccess: (res) => {
        setRequestId(res.data.request_id);
        setStep('sent');
        timer.start();
      },
    });
  };

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setError('');
    verifyOtp.mutate(
      { request_id: requestId, otp },
      {
        onSuccess: () => {
          setStep('verified');
          timer.reset();
          onVerified?.();
        },
      },
    );
  };

  const handleResend = () => {
    setError('');
    resendOtp.mutate(requestId, {
      onSuccess: (res) => {
        setRequestId(res.data.request_id);
        setOtp('');
        timer.start();
      },
      onError: (err: any) => {
        const code = err?.response?.data?.resCode;
        if (code === '429') {
          setResendBlocked(true);
        }
        const desc = err?.response?.data?.resDesc || 'Failed to resend OTP';
        setError(desc);
      },
    });
  };

  if (step === 'verified') {
    return (
      <Text type="success" strong>
        Email verified successfully
      </Text>
    );
  }

  return (
    <Flex vertical gap={12}>
      {step === 'idle' && (
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={handleSend}
          loading={sendOtp.isPending}
        >
          Send OTP
        </Button>
      )}

      {step === 'sent' && (
        <>
          <Text strong>Enter OTP sent to your email</Text>

          <Input
            size="large"
            maxLength={6}
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            style={{ width: 200, textAlign: 'center', letterSpacing: 8, fontSize: 20 }}
          />

          {error && <Text type="danger">{error}</Text>}

          <Flex gap={8}>
            <Button
              type="primary"
              onClick={handleVerify}
              loading={verifyOtp.isPending}
              disabled={otp.length !== 6}
            >
              Verify
            </Button>

            {resendBlocked ? (
              <Text type="warning">Resend limit reached</Text>
            ) : (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResend}
                loading={resendOtp.isPending}
                disabled={timer.isActive}
              >
                {timer.isActive ? `Resend in ${timer.seconds}s` : 'Resend'}
              </Button>
            )}
          </Flex>
        </>
      )}
    </Flex>
  );
}
