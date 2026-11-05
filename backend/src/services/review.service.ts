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

  if (!userId) {
    throw new Error('Authentication required: Please sign in to review your purchased piece.');
  }

  // Strict verification: User must have a DELIVERED & CONFIRMED order for this product
  const query: any = {
    user: userId,
    $or: [{ status: 'Delivered' }, { isDeliveryConfirmed: true }],
    $and: [
      {
        $or: [
          { 'orderItems.product': productId },
          { 'orderItems.title': product.name },
          ...(orderId ? [{ _id: orderId }] : []),
        ],
      },
    ],
  };

  let verifiedOrder = await Order.findOne(query);

  if (!verifiedOrder && orderId) {
    const checkOrder = await Order.findOne({ _id: orderId, user: userId });
    if (checkOrder && (checkOrder.status === 'Delivered' || checkOrder.isDeliveryConfirmed)) {
      verifiedOrder = checkOrder;
    }
  }

  if (!verifiedOrder) {
    // Check if there is an in-progress order
    const pendingOrder = await Order.findOne({
      user: userId,
      $or: [
        { 'orderItems.product': productId },
        { 'orderItems.title': product.name },
        ...(orderId ? [{ _id: orderId }] : []),
      ],
    });

    if (pendingOrder) {
      throw new Error(
        `Delivery confirmation required: Your order (#${pendingOrder.orderNumber}) is currently ${pendingOrder.status}. Reviews can only be submitted after delivery is completed and confirmed.`
      );
    }

    throw new Error(
      'Verified purchase required: Only patrons who have purchased and received this piece can submit a review.'
    );
  }

  // Ensure customer hasn't already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (existingReview) {
    throw new Error('You have already submitted a verified review for this piece.');
  }

  return Review.create({
    product: productId,
    user: userId,
    order: verifiedOrder._id,
    customerName: customerName || 'Verified Buyer',
    title: title || 'Verified Customer Review',
    photos: photos || [],
    rating,
    comment,
    verifiedPurchase: true,
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

export const checkReviewEligibility = async (productId: string, userId?: string) => {
  if (!userId) {
    return {
      canReview: false,
      reason: 'unauthenticated',
      message: 'Sign in to verify if you can review this piece.',
    };
  }

  const product = await Product.findById(productId);
  if (!product) {
    return {
      canReview: false,
      reason: 'not_found',
      message: 'Product not found.',
    };
  }

  // 1. Has user already reviewed?
  const existingReview = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (existingReview) {
    return {
      canReview: false,
      hasReviewed: true,
      reviewStatus: existingReview.status,
      message: 'You have already submitted a verified review for this piece.',
    };
  }

  // 2. Has user purchased and has delivered/confirmed order?
  const deliveredOrder = await Order.findOne({
    user: userId,
    $or: [{ status: 'Delivered' }, { isDeliveryConfirmed: true }],
    $and: [
      {
        $or: [
          { 'orderItems.product': productId },
          { 'orderItems.title': product.name },
        ],
      },
    ],
  });

  if (deliveredOrder) {
    return {
      canReview: true,
      orderId: deliveredOrder._id,
      orderNumber: deliveredOrder.orderNumber,
      message: 'You are verified and eligible to review this delivered piece.',
    };
  }

  // 3. Has user purchased but order is pending/shipped/not yet confirmed delivered?
  const pendingOrder = await Order.findOne({
    user: userId,
    $or: [
      { 'orderItems.product': productId },
      { 'orderItems.title': product.name },
    ],
  });

  if (pendingOrder) {
    return {
      canReview: false,
      needsDeliveryConfirmation: true,
      orderId: pendingOrder._id,
      orderNumber: pendingOrder.orderNumber,
      orderStatus: pendingOrder.status,
      message:
        pendingOrder.status === 'Shipped'
          ? 'Your order is in transit! Confirm delivery upon arrival to unlock reviews.'
          : `Your order is ${pendingOrder.status}. You can review this piece once delivery is confirmed.`,
    };
  }

  // 4. User has not purchased this piece
  return {
    canReview: false,
    reason: 'not_purchased',
    message: 'Reviews are reserved exclusively for patrons who have purchased and received this piece.',
  };
};
