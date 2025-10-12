import type {
  CreateRoleRequest,
  CreateRoleResponse,
  EditRoleRequest,
  EditRoleResponse,
  GetRoleResponse,
  PaginationRolesResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { get, post, put } from './http';

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

export const getRole = async (id: string) => {
  const response = await get(`/admin/roles/${id}`);
  return response as GetRoleResponse;
};

export const editRole = async (
  id: string,
  name: string,
  description?: string,
) => {
  const response = await put(`/admin/roles/${id}`, {
    body: {
      name,
      description,
    } as EditRoleRequest,
  });
  return response as EditRoleResponse;
};
