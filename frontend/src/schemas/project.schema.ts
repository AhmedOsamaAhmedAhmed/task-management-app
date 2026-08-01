/**
 * Project Zod schemas
 */

import { z } from 'zod';

const projectStatusEnum = z.enum(['active', 'archived']);
const memberRoleEnum = z.enum(['admin', 'member']);

// Create project schema
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(255, 'Project name must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

// Update project schema
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(255, 'Project name must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  status: projectStatusEnum.optional(),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

// Add member schema
export const addMemberSchema = z.object({
  userId: z
    .string()
    .uuid('Please select a valid user'),
  role: memberRoleEnum.default('member'),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;

// Project filters schema
export const projectFiltersSchema = z.object({
  status: projectStatusEnum.optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().min(1).max(100).default(10),
});

export type ProjectFiltersFormData = z.infer<typeof projectFiltersSchema>;