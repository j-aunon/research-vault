import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { projectsService } from '../services/projects.service';

export const projectsController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const projects = await projectsService.list(req.user!.id);
    res.json({ projects });
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const project = await projectsService.create(req.user!.id, req.body.name, req.body.color);
    res.status(201).json({ project });
  },

  async getById(req: AuthenticatedRequest, res: Response) {
    const project = await projectsService.getById(req.user!.id, String(req.params.id));
    res.json({ project });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const project = await projectsService.update(req.user!.id, String(req.params.id), req.body);
    res.json({ project });
  },

  async remove(req: AuthenticatedRequest, res: Response) {
    await projectsService.remove(req.user!.id, String(req.params.id));
    res.status(204).send();
  }
};
