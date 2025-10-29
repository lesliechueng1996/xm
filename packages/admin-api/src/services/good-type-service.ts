import type {
  CreateGoodTypeRequest,
  EditGoodTypeRequest,
} from '@repo/admin-api-types';
import type { GoodTypeStatus, PaginationRequest } from '@repo/common-types';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';
import { HTTPException } from 'hono/http-exception';

export const createGoodType = async (request: CreateGoodTypeRequest) => {
  return prisma.goodType.create({
    data: request,
  });
};

export const paginationGoodTypes = async (query: PaginationRequest) => {
  const orderBy = query.orderBy || 'createdAt';
  const orderDirection = query.orderDirection ?? 'descending';
  const orderDirectionValue = orderDirection === 'ascending' ? 'asc' : 'desc';

  const goodTypes = await prisma.goodType.findMany({
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      [orderBy]: orderDirectionValue,
    },
  });

  const total = await prisma.goodType.count();

  return buildPaginationResponse(
    goodTypes.map((goodType) => ({
      id: goodType.id,
      title: goodType.title,
      status: goodType.status,
      description: goodType.description ?? '',
      createdAt: goodType.createdAt.getTime(),
    })),
    total,
    query,
    orderBy,
    orderDirection,
  );
};

export const getGoodType = async (id: string) => {
  const goodType = await prisma.goodType.findUnique({
    where: { id },
  });
  if (!goodType) {
    throw new HTTPException(404, {
      message: '商品类型不存在',
    });
  }
  return goodType;
};

export const editGoodType = async (
  id: string,
  request: EditGoodTypeRequest,
) => {
  await getGoodType(id);
  return prisma.goodType.update({
    where: { id },
    data: request,
  });
};

export const deleteGoodType = async (id: string) => {
  return prisma.goodType.delete({
    where: { id },
  });
};

export const changeGoodTypeStatus = async (
  id: string,
  status: GoodTypeStatus,
) => {
  await getGoodType(id);
  return prisma.goodType.update({
    where: { id },
    data: { status },
  });
};
