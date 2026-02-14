import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { tagsService } from '../services/tags.service';

export const tagsController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const tags = await tagsService.list(req.user!.id);
    res.json({ tags });
  },

  async search(req: AuthenticatedRequest, res: Response) {
    const tags = await tagsService.search(req.user!.id, (req.query.q as string) || '');
    res.json({ tags });
  }
};
