import type {
  ChangeGoodTypeAttrStatusRequest,
  CreateGoodTypeAttrRequest,
  CreateGoodTypeAttrResponse,
  PaginationGoodTypeAttrsRequest,
  PaginationGoodTypeAttrsResponse,
} from '@repo/admin-api-types';
import type { GoodTypeAttrStatus } from '@repo/common-types';
import qs from 'qs';
import { del, get, patch, post } from './http';

export const paginationGoodTypeAttrs = async (
  req: PaginationGoodTypeAttrsRequest,
) => {
  const query = qs.stringify(req);
  const response = await get<PaginationGoodTypeAttrsResponse>(
    `/admin/good-type-attr?${query}`,
  );
  return response;
};

export const createGoodTypeAttr = async (body: CreateGoodTypeAttrRequest) => {
  const response = await post<CreateGoodTypeAttrResponse>(
    '/admin/good-type-attr',
    { body },
  );
  return response;
};

export const deleteGoodTypeAttr = async (id: string) => {
  const response = await del<void>(`/admin/good-type-attr/${id}`);
  return response;
};

export const changeGoodTypeAttrStatus = async ({
  id,
  status,
}: {
  id: string;
  status: GoodTypeAttrStatus;
}) => {
  const response = await patch<void>(`/admin/good-type-attr/${id}/status`, {
    body: { status } satisfies ChangeGoodTypeAttrStatusRequest,
  });
  return response;
};
