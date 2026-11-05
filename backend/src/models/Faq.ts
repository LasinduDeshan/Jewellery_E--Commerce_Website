import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: 'customize' | 'general' | 'shipping' | 'ordering';
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['customize', 'general', 'shipping', 'ordering'],
      default: 'customize',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

FaqSchema.index({ category: 1, sortOrder: 1, isActive: 1 });

export const Faq = mongoose.models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);

