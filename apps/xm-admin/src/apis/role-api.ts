import type {
  CreateRoleRequest,
  CreateRoleResponse,
  EditRoleRequest,
  EditRoleResponse,
  GetRoleAccessResponse,
  GetRoleResponse,
  PaginationRolesResponse,
  SaveRoleAccessRequest,
  SaveRoleAccessResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest, SelectOption } from '@repo/common-types';
import qs from 'qs';
import { del, get, post, put } from './http';

export const createRole = async (
  name: string,
  description?: string,
): Promise<CreateRoleResponse> => {
  const response = await post<CreateRoleResponse>('/admin/roles', {
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
  const response = await get<PaginationRolesResponse>(`/admin/roles?${query}`);
  return response;
};

export const getRole = async (id: string) => {
  const response = await get<GetRoleResponse>(`/admin/roles/${id}`);
  return response as GetRoleResponse;
};

export const editRole = async (
  id: string,
  name: string,
  description?: string,
): Promise<EditRoleResponse> => {
  const response = await put<EditRoleResponse>(`/admin/roles/${id}`, {
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

export const allRoleOptions = async (): Promise<SelectOption[]> => {
  const response = await get<SelectOption[]>('/admin/roles/options');
  return response;
};

export const getRoleAccess = async (
  roleId: string,
): Promise<GetRoleAccessResponse> => {
  const response = await get<GetRoleAccessResponse>(
    `/admin/roles/${roleId}/access`,
  );
  return response;
};

export const saveRoleAccess = async (
  roleId: string,
  accessIds: string[],
): Promise<SaveRoleAccessResponse> => {
  const response = await post<SaveRoleAccessResponse>(
    `/admin/roles/${roleId}/access`,
    { body: { accessIds } as SaveRoleAccessRequest },
  );
  return response;
};
