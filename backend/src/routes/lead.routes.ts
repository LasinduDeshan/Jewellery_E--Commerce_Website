import { Router } from 'express';
import {
  logWhatsAppInquiry,
  getAllLeads,
  updateLead,
} from '../controllers/lead.controller.js';

const router = Router();

// Log inquiry when customer clicks WhatsApp button
router.post('/whatsapp', logWhatsAppInquiry);

// Admin review & status updates
router.get('/', getAllLeads);
router.patch('/:id', updateLead);

export default router;
