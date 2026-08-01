/**
 * User management related types
 */

import { User, UserRole } from './auth.types';

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangeRoleDto {
  role: UserRole;
}

export type UserResponse = User;

export interface UserFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
}