import type {
  CreateAccessRequest,
  CreateAccessResponse,
  EditAccessRequest,
  EditAccessResponse,
  GetAccessResponse,
  GetAccessTreeResponse,
  GetAllAccessesResponse,
} from '@repo/admin-api-types';
import { AdminAccessType, type SelectOption } from '@repo/common-types';
import { del, get, post, put } from './http';

export const createAccess = async (data: CreateAccessRequest) => {
  return post<CreateAccessResponse>('/admin/access', {
    body: data,
  });
};

export const getAccessOptions = async (type: AdminAccessType) => {
  if (type === AdminAccessType.MENU) {
    return get<SelectOption[]>(
      `/admin/access/options?type=${AdminAccessType.MODULE}`,
    );
  }
  if (type === AdminAccessType.OPERATION) {
    return get<SelectOption[]>(
      `/admin/access/options?type=${AdminAccessType.MENU}`,
    );
  }
  return [];
};

export const getAllAccesses = async () => {
  return get<GetAllAccessesResponse>('/admin/access');
};

export const getAccess = async (id: string) => {
  return get<GetAccessResponse>(`/admin/access/${id}`);
};

export const editAccess = async (id: string, data: EditAccessRequest) => {
  return put<EditAccessResponse>(`/admin/access/${id}`, {
    body: data,
  });
};

export const deleteAccess = async (id: string) => {
  return del(`/admin/access/${id}`);
};

type ModuleAccess = {
  id: string;
  label: string;
  children: Array<{
    id: string;
    label: string;
  }>;
};

export const getAccessTree = async () => {
  const accessTree = await get<GetAccessTreeResponse>(`/admin/access/tree`);
  const result: ModuleAccess[] = [];
  for (const module of accessTree) {
    const accessList: ModuleAccess['children'] = [];
    for (const menu of module.children) {
      accessList.push({
        id: menu.id,
        label: menu.accessName,
      });
      for (const operation of menu.children) {
        accessList.push({
          id: operation.id,
          label: operation.accessName,
        });
      }
    }
    result.push({
      id: module.id,
      label: module.accessName,
      children: accessList,
    });
  }

  return result;
};
