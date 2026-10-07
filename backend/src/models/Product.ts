import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface IProductCertificate {
  available: boolean;
  url?: string;
  certificateNumber?: string;
  issuer?: string;
}

export interface IProductMedia {
  videoUrl?: string;
  view360Url?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;

  category:
    | 'necklaces'
    | 'rings'
    | 'engagement-promise-rings'
    | 'bracelets'
    | 'earrings';

  gender: 'women' | 'men' | 'unisex';

  metal: {
    type: 'silver' | 'rose-gold';
    purity: string;
  };

  gemstone: {
    type: string;
    carat?: number;
  };

  weight?: {
    value: number;
    unit: 'g' | 'mg';
  };

  dimensions?: {
    description?: string;
    ringSizes?: string[];
    chainLengths?: string[];
  };

  price: number;
  currency: 'AUD';

  stockQuantity: number;

  images: IProductImage[];

  media?: IProductMedia;

  certificate?: IProductCertificate;

  description: string;
  careInstructions: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
    },

    sortOrder: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const ProductCertificateSchema = new Schema<IProductCertificate>(
  {
    available: {
      type: Boolean,
      default: false,
    },

    url: {
      type: String,
      trim: true,
    },

    certificateNumber: {
      type: String,
      trim: true,
    },

    issuer: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ProductMediaSchema = new Schema<IProductMedia>(
  {
    videoUrl: {
      type: String,
      trim: true,
    },

    view360Url: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    // --------------------------------------------------
    // Basic Product Information
    // --------------------------------------------------

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // --------------------------------------------------
    // Product Classification
    // --------------------------------------------------

    category: {
      type: String,
      required: true,
      enum: [
        'necklaces',
        'rings',
        'engagement-promise-rings',
        'bracelets',
        'earrings',
      ],
    },

    gender: {
      type: String,
      required: true,
      enum: ['women', 'men', 'unisex'],
    },

    // --------------------------------------------------
    // Metal Information
    // --------------------------------------------------

    metal: {
      type: {
        type: String,
        required: true,
        enum: ['silver', 'rose-gold'],
      },

      purity: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // --------------------------------------------------
    // Gemstone Information
    // --------------------------------------------------

    gemstone: {
      type: {
        type: String,
        required: true,
        trim: true,
      },

      carat: {
        type: Number,
        min: 0,
      },
    },

    // --------------------------------------------------
    // Weight
    // --------------------------------------------------

    weight: {
      value: {
        type: Number,
        min: 0,
      },

      unit: {
        type: String,
        enum: ['g', 'mg'],
        default: 'g',
      },
    },

    // --------------------------------------------------
    // Dimensions / Size Options
    // --------------------------------------------------

    dimensions: {
      description: {
        type: String,
        trim: true,
      },

      ringSizes: [
        {
          type: String,
          trim: true,
        },
      ],

      chainLengths: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    // --------------------------------------------------
    // Selling Information
    // --------------------------------------------------

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ['AUD'],
      default: 'AUD',
      required: true,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // --------------------------------------------------
    // Product Images
    // --------------------------------------------------

    images: {
      type: [ProductImageSchema],
      required: true,

      validate: {
        validator: (images: IProductImage[]) =>
          Array.isArray(images) && images.length >= 4,

        message: 'A product must have at least 4 images.',
      },
    },

    // --------------------------------------------------
    // Video / 360 Degree View
    // --------------------------------------------------

    media: {
      type: ProductMediaSchema,
      default: undefined,
    },

    // --------------------------------------------------
    // Certification
    // --------------------------------------------------

    certificate: {
      type: ProductCertificateSchema,
      default: undefined,
    },

    // --------------------------------------------------
    // Product Story / Care
    // --------------------------------------------------

    description: {
      type: String,
      required: true,
      trim: true,
    },

    careInstructions: {
      type: String,
      required: true,
      trim: true,
    },

    // --------------------------------------------------
    // Product Visibility
    // --------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ------------------------------------------------------
// Indexes
// ------------------------------------------------------

// Search product name and description
ProductSchema.index({
  name: 'text',
  description: 'text',
});

// Filtering
ProductSchema.index({ category: 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ 'metal.type': 1 });
ProductSchema.index({ 'gemstone.type': 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stockQuantity: 1 });

export const Product = mongoose.model<IProduct>(
  'Product',
  ProductSchema
);