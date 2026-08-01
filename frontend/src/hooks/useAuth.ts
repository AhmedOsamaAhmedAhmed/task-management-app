/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Authentication hooks using React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { LoginDto, RegisterDto } from '../types/auth.types';
import { handleApiError } from '../utils/errorHandler';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, logout, setUser, setLoading } = useAuthStore();
  const { showNotification } = useUIStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      login(user, accessToken);
      showNotification('success', 'Welcome back!');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      setLoading(false);
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      login(user, accessToken);
      showNotification('success', 'Registration successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = handleApiError(error);
      showNotification('error', message);
      setLoading(false);
      throw error;
    },
  });

  // Get profile query
  const profileQuery = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: false,
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      showNotification('info', 'Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate('/login');
    },
  });

  // Fetch profile on mount if authenticated
  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      logout();
      navigate('/login');
      throw error;
    }
  };

  return {
    // Mutations
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,

    // Queries
    profile: profileQuery,
    fetchProfile,

    // Status
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};