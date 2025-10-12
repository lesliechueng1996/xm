import type { PaginationRequest } from '@repo/common-types';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';

export const createRole = async (
  name: string,
  description?: string,
  status = 1,
) => {
  return prisma.adminRole.create({
    data: {
      name,
      description,
      status,
    },
  });
};

export const paginationRoles = async (query: PaginationRequest) => {
  const roles = await prisma.adminRole.findMany({
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      [query.orderBy ?? 'createdAt']:
        query.orderDirection === 'asc' ? 'asc' : 'desc',
    },
  });

  const total = await prisma.adminRole.count();

  return buildPaginationResponse(
    roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt.getTime(),
    })),
    total,
    query,
  );
};
