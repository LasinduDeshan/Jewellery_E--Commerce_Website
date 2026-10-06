import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomRequest extends Document {
  ticketId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  country: string;
  preferredContactMethod: 'email' | 'whatsapp' | 'phone';
  jewelleryType: 'ring' | 'necklace' | 'earrings' | 'bracelet';
  metalPreference: string;
  sapphireColor: string;
  cutPreference: string;
  size?: string;
  budgetRange?: string;
  occasion?: string;
  referenceImages: string[];
  specialInstructions?: string;
  status: 'New' | 'Under Review' | 'Quote Sent' | 'Customer Approved' | 'In Production' | 'Completed' | 'Declined';
  adminNotes?: string;
  quotedPrice?: number;
  quotedCurrency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      default: () => `CR-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    country: { type: String, required: true, default: 'United States' },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'whatsapp', 'phone'],
      default: 'whatsapp',
    },
    jewelleryType: {
      type: String,
      required: true,
      enum: ['ring', 'necklace', 'earrings', 'bracelet'],
    },
    metalPreference: { type: String, required: true },
    sapphireColor: { type: String, required: true },
    cutPreference: { type: String, required: true },
    size: { type: String },
    budgetRange: { type: String },
    occasion: { type: String },
    referenceImages: [{ type: String }],
    specialInstructions: { type: String },
    status: {
      type: String,
      enum: ['New', 'Under Review', 'Quote Sent', 'Customer Approved', 'In Production', 'Completed', 'Declined'],
      default: 'New',
    },
    adminNotes: { type: String },
    quotedPrice: { type: Number },
    quotedCurrency: { type: String, default: 'USD' },
  },
  { timestamps: true }
);

export const CustomRequest = mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);
