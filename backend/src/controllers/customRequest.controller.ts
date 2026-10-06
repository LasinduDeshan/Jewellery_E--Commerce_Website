import { Request, Response } from 'express';
import { CustomRequest, ICustomRequest } from '../models/CustomRequest.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// In-memory fallback in case MongoDB isn't running in local dev
let inMemoryRequests: any[] = [];

export const createCustomRequest = asyncHandler(async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phoneNumber,
    whatsappNumber,
    country,
    preferredContactMethod,
    jewelleryType,
    metalPreference,
    sapphireColor,
    cutPreference,
    size,
    budgetRange,
    occasion,
    referenceImages = [],
    specialInstructions,
  } = req.body;

  if (!fullName || !email || !phoneNumber || !jewelleryType || !metalPreference || !sapphireColor || !cutPreference) {
    throw new ApiError(400, 'Please provide all required jewellery specifications and contact details');
  }

  const ticketId = `CR-${Math.floor(100000 + Math.random() * 900000)}`;

  let createdRequest: any;

  try {
    createdRequest = await CustomRequest.create({
      ticketId,
      fullName,
      email,
      phoneNumber,
      whatsappNumber: whatsappNumber || phoneNumber,
      country: country || 'United States',
      preferredContactMethod: preferredContactMethod || 'whatsapp',
      jewelleryType,
      metalPreference,
      sapphireColor,
      cutPreference,
      size,
      budgetRange,
      occasion,
      referenceImages,
      specialInstructions,
      status: 'New',
    });
  } catch (error) {
    // Fallback in-memory persistence
    createdRequest = {
      _id: `mock_${Date.now()}`,
      ticketId,
      fullName,
      email,
      phoneNumber,
      whatsappNumber: whatsappNumber || phoneNumber,
      country: country || 'United States',
      preferredContactMethod: preferredContactMethod || 'whatsapp',
      jewelleryType,
      metalPreference,
      sapphireColor,
      cutPreference,
      size,
      budgetRange,
      occasion,
      referenceImages,
      specialInstructions,
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryRequests.unshift(createdRequest);
  }

  // Simulated founder notification log
  console.log(`\n========================================`);
  console.log(`💎 [NEW CUSTOM SAPPHIRE REQUEST RECEIVED]`);
  console.log(`Ticket ID: ${ticketId}`);
  console.log(`Customer: ${fullName} (${email} / ${phoneNumber})`);
  console.log(`Jewellery: ${jewelleryType.toUpperCase()} | Metal: ${metalPreference}`);
  console.log(`Gemstone: ${sapphireColor} (${cutPreference}) | Size: ${size || 'N/A'}`);
  console.log(`Contact via: ${preferredContactMethod.toUpperCase()}`);
  console.log(`========================================\n`);

  res.status(201).json(
    ApiResponse.success(
      {
        ticketId: createdRequest.ticketId,
        request: createdRequest,
        confirmationMessage: 'Your custom sapphire jewellery request has been received. Our master gemologist will review your specifications and reach out with a detailed quote within 1-2 business days.',
      },
      'Custom jewellery request created successfully'
    )
  );
});

export const getCustomRequests = asyncHandler(async (req: Request, res: Response) => {
  const { status, search, limit = 50 } = req.query;

  let requests: any[] = [];

  try {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { sapphireColor: { $regex: search, $options: 'i' } },
      ];
    }

    requests = await CustomRequest.find(query).sort({ createdAt: -1 }).limit(Number(limit));
  } catch (error) {
    requests = inMemoryRequests.filter((reqItem) => {
      let matches = true;
      if (status && status !== 'all') {
        matches = matches && reqItem.status === status;
      }
      if (search) {
        const s = String(search).toLowerCase();
        matches =
          matches &&
          (reqItem.fullName?.toLowerCase().includes(s) ||
            reqItem.email?.toLowerCase().includes(s) ||
            reqItem.ticketId?.toLowerCase().includes(s));
      }
      return matches;
    });
  }

  res.status(200).json(ApiResponse.success(requests));
});

export const getCustomRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  let customReq: any;
  try {
    customReq = await CustomRequest.findOne({ $or: [{ _id: id }, { ticketId: id }] });
  } catch (error) {
    customReq = inMemoryRequests.find((r) => r._id === id || r.ticketId === id);
  }

  if (!customReq) {
    throw new ApiError(404, 'Custom request not found');
  }

  res.status(200).json(ApiResponse.success(customReq));
});

export const updateCustomRequestStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, quotedPrice, quotedCurrency } = req.body;

  let updated: any;
  try {
    updated = await CustomRequest.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(quotedPrice !== undefined && { quotedPrice }),
        ...(quotedCurrency && { quotedCurrency }),
      },
      { new: true }
    );
  } catch (error) {
    const idx = inMemoryRequests.findIndex((r) => r._id === id || r.ticketId === id);
    if (idx > -1) {
      inMemoryRequests[idx] = {
        ...inMemoryRequests[idx],
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(quotedPrice !== undefined && { quotedPrice }),
        updatedAt: new Date(),
      };
      updated = inMemoryRequests[idx];
    }
  }

  if (!updated) {
    throw new ApiError(404, 'Custom request not found');
  }

  res.status(200).json(ApiResponse.success(updated, 'Custom request updated successfully'));
});
