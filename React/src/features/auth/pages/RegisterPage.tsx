import { Button, Card, Form, Input, InputNumber, Typography } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { Link } from 'react-router-dom';

const { Title } = Typography;

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  age: number;
}

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();

  const onFinish = (values: RegisterForm) => {
    const { password_confirmation, ...payload } = values;
    registerMutation.mutate(payload);
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
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Register
        </Title>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { min: 10, message: 'Phone must be at least 10 digits' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone" size="large" />
          </Form.Item>

          <Form.Item
            name="age"
            rules={[{ required: true, message: 'Please enter your age' }]}
          >
            <InputNumber
              placeholder="Age"
              min={18}
              max={80}
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={registerMutation.isPending}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}
