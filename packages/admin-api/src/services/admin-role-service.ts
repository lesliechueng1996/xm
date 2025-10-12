import type { PaginationRequest } from '@repo/common-types';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';
import { HTTPException } from 'hono/http-exception';

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
      status: role.status,
      description: role.description,
      createdAt: role.createdAt.getTime(),
    })),
    total,
    query,
  );
};

export const getRole = async (id: string) => {
  const role = await prisma.adminRole.findUnique({
    where: { id },
  });
  if (!role) {
    throw new HTTPException(404, {
      message: '角色不存在',
    });
  }
  return role;
};

export const editRole = async (
  id: string,
  name: string,
  description?: string,
) => {
  return prisma.adminRole.update({
    where: { id },
    data: { name, description },
  });
};
