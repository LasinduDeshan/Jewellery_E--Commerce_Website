import { Response } from 'express';
import { Order, IOrder } from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user?.userId }).sort({ createdAt: -1 });
  res.status(200).json(ApiResponse.success(orders));
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const order = await Order.findOne({
    $or: [{ _id: id }, { orderNumber: id }],
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Check authorization
  if (order.user.toString() !== req.user?.userId && req.user?.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: You do not have access to this order');
  }

  res.status(200).json(ApiResponse.success(order));
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice = 0,
    dutyEstimated = 0,
    totalPrice,
    currency = 'AUD',
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'Order items cannot be empty');
  }

  const initialTimeline = [
    {
      status: 'Processing',
      title: 'Order Placed & Confirmed',
      description: 'Your payment was confirmed and your jewellery order was received by our Colombo atelier.',
      timestamp: new Date(),
      isCompleted: true,
    },
    {
      status: 'Gem Setting & Inspection',
      title: 'Artisanal Setting & QC',
      description: 'Our hereditary master setting bench is crafting and inspecting your piece.',
      timestamp: new Date(),
      isCompleted: false,
    },
    {
      status: 'Pending NGJA Export Clearance',
      title: 'Sri Lanka NGJA Appraisal',
      description: 'National Gem & Jewellery Authority verification and export permit issuance in Sri Lanka.',
      timestamp: new Date(),
      isCompleted: false,
    },
    {
      status: 'Shipped',
      title: 'Dispatched with International Courier',
      description: 'Handed over to courier with full transit insurance.',
      timestamp: new Date(),
      isCompleted: false,
    },
    {
      status: 'Delivered',
      title: 'Delivered to Your Doorstep',
      description: 'Signature required delivery.',
      timestamp: new Date(),
      isCompleted: false,
    },
  ];

  const order = await Order.create({
    user: req.user?.userId,
    customerName: shippingAddress?.fullName || 'Valued Customer',
    customerEmail: req.user?.email || '',
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'CreditCard',
    itemsPrice,
    shippingPrice,
    dutyEstimated,
    totalPrice,
    currency,
    status: 'Processing',
    timeline: initialTimeline,
  });

  res.status(201).json(ApiResponse.success(order, 'Order created successfully'));
});

// Admin Endpoint: Update manual courier tracking & NGJA status (Section 5.4)
export const updateOrderTracking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, isNgjaCleared, trackingNumber, courierPartner, trackingUrl, estimatedDeliveryDate, adminNotes } =
    req.body;

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (status) order.status = status;
  if (isNgjaCleared !== undefined) {
    order.isNgjaCleared = isNgjaCleared;
    if (isNgjaCleared) order.ngjaClearanceDate = new Date();
  }
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (estimatedDeliveryDate) order.estimatedDeliveryDate = estimatedDeliveryDate;
  if (adminNotes !== undefined) order.adminNotes = adminNotes;

  // Auto-generate DHL tracking link if DHL
  if (trackingNumber && !trackingUrl) {
    if (order.courierPartner === 'DHL Express') {
      order.trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
    } else if (order.courierPartner === 'FedEx International') {
      order.trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    } else if (order.courierPartner === 'Australia Post Global') {
      order.trackingUrl = `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`;
    }
  }

  // Update timeline flags based on current status
  const statusesOrder = [
    'Processing',
    'Gem Setting & Inspection',
    'Pending NGJA Export Clearance',
    'Shipped',
    'Delivered',
  ];
  const currentIndex = statusesOrder.indexOf(order.status);

  order.timeline.forEach((step) => {
    const stepIdx = statusesOrder.indexOf(step.status);
    if (stepIdx <= currentIndex && currentIndex !== -1) {
      step.isCompleted = true;
    }
  });

  await order.save();

  res.status(200).json(ApiResponse.success(order, 'Order tracking updated successfully'));
});
