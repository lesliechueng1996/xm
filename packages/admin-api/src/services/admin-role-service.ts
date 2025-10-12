import { prisma } from '@repo/database';

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
