import { useState } from 'react';
import { Button, Card, Form, Input, Typography, Steps } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCheckUserExistsMutation, useForgotPasswordMutation } from '../hooks/useForgotPasswordMutations';
import { Link } from 'react-router-dom';

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const checkUserMutation = useCheckUserExistsMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleCheckUser = (values: { userName: string }) => {
    checkUserMutation.mutate(values.userName, {
      onSuccess: (res) => {
        if (res.data.exists && res.data.user) {
          setUserId(res.data.user.id);
          setStep(1);
        } else {
          // handled by onError in hook
        }
      },
    });
  };

  const handleResetPassword = (values: {
    newPassword: string;
    newPassword_confirmation: string;
  }) => {
    if (!userId) return;
    forgotPasswordMutation.mutate({ id: userId, ...values });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 450, padding: '24px' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          Forgot Password
        </Title>

        <Steps
          current={step}
          size="small"
          style={{ marginBottom: 32, marginTop: 16 }}
          items={[
            { title: 'Verify Account', icon: <CheckCircleOutlined /> },
            { title: 'Reset Password', icon: <LockOutlined /> },
          ]}
        />

        {step === 0 && (
          <Form
            name="check-user"
            layout="vertical"
            onFinish={handleCheckUser}
            autoComplete="off"
          >
            <Form.Item
              name="userName"
              rules={[{ required: true, message: 'Please enter your email or phone' }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email or Phone"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={checkUserMutation.isPending}
              >
                Verify
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 1 && (
          <Form
            name="forgot-password"
            layout="vertical"
            onFinish={handleResetPassword}
            autoComplete="off"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword_confirmation"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm New Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={forgotPasswordMutation.isPending}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </div>
  );
}
