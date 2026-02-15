import { Prisma, ResourceType } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../utils/prisma.util';
import { AppError } from '../types';

const includeResource = {
  project: true,
  folder: true,
  resourceTags: {
    include: { tag: true }
  }
} satisfies Prisma.ResourceInclude;

const ensureProjectOwnership = async (userId: string, projectId: string) => {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
};

const ensureFolderInProject = async (folderId: string, projectId: string) => {
  const folder = await prisma.folder.findFirst({ where: { id: folderId, projectId } });
  if (!folder) {
    throw new AppError('Folder not found for this project', 400);
  }
};

const attachTags = async (tx: Prisma.TransactionClient, userId: string, resourceId: string, tags: string[]) => {
  const uniqueTags = [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))];
  if (!uniqueTags.length) {
    return;
  }

  const records = await Promise.all(
    uniqueTags.map(async (name) => {
      const tag = await tx.tag.upsert({
        where: { userId_name: { userId, name } },
        update: {},
        create: { userId, name }
      });
      return tag;
    })
  );

  await tx.resourceTag.createMany({
    data: records.map((tag) => ({ resourceId, tagId: tag.id })),
    skipDuplicates: true
  });
};

const cleanResponse = <T extends { resourceTags: { tag: { id: string; name: string } }[] }>(resource: T) => ({
  ...resource,
  tags: resource.resourceTags.map((rt) => rt.tag),
  resourceTags: undefined
});

const normalizeUrl = (value?: string) => {
  if (!value) {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
};

export const resourcesService = {
  async list(
    userId: string,
    query: {
      projectId: string;
      folderId?: string;
      type?: 'paper' | 'book' | 'website';
      starred?: boolean;
      search?: string;
      sortBy?: 'recent' | 'title' | 'starred';
    }
  ) {
    const { projectId, folderId, type, starred, search, sortBy = 'recent' } = query;
    await ensureProjectOwnership(userId, projectId);

    const where: Prisma.ResourceWhereInput = {
      userId,
      projectId,
      ...(folderId ? { folderId } : {}),
      ...(type ? { type } : {}),
      ...(typeof starred === 'boolean' ? { starred } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              {
                resourceTags: {
                  some: {
                    tag: {
                      name: { contains: search, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          }
        : {})
    };

    const orderBy: Prisma.ResourceOrderByWithRelationInput[] =
      sortBy === 'title'
        ? [{ title: 'asc' }]
        : sortBy === 'starred'
          ? [{ starred: 'desc' }, { addedDate: 'desc' }]
          : [{ addedDate: 'desc' }];

    const resources = await prisma.resource.findMany({ where, orderBy, include: includeResource });
    return resources.map(cleanResponse);
  },

  async create(
    userId: string,
    payload: {
      title: string;
      type: ResourceType;
      projectId: string;
      folderId?: string;
      url?: string;
      notes?: string;
      tags?: string[];
      starred?: boolean;
    }
  ) {
    await ensureProjectOwnership(userId, payload.projectId);
    if (payload.folderId) {
      await ensureFolderInProject(payload.folderId, payload.projectId);
    }

    const resource = await prisma.$transaction(async (tx) => {
      const created = await tx.resource.create({
        data: {
          userId,
          projectId: payload.projectId,
          folderId: payload.folderId || null,
          title: payload.title,
          type: payload.type,
          url: normalizeUrl(payload.url),
          notes: payload.notes,
          starred: payload.starred || false
        }
      });

      await attachTags(tx, userId, created.id, payload.tags || []);

      return tx.resource.findUniqueOrThrow({
        where: { id: created.id },
        include: includeResource
      });
    });

    return cleanResponse(resource);
  },

  async getById(userId: string, resourceId: string) {
    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, userId },
      include: includeResource
    });

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    return cleanResponse(resource);
  },

  async update(
    userId: string,
    resourceId: string,
    payload: {
      title?: string;
      type?: ResourceType;
      projectId?: string;
      folderId?: string | null;
      url?: string;
      notes?: string;
      tags?: string[];
      starred?: boolean;
    }
  ) {
    const existing = await prisma.resource.findFirst({ where: { id: resourceId, userId } });
    if (!existing) {
      throw new AppError('Resource not found', 404);
    }

    const projectId = payload.projectId || existing.projectId;
    await ensureProjectOwnership(userId, projectId);

    if (payload.folderId) {
      await ensureFolderInProject(payload.folderId, projectId);
    }

    const resource = await prisma.$transaction(async (tx) => {
      await tx.resource.update({
        where: { id: resourceId },
        data: {
          title: payload.title,
          type: payload.type,
          projectId,
          folderId: payload.folderId === undefined ? existing.folderId : payload.folderId,
          url: payload.url === undefined ? existing.url : normalizeUrl(payload.url),
          notes: payload.notes,
          starred: payload.starred
        }
      });

      if (payload.tags) {
        await tx.resourceTag.deleteMany({ where: { resourceId } });
        await attachTags(tx, userId, resourceId, payload.tags);
      }

      return tx.resource.findUniqueOrThrow({ where: { id: resourceId }, include: includeResource });
    });

    return cleanResponse(resource);
  },

  async remove(userId: string, resourceId: string) {
    const existing = await prisma.resource.findFirst({ where: { id: resourceId, userId } });
    if (!existing) {
      throw new AppError('Resource not found', 404);
    }

    if (existing.filePath) {
      await fs.unlink(existing.filePath).catch(() => undefined);
    }

    await prisma.resource.delete({ where: { id: resourceId } });
  },

  async toggleStar(userId: string, resourceId: string) {
    const existing = await prisma.resource.findFirst({ where: { id: resourceId, userId } });
    if (!existing) {
      throw new AppError('Resource not found', 404);
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: { starred: !existing.starred },
      include: includeResource
    });

    return cleanResponse(resource);
  },

  async uploadFile(
    userId: string,
    resourceId: string,
    file: {
      path: string;
      originalname: string;
      mimetype: string;
      size: number;
    }
  ) {
    const existing = await prisma.resource.findFirst({ where: { id: resourceId, userId } });
    if (!existing) {
      throw new AppError('Resource not found', 404);
    }

    if (existing.type === 'website') {
      throw new AppError('Files can only be attached to papers or books', 400);
    }

    if (existing.filePath && existing.filePath !== file.path) {
      await fs.unlink(existing.filePath).catch(() => undefined);
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        filePath: file.path,
        fileName: file.originalname,
        fileMime: file.mimetype
      },
      include: includeResource
    });

    return cleanResponse(resource);
  },

  async getFile(userId: string, resourceId: string) {
    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, userId },
      select: {
        filePath: true,
        fileName: true,
        fileMime: true
      }
    });

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    if (!resource.filePath) {
      throw new AppError('No file attached to this resource', 404);
    }

    const absolutePath = path.resolve(resource.filePath);
    await fs.access(absolutePath).catch(() => {
      throw new AppError('Attached file is missing on disk', 404);
    });

    return {
      absolutePath,
      fileName: resource.fileName || 'document.pdf',
      fileMime: resource.fileMime || 'application/pdf'
    };
  }
};
