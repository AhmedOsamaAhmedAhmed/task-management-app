/**
 * Project members management component
 */

import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Typography, Select} from 'antd';
import { PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import { ProjectMember} from '../../types';
import { UserAvatar } from '../users/UserAvatar';
import { UserSelect } from '../users/UserSelect';
import { useAuthStore } from '../../store/authStore';

const { Text } = Typography;

interface ProjectMembersProps {
  members: ProjectMember[];
  onAddMember: (userId: string, role: 'admin' | 'member') => void;
  onRemoveMember: (userId: string) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

export function ProjectMembers({
  members,
  onAddMember,
  onRemoveMember,
  isLoading = false,
  isAdmin = false,
}: ProjectMembersProps) {
  const { user: currentUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');

  const handleAddMember = () => {
    if (selectedUser) {
      onAddMember(selectedUser, selectedRole);
      setIsModalOpen(false);
      setSelectedUser(null);
      setSelectedRole('member');
    }
  };

  const handleRemoveMember = (userId: string) => {
    Modal.confirm({
      title: 'Remove Member',
      content: 'Are you sure you want to remove this member from the project?',
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => onRemoveMember(userId),
    });
  };

  const columns = [
    {
      title: 'Member',
      key: 'member',
      render: (record: ProjectMember) => (
        <Space>
          <UserAvatar user={record.user} size={32} />
          <div>
            <Text strong>
              {record.user?.firstName} {record.user?.lastName}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.user?.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ProjectMember) => {
        // Cannot remove project owner
        if (record.userId === currentUser?.id) {
          return <Text type="secondary">Owner</Text>;
        }
        return (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveMember(record.userId)}
            disabled={!isAdmin}
          />
        );
      },
    },
  ];

  const excludeUserIds = members.map((m) => m.userId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong style={{ fontSize: 16 }}>
          Team Members ({members.length})
        </Text>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Member
          </Button>
        )}
      </div>

      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: 'No members in this project' }}
      />

      <Modal
        title="Add Team Member"
        open={isModalOpen}
        onOk={handleAddMember}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setSelectedRole('member');
        }}
        okText="Add Member"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Select a user to add to the project:</Text>
          <div style={{ marginTop: 8 }}>
            <UserSelect
              value={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              excludeUserIds={excludeUserIds}
              placeholder="Search for a user..."
              size="large"
            />
          </div>
        </div>
        <div>
          <Text>Role:</Text>
          <div style={{ marginTop: 8 }}>
            <Select
              value={selectedRole}
              onChange={(value: string | ((prevState: "admin" | "member") => "admin" | "member")) => setSelectedRole(value)}
              style={{ width: '100%' }}
              options={[
                { value: 'member', label: 'Member' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}