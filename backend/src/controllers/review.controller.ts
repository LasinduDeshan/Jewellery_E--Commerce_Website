import { Response } from 'express';
import {
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  rejectReview,
} from '../services/review.service.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const createReviewController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || rating === undefined || !comment) {
      throw new ApiError(
        400,
        'Product, order, rating, and comment are required'
      );
    }

    if (rating < 1 || rating > 5) {
      throw new ApiError(400, 'Rating must be between 1 and 5');
    }

    const review = await createReview({
      productId,
      orderId,
      userId: req.user!.userId,
      rating,
      comment,
    });

    res
      .status(201)
      .json(
        ApiResponse.success(
          review,
          'Review submitted successfully and is awaiting approval'
        )
      );
  }
);

export const getProductReviewsController = asyncHandler(
  async (req, res: Response) => {
    const productId = String(req.params.productId);

    const reviews = await getProductReviews(productId);

    res.status(200).json(ApiResponse.success(reviews));
  }
);

export const getAllReviewsController = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const reviews = await getAllReviews();

    res.status(200).json(ApiResponse.success(reviews));
  }
);

export const approveReviewController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = String(req.params.id);

    const review = await approveReview(id);

    res
      .status(200)
      .json(ApiResponse.success(review, 'Review approved successfully'));
  }
);

export const rejectReviewController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = String(req.params.id);

    const review = await rejectReview(id);

    res
      .status(200)
      .json(ApiResponse.success(review, 'Review rejected successfully'));
  }
);