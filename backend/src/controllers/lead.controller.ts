import { Request, Response } from 'express';
import { Lead } from '../models/Lead.js';

const SEED_LEADS = [
  {
    _id: 'lead_001',
    ticketId: 'WA-CART-8821',
    customerName: 'Oliver Smith',
    phoneNumber: '+61 412 345 678',
    email: 'oliver.smith@sydney.com.au',
    source: 'Cart WhatsApp Checkout',
    cartItems: [
      {
        title: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
        metal: '925 Solid Sterling Silver',
        gemstone: '1.85ct Oval Sapphire',
        size: 'US 7',
        price: 840,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 840,
    currency: 'AUD',
    status: 'New',
    adminNotes: 'Customer asked via WhatsApp if ring size can be resized if needed in Melbourne.',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    _id: 'lead_002',
    ticketId: 'WA-CART-8819',
    customerName: 'Grace Robinson',
    phoneNumber: '+61 488 901 234',
    email: 'grace.r@perth.au',
    source: 'Cart WhatsApp Checkout',
    cartItems: [
      {
        title: 'Padparadscha Lotus Blossom Pendant',
        metal: '18K Rose Gold Vermeil',
        gemstone: '1.42ct Cushion Cut',
        price: 1120,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80',
      },
    ],
    totalAmount: 1120,
    currency: 'AUD',
    status: 'Converted',
    adminNotes: 'Paid via direct international wire / invoice sent.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

let inMemoryLeads: any[] = [...SEED_LEADS];

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
    if (docs && docs.length > 0) {
      res.json({ success: true, data: docs });
      return;
    }
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
