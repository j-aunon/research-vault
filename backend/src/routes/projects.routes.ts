import { Router } from 'express';
import { z } from 'zod';
import { projectsController } from '../controllers/projects.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/async.middleware';
import { foldersController } from '../controllers/folders.controller';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });
const projectIdParamSchema = z.object({ projectId: z.string().uuid() });
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().max(50).optional()
});
const updateProjectSchema = createProjectSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().max(50).optional()
});

router.use(authMiddleware);

router.get('/', asyncHandler(projectsController.list));
router.post('/', validate(createProjectSchema), asyncHandler(projectsController.create));
router.get('/:id', validate(idParamSchema, 'params'), asyncHandler(projectsController.getById));
router.put('/:id', validate(idParamSchema, 'params'), validate(updateProjectSchema), asyncHandler(projectsController.update));
router.delete('/:id', validate(idParamSchema, 'params'), asyncHandler(projectsController.remove));

router.get('/:projectId/folders', validate(projectIdParamSchema, 'params'), asyncHandler(foldersController.list));
router.post(
  '/:projectId/folders',
  validate(projectIdParamSchema, 'params'),
  validate(createFolderSchema),
  asyncHandler(foldersController.create)
);

export default router;
