import { z } from 'zod';

export const defaultPageSize = 10;

export const paginationRequestSchema = z.object({
  page: z
    .string()
    .min(1)
    .max(1000)
    .transform((val) => parseInt(val, 10)),
  pageSize: z
    .string()
    .min(1)
    .max(100)
    .transform((val) => parseInt(val, 10)),
  orderBy: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
});

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;

export type PaginationResponse<T> = {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiError = {
  message: string;
};
