export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  links?: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  take: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  search?: string;
}
