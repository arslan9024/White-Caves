/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user info to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { JWT_SECRET } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  if (!authorizationHeader.startsWith('Bearer ')) return null;
  return authorizationHeader.slice('Bearer '.length);
};

const decodeJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

const mapJwtErrorToAppError = (error: unknown): AppError => {
  if (error instanceof jwt.TokenExpiredError) {
    return new AppError('Token expired', 401);
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return new AppError('Invalid token', 401);
  }

  return new AppError('Authentication failed', 401);
};

/**
 * Verify a JWT token string and return the decoded payload, or null on failure.
 * Used by non-Express code (e.g. Socket.io middleware) that cannot call next().
 */
export function verifyJwt(token: string): { id: string; email: string; role: string } | null {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}

const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = decodeJwt(token);

    req.user = decoded;
    next();
  } catch (error) {
    return next(mapJwtErrorToAppError(error));
  }
};

export default authMiddleware;
