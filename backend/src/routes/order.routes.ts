import { Router } from 'express';
import {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderTracking,
  confirmOrderDelivery,
} from '../controllers/order.controller.js';
import { optionalAuthenticate, authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(optionalAuthenticate);

// Admin: List all orders with filters & search
router.get('/', getAllOrders);

// Customer: My orders
router.get('/my-orders', getMyOrders);

// Single order details
router.get('/:id', getOrderById);

// Create order
router.post('/', createOrder);

// Admin manual status & tracking update (Section 5.4)
router.patch('/:id/tracking', updateOrderTracking);

// Customer confirm delivery of package to unlock reviews
router.patch('/:id/confirm-delivery', authenticate, confirmOrderDelivery);

export default router;
