import type {
  CreateGoodTypeAttrRequest,
  PaginationGoodTypeAttrsRequest,
  PaginationGoodTypeAttrsResponse,
} from '@repo/admin-api-types';
import { type GoodTypeAttrStatus, GoodTypeAttrType } from '@repo/common-types';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';

export const paginationGoodTypeAttrs = async (
  query: PaginationGoodTypeAttrsRequest,
) => {
  const orderBy = query.orderBy || 'createdAt';
  const orderDirection = query.orderDirection ?? 'descending';
  const orderDirectionValue = orderDirection === 'ascending' ? 'asc' : 'desc';

  const attrs = await prisma.goodTypeAttribute.findMany({
    include: {
      goodType: true,
    },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      [orderBy]: orderDirectionValue,
    },
    where: {
      typeId: query.goodTypeId,
    },
  });

  const total = await prisma.goodTypeAttribute.count();

  return buildPaginationResponse(
    attrs.map((attr) => ({
      id: attr.id,
      title: attr.title,
      status: attr.status as GoodTypeAttrStatus,
      goodTypeId: attr.typeId,
      goodTypeTitle: attr.goodType.title,
      attrType: attr.attrType as GoodTypeAttrType,
      attrValue: attr.attrValue,
      createdAt: attr.createdAt.getTime(),
    })),
    total,
    query,
    orderBy,
    orderDirection,
  ) as PaginationGoodTypeAttrsResponse;
};

export const createGoodTypeAttr = async (data: CreateGoodTypeAttrRequest) => {
  const attrValue =
    data.attrType === GoodTypeAttrType.SELECT
      ? JSON.stringify(data.attrValue?.split('\n').map((item) => item.trim()))
      : '';

  return await prisma.goodTypeAttribute.create({
    data: {
      title: data.title,
      attrType: data.attrType,
      status: data.status,
      attrValue,
      goodType: {
        connect: {
          id: data.goodTypeId,
        },
      },
    },
  });
};

export const deleteGoodTypeAttr = async (id: string) => {
  return await prisma.goodTypeAttribute.delete({
    where: {
      id,
    },
  });
};

export const changeGoodTypeAttrStatus = async (
  id: string,
  status: GoodTypeAttrStatus,
) => {
  return await prisma.goodTypeAttribute.update({
    where: {
      id,
    },
    data: { status },
  });
};
