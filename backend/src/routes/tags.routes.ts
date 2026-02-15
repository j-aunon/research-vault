import { Router } from 'express';
import { z } from 'zod';
import { tagsController } from '../controllers/tags.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/async.middleware';

const router = Router();

const searchQuerySchema = z.object({ q: z.string().default('') });

router.use(authMiddleware);
router.get('/', asyncHandler(tagsController.list));
router.get('/search', validate(searchQuerySchema, 'query'), asyncHandler(tagsController.search));

export default router;
