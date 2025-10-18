import type { CreateFocusRequest } from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';

export const createFocus = async (request: CreateFocusRequest) => {
  return prisma.focus.create({
    data: {
      title: request.title,
      type: request.type,
      focusImg: request.focusImg,
      link: request.link,
      sort: request.sort,
      status: request.status,
    },
  });
};

export const paginationFocuses = async (query: PaginationRequest) => {
  const orderBy = query.orderBy || 'createdAt';
  const orderDirection = query.orderDirection ?? 'descending';
  const orderDirectionValue = orderDirection === 'ascending' ? 'asc' : 'desc';

  const focuses = await prisma.focus.findMany({
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      [orderBy]: orderDirectionValue,
    },
  });

  const total = await prisma.focus.count();
  const staticServer =
    process.env.STATIC_SERVER || 'http://localhost:3000/static';

  return buildPaginationResponse(
    focuses.map((focus) => ({
      id: focus.id,
      title: focus.title,
      type: focus.type,
      focusImg: `${staticServer}${focus.focusImg}`,
      link: focus.link,
      sort: focus.sort,
      status: focus.status,
    })),
    total,
    query,
    orderBy,
    orderDirection,
  );
};
