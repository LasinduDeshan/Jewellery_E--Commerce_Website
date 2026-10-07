import { Router } from 'express';

import customRequestRoutes from './customRequest.routes.js';
import productRoutes from './product.routes.js';

const router = Router();

router.use('/custom-requests', customRequestRoutes);

router.use('/products', productRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
