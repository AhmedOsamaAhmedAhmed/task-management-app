/**
 * Project form for create/edit
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button } from 'antd';
import { createProjectSchema, CreateProjectFormData } from '../../schemas/project.schema';
import { Project } from '../../types';

const { TextArea } = Input;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (project) {
      setValue('name', project.name);
      // ✅ تحويل null إلى undefined
      setValue('description', project.description || undefined);
    }
  }, [project, setValue]);

  // ✅ معالجة البيانات قبل الإرسال
  const handleFormSubmit = (data: CreateProjectFormData) => {
    // ✅ تحويل null إلى undefined
    const formattedData = {
      ...data,
      description: data.description || undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Item
        label="Project Name"
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name?.message}
        required
      >
        <Input
          size="large"
          placeholder="Enter project name"
          {...register('name')}
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <TextArea
          rows={4}
          placeholder="Enter project description (optional)"
          {...register('description')}
          disabled={isLoading}
        />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}