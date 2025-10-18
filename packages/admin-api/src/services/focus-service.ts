import type { CreateFocusRequest } from '@repo/admin-api-types';
import { prisma } from '@repo/database';

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
