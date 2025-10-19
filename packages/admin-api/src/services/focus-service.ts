import type {
  CreateFocusRequest,
  EditFocusRequest,
} from '@repo/admin-api-types';
import type { PaginationRequest } from '@repo/common-types';
import { type Focus, prisma } from '@repo/database';
import { buildPaginationResponse } from '@repo/server-common';
import { HTTPException } from 'hono/http-exception';
import { deleteImage } from './image-service.js';

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

export const getFocus = async (id: string) => {
  const focus = await prisma.focus.findUnique({
    where: {
      id,
    },
  });
  if (!focus) {
    throw new HTTPException(404, {
      message: '轮播图不存在',
    });
  }

  const staticServer =
    process.env.STATIC_SERVER || 'http://localhost:3000/static';
  return {
    id: focus.id,
    type: focus.type,
    title: focus.title,
    focusImg: `${staticServer}${focus.focusImg}`,
    link: focus.link,
    sort: focus.sort,
    status: focus.status,
  };
};

export const editFocus = async (id: string, request: EditFocusRequest) => {
  await getFocus(id);

  const updateData: Partial<Focus> = {
    title: request.title,
    type: request.type,
    link: request.link,
    sort: request.sort,
    status: request.status,
  };
  if (request.focusImg) {
    updateData.focusImg = request.focusImg;
  }

  return prisma.focus.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const deleteFocus = async (id: string) => {
  const focus = await getFocus(id);
  const focusImg = focus.focusImg;
  await prisma.focus.delete({
    where: {
      id,
    },
  });
  deleteImage(focusImg);
};
