import { Card, Descriptions, Skeleton, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

const { Title } = Typography;

export default function MePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  });

  const user = data?.data?.user;

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Title level={5} type="danger">Failed to load user information</Title>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: '24px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <UserOutlined style={{ fontSize: 64, color: '#1677ff' }} />
        <Title level={4} style={{ marginTop: 12 }}>{user.name}</Title>
      </div>

      <Descriptions column={1} bordered size="large">
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
