import type {
  CreateAccessRequest,
  CreateAccessResponse,
} from '@repo/admin-api-types';
import { AdminAccessType, type SelectOption } from '@repo/common-types';
import { get, post } from './http';

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
