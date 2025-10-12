import type { PaginationRequest, PaginationResponse } from '@repo/common-types';

export const buildPaginationResponse = <T>(
  data: T[],
  total: number,
  query: PaginationRequest,
  orderBy: string,
  orderDirection: 'ascending' | 'descending',
): PaginationResponse<T> => {
  return {
    results: data,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(total / query.pageSize),
    orderBy,
    orderDirection,
  };
};
