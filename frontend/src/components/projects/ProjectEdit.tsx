/**
 * Edit project page
 */

import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { useProject, useUpdateProject } from '../../hooks/useProjects';
import { CreateProjectFormData } from '../../schemas/project.schema';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const { Title } = Typography;

export function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id!);
  const updateProject = useUpdateProject();

  const handleSubmit = async (data: CreateProjectFormData) => {
    if (id) {
      await updateProject.mutateAsync({ id, data });
      navigate('/projects');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" tip="Loading project..." />
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
      <Title level={2} style={{ marginBottom: 24 }}>
        Edit Project: {project.name}
      </Title>
      <Card>
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          isLoading={updateProject.isPending}
        />
      </Card>
    </div>
  );
}