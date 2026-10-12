import mongoose, { Schema, Document } from 'mongoose';

export interface IContentSection {
  title: string;
  subtitle?: string;
  body: string;
  imageUrl?: string;
  quote?: string;
  author?: string;
}

export interface IContent extends Document {
  slug: string; // 'our-story', 'shipping-policy', 'faq'
  pageTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl?: string;
  sections: IContentSection[];
  metaDescription?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSectionSchema = new Schema<IContentSection>(
  {
    title: { type: String, required: true },
    subtitle: String,
    body: { type: String, required: true },
    imageUrl: String,
    quote: String,
    author: String,
  },
  { _id: false }
);

const ContentSchema = new Schema<IContent>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    heroHeadline: {
      type: String,
      required: true,
    },
    heroSubheadline: {
      type: String,
      required: true,
    },
    heroImageUrl: {
      type: String,
    },
    sections: {
      type: [ContentSectionSchema],
      default: [],
    },
    metaDescription: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
