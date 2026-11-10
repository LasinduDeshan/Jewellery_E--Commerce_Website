import { Router } from 'express';
import {
  createReviewController,
  getAllReviewsController,
  getProductReviewsController,
  getLatestReviewsController,
  approveReviewController,
  rejectReviewController,
  checkReviewEligibilityController,
} from '../controllers/review.controller.js';
import { approveReview, rejectReview } from '../services/review.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { authenticate, authorizeAdmin, optionalAuthenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Public: Fetch approved reviews for a product
router.get('/product/:productId', getProductReviewsController);

// Public/Optional: Check eligibility of user to review product
router.get('/eligibility/:productId', optionalAuthenticate, (req: AuthRequest, res, next) => {
  if (!req.user?.userId) {
    return res.status(200).json(
      ApiResponse.success(
        { eligible: false, message: 'Please sign in to write a verified review.' }
      )
    );
  }
  return checkReviewEligibilityController(req, res, next);
});

// Review submission: strictly requires authentication & verified delivered purchase
router.post('/', authenticate, createReviewController);

// Public: Latest approved reviews for landing page
router.get('/latest', getLatestReviewsController);

// Public reviews list
router.get('/', getAllReviewsController);

// Admin: review moderation
router.get('/admin', authenticate, authorizeAdmin, getAllReviewsController);
router.patch('/admin/:id/status', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reviewId = Array.isArray(id) ? id[0] : id;
    if (status === 'approved') {
      const review = await approveReview(reviewId);
      res.json(ApiResponse.success(review, 'Review approved successfully'));
    } else {
      const review = await rejectReview(reviewId);
      res.json(ApiResponse.success(review, 'Review rejected successfully'));
    }
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/approve', authenticate, authorizeAdmin, approveReviewController);
router.delete('/:id/reject', authenticate, authorizeAdmin, rejectReviewController);

export default router;
