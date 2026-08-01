/**
 * Project related types
 */

import { User } from './auth.types';

export type ProjectStatus = 'active' | 'archived';
export type ProjectMemberRole = 'admin' | 'member';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isOwner?: boolean;
  isMember?: boolean;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  joinedAt: string;
  user?: User;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface AddMemberDto {
  userId: string;
  role: ProjectMemberRole;
}

export interface RemoveMemberDto {
  userId: string;
}

export interface UpdateMemberRoleDto {
  role: ProjectMemberRole;
}

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export const PROJECT_MEMBER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;