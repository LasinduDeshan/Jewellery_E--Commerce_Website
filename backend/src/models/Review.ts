import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  customerName?: string;
  title?: string;
  photos?: string[];
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },

    customerName: {
      type: String,
      trim: true,
      default: 'Verified Buyer',
    },

    title: {
      type: String,
      trim: true,
      default: 'Verified Review',
    },

    photos: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },

    verifiedPurchase: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// A customer can review a particular product once per order (sparse for unlinked reviews)
ReviewSchema.index(
  { product: 1, user: 1, order: 1 },
  { unique: true, sparse: true }
);

ReviewSchema.index({ isApproved: 1, createdAt: -1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ product: 1, isApproved: 1 });
ReviewSchema.index({ user: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
