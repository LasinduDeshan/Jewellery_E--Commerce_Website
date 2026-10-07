import { Router } from 'express';
import {
  getWishlist,
  toggleWishlist,
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist/toggle', toggleWishlist);

// Saved Addresses
router.get('/addresses', getSavedAddresses);
router.post('/addresses', addSavedAddress);
router.put('/addresses/:addressId', updateSavedAddress);
router.delete('/addresses/:addressId', deleteSavedAddress);

export default router;
