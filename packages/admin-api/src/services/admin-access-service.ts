import type {
  CreateAccessRequest,
  EditAccessRequest,
  GetAccessResponse,
  GetAllAccessesResponse,
} from '@repo/admin-api-types';
import { AdminAccessType, type SelectOption } from '@repo/common-types';
import { prisma, type AdminAccess } from '@repo/database';
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

type AccessTreeNode = AdminAccess & {
  children: AccessTreeNode[];
};

const buildAccessTree = (accesses: AdminAccess[]) => {
  const tree: AccessTreeNode[] = [];
  const modules = accesses
    .filter((access) => access.type === AdminAccessType.MODULE)
    .sort((a, b) => a.sort - b.sort);
  const menus = accesses
    .filter((access) => access.type === AdminAccessType.MENU)
    .sort((a, b) => a.sort - b.sort);
  const operations = accesses
    .filter((access) => access.type === AdminAccessType.OPERATION)
    .sort((a, b) => a.sort - b.sort);
  for (const module of modules) {
    const moduleMenus = menus.filter((menu) => menu.parentId === module.id);
    const moduleNode: AccessTreeNode = {
      ...module,
      children: [],
    };
    for (const menu of moduleMenus) {
      const menuOperations = operations.filter(
        (operation) => operation.parentId === menu.id,
      );
      const menuNode: AccessTreeNode = {
        ...menu,
        children: menuOperations.map((operation) => ({
          ...operation,
          children: [],
        })),
      };
      moduleNode.children.push(menuNode);
    }
    tree.push(moduleNode);
  }
  return tree;
};

export const getAllAccesses = async (): Promise<GetAllAccessesResponse> => {
  const accesses = await prisma.adminAccess.findMany();
  const tree = buildAccessTree(accesses);

  const buildResponseItem = (
    node: AccessTreeNode,
  ): GetAllAccessesResponse[number] => {
    return {
      id: node.id,
      moduleName: node.type === AdminAccessType.MODULE ? node.accessName : '-',
      menuName: node.type === AdminAccessType.MENU ? node.accessName : '-',
      operationName:
        node.type === AdminAccessType.OPERATION ? node.accessName : '-',
      type: node.type,
      url: node.url ?? null,
      parentId: node.parentId ?? null,
      sort: node.sort,
      description: node.description ?? '',
      status: node.status,
      createdAt: node.createdAt.getTime(),
    };
  };

  const result: GetAllAccessesResponse = [];

  const buildResponse = (nodes: AccessTreeNode[]) => {
    for (const node of nodes) {
      result.push(buildResponseItem(node));
      if (node.children.length > 0) {
        buildResponse(node.children);
      }
    }
  };

  buildResponse(tree);
  return result;
};

export const getAccess = async (id: string): Promise<GetAccessResponse> => {
  const access = await prisma.adminAccess.findUnique({
    where: { id },
  });
  if (!access) {
    throw new HTTPException(404, {
      message: '权限不存在',
    });
  }
  return {
    id: access.id,
    accessName: access.accessName,
    type: access.type,
    url: access.url ?? null,
    parentId: access.parentId ?? null,
    sort: access.sort,
    description: access.description ?? '',
    status: access.status,
  };
};

export const editAccess = async (id: string, data: EditAccessRequest) => {
  await getAccess(id);
  return prisma.adminAccess.update({
    where: { id },
    data: {
      accessName: data.accessName,
      url: data.url,
      parentId: data.parentId,
      sort: data.sort,
      description: data.description,
    },
  });
};

export const deleteAccess = async (id: string) => {
  const childrenCount = await prisma.adminAccess.count({
    where: {
      parentId: id,
    },
  });
  if (childrenCount > 0) {
    throw new HTTPException(400, {
      message: '权限下有子权限，不能删除',
    });
  }
  return prisma.adminAccess.delete({
    where: { id },
  });
};
