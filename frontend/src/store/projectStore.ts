/**
 * Project store for managing project state
 * Note: Most project data is managed by React Query
 * This store is for UI state and selected project
 */

import { Project } from '../types/project.types';
import { create } from 'zustand';

interface ProjectState {
  // State
  selectedProjectId: string | null;
  selectedProject: Project | null;
  isCreating: boolean;
  isEditing: boolean;
  filters: {
    status?: string;
    search?: string;
    page: number;
    limit: number;
  };
}

interface ProjectStore extends ProjectState {
  // Actions
  setSelectedProject: (project: Project | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  setFilters: (filters: Partial<ProjectState['filters']>) => void;
  resetFilters: () => void;
  clearSelectedProject: () => void;
}

const initialFilters = {
  page: 1,
  limit: 10,
};

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initial state
  selectedProjectId: null,
  selectedProject: null,
  isCreating: false,
  isEditing: false,
  filters: initialFilters,

  // Actions
  setSelectedProject: (project: Project | null) => {
    set({ selectedProject: project });
    if (project) {
      set({ selectedProjectId: project.id });
    }
  },

  setSelectedProjectId: (id: string | null) => {
    set({ selectedProjectId: id });
  },

  setIsCreating: (isCreating: boolean) => {
    set({ isCreating });
  },

  setIsEditing: (isEditing: boolean) => {
    set({ isEditing });
  },

  setFilters: (filters: Partial<ProjectState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  clearSelectedProject: () => {
    set({ selectedProject: null, selectedProjectId: null });
  },
}));

// Selectors
export const useSelectedProject = () => useProjectStore((state) => state.selectedProject);
export const useSelectedProjectId = () => useProjectStore((state) => state.selectedProjectId);
export const useProjectFilters = () => useProjectStore((state) => state.filters);
export const useIsCreatingProject = () => useProjectStore((state) => state.isCreating);
export const useIsEditingProject = () => useProjectStore((state) => state.isEditing);