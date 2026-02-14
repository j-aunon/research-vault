import { prisma } from '../utils/prisma.util';

export const tagsService = {
  async list(userId: string) {
    return prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
  },

  async search(userId: string, q: string) {
    return prisma.tag.findMany({
      where: {
        userId,
        name: { contains: q, mode: 'insensitive' }
      },
      orderBy: { name: 'asc' },
      take: 20
    });
  }
};
