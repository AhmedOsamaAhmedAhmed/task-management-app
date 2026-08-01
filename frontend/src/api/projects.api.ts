/**
 * Projects API calls
 */

import {
  AddMemberDto,
  CreateProjectDto,
  PaginatedResponse,
  Project,
  ProjectMember,
  UpdateProjectDto,
} from '../types';

import { api } from './axios.config';

export const projectsApi = {
  /**
   * Get all projects with pagination and filters
   */
  getProjects: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    return api.get<PaginatedResponse<Project>>('/projects', { params });
  },

  /**
   * Get a single project by ID
   */
  getProject: (id: string) => {
    return api.get<Project>(`/projects/${id}`);
  },

  /**
   * Create a new project
   */
  createProject: (data: CreateProjectDto) => {
    return api.post<Project>('/projects', data);
  },

  /**
   * Update a project
   */
  updateProject: (id: string, data: UpdateProjectDto) => {
    return api.patch<Project>(`/projects/${id}`, data);
  },

  /**
   * Delete a project
   */
  deleteProject: (id: string) => {
    return api.delete(`/projects/${id}`);
  },

  /**
   * Get project members
   */
  getProjectMembers: (projectId: string) => {
    return api.get<ProjectMember[]>(`/projects/${projectId}/members`);
  },

  /**
   * Add a member to a project
   */
  addProjectMember: (projectId: string, data: AddMemberDto) => {
    return api.post<ProjectMember>(`/projects/${projectId}/members`, data);
  },

  /**
   * Remove a member from a project
   */
  removeProjectMember: (projectId: string, userId: string) => {
    return api.delete(`/projects/${projectId}/members/${userId}`);
  },

  /**
   * Update a member's role
   */
  updateMemberRole: (projectId: string, memberId: string, role: string) => {
    return api.patch<ProjectMember>(`/projects/${projectId}/members/${memberId}`, {
      role,
    });
  },
};