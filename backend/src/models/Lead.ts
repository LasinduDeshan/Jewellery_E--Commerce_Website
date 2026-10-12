import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadItem {
  productId?: string;
  title: string;
  metal: string;
  gemstone: string;
  size?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ILead extends Document {
  ticketId: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  source: 'Cart WhatsApp Checkout' | 'Product Consultation' | 'Direct Chat';
  cartItems: ILeadItem[];
  totalAmount: number;
  currency: 'AUD';
  status: 'New' | 'Contacted' | 'Quoted' | 'Converted' | 'Lost';
  adminNotes?: string;
  whatsappDirectUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadItemSchema = new Schema<ILeadItem>(
  {
    productId: String,
    title: { type: String, required: true },
    metal: { type: String, default: 'Sterling Silver' },
    gemstone: { type: String, default: 'Ceylon Sapphire' },
    size: String,
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    image: String,
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      enum: ['Cart WhatsApp Checkout', 'Product Consultation', 'Direct Chat'],
      default: 'Cart WhatsApp Checkout',
    },
    cartItems: {
      type: [LeadItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'AUD',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'],
      default: 'New',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    whatsappDirectUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
