import { Product, IProduct } from '../models/Product.js';
import { SEED_PRODUCTS, SeedProduct } from '../data/seedProducts.js';

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

// In-memory runtime store for new products added via admin when offline
let runtimeProducts: any[] = [...SEED_PRODUCTS];

export const createProduct = async (
  productData: any
): Promise<any> => {
  // 1. Auto-generate slug if missing
  if (!productData.slug && productData.name) {
    const base = String(productData.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const suffix = productData.sku
      ? String(productData.sku).toLowerCase().trim()
      : Math.random().toString(36).substring(2, 7);
    productData.slug = `${base}-${suffix}`;
  }

  // 2. Ensure care instructions
  if (!productData.careInstructions) {
    productData.careInstructions =
      'Clean gently with lukewarm soapy water and a soft brush. Store separately in a velvet jewellery pouch.';
  }

  // 3. Ensure images array has proper objects and sortOrder
  if (Array.isArray(productData.images)) {
    productData.images = productData.images.map((img: any, idx: number) => {
      if (typeof img === 'string') {
        return { url: img, alt: productData.name, sortOrder: idx + 1 };
      }
      return { ...img, sortOrder: img.sortOrder || idx + 1 };
    });

    const fallbackUrl =
      productData.images[0]?.url ||
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
    while (productData.images.length < 4) {
      productData.images.push({
        url: fallbackUrl,
        alt: `${productData.name} angle ${productData.images.length + 1}`,
        sortOrder: productData.images.length + 1,
      });
    }
  }

  try {
    const product = await Product.create(productData);
    console.log('✅ [MongoDB] Product created successfully:', product._id, product.name);
    return product;
  } catch (err: any) {
    console.error('❌ [MongoDB] Error in Product.create:', err.message);
    throw err;
  }
};

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<{
  products: any[];
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

  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.min(100, Math.max(1, Number(limit)));

  try {
    const query: Record<string, any> = {
      isActive: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'gemstone.type': { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (gender && gender !== 'all') {
      if (gender === 'women') {
        query.gender = { $in: ['women', 'unisex'] };
      } else if (gender === 'men') {
        query.gender = { $in: ['men', 'unisex'] };
      } else {
        query.gender = gender;
      }
    }

    if (metal && metal !== 'all') {
      query['metal.type'] = metal;
    }

    if (gemstone && gemstone !== 'all') {
      query['gemstone.type'] = {
        $regex: gemstone,
        $options: 'i',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
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

    const [dbProducts, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip((currentPage - 1) * currentLimit)
        .limit(currentLimit),
      Product.countDocuments(query),
    ]);

    const totalInDb = await Product.estimatedDocumentCount();
    if (totalInDb > 0 || (dbProducts && dbProducts.length > 0)) {
      return {
        products: dbProducts,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit) || 1,
      };
    }
  } catch (dbErr: any) {
    console.warn('⚠️ [MongoDB] Query failed or offline, falling back to seed dataset:', dbErr.message);
  }

  // Fallback to runtime / seed products with full filtering
  let filtered = runtimeProducts.filter((p) => p.isActive);

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.gemstone?.type?.toLowerCase().includes(s)
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (gender && gender !== 'all') {
    if (gender === 'women') {
      filtered = filtered.filter((p) => p.gender === 'women' || p.gender === 'unisex');
    } else if (gender === 'men') {
      filtered = filtered.filter((p) => p.gender === 'men' || p.gender === 'unisex');
    } else {
      filtered = filtered.filter((p) => p.gender === gender);
    }
  }

  if (metal && metal !== 'all') {
    filtered = filtered.filter((p) => p.metal.type === metal);
  }

  if (gemstone && gemstone !== 'all') {
    filtered = filtered.filter((p) =>
      p.gemstone.type.toLowerCase().includes(gemstone.toLowerCase())
    );
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // Sorting
  switch (sort) {
    case 'price-low-high':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high-low':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-a-z':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-z-a':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  const total = filtered.length;
  const paginated = filtered.slice(
    (currentPage - 1) * currentLimit,
    currentPage * currentLimit
  );

  return {
    products: paginated,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(total / currentLimit) || 1,
  };
};

export const getProductById = async (id: string): Promise<any | null> => {
  try {
    const product = await Product.findById(id);
    if (product) return product;
  } catch (e) {
    // ignore
  }
  return runtimeProducts.find((p) => p._id === id) || null;
};

export const getProductBySlug = async (slug: string): Promise<any | null> => {
  try {
    const product = await Product.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });
    if (product) return product;
  } catch (e) {
    // ignore
  }
  return (
    runtimeProducts.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.isActive
    ) || null
  );
};

export const getRelatedProducts = async (
  currentIdOrSlug: string,
  limit: number = 4
): Promise<any[]> => {
  const current =
    runtimeProducts.find((p) => p._id === currentIdOrSlug || p.slug === currentIdOrSlug) ||
    runtimeProducts[0];

  const related = runtimeProducts
    .filter(
      (p) =>
        p._id !== current?._id &&
        p.slug !== current?.slug &&
        (p.category === current?.category || p.gemstone?.type?.includes('Sapphire'))
    )
    .slice(0, limit);

  return related.length > 0 ? related : runtimeProducts.slice(0, limit);
};

export const updateProduct = async (
  id: string,
  productData: any
): Promise<any | null> => {
  try {
    const updated = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });
    if (updated) return updated;
  } catch (e: any) {
    console.error('❌ [MongoDB] Error in Product.findByIdAndUpdate:', e.message);
    throw e;
  }
  const idx = runtimeProducts.findIndex((p) => p._id === id);
  if (idx !== -1) {
    runtimeProducts[idx] = { ...runtimeProducts[idx], ...productData };
    return runtimeProducts[idx];
  }
  return null;
};

export const deleteProduct = async (id: string): Promise<any | null> => {
  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (updated) return updated;
  } catch (e: any) {
    console.error('❌ [MongoDB] Error in deleteProduct:', e.message);
    throw e;
  }
  const idx = runtimeProducts.findIndex((p) => p._id === id);
  if (idx !== -1) {
    runtimeProducts[idx].isActive = false;
    return runtimeProducts[idx];
  }
  return null;
};