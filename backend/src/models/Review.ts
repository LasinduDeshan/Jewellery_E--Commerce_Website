import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: string;
  productName: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  photos: string[]; // Customer photo upload urls
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approved or moderated
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
