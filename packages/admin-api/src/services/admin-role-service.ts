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
  const orderBy = query.orderBy || 'createdAt';
  const orderDirection = query.orderDirection ?? 'descending';
  const orderDirectionValue = orderDirection === 'ascending' ? 'asc' : 'desc';

  const roles = await prisma.adminRole.findMany({
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: {
      [orderBy]: orderDirectionValue,
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
    orderBy,
    orderDirection,
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

export const deleteRole = async (id: string) => {
  const users = await prisma.adminUser.findMany({
    where: { roleId: id },
  });
  if (users.length > 0) {
    throw new HTTPException(400, {
      message: '角色下有管理员，不能删除',
    });
  }

  const deleteRole = prisma.adminRole.delete({
    where: { id },
  });
  const deleteRoleAccess = prisma.rolesOnAccesses.deleteMany({
    where: { roleId: id },
  });
  return prisma.$transaction([deleteRole, deleteRoleAccess]);
};

export const allRoles = async () => {
  return prisma.adminRole.findMany();
};

export const getRoleAccess = async (roleId: string) => {
  const roleAccess = await prisma.rolesOnAccesses.findMany({
    select: {
      accessId: true,
    },
    where: {
      roleId,
    },
  });
  return roleAccess.map((item) => item.accessId);
};

export const saveRoleAccess = async (roleId: string, accessIds: string[]) => {
  const deleteRoleAccess = prisma.rolesOnAccesses.deleteMany({
    where: { roleId },
  });
  const createRoleAccess = prisma.rolesOnAccesses.createMany({
    data: accessIds.map((accessId) => ({ roleId, accessId })),
  });
  return prisma.$transaction([deleteRoleAccess, createRoleAccess]);
};
