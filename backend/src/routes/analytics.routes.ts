import { Router } from 'express';
import { getAnalyticsOverview } from '../controllers/analytics.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/overview',
  authenticate,
  authorizeAdmin,
  getAnalyticsOverview
);

export default router;
