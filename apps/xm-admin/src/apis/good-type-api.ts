import type {
  CreateGoodTypeRequest,
  CreateGoodTypeResponse,
  EditGoodTypeRequest,
  EditGoodTypeResponse,
  GetGoodTypeResponse,
  PaginationGoodTypesResponse,
} from '@repo/admin-api-types';
import type { GoodTypeStatus, PaginationRequest } from '@repo/common-types';
import qs from 'qs';
import { del, get, patch, post, put } from './http';

export const deleteGoodType = async (id: string) => {
  return del<void>(`/admin/good-type/${id}`);
};

export const paginationGoodTypes = async (req: PaginationRequest) => {
  const query = qs.stringify(req);
  const response = await get<PaginationGoodTypesResponse>(
    `/admin/good-type?${query}`,
  );
  return response;
};

export const createGoodType = async (data: CreateGoodTypeRequest) => {
  return post<CreateGoodTypeResponse>(`/admin/good-type`, { body: data });
};

export const getGoodType = async (id: string) => {
  return get<GetGoodTypeResponse>(`/admin/good-type/${id}`);
};

export const editGoodType = async (id: string, data: EditGoodTypeRequest) => {
  return put<EditGoodTypeResponse>(`/admin/good-type/${id}`, { body: data });
};

export const changeGoodTypeStatus = async ({
  id,
  status,
}: {
  id: string;
  status: GoodTypeStatus;
}) => {
  return patch<void>(`/admin/good-type/${id}/status`, { body: { status } });
};
