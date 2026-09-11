/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user info to request
 *
 * FIX 01 (AEGIS): Structured JWT error handling with Lion founder bypass
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { JWT_SECRET } from '../config/env.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AuthMiddleware');

// ─── Lion Founder Profile (Level 5 Master) ─────────────────────────────────
const LION_FOUNDER_PROFILE = {
  id: 'dev-lion-001',
  email: 'arslanmalikgoraha@gmail.com',
  role: 'managing_director',
  name: 'Arslan Goraha',
  accessLevel: 5,
  tier: 'LEVEL_5_MASTER',
} as const;

const FOUNDER_EMAIL = 'arslanmalikgoraha@gmail.com';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  accessLevel?: number;
  tier?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

type JwtPayload = {
  id?: string;
  sub?: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  accessLevel?: number;
  tier?: string;
};

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  if (!authorizationHeader.startsWith('Bearer ')) return null;
  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

const decodeJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
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
    const decoded = decodeJwt(token);
    const userId = decoded.id || decoded.sub;
    if (!userId || !decoded.email || !decoded.role) return null;
    return {
      id: String(userId),
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/**
 * Check if decoded user is the founder and enrich with Level 5 payload.
 */
function enrichFounderPayload(user: AuthUser): AuthUser {
  if (user.email?.toLowerCase() === FOUNDER_EMAIL) {
    return {
      ...user,
      role: 'managing_director',
      accessLevel: 5,
      tier: 'LEVEL_5_MASTER',
    };
  }
  return user;
}

const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      log.warn('No Bearer token provided');
      return next(new AppError('No token provided', 401));
    }

    const decoded = decodeJwt(token);
    const userId = decoded.id || decoded.sub;
    if (!userId) {
      log.warn('JWT payload missing user ID');
      return next(new AppError('Invalid token', 401));
    }

    const authUser: AuthUser = {
      ...decoded,
      id: String(userId),
    };
    req.user = enrichFounderPayload(authUser);
    next();
  } catch (error: unknown) {
    // Structured JWT error classification
    if (error instanceof jwt.TokenExpiredError) {
      log.warn(`JWT expired at ${error.expiredAt?.toISOString?.()}`);
      return next(new AppError('Token expired', 401));
    } else if (error instanceof jwt.NotBeforeError) {
      log.warn(`JWT not active until ${error.date?.toISOString?.()}`);
      return next(new AppError('Token not yet active', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      log.warn(`JWT malformed: ${error.message}`);
      return next(new AppError('Invalid token', 401));
    } else {
      log.error('Unexpected auth error', {
        error: error instanceof Error ? error.message : String(error),
      });
      return next(new AppError('Authentication failed', 401));
    }
  }
};

export default authMiddleware;

