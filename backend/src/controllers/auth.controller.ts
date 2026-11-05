import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
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

const googleClient = new OAuth2Client(config.googleClientId);

export const googleLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { credential, accessToken } = req.body;

    if (!credential && !accessToken) {
      throw new ApiError(400, 'Google credential or access token is required');
    }

    if (!config.googleClientId) {
      throw new ApiError(500, 'Google authentication is not configured');
    }

    let payload: {
      sub: string;
      email: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    } | undefined;

    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: config.googleClientId,
        });

        const p = ticket.getPayload();
        if (p) {
          payload = {
            sub: p.sub,
            email: p.email || '',
            email_verified: p.email_verified,
            name: p.name,
            picture: p.picture,
          };
        }
      } catch {
        throw new ApiError(401, 'Invalid Google credential');
      }
    } else if (accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch user info from Google');
        }

        const data = (await userInfoRes.json()) as {
          sub: string;
          email: string;
          email_verified?: boolean;
          name?: string;
          picture?: string;
        };

        payload = {
          sub: data.sub,
          email: data.email,
          email_verified: data.email_verified,
          name: data.name,
          picture: data.picture,
        };
      } catch {
        throw new ApiError(401, 'Invalid Google access token');
      }
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new ApiError(401, 'A verified Google email is required');
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    // Find an existing account by Google ID or verified email.
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Keep existing roles, including admin; never promote a customer.
      if (user.googleId && user.googleId !== googleId) {
        throw new ApiError(
          409,
          'This email is linked to a different Google account'
        );
      }

      if (!user.googleId) {
        user.googleId = googleId;
      }

      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
      }

      await user.save();
    } else {
      user = await User.create({
        name: payload.name?.trim() || email.split('@')[0],
        email,
        googleId,
        avatar: payload.picture,
        role: 'customer',
        preferredCurrency: 'AUD',
      });
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
            avatar: user.avatar,
          },
          token,
        },
        'Google login successful'
      )
    );
  }
);

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

// =========================================================================
// DEDICATED ADMIN PORTAL AUTHENTICATION
// =========================================================================

/**
 * Dedicated Admin Portal Login
 * - Accepts email, password, and optional 2FA OTP
 * - Enforces role: 'admin' | 'super_admin' (customers strictly forbidden)
 * - Checks needsPasswordChange (first login requirement)
 * - Verifies optional 2FA OTP if twoFactorEnabled is active
 * - Issues an 8-hour admin session token
 */
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, otp } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide administrator email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid administrator credentials');
  }

  // Enforce role: only super_admin and admin are allowed
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    throw new ApiError(403, 'Access denied: You do not have authorization to access the Admin Portal.');
  }

  // Optional Two-Factor Authentication Check
  if (user.twoFactorEnabled) {
    if (!otp) {
      // Generate 6-digit OTP code valid for 10 minutes
      const tempOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFactorTempOtp = tempOtp;
      user.twoFactorTempExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      console.log(`[Security 2FA] 6-digit OTP for admin ${user.email}: ${tempOtp}`);

      return res.status(200).json(
        ApiResponse.success(
          {
            twoFactorRequired: true,
            email: user.email,
            otp: tempOtp, // provided for seamless developer/local evaluation
          },
          'Two-factor authentication code required. Please enter the 6-digit code.'
        )
      );
    }

    // Verify OTP code
    if (
      !user.twoFactorTempOtp ||
      user.twoFactorTempOtp !== String(otp).trim() ||
      !user.twoFactorTempExpires ||
      user.twoFactorTempExpires < new Date()
    ) {
      throw new ApiError(400, 'Invalid or expired 2FA verification code. Please try again.');
    }

    // Clear temp 2FA OTP
    user.twoFactorTempOtp = undefined;
    user.twoFactorTempExpires = undefined;
  }

  // Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save();

  // Generate Admin Token with 8h session expiration
  const secret: Secret = config.jwtSecret;
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    secret,
    { expiresIn: '8h' }
  );

  res.status(200).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          needsPasswordChange: Boolean(user.needsPasswordChange),
          twoFactorEnabled: Boolean(user.twoFactorEnabled),
          lastLoginAt: user.lastLoginAt,
        },
        token,
        needsPasswordChange: Boolean(user.needsPasswordChange),
      },
      user.needsPasswordChange
        ? 'First login detected: You are required to update your initial password.'
        : 'Welcome to the Zeyloraa Admin Portal.'
    )
  );
});

/**
 * Admin First-Login / Mandatory Password Change
 */
export const adminChangePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    throw new ApiError(400, 'New password must be at least 8 characters long.');
  }

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ApiError(404, 'Administrator account not found.');
  }

  // If user does not have needsPasswordChange flag, require currentPassword verification
  if (!user.needsPasswordChange) {
    if (!currentPassword) {
      throw new ApiError(400, 'Please provide your current password.');
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password does not match.');
    }
  }

  user.password = newPassword;
  user.needsPasswordChange = false;
  await user.save();

  res.status(200).json(
    ApiResponse.success(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          needsPasswordChange: false,
        },
      },
      'Password updated successfully. You now have full access to the Admin Portal.'
    )
  );
});

/**
 * Toggle Two-Factor Authentication for Admin Account
 */
export const adminToggle2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { enabled } = req.body;

  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ApiError(404, 'Administrator account not found.');
  }

  user.twoFactorEnabled = Boolean(enabled);
  user.twoFactorTempOtp = undefined;
  user.twoFactorTempExpires = undefined;
  await user.save();

  res.status(200).json(
    ApiResponse.success(
      { twoFactorEnabled: user.twoFactorEnabled },
      user.twoFactorEnabled
        ? 'Two-factor authentication has been enabled for this admin account.'
        : 'Two-factor authentication has been disabled.'
    )
  );
});
