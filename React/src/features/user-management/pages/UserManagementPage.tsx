import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Table,
  Tag,
  Select,
  Button,
  Space,
  Typography,
  Skeleton,
  Modal,
  Result,
  Checkbox,
  Collapse,
} from 'antd';
import { EditOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { authApi } from '@/features/auth/api/authApi';
import {
  useUsers,
  useAssignRole,
  useAllPermissions,
  useRolesWithPermissions,
  useSyncRolePermissions,
} from '@/features/user-management/hooks/useUsers';
import type { User } from '@/features/user-management/api/userApi';
import type { SelectProps } from 'antd';

const { Title, Text } = Typography;

const ROLE_OPTIONS: SelectProps['options'] = [
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
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading: usersLoading } = useUsers(page);
  const assignRole = useAssignRole();
  const syncRolePermissions = useSyncRolePermissions();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  });

  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string | undefined>(undefined);

  const [rolePermModalOpen, setRolePermModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(undefined);
  const [selectedRolePerms, setSelectedRolePerms] = useState<string[]>([]);

  const { data: allPermissionsData, isLoading: permsLoading } = useAllPermissions();
  const { data: rolesWithPerms } = useRolesWithPermissions();

  const userPermissions =
    meData?.data?.user?.all_permissions ?? [];
  const canView = userPermissions.includes('usermanagement.list');
  const canEdit = userPermissions.includes('usermanagement.edit');

  if (!canView) {
    return (
      <Card style={{ margin: 24 }}>
        <Result
          status="403"
          title="Access Denied"
          subTitle="You do not have permission to access this page."
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
          }
        />
      </Card>
    );
  }

  const openEditRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.roles[0]?.name ?? undefined);
    setEditRoleModalOpen(true);
  };

  const handleEditRoleSave = () => {
    if (!selectedUser) return;
    assignRole.mutate(
      { id: selectedUser.id, role: newRole ?? 'User' },
      { onSuccess: () => setEditRoleModalOpen(false) },
    );
  };

  const openRolePermModal = () => {
    setSelectedRoleId(undefined);
    setSelectedRolePerms([]);
    setRolePermModalOpen(true);
  };

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);
    const role = rolesWithPerms?.find((r) => r.id === roleId);
    setSelectedRolePerms(role?.permissions.map((p) => p.name) ?? []);
  };

  const handleRolePermToggle = (name: string) => {
    setSelectedRolePerms((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name],
    );
  };

  const handleRolePermSave = () => {
    if (selectedRoleId === undefined) return;
    syncRolePermissions.mutate(
      { roleId: selectedRoleId, permissions: selectedRolePerms },
      { onSuccess: () => setRolePermModalOpen(false) },
    );
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
    ...(canEdit
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: User) => (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEditRoleModal(record)}
              >
                Edit Role
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (usersLoading) {
    return (
      <Card style={{ margin: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <Card style={{ margin: 24 }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <UserOutlined style={{ fontSize: 24 }} />
          <Title level={4} style={{ margin: 0 }}>
            User Management
          </Title>
          {canView && !canEdit && (
            <Tag color="blue" style={{ marginLeft: 8 }}>View Only</Tag>
          )}
        </Space>
        {canEdit && (
          <Button
            type="default"
            icon={<SafetyCertificateOutlined />}
            onClick={openRolePermModal}
          >
            Role Permissions
          </Button>
        )}
      </Space>

      <Table
        columns={columns}
        dataSource={usersData?.data}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: usersData?.per_page ?? 10,
          total: usersData?.total ?? 0,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />

      <Modal
        title={`Edit Role — ${selectedUser?.name ?? ''}`}
        open={editRoleModalOpen}
        onOk={handleEditRoleSave}
        onCancel={() => setEditRoleModalOpen(false)}
        okText="Save"
        okButtonProps={{ disabled: !newRole }}
        confirmLoading={assignRole.isPending}
        width={400}
      >
        <div>
          <Text strong>Role</Text>
          <Select
            style={{ width: '100%', marginTop: 4 }}
            placeholder="Select role"
            options={ROLE_OPTIONS}
            value={newRole}
            onChange={(value) => setNewRole(value)}
          />
        </div>
      </Modal>

      <Modal
        title="Role Permissions"
        open={rolePermModalOpen}
        onOk={handleRolePermSave}
        onCancel={() => setRolePermModalOpen(false)}
        okText="Save"
        okButtonProps={{ disabled: selectedRoleId === undefined }}
        confirmLoading={syncRolePermissions.isPending}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Role</Text>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              placeholder="Select a role"
              options={rolesWithPerms?.map((r) => ({ label: r.name, value: r.id })) ?? []}
              value={selectedRoleId}
              onChange={handleRoleSelect}
            />
          </div>

          {selectedRoleId !== undefined && (
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Permissions</Text>
              {permsLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <Collapse
                  size="small"
                  defaultActiveKey={
                    allPermissionsData
                      ? Object.keys(allPermissionsData)
                      : []
                  }
                  items={Object.entries(allPermissionsData ?? {})
                    .map(([module, perms]) => ({
                      key: module,
                      label: <Text strong style={{ textTransform: 'capitalize' }}>{module}</Text>,
                      children: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {perms.map((perm) => (
                            <Checkbox
                              key={perm.name}
                              checked={selectedRolePerms.includes(perm.name)}
                              onChange={() => handleRolePermToggle(perm.name)}
                            >
                              {perm.name.split('.').pop()}
                            </Checkbox>
                          ))}
                        </div>
                      ),
                    }))}
                />
              )}
            </div>
          )}
        </Space>
      </Modal>
    </Card>
  );
}
