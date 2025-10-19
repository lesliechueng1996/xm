import {
  FocusStatus,
  FocusType,
  type PaginationResponse,
} from '@repo/common-types';
import { z } from 'zod';

export const createFocusRequestSchema = z.object({
  type: z.enum(FocusType),
  title: z.string().min(1, '名称不能为空').max(16, '名称不能超过16个字符'),
  link: z.url(),
  focusImg: z.string().min(1, '轮播图不能为空'),
  sort: z
    .number()
    .min(0, '排序不能小于0')
    .max(999, '排序不能大于999')
    .optional()
    .default(10),
  status: z.enum(FocusStatus),
});

export type CreateFocusRequest = z.infer<typeof createFocusRequestSchema>;

export type CreateFocusResponse = {
  id: string;
};

export type PaginationFocusesResponse = PaginationResponse<{
  id: string;
  type: FocusType;
  title: string;
  focusImg: string;
  link: string;
  sort: number;
  status: FocusStatus;
}>;

export type GetFocusResponse = {
  id: string;
  type: FocusType;
  title: string;
  focusImg: string;
  link: string;
  sort: number;
  status: FocusStatus;
};

export const editFocusRequestSchema = z.object({
  type: z.enum(FocusType),
  title: z.string().min(1, '名称不能为空').max(16, '名称不能超过16个字符'),
  link: z.url(),
  focusImg: z.string().optional(),
  sort: z
    .number()
    .min(0, '排序不能小于0')
    .max(999, '排序不能大于999')
    .optional()
    .default(10),
  status: z.enum(FocusStatus),
});

export type EditFocusRequest = z.infer<typeof editFocusRequestSchema>;

export type EditFocusResponse = {
  id: string;
};

export const changeFocusStatusRequestSchema = z.object({
  status: z.enum(FocusStatus),
});

export type ChangeFocusStatusRequest = z.infer<
  typeof changeFocusStatusRequestSchema
>;

export type ChangeFocusStatusResponse = {
  id: string;
  status: FocusStatus;
};
