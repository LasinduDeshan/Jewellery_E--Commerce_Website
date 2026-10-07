import { Product, IProduct } from '../models/Product.js';

export interface ProductFilters {
  search?: string;
  category?: string;
  gender?: string;
  metal?: string;
  gemstone?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const createProduct = async (
  productData: Partial<IProduct>
): Promise<IProduct> => {
  const product = await Product.create(productData);

  return product;
};

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<{
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const {
    search,
    category,
    gender,
    metal,
    gemstone,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  const query: Record<string, any> = {
    isActive: true,
  };

  // -----------------------------------------
  // Search
  // -----------------------------------------

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  // -----------------------------------------
  // Category
  // -----------------------------------------

  if (category) {
    query.category = category;
  }

  // -----------------------------------------
  // Gender
  // -----------------------------------------

  if (gender) {
    if (gender === 'women') {
      query.gender = { $in: ['women', 'unisex'] };
    } else if (gender === 'men') {
      query.gender = { $in: ['men', 'unisex'] };
    } else {
      query.gender = gender;
    }
  }

  // -----------------------------------------
  // Metal
  // -----------------------------------------

  if (metal) {
    query['metal.type'] = metal;
  }

  // -----------------------------------------
  // Gemstone
  // -----------------------------------------

  if (gemstone) {
    query['gemstone.type'] = {
      $regex: gemstone,
      $options: 'i',
    };
  }

  // -----------------------------------------
  // Price range
  // -----------------------------------------

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      query.price.$lte = maxPrice;
    }
  }

  // -----------------------------------------
  // Pagination
  // -----------------------------------------

  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.min(100, Math.max(1, Number(limit)));

  const skip = (currentPage - 1) * currentLimit;

  // -----------------------------------------
  // Sorting
  // -----------------------------------------

  let sortOption: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  switch (sort) {
    case 'price-low-high':
      sortOption = { price: 1 };
      break;

    case 'price-high-low':
      sortOption = { price: -1 };
      break;

    case 'name-a-z':
      sortOption = { name: 1 };
      break;

    case 'name-z-a':
      sortOption = { name: -1 };
      break;

    case 'oldest':
      sortOption = { createdAt: 1 };
      break;

    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  // -----------------------------------------
  // Execute queries
  // -----------------------------------------

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(currentLimit),

    Product.countDocuments(query),
  ]);

  return {
    products,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(total / currentLimit),
  };
};

export const getProductById = async (
  id: string
): Promise<IProduct | null> => {
  return Product.findById(id);
};

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  return Product.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  });
};

export const updateProduct = async (
  id: string,
  productData: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(
    id,
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteProduct = async (
  id: string
): Promise<IProduct | null> => {
  // Soft delete instead of permanently deleting the product.
  return Product.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};