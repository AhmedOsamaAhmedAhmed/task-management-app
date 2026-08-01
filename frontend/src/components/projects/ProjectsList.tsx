/**
 * Projects list page with grid/list view, search, filters, and pagination
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Input,
  Button,

  Segmented,
  Pagination,

  Typography,
  Select,
  Card,
} from 'antd';
import { SearchOutlined, PlusOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useProjects } from '../../hooks/useProjects';
import { useProjectStore } from '../../store/projectStore';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';

const { Title } = Typography;
const { Option } = Select;

export function ProjectsList() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useProjectStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useProjects({
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    search: debouncedSearch || undefined,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleStatusFilter = (status: string | undefined) => {
    setFilters({ status, page: 1 });
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" tip="Loading projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load projects"
        description="There was an error loading your projects. Please try again."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  const projects = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Projects
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProject}
          size="large"
        >
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search projects..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={handleStatusFilter}
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="active">Active</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as 'grid' | 'list')}
              options={[
                { value: 'grid', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> },
              ]}
              size="large"
            />
          </Col>
          <Col xs={24} md={4} style={{ textAlign: 'right' }}>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </Col>
        </Row>
      </Card>

      {/* Projects Grid/List */}
      {projects.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {projects.map((project) => (
              <Col
                key={project.id}
                xs={24}
                sm={viewMode === 'grid' ? 12 : 24}
                md={viewMode === 'grid' ? 8 : 24}
                lg={viewMode === 'grid' ? 6 : 24}
              >
                <ProjectCard
                  project={project}
                  viewMode={viewMode}
                  onEdit={() => navigate(`/projects/${project.id}/edit`)}
                  onDelete={() => {
                    // Handle delete
                  }}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Pagination
                current={meta.page}
                total={meta.total}
                pageSize={meta.limit}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total) => `Total ${total} projects`}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No projects found"
          description="Create your first project to get started"
          icon="📁"
          actionLabel="Create Project"
          onAction={handleCreateProject}
        />
      )}
    </div>
  );
}