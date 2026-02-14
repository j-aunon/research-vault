import { Response } from 'express';
import fs from 'fs';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../types';
import { resourcesService } from '../services/resources.service';

export const resourcesController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const resources = await resourcesService.list(req.user!.id, {
      projectId: req.query.projectId as string,
      folderId: req.query.folderId as string | undefined,
      type: req.query.type as 'paper' | 'book' | 'website' | undefined,
      starred: req.query.starred === undefined ? undefined : req.query.starred === 'true',
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as 'recent' | 'title' | 'starred' | undefined
    });
    res.json({ resources });
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const resource = await resourcesService.create(req.user!.id, req.body);
    res.status(201).json({ resource });
  },

  async getById(req: AuthenticatedRequest, res: Response) {
    const resource = await resourcesService.getById(req.user!.id, String(req.params.id));
    res.json({ resource });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const resource = await resourcesService.update(req.user!.id, String(req.params.id), req.body);
    res.json({ resource });
  },

  async remove(req: AuthenticatedRequest, res: Response) {
    await resourcesService.remove(req.user!.id, String(req.params.id));
    res.status(204).send();
  },

  async toggleStar(req: AuthenticatedRequest, res: Response) {
    const resource = await resourcesService.toggleStar(req.user!.id, String(req.params.id));
    res.json({ resource });
  },

  async uploadFile(req: AuthenticatedRequest, res: Response) {
    if (!req.file) {
      throw new AppError('File is required', 400);
    }

    if (req.file.mimetype !== 'application/pdf') {
      throw new AppError('Only PDF files are allowed', 400);
    }

    const resource = await resourcesService.uploadFile(req.user!.id, String(req.params.id), req.file);
    res.json({ resource });
  },

  async getFile(req: AuthenticatedRequest, res: Response) {
    const file = await resourcesService.getFile(req.user!.id, String(req.params.id));
    res.setHeader('Content-Type', file.fileMime);
    res.setHeader('Content-Disposition', `inline; filename=\"${file.fileName}\"`);
    fs.createReadStream(file.absolutePath).pipe(res);
  }
};
