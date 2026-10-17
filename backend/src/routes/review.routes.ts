import { Router } from 'express';
import {
  createReviewController,
  getProductReviewsController,
  getAllReviewsController,
  approveReviewController,
  rejectReviewController,
} from '../controllers/review.controller.js';
import { approveReview, rejectReview } from '../services/review.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
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
router.get('/admin', getAllReviewsController);
router.patch('/admin/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status === 'approved') {
      const review = await approveReview(id);
      res.json(ApiResponse.success(review, 'Review approved successfully'));
    } else {
      const review = await rejectReview(id);
      res.json(ApiResponse.success(review, 'Review rejected successfully'));
    }
  } catch (e) {
    next(e);
  }
});

router.get('/', authenticate, authorizeAdmin, getAllReviewsController);
router.patch('/:id/approve', authenticate, authorizeAdmin, approveReviewController);
router.delete('/:id/reject', authenticate, authorizeAdmin, rejectReviewController);

export default router;
