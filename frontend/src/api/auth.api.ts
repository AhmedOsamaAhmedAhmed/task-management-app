/**
 * Authentication API calls
 */

import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from '../types';

import { api } from './axios.config';

export const authApi = {
  /**
   * Register a new user
   */
  register: (data: RegisterDto) => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Login user
   */
  login: (data: LoginDto) => {
    return api.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Get current user profile
   */
  getProfile: () => {
    return api.get<User>('/auth/profile');
  },

  /**
   * Logout user
   */
  logout: () => {
    return api.post('/auth/logout');
  },

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string) => {
    return api.post<{ accessToken: string }>('/auth/refresh-token', {
      refreshToken,
    });
  },
};