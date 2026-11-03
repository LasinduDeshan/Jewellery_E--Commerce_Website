import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export interface IUserPayload {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (config.nodeEnv === 'development') {
      req.user = {
        userId: 'dev-admin-id',
        email: 'lasindudeshan61@gmail.com',
        role: 'admin',
      };
      return next();
    }
    return next(new ApiError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (config.nodeEnv === 'development') {
      req.user = {
        userId: 'dev-admin-id',
        email: 'lasindudeshan61@gmail.com',
        role: 'admin',
      };
      return next();
    }
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
  const adminEmails = [
    (config.founderEmail || '').toLowerCase(),
    'lasindudeshan61@gmail.com',
    'lasindudeshan617@gmail.com',
    'admin@zeyloraa.com',
  ].filter(Boolean);

  if (
    req.user?.role === 'admin' ||
    (req.user?.email && adminEmails.includes(req.user.email.toLowerCase())) ||
    config.nodeEnv === 'development'
  ) {
    return next();
  }

  return next(new ApiError(403, 'Forbidden: Admin access required'));
};
