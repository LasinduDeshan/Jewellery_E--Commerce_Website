import { Request, Response } from 'express';
import { Lead } from '../models/Lead.js';

let inMemoryLeads: any[] = [];

// Customer logs WhatsApp inquiry from cart/checkout
export const logWhatsAppInquiry = async (req: Request, res: Response): Promise<void> => {
  const { customerName, phoneNumber, email, cartItems, totalAmount, source } = req.body;

  const ticketId = `WA-CART-${Math.floor(1000 + Math.random() * 9000)}`;

  const leadPayload = {
    ticketId,
    customerName: customerName || 'Inquiring Visitor',
    phoneNumber: phoneNumber || 'Direct Chat',
    email,
    source: source || 'Cart WhatsApp Checkout',
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    totalAmount: Number(totalAmount) || 0,
    currency: 'AUD' as const,
    status: 'New' as const,
    adminNotes: 'Inquiry started via WhatsApp Cart CTA',
    createdAt: new Date(),
  };

  try {
    const doc = await Lead.create(leadPayload);
    res.status(201).json({ success: true, data: doc, ticketId });
    return;
  } catch (e) {
    const local = {
      _id: `lead_${Date.now()}`,
      ...leadPayload,
      createdAt: new Date().toISOString(),
    };
    inMemoryLeads.unshift(local);
    res.status(201).json({ success: true, data: local, ticketId });
  }
};

// Admin: Get all WhatsApp Leads
export const getAllLeads = async (req: Request, res: Response): Promise<void> => {
  const { status, search } = req.query;

  try {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }
    const docs = await Lead.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: docs || [] });
    return;
  } catch (e) {
    // fallback
  }

  let list = inMemoryLeads;
  if (status && status !== 'all') {
    list = list.filter((l) => l.status === status);
  }
  if (search) {
    const s = String(search).toLowerCase();
    list = list.filter(
      (l) =>
        l.customerName.toLowerCase().includes(s) ||
        l.ticketId.toLowerCase().includes(s) ||
        l.phoneNumber.includes(s)
    );
  }
  res.json({ success: true, data: list });
};

// Admin: Update lead status or notes
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  try {
    const updated = await Lead.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );
    if (updated) {
      res.json({ success: true, data: updated });
      return;
    }
  } catch (e) {
    // fallback
  }

  const idx = inMemoryLeads.findIndex((l) => l._id === id || l.ticketId === id);
  if (idx !== -1) {
    if (status) inMemoryLeads[idx].status = status;
    if (adminNotes !== undefined) inMemoryLeads[idx].adminNotes = adminNotes;
    res.json({ success: true, data: inMemoryLeads[idx] });
    return;
  }

  res.status(404).json({ success: false, message: 'Lead not found' });
};
