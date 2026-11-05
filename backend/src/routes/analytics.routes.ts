import { Router } from 'express';
import { getAnalyticsOverview } from '../controllers/analytics.controller.js';
import {
  optionalAuthenticate,
} from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/overview',
  optionalAuthenticate,
  getAnalyticsOverview
);

export default router;
