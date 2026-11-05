import { Router } from 'express';
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from '../controllers/faq.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public: Get FAQs (filter by category, active only by default)
router.get('/', getFaqs);

// Admin: FAQ Management
router.post('/', authenticate, authorizeAdmin, createFaq);
router.put('/reorder', authenticate, authorizeAdmin, reorderFaqs);
router.put('/:id', authenticate, authorizeAdmin, updateFaq);
router.delete('/:id', authenticate, authorizeAdmin, deleteFaq);

export default router;

