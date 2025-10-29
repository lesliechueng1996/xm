import type { PaginationResponse } from '@repo/common-types';
import { GoodTypeStatus } from '@repo/common-types';
import { z } from 'zod';

export const createGoodTypeRequestSchema = z.object({
  title: z.string().min(1, '名称不能为空').max(32, '名称不能超过32个字符'),
  description: z.string().optional(),
  status: z.enum(GoodTypeStatus),
});

export type CreateGoodTypeRequest = z.infer<typeof createGoodTypeRequestSchema>;

export type CreateGoodTypeResponse = {
  id: string;
};

export type PaginationGoodTypesResponse = PaginationResponse<{
  id: string;
  title: string;
  status: number;
  description: string;
  createdAt: number;
}>;

export type GetGoodTypeResponse = {
  id: string;
  title: string;
  status: number;
  description: string;
  createdAt: number;
};

export const editGoodTypeRequestSchema = z.object({
  title: z.string().min(1, '名称不能为空').max(32, '名称不能超过32个字符'),
  description: z.string().optional(),
  status: z.enum(GoodTypeStatus),
});

export type EditGoodTypeRequest = z.infer<typeof editGoodTypeRequestSchema>;

export type EditGoodTypeResponse = {
  id: string;
};

export const changeGoodTypeStatusRequestSchema = z.object({
  status: z.enum(GoodTypeStatus),
});

export type ChangeGoodTypeStatusRequest = z.infer<
  typeof changeGoodTypeStatusRequestSchema
>;
