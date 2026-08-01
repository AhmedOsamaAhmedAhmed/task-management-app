/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Users hooks using React Query
 */

import { UpdateUserDto, UserFilters } from '../types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { handleApiError } from '../utils/errorHandler';
import { useUIStore } from '../store/uiStore';
import { usersApi } from '../api/users.api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

// Get all users (Admin only)
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersApi.getUsers(filters),
    select: (response) => response.data,
    staleTime: 60 * 1000,
    // Only fetch if user is admin (handled by component)
  });
};

// Get a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUser(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersApi.updateUser(id, data),
    onSuccess: (response, variables) => {
      // Update user cache
      queryClient.setQueryData(userKeys.detail(variables.id), response);
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Also invalidate profile if it's the current user
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      showNotification('success', 'User updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Change user role mutation (Admin only)
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.changeUserRole(id, role),
    onSuccess: (response, variables) => {
      // Update user cache
      queryClient.setQueryData(userKeys.detail(variables.id), response);
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showNotification('success', 'User role updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};

// Toggle user status mutation (Admin only)
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => usersApi.toggleUserStatus(id),
    onSuccess: (response, id) => {
      // Update user cache
      queryClient.setQueryData(userKeys.detail(id), response);
      // Invalidate user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      const isActive = response.data.isActive;
      showNotification(
        'success',
        `User ${isActive ? 'activated' : 'deactivated'} successfully!`
      );
      return response.data;
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      throw error;
    },
  });
};