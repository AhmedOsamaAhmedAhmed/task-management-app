/**
 * Users API calls
 */

import { PaginatedResponse, UpdateUserDto, User, UserFilters } from '../types';

import { api } from './axios.config';

export const usersApi = {
  /**
   * Get all users (Admin only)
   */
  getUsers: (params?: UserFilters) => {
    return api.get<PaginatedResponse<User>>('/users', { params });
  },

  /**
   * Get a user by ID
   */
  getUser: (id: string) => {
    return api.get<User>(`/users/${id}`);
  },

  /**
   * Update a user
   */
  updateUser: (id: string, data: UpdateUserDto) => {
    return api.patch<User>(`/users/${id}`, data);
  },

  /**
   * Change user role (Admin only)
   */
  changeUserRole: (id: string, role: string) => {
    return api.patch<User>(`/users/${id}/role`, { role });
  },

  /**
   * Toggle user status (Admin only)
   */
  toggleUserStatus: (id: string) => {
    return api.patch<User>(`/users/${id}/toggle-status`);
  },
};