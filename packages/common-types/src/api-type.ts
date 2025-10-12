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
  orderDirection: z.enum(['ascending', 'descending']).optional(),
});

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;

export type PaginationResponse<T> = {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  orderBy: string;
  orderDirection: 'ascending' | 'descending';
};

export type ApiError = {
  message: string;
};

export type SelectOption = {
  label: string;
  key: string;
};
