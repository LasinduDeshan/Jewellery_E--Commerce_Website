import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order, IOrder } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

let inMemoryOrders: any[] = [];

// Admin: Get all orders with search and filter
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, search, limit = 50 } = req.query;

  let orders: any[] = [];

  try {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
      ];
    }

    orders = await Order.find(query).sort({ createdAt: -1 }).limit(Number(limit));

    // Real database orders only

  } catch (error) {
    orders = inMemoryOrders.filter((ord) => {
      let matches = true;
      if (status && status !== 'all') {
        matches = matches && ord.status === status;
      }
      if (search) {
        const s = String(search).toLowerCase();
        matches =
          matches &&
          (ord.orderNumber.toLowerCase().includes(s) ||
            ord.customerName.toLowerCase().includes(s) ||
            ord.customerEmail.toLowerCase().includes(s) ||
            (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(s)));
      }
      return matches;
    });
  }

  res.status(200).json(ApiResponse.success(orders));
});

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  let orders: any[] = [];
  try {
    orders = await Order.find({ user: req.user?.userId }).sort({ createdAt: -1 });
    // Real database orders only

  } catch (e) {
    orders = inMemoryOrders;
  }
  res.status(200).json(ApiResponse.success(orders));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  let order: any;
  try {
    order = await Order.findOne({
      $or: [{ _id: id }, { orderNumber: id }],
    });
  } catch (e) {
    order = inMemoryOrders.find((o) => o._id === id || o.orderNumber === id);
  }

  if (!order) {
    order = inMemoryOrders.find((o) => o._id === id || o.orderNumber === id);
  }

  if (!order) {
    throw new ApiError(404, 'Order not found');
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
    couponCode,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'Order items cannot be empty');
  }

  let appliedCouponCode: string | undefined;
  let discountAmount = 0;

  if (couponCode) {
    const cleanCode = String(couponCode).trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code: cleanCode,
      isActive: true,
      $and: [
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } },
          ],
        },
        {
          $or: [
            { usageLimit: { $exists: false } },
            { usageLimit: null },
            { $expr: { $lt: ['$usageCount', '$usageLimit'] } },
          ],
        },
      ],
    });

    if (!coupon) {
      throw new ApiError(400, 'Invalid, expired, or exhausted coupon');
    }

    const subtotal = Number(itemsPrice);

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      throw new ApiError(400, 'A valid order subtotal is required');
    }

    if (subtotal < (coupon.minOrderAmount ?? 0)) {
      throw new ApiError(
        400,
        `Minimum order amount of AUD ${coupon.minOrderAmount} required`
      );
    }

    discountAmount =
      coupon.discountType === 'percentage'
        ? Math.round((subtotal * coupon.discountValue) / 100 * 100) / 100
        : Math.min(coupon.discountValue, subtotal);

    appliedCouponCode = coupon.code;
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

  let order: any;

  const orderPayload = {
    user: req.user?.userId || 'user_guest',
    customerName: shippingAddress?.fullName || 'Valued Customer',
    customerEmail: req.user?.email || 'customer@example.com',
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'CreditCard',
    itemsPrice,
    shippingPrice,
    dutyEstimated,
    couponCode: appliedCouponCode,
    discountAmount,
    totalPrice: Math.max(
      0,
      Number(totalPrice ?? (Number(itemsPrice) + Number(shippingPrice) + Number(dutyEstimated))) -
        discountAmount
    ),
    currency,
    status: 'Processing',
    timeline: initialTimeline,
  };

  if (appliedCouponCode) {
    // Coupon orders must be saved in MongoDB; never use the
    // in-memory fallback for a coupon redemption.
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Atomically reserve one use, provided the coupon is
        // still active, unexpired and below its usage limit.
        const redeemedCoupon = await Coupon.findOneAndUpdate(
          {
            code: appliedCouponCode,
            isActive: true,
            $and: [
              {
                $or: [
                  { expiryDate: { $exists: false } },
                  { expiryDate: null },
                  { expiryDate: { $gt: new Date() } },
                ],
              },
              {
                $or: [
                  { usageLimit: { $exists: false } },
                  { usageLimit: null },
                  { $expr: { $lt: ['$usageCount', '$usageLimit'] } },
                ],
              },
            ],
          },
          { $inc: { usageCount: 1 } },
          { new: true, session }
        );

        if (!redeemedCoupon) {
          throw new ApiError(
            400,
            'Coupon is no longer available. Please validate it again.'
          );
        }

        const createdOrders = await Order.create([orderPayload], {
          session,
        });

        order = createdOrders[0];
      });
    } finally {
      await session.endSession();
    }
  } else {
    // Preserve the existing non-coupon order behaviour for now.
    try {
      order = await Order.create(orderPayload);
    } catch (error) {
      order = {
        _id: `ord_${Date.now()}`,
        orderNumber: `AJ-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        ...orderPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryOrders.unshift(order);
    }
  }

  res.status(201).json(
    ApiResponse.success(order, 'Order created successfully')
  );
});

// Admin Endpoint: Update manual courier tracking & NGJA status (Section 5.4)
export const updateOrderTracking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, isNgjaCleared, trackingNumber, courierPartner, trackingUrl, estimatedDeliveryDate, adminNotes } =
    req.body;

  let order: any;
  try {
    order = await Order.findById(id);
  } catch (e) {
    order = inMemoryOrders.find((o) => o._id === id || o.orderNumber === id);
  }

  if (!order) {
    order = inMemoryOrders.find((o) => o._id === id || o.orderNumber === id);
  }

  if (!order) throw new ApiError(404, 'Order not found');

  if (status) order.status = status;
  if (isNgjaCleared !== undefined) {
    order.isNgjaCleared = isNgjaCleared;
    if (isNgjaCleared) order.ngjaClearanceDate = new Date();
  }
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (estimatedDeliveryDate !== undefined) order.estimatedDeliveryDate = estimatedDeliveryDate;
  if (adminNotes !== undefined) order.adminNotes = adminNotes;

  // Auto-generate courier tracking URL if not explicitly provided
  if (order.trackingNumber && !order.trackingUrl) {
    if (order.courierPartner === 'DHL Express') {
      order.trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`;
    } else if (order.courierPartner === 'FedEx International') {
      order.trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`;
    } else if (order.courierPartner === 'Australia Post Global') {
      order.trackingUrl = `https://auspost.com.au/mypost/track/#/details/${order.trackingNumber}`;
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

  if (order.timeline && Array.isArray(order.timeline)) {
    order.timeline.forEach((step: any) => {
      const stepIdx = statusesOrder.indexOf(step.status);
      if (stepIdx <= currentIndex && currentIndex !== -1) {
        step.isCompleted = true;
      }
    });
  }

  try {
    if (typeof order.save === 'function') {
      await order.save();
    }
  } catch (e) {
    // handled in-memory
  }

  // Also update inMemoryOrders if it exists there
  const memIdx = inMemoryOrders.findIndex((o) => o._id === id || o.orderNumber === id);
  if (memIdx > -1) {
    inMemoryOrders[memIdx] = {
      ...inMemoryOrders[memIdx],
      status: order.status,
      isNgjaCleared: order.isNgjaCleared,
      ngjaClearanceDate: order.ngjaClearanceDate,
      trackingNumber: order.trackingNumber,
      courierPartner: order.courierPartner,
      trackingUrl: order.trackingUrl,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      adminNotes: order.adminNotes,
      timeline: order.timeline,
      updatedAt: new Date(),
    };
  }

  res.status(200).json(ApiResponse.success(order, 'Order tracking updated successfully'));
});
