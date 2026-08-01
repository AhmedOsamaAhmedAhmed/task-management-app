/**
 * TanStack Query configuration
 */

import {
  DefaultOptions,
  QueryClient,
  QueryClientConfig,
} from '@tanstack/react-query';

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: 1000,
  },
  mutations: {
    retry: 0,
  },
};

export const createQueryClient = (options?: QueryClientConfig): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      ...defaultOptions,
      ...options?.defaultOptions,
    },
    ...options,
  });
};

export const queryClient = createQueryClient();