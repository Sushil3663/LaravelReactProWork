import { Button, Card, Descriptions, Divider, Skeleton, Tag, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import AvatarUpload from '../components/AvatarUpload';
import OtpVerification from '../components/OtpVerification';

const { Title } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Title level={5} type="danger">Failed to load profile</Title>
      </Card>
    );
  }

  return (
    <Card
      style={{ maxWidth: 600, margin: '24px auto' }}
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate('/profile/edit')}
        >
          Edit Profile
        </Button>
      }
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <AvatarUpload image={profile.image} name={profile.name} />
        <Title level={4} style={{ marginTop: 12 }}>{profile.name}</Title>
      </div>

      <Descriptions column={1} bordered size="default">
        <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
        <Descriptions.Item label="Gender">
          {profile.gender ? <Tag>{profile.gender}</Tag> : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {profile.date_of_birth ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Occupation">
          {profile.occupation_type ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {profile.email ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Mobile">
          {profile.mobile ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Mobile Verified">
          {profile.mobile_verified ? <Tag color="green">Verified</Tag> : <Tag color="red">Not Verified</Tag>}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <OtpVerification />
      </div>
    </Card>
  );
}
