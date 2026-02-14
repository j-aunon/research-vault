import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { foldersService } from '../services/folders.service';

export const foldersController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const folders = await foldersService.list(req.user!.id, String(req.params.projectId));
    res.json({ folders });
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const folder = await foldersService.create(req.user!.id, String(req.params.projectId), req.body.name, req.body.color);
    res.status(201).json({ folder });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const folder = await foldersService.update(req.user!.id, String(req.params.id), req.body);
    res.json({ folder });
  },

  async remove(req: AuthenticatedRequest, res: Response) {
    await foldersService.remove(req.user!.id, String(req.params.id));
    res.status(204).send();
  }
};
