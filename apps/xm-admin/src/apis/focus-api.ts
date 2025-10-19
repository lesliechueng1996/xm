import type {
  CreateFocusRequest,
  CreateFocusResponse,
  EditFocusRequest,
  EditFocusResponse,
  GetFocusResponse,
  PaginationFocusesResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { del, get, post, put } from './http';

export const createFocus = async (request: CreateFocusRequest) => {
  return post<CreateFocusResponse>('/admin/focus', {
    body: request,
  });
};

export const paginationFocuses = async (query: PaginationRequest) => {
  const queryString = qs.stringify(query);
  const response = await get<PaginationFocusesResponse>(
    `/admin/focus?${queryString}`,
  );
  return response;
};

export const getFocus = async (id: string) => {
  return get<GetFocusResponse>(`/admin/focus/${id}`);
};

export const editFocus = async (id: string, request: EditFocusRequest) => {
  return put<EditFocusResponse>(`/admin/focus/${id}`, {
    body: request,
  });
};

export const deleteFocus = async (id: string) => {
  return del<void>(`/admin/focus/${id}`);
};
