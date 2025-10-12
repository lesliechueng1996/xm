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
