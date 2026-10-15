import { Router } from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCouponStatus,
} from '../controllers/coupon.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public: Validate coupon at cart/checkout
router.post('/validate', validateCoupon);

// Admin: Manage coupons
router.get('/', authenticate, authorizeAdmin, getAllCoupons);
router.post('/', authenticate, authorizeAdmin, createCoupon);
router.patch('/:id/toggle', authenticate, authorizeAdmin, toggleCouponStatus);

export default router;
