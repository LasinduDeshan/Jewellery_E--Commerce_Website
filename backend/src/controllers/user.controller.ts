import { Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import mongoose from 'mongoose';

// ================= WISHLIST =================

export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId).populate('wishlist');
  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(ApiResponse.success(user.wishlist || []));
});

export const toggleWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID required');

  const user = await User.findById(req.user?.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const pId = new mongoose.Types.ObjectId(productId);
  const existsIndex = user.wishlist.findIndex((id) => id.toString() === productId);

  let added = false;
  if (existsIndex > -1) {
    user.wishlist.splice(existsIndex, 1);
  } else {
    user.wishlist.push(pId);
    added = true;
  }

  await user.save();

  res.status(200).json(
    ApiResponse.success(
      { wishlist: user.wishlist, added },
      added ? 'Added to wishlist' : 'Removed from wishlist'
    )
  );
});

// ================= SAVED ADDRESSES =================

export const getSavedAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(ApiResponse.success(user.savedAddresses || []));
});

export const addSavedAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { label, fullName, street, apartment, city, state, postalCode, country, phoneNumber, isDefault } = req.body;

  if (!fullName || !street || !city || !state || !postalCode || !phoneNumber) {
    throw new ApiError(400, 'Please provide all required address fields');
  }

  const user = await User.findById(req.user?.userId);
  if (!user) throw new ApiError(404, 'User not found');

  // If this address is set as default, unset others
  if (isDefault || user.savedAddresses.length === 0) {
    user.savedAddresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  const newAddress = {
    label: label || 'Home',
    fullName,
    street,
    apartment,
    city,
    state,
    postalCode,
    country: country || 'Australia',
    phoneNumber,
    isDefault: isDefault || user.savedAddresses.length === 0,
  };

  user.savedAddresses.push(newAddress as any);
  await user.save();

  res.status(201).json(ApiResponse.success(user.savedAddresses, 'Address added successfully'));
});

export const updateSavedAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { addressId } = req.params;
  const { label, fullName, street, apartment, city, state, postalCode, country, phoneNumber, isDefault } = req.body;

  const user = await User.findById(req.user?.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const addr = (user.savedAddresses as any).id(addressId);
  if (!addr) throw new ApiError(404, 'Address not found');

  if (isDefault) {
    user.savedAddresses.forEach((a) => {
      a.isDefault = false;
    });
    addr.isDefault = true;
  }

  if (label) addr.label = label;
  if (fullName) addr.fullName = fullName;
  if (street) addr.street = street;
  if (apartment !== undefined) addr.apartment = apartment;
  if (city) addr.city = city;
  if (state) addr.state = state;
  if (postalCode) addr.postalCode = postalCode;
  if (country) addr.country = country;
  if (phoneNumber) addr.phoneNumber = phoneNumber;

  await user.save();

  res.status(200).json(ApiResponse.success(user.savedAddresses, 'Address updated successfully'));
});

export const deleteSavedAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user?.userId);
  if (!user) throw new ApiError(404, 'User not found');

  user.savedAddresses = user.savedAddresses.filter((a: any) => a._id.toString() !== addressId);
  await user.save();

  res.status(200).json(ApiResponse.success(user.savedAddresses, 'Address deleted successfully'));
});
