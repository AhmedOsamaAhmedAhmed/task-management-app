/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tasks hooks using React Query
 */

import {
  AssignTaskDto,
  CreateTaskDto,
  TaskFilters,
  UpdateTaskDto,
} from '../types/task.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '../utils/errorHandler';
import { tasksApi } from '../api/tasks.api';
import { useUIStore } from '../store/uiStore';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (projectId: string, filters: any) =>
    [...taskKeys.lists(), projectId, filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Get tasks for a project with filters
export const useTasks = (projectId: string, filters?: TaskFilters) => {
  return useQuery({
    queryKey: taskKeys.list(projectId, filters),
    queryFn: () => tasksApi.getTasks(projectId, filters),
    select: (response) => response.data,
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
};

// Get a single task
export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getTask(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

// ✅ Create task mutation with proper data cleaning
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) => {
      // ✅ تنظيف البيانات - إزالة null و empty strings
      const cleanData: CreateTaskDto = {
        title: data.title,
        description: data.description || undefined,
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || undefined,
        assigneeId: data.assigneeId || undefined,
      };
      return tasksApi.createTask(projectId, cleanData);
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.list(variables.projectId, undefined),
      });
      showNotification('success', 'Task created successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// ✅ Update task mutation with proper data cleaning
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // ✅ تنظيف البيانات - إزالة null و empty strings
      const cleanData: UpdateTaskDto = {
        title: data.title || undefined,
        description: data.description || undefined,
        status: data.status || undefined,
        priority: data.priority || undefined,
        dueDate: data.dueDate || undefined,
        assigneeId: data.assigneeId || undefined,
      };
      return tasksApi.updateTask(id, cleanData);
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showNotification('success', 'Task updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showNotification('success', 'Task deleted successfully!');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Assign task mutation
export const useAssignTask = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // ✅ تنظيف البيانات
      const cleanData: AssignTaskDto = {
        assigneeId: data.assigneeId || undefined,
      };
      return tasksApi.assignTask(id, cleanData);
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskKeys.detail(variables.id), response);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showNotification('success', 'Task assigned successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};