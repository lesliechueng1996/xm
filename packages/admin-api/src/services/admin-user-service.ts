import { prisma } from '@repo/database';

export const findAdminUserByUsername = async (username: string) => {
  return prisma.adminUser.findUnique({
    where: {
      username,
    },
  });
};
