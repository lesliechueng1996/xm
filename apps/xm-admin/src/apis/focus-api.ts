import type {
  CreateFocusRequest,
  CreateFocusResponse,
  PaginationFocusesResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { get, post } from './http';

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
