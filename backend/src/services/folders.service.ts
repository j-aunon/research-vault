import { prisma } from '../utils/prisma.util';
import { AppError } from '../types';

const ensureProjectOwnership = async (userId: string, projectId: string) => {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
};

const ensureFolderOwnership = async (userId: string, folderId: string) => {
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      project: { userId }
    }
  });

  if (!folder) {
    throw new AppError('Folder not found', 404);
  }

  return folder;
};

export const foldersService = {
  async list(userId: string, projectId: string) {
    await ensureProjectOwnership(userId, projectId);

    return prisma.folder.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { resources: true } } }
    });
  },

  async create(userId: string, projectId: string, name: string, color?: string) {
    await ensureProjectOwnership(userId, projectId);

    return prisma.folder.create({
      data: {
        projectId,
        name,
        color: color || 'bg-purple-500'
      }
    });
  },

  async update(userId: string, folderId: string, data: { name?: string; color?: string }) {
    await ensureFolderOwnership(userId, folderId);

    return prisma.folder.update({
      where: { id: folderId },
      data
    });
  },

  async remove(userId: string, folderId: string) {
    await ensureFolderOwnership(userId, folderId);

    await prisma.resource.updateMany({
      where: { folderId },
      data: { folderId: null }
    });

    await prisma.folder.delete({ where: { id: folderId } });
  }
};
