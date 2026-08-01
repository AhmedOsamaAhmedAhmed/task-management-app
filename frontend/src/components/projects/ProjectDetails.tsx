/**
 * Project details page with members and tasks overview
 */

import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Tag, Button, Descriptions, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useProject, useDeleteProject, useProjectMembers } from '../../hooks/useProjects';
import { ProjectMembers } from '../../components/projects/ProjectMembers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuthStore } from '../../store/authStore';

const { Title } = Typography;

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: project, isLoading, error } = useProject(id!);
  const { data: members, isLoading: membersLoading } = useProjectMembers(id!);
  const deleteProject = useDeleteProject();

  const isAdmin = user?.role === 'admin';

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        if (id) {
          await deleteProject.mutateAsync(id);
          navigate('/projects');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" tip="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you're looking for doesn't exist or you don't have access to it."
        actionLabel="Back to Projects"
        onAction={() => navigate('/projects')}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
            Back
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            {project.name}
          </Title>
          <Tag color={project.status === 'active' ? 'green' : 'orange'}>
            {project.status === 'active' ? 'Active' : 'Archived'}
          </Tag>
        </Space>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/projects/${project.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deleteProject.isPending}
          >
            Delete
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Project Info */}
        <Col xs={24} lg={16}>
          <Card title="Project Information">
            <Descriptions column={1}>
              <Descriptions.Item label="Name">{project.name}</Descriptions.Item>
              <Descriptions.Item label="Description">
                {project.description || 'No description provided'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={project.status === 'active' ? 'green' : 'orange'}>
                  {project.status === 'active' ? 'Active' : 'Archived'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(project.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Owner">
                {project.owner?.firstName} {project.owner?.lastName}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                onClick={() => navigate(`/projects/${project.id}/tasks/create`)}
              >
                Create Task
              </Button>
              <Button
                icon={<EditOutlined />}
                block
                onClick={() => navigate(`/projects/${project.id}/edit`)}
              >
                Edit Project
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Project Members */}
        <Col xs={24}>
          <Card>
            <ProjectMembers
              members={members || []}
              onAddMember={() => {}}
              onRemoveMember={() => {}}
              isLoading={membersLoading}
              isAdmin={isAdmin}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}