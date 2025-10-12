import type {
  CreateRoleRequest,
  CreateRoleResponse,
  PaginationRolesResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { get, post } from './http';

export const createRole = async (name: string, description?: string) => {
  const response = await post('/admin/roles', {
    body: {
      name,
      description,
    } as CreateRoleRequest,
  });
  return response as CreateRoleResponse;
};

export const paginationRoles = async (req: PaginationRequest) => {
  const query = qs.stringify(req);
  const response = await get(`/admin/roles?${query}`);
  return response as PaginationRolesResponse;
};
