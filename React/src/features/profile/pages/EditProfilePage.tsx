import { Button, Card, DatePicker, Form, Input, Select, Skeleton, Typography, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { type Profile } from '../api/profileApi';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const { Title } = Typography;

interface EditProfileForm {
  name: string;
  gender: string;
  date_of_birth: dayjs.Dayjs;
  occupation_type: string;
}

export default function EditProfilePage() {
  const [form] = Form.useForm<EditProfileForm>();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();

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

  const onFinish = (values: EditProfileForm) => {
    const data: Partial<Profile> = {
      name: values.name,
      gender: values.gender,
      occupation_type: values.occupation_type,
      date_of_birth: values.date_of_birth
        ? values.date_of_birth.format('YYYY-MM-DD')
        : undefined,
    };
    updateProfile.mutate(
      { userId: profile.user_id, data },
      {
        onSuccess: () => message.success('Profile updated successfully'),
        onError: () => message.error('Failed to update profile'),
      }
    );
  };

  return (
    <Card style={{ maxWidth: 600, margin: '24px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <UserOutlined style={{ fontSize: 64, color: '#1677ff' }} />
        <Title level={4} style={{ marginTop: 12 }}>Edit Profile</Title>
      </div>

      <Form
        form={form}
        name="editProfile"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          name: profile.name,
          gender: profile.gender ?? undefined,
          date_of_birth: profile.date_of_birth ? dayjs(profile.date_of_birth) : undefined,
          occupation_type: profile.occupation_type ?? undefined,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Name" size="large" />
        </Form.Item>

        <Form.Item name="gender" label="Gender">
          <Select
            placeholder="Select gender"
            size="large"
            allowClear
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </Form.Item>

        <Form.Item name="date_of_birth" label="Date of Birth">
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item name="occupation_type" label="Occupation">
          <Input placeholder="Occupation" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={updateProfile.isPending}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
