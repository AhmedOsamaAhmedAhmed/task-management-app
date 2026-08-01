 
/**
 * Task store for managing task state
 * Note: Most task data is managed by React Query
 * This store is for UI state and filters
 */

import { TaskFilters } from '../types/task.types';
import { create } from 'zustand';

interface TaskState {
  // State
  selectedTaskId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  filters: TaskFilters & {
    page: number;
    limit: number;
  };
  // View mode: 'board' or 'list'
  viewMode: 'board' | 'list';
}

interface TaskStore extends TaskState {
  // Actions
  setSelectedTaskId: (id: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'board' | 'list') => void;
  toggleViewMode: () => void;
  clearSelectedTask: () => void;
}

const initialFilters = {
  page: 1,
  limit: 10,
};

export const useTaskStore = create<TaskStore>((set) => ({
  // Initial state
  selectedTaskId: null,
  isCreating: false,
  isEditing: false,
  filters: initialFilters,
  viewMode: 'board',

  // Actions
  setSelectedTaskId: (id: string | null) => {
    set({ selectedTaskId: id });
  },

  setIsCreating: (isCreating: boolean) => {
    set({ isCreating });
  },

  setIsEditing: (isEditing: boolean) => {
    set({ isEditing });
  },

  setFilters: (filters: Partial<TaskState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setViewMode: (mode: 'board' | 'list') => {
    set({ viewMode: mode });
  },

  toggleViewMode: () => {
    set((state) => ({
      viewMode: state.viewMode === 'board' ? 'list' : 'board',
    }));
  },

  clearSelectedTask: () => {
    set({ selectedTaskId: null });
  },
}));

// Selectors
export const useSelectedTaskId = () => useTaskStore((state) => state.selectedTaskId);
export const useTaskFilters = () => useTaskStore((state) => state.filters);
export const useIsCreatingTask = () => useTaskStore((state) => state.isCreating);
export const useIsEditingTask = () => useTaskStore((state) => state.isEditing);
export const useTaskViewMode = () => useTaskStore((state) => state.viewMode);