import { Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '../hooks/useAuthMutations';

const { Title } = Typography;

interface ChangePasswordForm {
  prevPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export default function ChangePasswordPage() {
  const [form] = Form.useForm<ChangePasswordForm>();
  const changePasswordMutation = useChangePasswordMutation();

  const onFinish = (values: ChangePasswordForm) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => form.resetFields(),
    });
  };

  return (
    <Card style={{ maxWidth: 500, margin: '24px auto' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Change Password
      </Title>
      <Form
        form={form}
        name="changePassword"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="prevPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Current Password"
            size="large"
          />
        </Form.Item>

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
            loading={changePasswordMutation.isPending}
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
