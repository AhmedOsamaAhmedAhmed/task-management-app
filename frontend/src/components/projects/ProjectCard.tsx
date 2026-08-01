/**
 * Project card component for displaying project in grid/list view
 */

import { Card, Space, Tag, Button, Dropdown, Avatar, Tooltip, Typography } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { UserAvatar } from '../users/UserAvatar';
import { formatDate } from '../../utils/dateUtils';

const { Text } = Typography;

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  viewMode?: 'grid' | 'list';
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  viewMode = 'grid',
}: ProjectCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'orange';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Active' : 'Archived';
  };

  const handleView = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
    } else {
      navigate(`/projects/${project.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(project);
    }
  };

  const menuItems = [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
      onClick: handleView,
    },
    {
      key: 'edit',
      label: 'Edit Project',
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: 'Delete Project',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ];

  const memberAvatars = project.members?.slice(0, 3).map((member) => (
    <UserAvatar key={member.userId} user={member.user} size={28} />
  ));

  const extraMembers = project.members && project.members.length > 3
    ? project.members.length - 3
    : 0;

  if (viewMode === 'list') {
    return (
      <Card
        hoverable
        style={{ marginBottom: 12 }}
        actions={[
          <Button type="text" icon={<EyeOutlined />} onClick={handleView}>
            View
          </Button>,
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>,
          <Button type="text" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text strong style={{ fontSize: 16 }}>
                {project.name}
              </Text>
              <Tag color={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {project.description || 'No description'}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Created {formatDate(project.createdAt, 'RELATIVE')}
                </Text>
                {project.members && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <TeamOutlined /> {project.members.length} members
                  </Text>
                )}
              </Space>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {memberAvatars}
            {extraMembers > 0 && (
              <Avatar size={28} style={{ background: '#f0f0f0' }}>
                +{extraMembers}
              </Avatar>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      hoverable
      cover={
        <div
          style={{
            height: 120,
            background: `linear-gradient(135deg, ${getStatusColor(project.status) === 'green' ? '#52c41a' : '#faad14'}, #1890ff)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
          }}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
      }
      actions={[
        <Button type="text" icon={<EyeOutlined />} onClick={handleView}>
          View
        </Button>,
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text ellipsis style={{ maxWidth: '70%' }}>
              {project.name}
            </Text>
            <Tag color={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Tag>
          </div>
        }
        description={
          <div>
            <Text type="secondary" ellipsis style={{ display: 'block', height: 44 }}>
              {project.description || 'No description'}
            </Text>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space>
                {memberAvatars}
                {extraMembers > 0 && (
                  <Avatar size={28} style={{ background: '#f0f0f0' }}>
                    +{extraMembers}
                  </Avatar>
                )}
              </Space>
              <Tooltip title={`Created ${formatDate(project.createdAt, 'RELATIVE')}`}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDate(project.createdAt, 'SHORT_DATE')}
                </Text>
              </Tooltip>
            </div>
          </div>
        }
      />
    </Card>
  );
}