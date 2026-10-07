import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product?: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
  currency: string;
  image: string;
  metal?: string;
  gemstone?: string;
  size?: string;
}

export interface IOrderTimelineStep {
  status: string;
  title: string;
  description: string;
  timestamp: Date;
  isCompleted: boolean;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  orderItems: IOrderItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  paymentMethod: 'CreditCard' | 'Stripe' | 'PayPal' | 'WhatsAppOrder';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  itemsPrice: number;
  shippingPrice: number;
  dutyEstimated: number;
  totalPrice: number;
  currency: 'AUD' | 'USD';
  status:
    | 'Processing'
    | 'Gem Setting & Inspection'
    | 'Pending NGJA Export Clearance'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  isNgjaCleared: boolean;
  ngjaClearanceDate?: Date;
  trackingNumber?: string;
  courierPartner?: 'DHL Express' | 'FedEx International' | 'Australia Post Global' | 'Other';
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  timeline: IOrderTimelineStep[];
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    currency: { type: String, default: 'AUD' },
    image: { type: String, required: true },
    metal: { type: String },
    gemstone: { type: String },
    size: { type: String },
  },
  { _id: false }
);

const OrderTimelineStepSchema = new Schema<IOrderTimelineStep>(
  {
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `AJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Australia' },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['CreditCard', 'Stripe', 'PayPal', 'WhatsAppOrder'],
      default: 'CreditCard',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Paid',
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    dutyEstimated: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: ['AUD', 'USD'], default: 'AUD' },
    status: {
      type: String,
      enum: [
        'Processing',
        'Gem Setting & Inspection',
        'Pending NGJA Export Clearance',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Processing',
    },
    isNgjaCleared: { type: Boolean, default: false },
    ngjaClearanceDate: { type: Date },
    trackingNumber: { type: String },
    courierPartner: {
      type: String,
      enum: ['DHL Express', 'FedEx International', 'Australia Post Global', 'Other'],
      default: 'DHL Express',
    },
    trackingUrl: { type: String },
    estimatedDeliveryDate: { type: String },
    timeline: [OrderTimelineStepSchema],
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
