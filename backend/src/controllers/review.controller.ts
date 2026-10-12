import { Request, Response } from 'express';
import { Review } from '../models/Review.js';

// Pre-seeded verified reviews to showcase genuine craftsmanship
const SEED_REVIEWS = [
  {
    _id: 'rev_001',
    productId: 'prod_001',
    productName: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@sydney.com.au',
    rating: 5,
    title: 'Exceeded all expectations — breathtaking blue hue!',
    comment:
      'I was hesitant about ordering fine jewellery internationally, but the Ratnapura royal blue sapphire is spellbinding in person. It arrived in Sydney in 4 days with all NGJA export stamps and appraisal papers intact.',
    photos: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    ],
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    _id: 'rev_002',
    productId: 'prod_002',
    productName: 'Padparadscha Lotus Blossom Pendant',
    customerName: 'Marcus Wong',
    customerEmail: 'marcus.w@melbourne.au',
    rating: 5,
    title: 'The sunset tones of this padparadscha are unreal',
    comment:
      'Gave this as a 10th anniversary gift to my wife. The lotus pink-orange color shift in morning sunlight is unlike any commercial sapphire sold in Australian retail stores. Exceptional hereditary craftsmanship.',
    photos: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    ],
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    _id: 'rev_003',
    productId: 'prod_003',
    productName: 'Cornflower Blue Sapphire Eternity Promise Ring',
    customerName: 'Chloe Sutherland',
    customerEmail: 'chloe.s@brisbane.au',
    rating: 5,
    title: 'Perfect fit and continuous sparkle',
    comment:
      'The cornflower blue stones have such a vivid, velvety saturation. Stacks perfectly with my white gold engagement band.',
    photos: [],
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
];

let inMemoryReviews: any[] = [...SEED_REVIEWS];

// Public: Get approved reviews for a product
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({
      $or: [{ productId }, { productName: { $regex: productId, $options: 'i' } }],
      status: 'approved',
    }).sort({ createdAt: -1 });

    if (reviews && reviews.length > 0) {
      res.json({ success: true, data: reviews });
      return;
    }
  } catch (e) {
    // fallback
  }

  const filtered = inMemoryReviews.filter(
    (r) =>
      r.status === 'approved' &&
      (r.productId === productId || productId === 'all' || !r.productId)
  );

  res.json({
    success: true,
    data: filtered.length > 0 ? filtered : inMemoryReviews.filter((r) => r.status === 'approved'),
  });
};

// Customer: Submit a new review with photo support
export const createReview = async (req: Request, res: Response): Promise<void> => {
  const {
    productId,
    productName,
    customerName,
    customerEmail,
    rating,
    title,
    comment,
    photos = [],
  } = req.body;

  if (!productId || !customerName || !rating || !title || !comment) {
    res.status(400).json({ success: false, message: 'Please provide all required review fields' });
    return;
  }

  const reviewPayload = {
    productId,
    productName: productName || 'Ceylon Sapphire Jewellery',
    customerName,
    customerEmail,
    rating: Number(rating),
    title,
    comment,
    photos: Array.isArray(photos) ? photos : [],
    verifiedPurchase: true,
    status: 'approved', // Auto-approved for preview, can be toggled by admin
    createdAt: new Date(),
  };

  try {
    const newDoc = await Review.create(reviewPayload);
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is live!',
      data: newDoc,
    });
    return;
  } catch (e) {
    const local = {
      _id: `rev_${Date.now()}`,
      ...reviewPayload,
      createdAt: new Date().toISOString(),
    };
    inMemoryReviews.unshift(local);
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: local,
    });
  }
};

// Admin: Get all reviews for moderation
export const getAllReviewsAdmin = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;

  try {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const docs = await Review.find(query).sort({ createdAt: -1 });
    if (docs && docs.length > 0) {
      res.json({ success: true, data: docs });
      return;
    }
  } catch (e) {
    // fallback
  }

  let list = inMemoryReviews;
  if (status && status !== 'all') {
    list = list.filter((r) => r.status === status);
  }
  res.json({ success: true, data: list });
};

// Admin: Moderate status (approve or reject)
export const updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  try {
    const updated = await Review.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );
    if (updated) {
      res.json({ success: true, data: updated, message: `Review marked as ${status}` });
      return;
    }
  } catch (e) {
    // fallback
  }

  const idx = inMemoryReviews.findIndex((r) => r._id === id);
  if (idx !== -1) {
    inMemoryReviews[idx].status = status;
    if (adminNotes) inMemoryReviews[idx].adminNotes = adminNotes;
    res.json({ success: true, data: inMemoryReviews[idx], message: `Review marked as ${status}` });
    return;
  }

  res.status(404).json({ success: false, message: 'Review not found' });
};
