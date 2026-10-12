import { Router } from 'express';
import {
  getContentBySlug,
  updateContent,
} from '../controllers/content.controller.js';

const router = Router();

// Public: Fetch page content
router.get('/:slug', getContentBySlug);

// Admin: Update CMS content
router.put('/:slug', updateContent);

export default router;
