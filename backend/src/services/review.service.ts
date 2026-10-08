import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export interface CreateReviewData {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
}

export const createReview = async (data: CreateReviewData) => {
  const { productId, userId, orderId, rating, comment } = data;

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error('Order not found or does not belong to this user');
  }

  if (order.status !== 'Delivered') {
    throw new Error('You can only review products from delivered orders');
  }

  const purchasedProduct = order.orderItems.some(
    (item) => item.product?.toString() === productId
  );

  if (!purchasedProduct) {
    throw new Error('You can only review products purchased in this order');
  }

  const existingReview = await Review.findOne({
    product: productId,
    user: userId,
    order: orderId,
  });

  if (existingReview) {
    throw new Error('You have already reviewed this product for this order');
  }

  return Review.create({
    product: productId,
    user: userId,
    order: orderId,
    rating,
    comment,
    isApproved: false,
  });
};

export const getProductReviews = async (productId: string) => {
  return Review.find({
    product: productId,
    isApproved: true,
  })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
};

export const getAllReviews = async () => {
  return Review.find()
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });
};

export const approveReview = async (reviewId: string) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error('Invalid review ID');
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isApproved: true },
    { new: true }
  );

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};

export const rejectReview = async (reviewId: string) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error('Invalid review ID');
  }

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};