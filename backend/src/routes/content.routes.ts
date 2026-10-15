import { Router } from 'express';
import {
  getContentBySlug,
  updateContent,
} from '../controllers/content.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public: Fetch page content
router.get('/:slug', getContentBySlug);

// Admin: Update CMS content
router.put('/:slug', authenticate, authorizeAdmin, updateContent);

export default router;
