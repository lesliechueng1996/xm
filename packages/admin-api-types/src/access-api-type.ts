import { AdminAccessType } from '@repo/common-types';
import z from 'zod';

export const createAccessRequestSchema = z.object({
  accessName: z
    .string()
    .min(1, '权限名称不能为空')
    .max(16, '权限名称不能超过16个字符'),
  type: z.enum(AdminAccessType, {
    message: '权限类型不能为空',
  }),
  url: z.string().optional(),
  parentId: z.string().optional(),
  sort: z
    .int()
    .min(0, '排序不能小于0')
    .max(999, '排序不能大于999')
    .optional()
    .default(100),
  description: z.string().optional(),
});

export type CreateAccessRequest = z.infer<typeof createAccessRequestSchema>;

export type CreateAccessResponse = {
  id: string;
};

export const getAccessOptionsRequestSchema = z.object({
  type: z.string().transform((val) => parseInt(val, 10)),
});

export type GetAccessOptionsRequest = z.infer<
  typeof getAccessOptionsRequestSchema
>;

export type GetAllAccessesResponse = {
  id: string;
  moduleName: string;
  menuName: string;
  operationName: string;
  type: AdminAccessType;
  url: string | null;
  parentId: string | null;
  sort: number;
  description: string;
  status: number;
  createdAt: number;
}[];
