/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Projects hooks using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import { useUIStore } from '../store/uiStore';
import { CreateProjectDto, UpdateProjectDto, AddMemberDto } from '../types/project.types';
import { handleApiError } from '../utils/errorHandler';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: any) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  members: (projectId: string) => [...projectKeys.detail(projectId), 'members'] as const,
};

// Get all projects with pagination and filters
export const useProjects = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsApi.getProjects(params),
    select: (response) => response.data,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get a single project
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getProject(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

// Get project members
export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => projectsApi.getProjectMembers(projectId),
    select: (response) => response.data,
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

// ✅ Create project mutation with proper formatting
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => {
      // ✅ تحويل null إلى undefined
      const formattedData = {
        ...data,
        description: data.description || undefined,
      };
      return projectsApi.createProject(formattedData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      showNotification('success', 'Project created successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// ✅ Update project mutation with proper formatting
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) => {
      // ✅ تحويل null إلى undefined
      const formattedData = {
        ...data,
        description: data.description || undefined,
      };
      return projectsApi.updateProject(id, formattedData);
    },
    onSuccess: (response, variables) => {
      // Update single project cache
      queryClient.setQueryData(projectKeys.detail(variables.id), response);
      // Invalidate project lists
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      showNotification('success', 'Project updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: (_, id) => {
      // Remove project from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      showNotification('success', 'Project deleted successfully!');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Add project member mutation
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: AddMemberDto }) =>
      projectsApi.addProjectMember(projectId, data),
    onSuccess: (_, variables) => {
      // Invalidate project members
      queryClient.invalidateQueries({ queryKey: projectKeys.members(variables.projectId) });
      showNotification('success', 'Member added successfully!');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Remove project member mutation
export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.removeProjectMember(projectId, userId),
    onSuccess: (_, variables) => {
      // Invalidate project members
      queryClient.invalidateQueries({ queryKey: projectKeys.members(variables.projectId) });
      showNotification('success', 'Member removed successfully!');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};