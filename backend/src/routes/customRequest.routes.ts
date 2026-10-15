import { Router } from 'express';
import {
  createCustomRequest,
  getCustomRequests,
  getCustomRequestById,
  updateCustomRequestStatus,
} from '../controllers/customRequest.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public: customers can submit custom jewellery requests.
router.post('/', createCustomRequest);

// Admin only: view and manage requests.
router.get('/', authenticate, authorizeAdmin, getCustomRequests);
router.get('/:id', authenticate, authorizeAdmin, getCustomRequestById);
router.patch('/:id', authenticate, authorizeAdmin, updateCustomRequestStatus);

export default router;
