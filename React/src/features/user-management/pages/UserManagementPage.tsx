import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Select,
  Button,
  Space,
  Typography,
  Skeleton,
  message,
} from 'antd';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import {
  useUsers,
  useAssignRole,
  useRemoveRole,
} from '@/features/user-management/hooks/useUsers';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import type { User } from '@/features/user-management/api/userApi';

const { Title } = Typography;

const ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Admin', value: 'Admin' },
  { label: 'User', value: 'User' },
];

const ROLE_COLORS: Record<string, string> = {
  'Super Admin': 'red',
  Admin: 'blue',
  User: 'green',
};

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page);
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const currentUserInList = data?.data?.find((u) => u.id === currentUserId);
  const currentUserRoles = currentUserInList?.roles?.map((r) => r.name) ?? [];
  const isSuperAdmin = currentUserRoles.includes('Super Admin');

  const handleAssignRole = (userId: string, role: string) => {
    assignRole.mutate({ id: userId, role });
  };

  const handleRemoveRole = (userId: string, role: string) => {
    if (!role) {
      message.warning('User has no role to remove');
      return;
    }
    removeRole.mutate({ id: userId, role });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: { id: number; name: string }[]) => (
        <Space>
          {roles.length === 0 ? (
            <Tag>No Role</Tag>
          ) : (
            roles.map((role) => (
              <Tag key={role.id} color={ROLE_COLORS[role.name] ?? 'default'}>
                {role.name}
              </Tag>
            ))
          )}
        </Space>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            title: 'Assign Role',
            key: 'assign',
            render: (_: unknown, record: User) => (
              <Select
                style={{ width: 140 }}
                placeholder="Select role"
                options={ROLE_OPTIONS}
                onChange={(value) => handleAssignRole(record.id, value)}
              />
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: User) => (
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveRole(record.id, record.roles[0]?.name)}
                disabled={record.roles.length === 0}
              >
                Remove Role
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <Card style={{ margin: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <Card style={{ margin: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <UserOutlined style={{ fontSize: 24 }} />
        <Title level={4} style={{ margin: 0 }}>
          User Management
        </Title>
      </Space>

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: data?.per_page ?? 10,
          total: data?.total ?? 0,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </Card>
  );
}
