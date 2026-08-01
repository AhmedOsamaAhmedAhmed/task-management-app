/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validation utility functions
 */

import { z } from 'zod';

// Re-export Zod schemas for convenience
export * from '../schemas';

// Custom validation helpers
export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  const passwordSchema = z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/);
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
};

export const validateUUID = (id: string): boolean => {
  const uuidSchema = z.string().uuid();
  try {
    uuidSchema.parse(id);
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (date: string | Date): boolean => {
  const dateSchema = z.date().or(z.string().datetime());
  try {
    dateSchema.parse(date);
    return true;
  } catch {
    return false;
  }
};

export const validateEnum = <T extends z.ZodEnum<any>>(
  value: string,
  enumSchema: T
): boolean => {
  try {
    enumSchema.parse(value);
    return true;
  } catch {
    return false;
  }
};

// Validation error formatter
export const formatZodError = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.errors.forEach((err: { path: any[]; message: string; }) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
};

export const getZodErrorMessage = (error: z.ZodError, field: string): string => {
  const errorMap = formatZodError(error);
  return errorMap[field] || '';
};