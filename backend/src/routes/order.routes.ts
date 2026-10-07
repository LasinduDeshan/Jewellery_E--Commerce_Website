import { Router } from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderTracking,
} from '../controllers/order.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);

// Admin manual status & tracking update
router.patch('/:id/tracking', authorizeAdmin, updateOrderTracking);

export default router;
