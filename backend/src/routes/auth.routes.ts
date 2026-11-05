import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  adminLogin,
  adminChangePassword,
  adminToggle2FA,
} from '../controllers/auth.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// ================= Customer Storefront Auth =================
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

// ================= Dedicated Admin Portal Auth =================
router.post('/admin/login', adminLogin);
router.post('/admin/change-password', authenticate, authorizeAdmin, adminChangePassword);
router.post('/admin/toggle-2fa', authenticate, authorizeAdmin, adminToggle2FA);

export default router;
