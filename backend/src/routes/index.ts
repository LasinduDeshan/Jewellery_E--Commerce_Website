import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import customRequestRoutes from './customRequest.routes.js';
import productRoutes from './product.routes.js';
import reviewRoutes from './review.routes.js';
import leadRoutes from './lead.routes.js';
import couponRoutes from './coupon.routes.js';
import contentRoutes from './content.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/orders', orderRoutes);
router.use('/custom-requests', customRequestRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/leads', leadRoutes);
router.use('/coupons', couponRoutes);
router.use('/content', contentRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
