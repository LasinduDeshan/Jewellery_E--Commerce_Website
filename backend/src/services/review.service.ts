import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export interface CreateReviewData {
  productId: string;
  userId?: string;
  orderId?: string;
  customerName?: string;
  title?: string;
  photos?: string[];
  rating: number;
  comment: string;
}

export const createReview = async (data: CreateReviewData) => {
  const { productId, userId, orderId, customerName, title, photos, rating, comment } = data;

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // If orderId is provided, perform strict order verification
  if (orderId && userId) {
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
  }

  return Review.create({
    product: productId,
    user: userId || undefined,
    order: orderId || undefined,
    customerName: customerName || 'Verified Buyer',
    title: title || 'Customer Review',
    photos: photos || [],
    rating,
    comment,
    isApproved: false,
    status: 'pending',
  });
};

export const getLatestReviews = async (limit: number = 6) => {
  const reviews = await Review.find({
    isApproved: true,
  })
    .populate('user', 'name avatar')
    .populate('product', 'name slug images price')
    .sort({ createdAt: -1 })
    .limit(limit);

  return reviews.map((r: any) => ({
    _id: r._id,
    rating: r.rating,
    comment: r.comment,
    title: r.title || 'Verified Ceylon Sapphire Review',
    photos: r.photos || [],
    createdAt: r.createdAt,
    customerName: r.customerName || r.user?.name || 'Verified Patron',
    productName: r.product?.name || 'Ceylon Sapphire Jewellery',
    productSlug: r.product?.slug || '',
    productImage: r.product?.images?.[0]?.url || '',
    verifiedPurchase: true,
  }));
};

export const getProductReviews = async (productId: string) => {
  let productFilter: any = { isApproved: true };

  if (mongoose.Types.ObjectId.isValid(productId)) {
    productFilter.product = productId;
  } else {
    const product = await Product.findOne({ slug: productId });
    if (product) {
      productFilter.product = product._id;
    } else {
      return [];
    }
  }

  const reviews = await Review.find(productFilter)
    .populate('user', 'name avatar')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });

  return reviews.map((r: any) => ({
    _id: r._id,
    rating: r.rating,
    comment: r.comment,
    title: r.title || 'Verified Purchase',
    photos: r.photos || [],
    createdAt: r.createdAt,
    customerName: r.customerName || r.user?.name || 'Verified Buyer',
    productName: r.product?.name || '',
    verifiedPurchase: true,
  }));
};

export const getAllReviews = async (status?: string) => {
  const filter: Record<string, any> = {};
  if (status === 'approved') {
    filter.isApproved = true;
  } else if (status === 'pending') {
    filter.$or = [{ status: 'pending' }, { isApproved: false, status: { $ne: 'rejected' } }];
  } else if (status === 'rejected') {
    filter.status = 'rejected';
  }

  const reviews = await Review.find(filter)
    .populate('user', 'name email avatar')
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 });

  return reviews.map((r: any) => {
    const computedStatus = r.status || (r.isApproved ? 'approved' : 'pending');
    return {
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      title: r.title || 'Exquisite Ceylon Craftsmanship',
      isApproved: r.isApproved,
      status: computedStatus,
      createdAt: r.createdAt,
      customerName: r.customerName || r.user?.name || 'Verified Buyer',
      customerEmail: r.user?.email || 'customer@example.com',
      productName: r.product?.name || 'Royal Blue Ceylon Sapphire',
      productSlug: r.product?.slug || '',
      productImage: r.product?.images?.[0]?.url || '',
      photos: r.photos || [],
    };
  });
};

export const approveReview = async (reviewId: string) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error('Invalid review ID');
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isApproved: true, status: 'approved' },
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

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isApproved: false, status: 'rejected' },
    { new: true }
  );

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};
