/**
 * Tasks API calls
 */

import {
  AssignTaskDto,
  CreateTaskDto,
  PaginatedResponse,
  Task,
  TaskFilters,
  UpdateTaskDto,
} from '../types';

import { api } from './axios.config';

export const tasksApi = {
  /**
   * Get all tasks for a project with filters
   */
  getTasks: (projectId: string, params?: TaskFilters) => {
    return api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, {
      params,
    });
  },

  /**
   * Get a single task by ID
   */
  getTask: (id: string) => {
    return api.get<Task>(`/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: (projectId: string, data: CreateTaskDto) => {
    return api.post<Task>(`/projects/${projectId}/tasks`, data);
  },

  /**
   * Update a task
   */
  updateTask: (id: string, data: UpdateTaskDto) => {
    return api.patch<Task>(`/tasks/${id}`, data);
  },

  /**
   * Delete a task
   */
  deleteTask: (id: string) => {
    return api.delete(`/tasks/${id}`);
  },

  /**
   * Assign a task to a user
   */
  assignTask: (id: string, data: AssignTaskDto) => {
    return api.post<Task>(`/tasks/${id}/assign`, data);
  },
};