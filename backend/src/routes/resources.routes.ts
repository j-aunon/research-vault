import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { z } from 'zod';
import { resourcesController } from '../controllers/resources.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/async.middleware';

const router = Router();
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${suffix}-${file.originalname.replace(/\s+/g, '_')}`);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 }
});

const idParamSchema = z.object({ id: z.string().uuid() });
const urlLikeSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => {
    const candidate = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
    try {
      new URL(candidate);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL');

const listQuerySchema = z.object({
  projectId: z.string().uuid(),
  folderId: z.string().uuid().optional(),
  type: z.enum(['paper', 'book', 'website']).optional(),
  starred: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['recent', 'title', 'starred']).optional()
});

const createResourceSchema = z.object({
  title: z.string().min(1).max(500),
  type: z.enum(['paper', 'book', 'website']),
  projectId: z.string().uuid(),
  folderId: z.string().uuid().optional(),
  url: urlLikeSchema.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string().min(1).max(100)).optional(),
  starred: z.boolean().optional()
});

const updateResourceSchema = z
  .object({
    title: z.string().min(1).max(500).optional(),
    type: z.enum(['paper', 'book', 'website']).optional(),
    projectId: z.string().uuid().optional(),
    folderId: z.string().uuid().nullable().optional(),
    url: urlLikeSchema.optional(),
    notes: z.string().optional(),
    tags: z.array(z.string().min(1).max(100)).optional(),
    starred: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });

router.use(authMiddleware);
router.get('/', validate(listQuerySchema, 'query'), asyncHandler(resourcesController.list));
router.post('/', validate(createResourceSchema), asyncHandler(resourcesController.create));
router.get('/:id', validate(idParamSchema, 'params'), asyncHandler(resourcesController.getById));
router.put('/:id', validate(idParamSchema, 'params'), validate(updateResourceSchema), asyncHandler(resourcesController.update));
router.delete('/:id', validate(idParamSchema, 'params'), asyncHandler(resourcesController.remove));
router.patch('/:id/star', validate(idParamSchema, 'params'), asyncHandler(resourcesController.toggleStar));
router.post('/:id/file', validate(idParamSchema, 'params'), upload.single('file'), asyncHandler(resourcesController.uploadFile));
router.get('/:id/file', validate(idParamSchema, 'params'), asyncHandler(resourcesController.getFile));

export default router;
