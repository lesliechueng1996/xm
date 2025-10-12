import type {
  CreateRoleRequest,
  CreateRoleResponse,
} from '@repo/admin-api-types';
import { post } from './http';

export const createRole = async (name: string, description?: string) => {
  const response = await post('/admin/roles', {
    body: {
      name,
      description,
    } as CreateRoleRequest,
  });
  return response as CreateRoleResponse;
};
