import type { CreateAccessRequest } from '@repo/admin-api-types';
import { AdminAccessType, type SelectOption } from '@repo/common-types';
import { prisma } from '@repo/database';
import { HTTPException } from 'hono/http-exception';

const isParentIdValid = async (parentId: string, selfType: AdminAccessType) => {
  let parentType = AdminAccessType.MODULE;
  if (selfType === AdminAccessType.OPERATION) {
    parentType = AdminAccessType.MENU;
  }
  const parent = await prisma.adminAccess.findFirst({
    where: {
      id: parentId,
      type: parentType,
    },
  });
  if (!parent) {
    return false;
  }
  return true;
};

export const createAccess = async (data: CreateAccessRequest) => {
  if (data.type === AdminAccessType.MODULE) {
    return prisma.adminAccess.create({
      data: {
        accessName: data.accessName,
        type: AdminAccessType.MODULE,
        sort: data.sort,
        description: data.description,
      },
    });
  } else {
    const isValid = await isParentIdValid(data.parentId ?? '', data.type);
    if (!isValid) {
      throw new HTTPException(400, {
        message: '父级权限不合法',
      });
    }
    return prisma.adminAccess.create({
      data: {
        accessName: data.accessName,
        type: data.type,
        url: data.url,
        parentId: data.parentId,
        sort: data.sort,
        description: data.description,
      },
    });
  }
};

export const getAccessOptions = async (
  type: Exclude<AdminAccessType, AdminAccessType.MODULE>,
): Promise<SelectOption[]> => {
  const accesses = await prisma.adminAccess.findMany({
    where: {
      type,
    },
  });
  return accesses.map((access) => ({
    label: access.accessName,
    key: access.id,
  }));
};
