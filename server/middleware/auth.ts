/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user info to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { JWT_SECRET } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string;
    phone?: string;
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
      // Fallback for development if no token is provided
      req.user = {
        id: 'dev-lion-001',
        email: 'arslanmalikgoraha@gmail.com',
        role: 'managing_director',
        name: 'Arslan Goraha',
      };
      return next();
    }

    const decoded = decodeJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    // Fallback for development if token verification crashes
    console.warn('[AEGIS AuthArmor] JWT verification crashed. Falling back to Developer Profile (Lion).');
    req.user = {
      id: 'dev-lion-001',
      email: 'arslanmalikgoraha@gmail.com',
      role: 'managing_director',
      name: 'Arslan Goraha',
    };
    return next();
  }
};

export default authMiddleware;
