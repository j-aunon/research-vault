import { Router } from 'express';
import { z } from 'zod';
import { foldersController } from '../controllers/folders.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/async.middleware';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });
const updateFolderSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    color: z.string().max(50).optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });

router.use(authMiddleware);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateFolderSchema), asyncHandler(foldersController.update));
router.delete('/:id', validate(idParamSchema, 'params'), asyncHandler(foldersController.remove));

export default router;
