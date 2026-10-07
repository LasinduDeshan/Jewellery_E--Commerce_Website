import { Request, Response } from 'express';

import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '../services/product.service.js';


// ============================================================
// CREATE PRODUCT
// POST /api/products
// ============================================================

export const createProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const productData = req.body;

    if (!productData.name) {
      throw new ApiError(400, 'Product name is required');
    }

    if (!productData.sku) {
      throw new ApiError(400, 'Product SKU is required');
    }

    if (!productData.category) {
      throw new ApiError(400, 'Product category is required');
    }

    if (!productData.gender) {
      throw new ApiError(400, 'Product gender/style is required');
    }

    if (!productData.metal) {
      throw new ApiError(400, 'Metal information is required');
    }

    if (!productData.gemstone) {
      throw new ApiError(400, 'Gemstone information is required');
    }

    if (productData.price === undefined) {
      throw new ApiError(400, 'Product price is required');
    }

    if (productData.stockQuantity === undefined) {
      throw new ApiError(400, 'Product stock quantity is required');
    }

    if (!productData.images || productData.images.length < 4) {
      throw new ApiError(
        400,
        'A product must have at least 4 images'
      );
    }

    if (!productData.description) {
      throw new ApiError(400, 'Product description is required');
    }

    if (!productData.careInstructions) {
      throw new ApiError(
        400,
        'Product care instructions are required'
      );
    }

    const product = await createProduct(productData);

    res.status(201).json(
      ApiResponse.success(
        product,
        'Product created successfully'
      )
    );
  }
);


// ============================================================
// GET PRODUCTS
// GET /api/products
// ============================================================

export const getProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      search,
      category,
      gender,
      metal,
      gemstone,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    } = req.query;

    const result = await getProducts({
      search: search ? String(search) : undefined,

      category: category
        ? String(category)
        : undefined,

      gender: gender
        ? String(gender)
        : undefined,

      metal: metal
        ? String(metal)
        : undefined,

      gemstone: gemstone
        ? String(gemstone)
        : undefined,

      minPrice:
        minPrice !== undefined
          ? Number(minPrice)
          : undefined,

      maxPrice:
        maxPrice !== undefined
          ? Number(maxPrice)
          : undefined,

      sort: sort
        ? String(sort)
        : undefined,

      page:
        page !== undefined
          ? Number(page)
          : undefined,

      limit:
        limit !== undefined
          ? Number(limit)
          : undefined,
    });

    res.status(200).json(
      ApiResponse.success(result)
    );
  }
);


// ============================================================
// GET PRODUCT BY ID
// GET /api/products/id/:id
// ============================================================

export const getProductByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      throw new ApiError(400, 'Product ID is required');
    }

    const product = await getProductById(id);

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json(
      ApiResponse.success(product)
    );
  }
);


// ============================================================
// GET PRODUCT BY SLUG
// GET /api/products/:slug
// ============================================================

export const getProductBySlugController = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = String(req.params.slug);

    if (!slug) {
      throw new ApiError(
        400,
        'Product slug is required'
      );
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json(
      ApiResponse.success(product)
    );
  }
);


// ============================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ============================================================

export const updateProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      throw new ApiError(
        400,
        'Product ID is required'
      );
    }

    const product = await updateProduct(
      id,
      req.body
    );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json(
      ApiResponse.success(
        product,
        'Product updated successfully'
      )
    );
  }
);


// ============================================================
// DELETE / DEACTIVATE PRODUCT
// DELETE /api/products/:id
// ============================================================

export const deleteProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    if (!id) {
      throw new ApiError(
        400,
        'Product ID is required'
      );
    }

    const product = await deleteProduct(id);

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json(
      ApiResponse.success(
        product,
        'Product deactivated successfully'
      )
    );
  }
);