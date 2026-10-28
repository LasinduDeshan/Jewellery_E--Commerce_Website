import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { CustomRequest } from '../models/CustomRequest.js';
import { Lead } from '../models/Lead.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';

export const getAnalyticsOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Fetch real orders from database
    const orders = await Order.find().sort({ createdAt: -1 });
    const ordersCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingNgjaCount = orders.filter((o) => !o.isNgjaCleared && o.status !== 'Delivered').length;

    // 2. Fetch real counts
    const customQuotesCount = await CustomRequest.countDocuments();
    const leadsCount = await Lead.countDocuments();
    const productsCount = await Product.countDocuments({ isActive: true });

    // 3. Compute real Top Selling Items from order line-items
    const productSalesMap = new Map<string, { name: string; category: string; unitsSold: number; revenueAUD: number; image?: string }>();

    for (const ord of orders) {
      if (Array.isArray(ord.orderItems)) {
        for (const it of ord.orderItems) {
          const key = it.title || 'Sapphire Jewellery';
          const existing = productSalesMap.get(key) || {
            name: it.title,
            category: it.gemstone || it.metal || 'Jewellery',
            unitsSold: 0,
            revenueAUD: 0,
            image: it.image,
          };
          existing.unitsSold += it.quantity || 1;
          existing.revenueAUD += (it.price || 0) * (it.quantity || 1);
          if (!existing.image && it.image) existing.image = it.image;
          productSalesMap.set(key, existing);
        }
      }
    }

    const topSellingItems = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenueAUD - a.revenueAUD)
      .slice(0, 5);

    // 4. Compute real Recent Activity across collections
    const recentActivity: Array<{ id: string; time: string; title: string; subtitle: string; type: string; timestamp: number }> = [];

    // Recent orders
    for (const ord of orders.slice(0, 3)) {
      const created = ord.createdAt ? new Date(ord.createdAt) : new Date();
      recentActivity.push({
        id: `ord-${ord._id}`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Order #${ord.orderNumber} placed`,
        subtitle: `${ord.customerName} • $${ord.totalPrice} ${ord.currency} • ${ord.status}`,
        type: ord.status === 'Shipped' ? 'shipping' : 'order',
        timestamp: created.getTime(),
      });
    }

    // Recent custom requests
    const recentQuotes = await CustomRequest.find().sort({ createdAt: -1 }).limit(3);
    for (const q of recentQuotes) {
      const created = q.createdAt ? new Date(q.createdAt) : new Date();
      recentActivity.push({
        id: `quote-${q._id}`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Bespoke Quote #${q.ticketId}`,
        subtitle: `${q.fullName} • ${q.sapphireColor || 'Sapphire'} ${q.jewelleryType} • ${q.status}`,
        type: 'quote',
        timestamp: created.getTime(),
      });
    }

    // Recent WhatsApp leads
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(3);
    for (const l of recentLeads) {
      const created = l.createdAt ? new Date(l.createdAt) : new Date();
      recentActivity.push({
        id: `lead-${l._id}`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `WhatsApp Lead #${l.ticketId}`,
        subtitle: `${l.customerName} • ${l.phoneNumber} • ${l.status}`,
        type: 'whatsapp',
        timestamp: created.getTime(),
      });
    }

    // Recent Reviews
    const recentReviews = await Review.find().sort({ createdAt: -1 }).limit(3).populate('product', 'name');
    for (const r of recentReviews) {
      const created = r.createdAt ? new Date(r.createdAt) : new Date();
      recentActivity.push({
        id: `rev-${r._id}`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `${r.rating}-Star Review submitted`,
        subtitle: `"${r.comment.slice(0, 60)}..."`,
        type: 'review',
        timestamp: created.getTime(),
      });
    }

    // Sort combined activities by timestamp descending
    recentActivity.sort((a, b) => b.timestamp - a.timestamp);

    // 5. Compute real Actionable Operational Notifications (only genuine pending work)
    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      timestamp: number;
      type: 'order' | 'custom-request' | 'lead' | 'review' | 'inventory';
      link: string;
    }> = [];

    // Only orders waiting for NGJA clearance that are still active
    const pendingNgjaOrders = orders.filter((o) => !o.isNgjaCleared && o.status !== 'Delivered' && o.status !== 'Cancelled');
    for (const ord of pendingNgjaOrders) {
      const created = ord.createdAt ? new Date(ord.createdAt) : new Date();
      notifications.push({
        id: `notif-ngja-${ord._id}`,
        title: `Order Pending NGJA Clearance`,
        message: `Order #${ord.orderNumber} ($${ord.totalPrice} ${ord.currency}) requires Colombo appraisal seal.`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: created.getTime(),
        type: 'order',
        link: '/admin/orders',
      });
    }

    // New custom quote inquiries awaiting admin response
    const pendingQuotes = await CustomRequest.find({ status: 'New' }).sort({ createdAt: -1 });
    for (const q of pendingQuotes) {
      const created = q.createdAt ? new Date(q.createdAt) : new Date();
      notifications.push({
        id: `notif-quote-${q._id}`,
        title: `New Bespoke Sapphire Request`,
        message: `${q.fullName} submitted custom request #${q.ticketId} for ${q.sapphireColor || 'Ceylon Sapphire'} ${q.jewelleryType}.`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: created.getTime(),
        type: 'custom-request',
        link: '/admin/custom-requests',
      });
    }


    // Customer reviews awaiting moderation approval
    const pendingReviews = await Review.find({ isApproved: false }).populate('user', 'name email').sort({ createdAt: -1 });
    for (const r of pendingReviews) {
      const created = r.createdAt ? new Date(r.createdAt) : new Date();
      const reviewerName = (r.user as any)?.name || 'Customer';
      notifications.push({
        id: `notif-rev-${r._id}`,
        title: `Customer Review for Moderation`,
        message: `${reviewerName} submitted a ${r.rating}-star review awaiting approval.`,
        time: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: created.getTime(),
        type: 'review',
        link: '/admin/reviews',
      });
    }

    // Low stock alerts
    const lowStockProducts = await Product.find({ isActive: true, countInStock: { $lte: 2, $gt: 0 } });
    for (const p of lowStockProducts) {
      notifications.push({
        id: `notif-stock-${p._id}`,
        title: `Low Stock Alert`,
        message: `${p.name} stock level is down to ${p.countInStock} units.`,
        time: 'Low Stock',
        timestamp: Date.now(),
        type: 'inventory',
        link: '/admin/products',
      });
    }

    notifications.sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      success: true,
      data: {
        totalRevenueAUD: totalRevenue,
        totalOrders: ordersCount,
        pendingNgjaClearance: pendingNgjaCount,
        activeCatalogueProducts: productsCount,
        customQuotesTotal: customQuotesCount,
        whatsAppLeadsTotal: leadsCount,
        topSellingItems,
        recentActivity: recentActivity.slice(0, 8),
        notifications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error compiling analytics overview' });
  }
};
