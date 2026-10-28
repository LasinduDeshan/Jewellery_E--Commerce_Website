import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const generateToken = (user: IUser): string => {
  const secret: Secret = config.jwtSecret;
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phoneNumber,
    role: 'customer',
    preferredCurrency: 'AUD',
  });

  const token = generateToken(user);

  res.status(201).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          savedAddresses: user.savedAddresses,
        },
        token,
      },
      'Account created successfully'
    )
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user);

  res.status(200).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          savedAddresses: user.savedAddresses,
        },
        token,
      },
      'Logged in successfully'
    )
  );
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId).select('-password').populate('wishlist');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(ApiResponse.success(user));
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phoneNumber, preferredCurrency, avatar, bio } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    {
      ...(name && { name }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(preferredCurrency && { preferredCurrency }),
      ...(avatar !== undefined && { avatar }),
      ...(bio !== undefined && { bio }),
    },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(ApiResponse.success(user, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide current and new password');
  }

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password does not match');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(ApiResponse.success(null, 'Password changed successfully'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Please provide your registered email address');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'No account found with this email address');
  }

  // Generate 6-digit OTP code valid for 15 minutes
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  console.log(`[Auth] Password Reset OTP for ${user.email}: ${otp}`);

  res.status(200).json(
    ApiResponse.success(
      {
        email: user.email,
        otp, // included for easy dev/local testing without external mailer setup
      },
      'A 6-digit verification code has been generated for your account.'
    )
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, 'Please provide email, verification code, and new password');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'No account found with this email address');
  }

  if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
    throw new ApiError(400, 'Invalid verification code');
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new ApiError(400, 'Verification code has expired. Please request a new code');
  }

  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const token = generateToken(user);

  res.status(200).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          savedAddresses: user.savedAddresses,
        },
        token,
      },
      'Password reset successful. You are now logged in.'
    )
  );
});

