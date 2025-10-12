import type { PaginationResponse } from '@repo/common-types';
import z from 'zod';

export const createUserRequestSchema = z.object({
  username: z
    .string('角色名称应该是非空字符串')
    .min(1, '角色名称不能为空')
    .max(16, '角色名称不能超过16个字符'),
  password: z
    .string('密码应该是非空字符串')
    .min(6, '密码不能少于6个字符')
    .max(32, '密码不能超过32个字符'),
  mobile: z
    .string('手机号应该是非空字符串')
    .min(1, '手机号不能为空')
    .max(16, '手机号不能超过16个字符'),
  email: z.email('邮箱格式不正确').max(255, '邮箱不能超过255个字符'),
  roleId: z.string('角色ID应该是非空字符串').min(1, '角色ID不能为空'),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export type CreateUserResponse = {
  id: string;
};

export type PaginationUsersResponse = PaginationResponse<{
  id: string;
  username: string;
  mobile: string;
  email: string;
  roleName: string;
  status: number;
  isSuper: number;
  createdAt: number;
}>;

export type GetUserResponse = {
  id: string;
  username: string;
  mobile: string;
  email: string;
  role: {
    id: string;
    name: string;
    status: number;
  };
  status: number;
  createdAt: number;
};

export const editUserRequestSchema = z.object({
  password: z
    .string('密码应该是字符串')
    .max(32, '密码不能超过32个字符')
    .optional(),
  mobile: z
    .string('手机号应该是非空字符串')
    .min(1, '手机号不能为空')
    .max(16, '手机号不能超过16个字符'),
  email: z.email('邮箱格式不正确').max(255, '邮箱不能超过255个字符'),
  roleId: z.string('角色ID应该是非空字符串').min(1, '角色ID不能为空'),
});

export type EditUserRequest = z.infer<typeof editUserRequestSchema>;

export type EditUserResponse = {
  id: string;
};
