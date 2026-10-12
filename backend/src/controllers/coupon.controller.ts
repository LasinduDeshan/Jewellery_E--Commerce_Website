import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';

const SEED_COUPONS = [
  {
    _id: 'coup_001',
    code: 'CEYLON10',
    description: '10% Welcome gift for fine jewellery connoisseurs',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    isActive: true,
    usageCount: 14,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'coup_002',
    code: 'AUSTRA50',
    description: '$50 AUD off orders over $600 AUD',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 600,
    isActive: true,
    usageCount: 8,
    createdAt: new Date().toISOString(),
  },
];

let inMemoryCoupons: any[] = [...SEED_COUPONS];

// Customer: Validate and calculate discount
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  const { code, cartTotal } = req.body;

  if (!code) {
    res.status(400).json({ success: false, message: 'Please provide a promo code' });
    return;
  }

  const cleanCode = String(code).trim().toUpperCase();

  try {
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
    if (coupon) {
      if (coupon.minOrderAmount && Number(cartTotal) < coupon.minOrderAmount) {
        res.status(400).json({
          success: false,
          message: `Minimum order amount of $${coupon.minOrderAmount} AUD required for code ${cleanCode}`,
        });
        return;
      }

      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((Number(cartTotal) * coupon.discountValue) / 100);
      } else {
        discountAmount = Math.min(coupon.discountValue, Number(cartTotal));
      }

      res.json({
        success: true,
        data: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount,
          description: coupon.description,
        },
      });
      return;
    }
  } catch (e) {
    // fallback
  }

  const matched = inMemoryCoupons.find((c) => c.code === cleanCode && c.isActive);
  if (!matched) {
    res.status(404).json({ success: false, message: 'Invalid or expired promotional code' });
    return;
  }

  if (matched.minOrderAmount && Number(cartTotal) < matched.minOrderAmount) {
    res.status(400).json({
      success: false,
      message: `Minimum order of $${matched.minOrderAmount} AUD required for code ${cleanCode}`,
    });
    return;
  }

  let discountAmount = 0;
  if (matched.discountType === 'percentage') {
    discountAmount = Math.round((Number(cartTotal) * matched.discountValue) / 100);
  } else {
    discountAmount = Math.min(matched.discountValue, Number(cartTotal));
  }

  res.json({
    success: true,
    data: {
      code: matched.code,
      discountType: matched.discountType,
      discountValue: matched.discountValue,
      discountAmount,
      description: matched.description,
    },
  });
};

// Admin: Get all coupons
export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const docs = await Coupon.find().sort({ createdAt: -1 });
    if (docs && docs.length > 0) {
      res.json({ success: true, data: docs });
      return;
    }
  } catch (e) {
    // fallback
  }

  res.json({ success: true, data: inMemoryCoupons });
};

// Admin: Create new coupon
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  const { code, description, discountType, discountValue, minOrderAmount } = req.body;

  if (!code || !discountValue) {
    res.status(400).json({ success: false, message: 'Code and discount value are required' });
    return;
  }

  const newPayload = {
    code: String(code).trim().toUpperCase(),
    description,
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrderAmount: Number(minOrderAmount) || 0,
    isActive: true,
    usageCount: 0,
    createdAt: new Date(),
  };

  try {
    const doc = await Coupon.create(newPayload);
    res.status(201).json({ success: true, data: doc });
    return;
  } catch (e) {
    const local = {
      _id: `coup_${Date.now()}`,
      ...newPayload,
      createdAt: new Date().toISOString(),
    };
    inMemoryCoupons.unshift(local);
    res.status(201).json({ success: true, data: local });
  }
};

// Admin: Toggle active status or delete
export const toggleCouponStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      await coupon.save();
      res.json({ success: true, data: coupon });
      return;
    }
  } catch (e) {
    // fallback
  }

  const idx = inMemoryCoupons.findIndex((c) => c._id === id);
  if (idx !== -1) {
    inMemoryCoupons[idx].isActive = !inMemoryCoupons[idx].isActive;
    res.json({ success: true, data: inMemoryCoupons[idx] });
    return;
  }

  res.status(404).json({ success: false, message: 'Coupon not found' });
};
