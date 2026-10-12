import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
} from '../controllers/review.controller.js';

const router = Router();

// Public: Product page reviews
router.get('/product/:productId', getProductReviews);
router.post('/', createReview);

// Admin moderation
router.get('/admin', getAllReviewsAdmin);
router.patch('/admin/:id/status', updateReviewStatus);

export default router;
