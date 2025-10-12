import type {
  CreateUserRequest,
  CreateUserResponse,
  EditUserRequest,
  EditUserResponse,
  GetUserResponse,
  PaginationUsersResponse,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { del, get, post, put } from './http';

export const createUser = async (
  data: CreateUserRequest,
): Promise<CreateUserResponse> => {
  const response = await post<CreateUserResponse>('/admin/users', {
    body: data,
  });
  return response;
};

export const paginationUsers = async (
  req: PaginationRequest,
): Promise<PaginationUsersResponse> => {
  const query = qs.stringify(req);
  const response = await get<PaginationUsersResponse>(`/admin/users?${query}`);
  return response;
};

export const getUser = async (id: string) => {
  const response = await get<GetUserResponse>(`/admin/users/${id}`);
  return response as GetUserResponse;
};

export const editUser = async (
  id: string,
  data: EditUserRequest,
): Promise<EditUserResponse> => {
  const response = await put<EditUserResponse>(`/admin/users/${id}`, {
    body: data,
  });
  return response;
};

export const deleteUser = async (id: string): Promise<void> => {
  await del(`/admin/users/${id}`);
};
