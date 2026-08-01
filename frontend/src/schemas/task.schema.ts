/**
 * Task Zod schemas
 */

import { z } from 'zod';

const taskStatusEnum = z.enum(['todo', 'in_progress', 'done']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical']);

// Create task schema
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(255, 'Task title must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  dueDate: z
    .string()
    .or(z.date())
    .nullable()
    .optional()
    .transform((val) => val || undefined) // ✅ تحويل null إلى undefined
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      {
        message: 'Due date must be today or in the future',
      }
    ),
  assigneeId: z
    .string()
    .uuid('Please select a valid user')
    .nullable()
    .optional()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

// Update task schema
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Task title must be at least 3 characters')
    .max(255, 'Task title must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z
    .string()
    .or(z.date())
    .nullable()
    .optional()
    .transform((val) => val || undefined) // ✅ تحويل null إلى undefined
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'Please enter a valid date',
      }
    ),
  assigneeId: z
    .string()
    .uuid('Please select a valid user')
    .nullable()
    .optional()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

// Task filters schema
export const taskFiltersSchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  assigneeId: z
    .string()
    .uuid('Please select a valid user')
    .optional()
    .nullable()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().min(1).max(100).default(10),
});

export type TaskFiltersFormData = z.infer<typeof taskFiltersSchema>;

// Assign task schema
export const assignTaskSchema = z.object({
  assigneeId: z
    .string()
    .uuid('Please select a valid user')
    .nullable()
    .optional()
    .transform((val) => val || undefined), // ✅ تحويل null إلى undefined
});

export type AssignTaskFormData = z.infer<typeof assignTaskSchema>;