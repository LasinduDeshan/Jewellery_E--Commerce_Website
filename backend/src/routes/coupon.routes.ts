import { Router } from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCouponStatus,
} from '../controllers/coupon.controller.js';

const router = Router();

// Public: Validate coupon at cart/checkout
router.post('/validate', validateCoupon);

// Admin: Manage coupons
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.patch('/:id/toggle', toggleCouponStatus);

export default router;
