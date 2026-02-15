import { prisma } from '../utils/prisma.util';
import { AppError } from '../types';

export const projectsService = {
  async list(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        folders: { orderBy: { createdAt: 'asc' } },
        _count: { select: { resources: true, folders: true } }
      }
    });
  },

  async create(userId: string, name: string, color?: string) {
    return prisma.project.create({
      data: {
        userId,
        name,
        color: color || 'bg-blue-500'
      }
    });
  },

  async getById(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        folders: {
          orderBy: { createdAt: 'asc' },
          include: { _count: { select: { resources: true } } }
        },
        _count: { select: { resources: true, folders: true } }
      }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return project;
  },

  async update(userId: string, projectId: string, data: { name?: string; color?: string }) {
    await projectsService.getById(userId, projectId);
    return prisma.project.update({
      where: { id: projectId },
      data
    });
  },

  async remove(userId: string, projectId: string) {
    await projectsService.getById(userId, projectId);
    await prisma.project.delete({ where: { id: projectId } });
  }
};
