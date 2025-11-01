import {
  GoodTypeAttrStatus,
  GoodTypeAttrType,
  type PaginationResponse,
  paginationRequestSchema,
} from '@repo/common-types';
import { z } from 'zod';

export const paginationGoodTypeAttrsRequestSchema =
  paginationRequestSchema.extend({
    goodTypeId: z.string().min(1, '商品类型ID不能为空'),
  });

export type PaginationGoodTypeAttrsRequest = z.infer<
  typeof paginationGoodTypeAttrsRequestSchema
>;

export type PaginationGoodTypeAttrsResponse = PaginationResponse<{
  id: string;
  title: string;
  goodTypeId: string;
  goodTypeTitle: string;
  attrType: GoodTypeAttrType;
  attrValue: string;
  status: GoodTypeAttrStatus;
  createdAt: number;
}>;

export const createGoodTypeAttrRequestSchema = z.object({
  goodTypeId: z.string().min(1, '商品类型ID不能为空'),
  title: z.string().min(1, '属性名称不能为空'),
  attrType: z.enum(GoodTypeAttrType),
  attrValue: z.string().optional(),
  status: z.enum(GoodTypeAttrStatus),
});

export type CreateGoodTypeAttrRequest = z.infer<
  typeof createGoodTypeAttrRequestSchema
>;

export type CreateGoodTypeAttrResponse = {
  id: string;
};

export const changeGoodTypeAttrStatusRequestSchema = z.object({
  status: z.enum(GoodTypeAttrStatus),
});

export type ChangeGoodTypeAttrStatusRequest = z.infer<
  typeof changeGoodTypeAttrStatusRequestSchema
>;
