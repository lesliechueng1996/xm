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
import { del, get, post, put } from './http';

export const createRole = async (
  name: string,
  description?: string,
): Promise<CreateRoleResponse> => {
  const response = await post('/admin/roles', {
    body: {
      name,
      description,
    } as CreateRoleRequest,
  });
  return response;
};

export const paginationRoles = async (
  req: PaginationRequest,
): Promise<PaginationRolesResponse> => {
  const query = qs.stringify(req);
  const response = await get(`/admin/roles?${query}`);
  return response;
};

export const getRole = async (id: string) => {
  const response = await get(`/admin/roles/${id}`);
  return response as GetRoleResponse;
};

export const editRole = async (
  id: string,
  name: string,
  description?: string,
): Promise<EditRoleResponse> => {
  const response = await put(`/admin/roles/${id}`, {
    body: {
      name,
      description,
    } as EditRoleRequest,
  });
  return response;
};

export const deleteRole = async (id: string): Promise<void> => {
  await del(`/admin/roles/${id}`);
};
