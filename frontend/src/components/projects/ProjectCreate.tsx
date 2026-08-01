/**
 * Create project page
 */

import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { useCreateProject } from '../../hooks/useProjects';
import { CreateProjectFormData } from '../../schemas/project.schema';

const { Title } = Typography;

export function ProjectCreate() {
  const navigate = useNavigate();
  const createProject = useCreateProject();

  const handleSubmit = async (data: CreateProjectFormData) => {
    await createProject.mutateAsync(data);
    navigate('/projects');
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Create New Project
      </Title>
      <Card>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          isLoading={createProject.isPending}
        />
      </Card>
    </div>
  );
}