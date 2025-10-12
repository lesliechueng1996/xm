import type { PaginationRequest } from '@repo/common-types';
import type { AdminUser } from '@repo/database';
import { prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';
import { HTTPException } from 'hono/http-exception';
import { encryptPassword } from '../utils/password-util.js';

export const findAdminUserByUsername = async (username: string) => {
  return prisma.adminUser.findUnique({
    where: {
      username,
    },
  });
};

export const createUser = async (
  username: string,
  password: string,
  mobile: string,
  email: string,
  roleId: string,
) => {
  const user = await prisma.adminUser.findUnique({
    where: {
      username,
    },
  });
  if (user) {
    throw new HTTPException(400, {
      message: '管理员已存在',
    });
  }

  const encryptedPassword = encryptPassword(password, username);

  return prisma.adminUser.create({
    data: {
      username,
      password: encryptedPassword,
      mobile,
      email,
      roleId,
      status: 1,
    },
  });
};

export const paginationUsers = async (query: PaginationRequest) => {
  const orderBy = query.orderBy || 'createdAt';
  const orderDirection = query.orderDirection ?? 'descending';
  const orderDirectionValue = orderDirection === 'ascending' ? 'asc' : 'desc';

  let orderByCondition = {};
  if (orderBy === 'roleName') {
    orderByCondition = {
      role: {
        name: orderDirectionValue,
      },
    };
  } else {
    orderByCondition = {
      [orderBy]: orderDirectionValue,
    };
  }

  const users = await prisma.adminUser.findMany({
    include: {
      role: true,
    },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
    orderBy: orderByCondition,
  });

  const total = await prisma.adminUser.count();

  return buildPaginationResponse(
    users.map((user) => ({
      id: user.id,
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      roleName: user.role.name,
      status: user.status,
      isSuper: user.isSuper,
      createdAt: user.createdAt.getTime(),
    })),
    total,
    query,
    orderBy,
    orderDirection,
  );
};

export const getUser = async (id: string) => {
  const user = await prisma.adminUser.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });
  if (!user) {
    throw new HTTPException(404, {
      message: '管理员不存在',
    });
  }
  return user;
};

export const editUser = async (
  id: string,
  password: string,
  mobile: string,
  email: string,
  roleId: string,
) => {
  const updateData: Partial<AdminUser> = {
    mobile,
    email,
    roleId,
  };

  const user = await getUser(id);

  if (password) {
    updateData.password = encryptPassword(password, user.username);
  }

  return prisma.adminUser.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUser = async (id: string) => {
  const user = await getUser(id);
  if (user.isSuper === 1) {
    throw new HTTPException(400, {
      message: '超级管理员不能删除',
    });
  }
  return prisma.adminUser.delete({
    where: { id },
  });
};
