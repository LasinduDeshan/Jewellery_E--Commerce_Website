import { Router } from 'express';
import customRequestRoutes from './customRequest.routes.js';

const router = Router();

router.use('/custom-requests', customRequestRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
