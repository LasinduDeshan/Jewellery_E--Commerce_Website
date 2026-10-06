import { Router } from 'express';
import {
  createCustomRequest,
  getCustomRequests,
  getCustomRequestById,
  updateCustomRequestStatus,
} from '../controllers/customRequest.controller.js';

const router = Router();

// Public route to submit a bespoke quote request
router.post('/', createCustomRequest);

// Admin routes to view and manage requests
router.get('/', getCustomRequests);
router.get('/:id', getCustomRequestById);
router.patch('/:id', updateCustomRequestStatus);

export default router;
