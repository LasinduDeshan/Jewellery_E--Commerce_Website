import { Router } from 'express';
import {
  createReviewController,
  getProductReviewsController,
  getAllReviewsController,
  approveReviewController,
  rejectReviewController,
} from '../controllers/review.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public: view approved reviews for a product
router.get('/product/:productId', getProductReviewsController);

// Customer: submit a review
router.post('/', authenticate, createReviewController);

// Admin: review moderation
router.get('/', authenticate, authorizeAdmin, getAllReviewsController);
router.patch('/:id/approve', authenticate, authorizeAdmin, approveReviewController);
router.delete('/:id/reject', authenticate, authorizeAdmin, rejectReviewController);

export default router;