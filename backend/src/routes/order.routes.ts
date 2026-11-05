import { Router } from 'express';
import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderTracking,
  confirmOrderDelivery,
} from '../controllers/order.controller.js';
import { optionalAuthenticate, authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Admin: List all orders with filters & search
router.get('/', authenticate, authorizeAdmin, getAllOrders);

// Customer: My orders
router.get('/my-orders', authenticate, getMyOrders);

// Single order details
router.get('/:id', optionalAuthenticate, getOrderById);

// Create order
router.post('/', optionalAuthenticate, createOrder);

// Admin manual status & tracking update (Section 5.4)
router.patch('/:id/tracking', authenticate, authorizeAdmin, updateOrderTracking);

// Customer confirm delivery of package to unlock reviews
router.patch('/:id/confirm-delivery', authenticate, confirmOrderDelivery);

export default router;
