import { Router } from 'express';
import {
  logWhatsAppInquiry,
  getAllLeads,
  updateLead,
} from '../controllers/lead.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Log inquiry when customer clicks WhatsApp button
router.post('/whatsapp', logWhatsAppInquiry);

// Admin review & status updates
router.get('/', authenticate, authorizeAdmin, getAllLeads);
router.patch('/:id', authenticate, authorizeAdmin, updateLead);

export default router;
