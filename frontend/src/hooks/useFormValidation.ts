/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Custom hook for form validation with Zod
 */

import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseFormValidationOptions<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
}

export function useFormValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onChange',
}: UseFormValidationOptions<T>): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode,
  });
}

// Helper to get field error
export const getFieldError = (
  errors: Record<string, any>,
  field: string
): string | undefined => {
  const fieldError = errors[field];
  if (fieldError && typeof fieldError === 'object' && 'message' in fieldError) {
    return fieldError.message as string;
  }
  return undefined;
};

// Helper to check if field has error
export const hasFieldError = (
  errors: Record<string, any>,
  field: string
): boolean => {
  return !!getFieldError(errors, field);
};