/**
 * User Zod schemas
 */

import { z } from 'zod';

// ✅ تعريف enum خارجياً
const userRoleEnum = z.enum(['admin', 'member']);

// Update user schema
export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be less than 100 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters')
    .optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Change role schema (Admin only)
export const changeRoleSchema = z.object({
  role: userRoleEnum,
});

export type ChangeRoleFormData = z.infer<typeof changeRoleSchema>;

// User filters schema
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: userRoleEnum.optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().min(1).max(100).default(10),
});

export type UserFiltersFormData = z.infer<typeof userFiltersSchema>;