import type { PaginationResponse } from '@repo/common-types';
import z from 'zod';

export const createRoleRequestSchema = z.object({
  name: z
    .string('角色名称应该是非空字符串')
    .min(1, '角色名称不能为空')
    .max(16, '角色名称不能超过16个字符'),
  description: z.string('角色描述应该是非空字符串').optional(),
});

export type CreateRoleRequest = z.infer<typeof createRoleRequestSchema>;

export type CreateRoleResponse = {
  id: string;
};

export type PaginationRolesResponse = PaginationResponse<{
  id: string;
  name: string;
  status: number;
  description: string;
  createdAt: number;
}>;

export const editRoleRequestSchema = z.object({
  name: z
    .string('角色名称应该是非空字符串')
    .min(1, '角色名称不能为空')
    .max(16, '角色名称不能超过16个字符'),
  description: z.string('角色描述应该是非空字符串').optional(),
});

export type EditRoleRequest = z.infer<typeof editRoleRequestSchema>;

export type EditRoleResponse = {
  id: string;
};

export type GetRoleResponse = {
  id: string;
  name: string;
  status: number;
  description: string;
  createdAt: number;
};

export type GetRoleAccessResponse = {
  roleId: string;
  accessIds: string[];
};

export const saveRoleAccessRequestSchema = z.object({
  accessIds: z.array(z.string()),
});

export type SaveRoleAccessRequest = z.infer<typeof saveRoleAccessRequestSchema>;

export type SaveRoleAccessResponse = {
  roleId: string;
  accessIds: string[];
};
