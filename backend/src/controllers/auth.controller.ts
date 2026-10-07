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
  const { name, email, password, phoneNumber, role } = req.body;

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
    role: role === 'admin' ? 'admin' : 'customer',
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
  const { name, phoneNumber, preferredCurrency } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    {
      ...(name && { name }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(preferredCurrency && { preferredCurrency }),
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
