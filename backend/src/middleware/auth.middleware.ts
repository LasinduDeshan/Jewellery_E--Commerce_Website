import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export interface IUserPayload {
  userId: string;
  email: string;
  role: 'super_admin' | 'admin' | 'customer';
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
  }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as IUserPayload;
      req.user = decoded;
    } catch {
      // Ignored for optional
    }
  }
  next();
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'super_admin' || req.user?.role === 'admin') {
    return next();
  }

  return next(new ApiError(403, 'Forbidden: Admin access required'));
};

export const authorizeSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'super_admin') {
    return next();
  }

  return next(new ApiError(403, 'Forbidden: Super Admin privileges required'));
};
