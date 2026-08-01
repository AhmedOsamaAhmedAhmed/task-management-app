// src/common/helpers/pagination.helper.ts

import { PaginatedResponse } from '../interfaces/pagination.interface';

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  baseUrl: string,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  const buildLink = (pageNum: number) => {
    return `${baseUrl}?page=${pageNum}&limit=${limit}`;
  };

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
    links: {
      first: buildLink(1),
      previous: page > 1 ? buildLink(page - 1) : '',
      next: page < totalPages ? buildLink(page + 1) : '',
      last: buildLink(totalPages),
    },
  };
}
