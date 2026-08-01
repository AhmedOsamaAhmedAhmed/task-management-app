 
/**
 * Dashboard page with overview statistics and recent items
 */

import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, List, Typography, Space, Tag, Empty } from 'antd';
import {
  ProjectOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, getTaskStatusColor, getTaskPriorityColor } from '../../utils/dateUtils';
// import { TaskStatus } from '../../types';

const { Title, Text } = Typography;

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch projects
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects({ page: 1, limit: 5 });

  // Fetch tasks from the first project if available
  const firstProjectId = projectsData?.data?.[0]?.id;
  const {
    data: tasksData,
    isLoading: tasksLoading,
  } = useTasks(firstProjectId || '', { limit: 5 });

  const tasks = tasksData?.data || [];
  const totalProjects = projectsData?.data?.length || 0;
  const totalTasks = tasksData?.meta?.total || 0;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleCreateTask = () => {
    if (firstProjectId) {
      navigate(`/projects/${firstProjectId}/tasks/create`);
    } else {
      // Show notification to create a project first
    }
  };

  if (projectsLoading || tasksLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (projectsError) {
    return (
      <EmptyState
        title="Failed to load dashboard"
        description="There was an error loading your dashboard. Please try again."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={{ padding: '8px' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>
          Welcome back, {user?.firstName}! 👋
        </Title>
        <Text type="secondary">
          Here's what's happening with your projects and tasks.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Projects"
              value={totalProjects}
              prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={handleCreateTask}
            disabled={totalProjects === 0}
          >
            Create Task
          </Button>
          {totalProjects === 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              (Create a project first to add tasks)
            </Text>
          )}
        </Space>
      </Card>

      {/* Recent Projects */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ProjectOutlined />
                <span>Recent Projects</span>
              </Space>
            }
            extra={
              totalProjects > 0 && (
                <Button type="link" onClick={() => navigate('/projects')}>
                  View All
                </Button>
              )
            }
          >
            {projectsData?.data && projectsData.data.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={projectsData.data}
                renderItem={(project) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Text
                          strong
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          {project.name}
                        </Text>
                      }
                      description={
                        <Space>
                          <Tag color={project.status === 'active' ? 'green' : 'orange'}>
                            {project.status === 'active' ? 'Active' : 'Archived'}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Created {formatDate(project.createdAt, 'RELATIVE')}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={
                  <div>
                    <Text>No projects yet</Text>
                    <br />
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleCreateProject}
                      style={{ marginTop: 8 }}
                    >
                      Create your first project
                    </Button>
                  </div>
                }
              />
            )}
          </Card>
        </Col>

        {/* Recent Tasks */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Recent Tasks</span>
              </Space>
            }
            extra={
              tasks.length > 0 && (
                <Button type="link" onClick={() => navigate('/tasks')}>
                  View All
                </Button>
              )
            }
          >
            {tasks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={tasks}
                renderItem={(task) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Text
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          {task.title}
                        </Text>
                      }
                      description={
                        <Space>
                          <Tag color={getTaskStatusColor(task.status)}>
                            {task.status}
                          </Tag>
                          <Tag color={getTaskPriorityColor(task.priority)}>
                            {task.priority}
                          </Tag>
                          {task.dueDate && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <ClockCircleOutlined /> Due {formatDate(task.dueDate, 'RELATIVE')}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={
                  <div>
                    <Text>No tasks yet</Text>
                    <br />
                    {totalProjects > 0 && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleCreateTask}
                        style={{ marginTop: 8 }}
                      >
                        Create your first task
                      </Button>
                    )}
                    {totalProjects === 0 && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Create a project first to add tasks
                      </Text>
                    )}
                  </div>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}