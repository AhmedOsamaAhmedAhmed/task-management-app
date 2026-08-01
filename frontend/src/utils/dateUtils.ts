/**
 * Date utility functions
 */

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);

export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  SHORT_DATE: 'MMM DD, YYYY',
  SHORT_DATETIME: 'MMM DD, YYYY HH:mm',
  RELATIVE: 'relative',
  TIME_AGO: 'timeAgo',
  DAY_MONTH_YEAR: 'DD/MM/YYYY',
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

export const formatDate = (
  date: string | Date | null,
  format: DateFormat = 'FULL'
): string => {
  if (!date) return 'N/A';

  const dayjsDate = dayjs(date);
  if (!dayjsDate.isValid()) return 'Invalid date';

  if (format === 'RELATIVE') {
    return dayjsDate.fromNow();
  }

  if (format === 'TIME_AGO') {
    return dayjsDate.fromNow();
  }

  return dayjsDate.format(DATE_FORMATS[format]);
};

export const formatRelativeDate = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isValid() || !endDate.isValid()) {
    return 'Invalid date range';
  }

  return `${startDate.format('MMM DD, YYYY')} - ${endDate.format('MMM DD, YYYY')}`;
};

export const isOverdue = (dueDate: string | Date): boolean => {
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

export const isDueToday = (dueDate: string | Date): boolean => {
  return dayjs(dueDate).isToday();
};

export const getDaysUntilDue = (dueDate: string | Date): number => {
  return dayjs(dueDate).diff(dayjs(), 'day');
};

export const getTaskStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'blue',
    in_progress: 'orange',
    done: 'green',
  };
  return colors[status] || 'default';
};

export const getTaskPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'green',
    medium: 'blue',
    high: 'orange',
    critical: 'red',
  };
  return colors[priority] || 'default';
};

export const getTaskStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };
  return labels[status] || status;
};

export const getTaskPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[priority] || priority;
};