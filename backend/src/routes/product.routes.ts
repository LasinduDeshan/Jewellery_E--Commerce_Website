import { Router } from 'express';

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
  deleteProductController,
} from '../controllers/product.controller.js';

const router = Router();

// --------------------------------------------------
// Public catalogue routes
// --------------------------------------------------

// Get products with search, filtering, sorting and pagination
router.get('/', getProductsController);

// Get a single product by MongoDB ID
router.get('/id/:id', getProductByIdController);

// Get a single product by SEO-friendly slug
router.get('/:slug', getProductBySlugController);


// --------------------------------------------------
// Product management routes
// --------------------------------------------------

// Create product
router.post('/', createProductController);

// Update product
router.put('/:id', updateProductController);

// Deactivate product
router.delete('/:id', deleteProductController);

export default router;