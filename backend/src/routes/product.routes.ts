import { Router } from 'express';

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
  deleteProductController,
} from '../controllers/product.controller.js';
import {
  authenticate,
  authorizeAdmin,
} from '../middleware/auth.middleware.js';

const router = Router();

// Public product browsing
router.get('/', getProductsController);
router.get('/id/:id', getProductByIdController);
router.get('/:slug', getProductBySlugController);

// Admin-only product management
router.post('/', authenticate, authorizeAdmin, createProductController);
router.put('/:id', authenticate, authorizeAdmin, updateProductController);
router.delete('/:id', authenticate, authorizeAdmin, deleteProductController);

export default router;