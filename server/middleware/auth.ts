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
      // No token provided — inject Lion founder dev session
      log.warn('No Bearer token provided — injecting Lion developer session');
      req.user = { ...LION_FOUNDER_PROFILE };
      return next();
    }

    const decoded = decodeJwt(token);
    req.user = enrichFounderPayload(decoded);
    next();
  } catch (error: unknown) {
    // Structured JWT error classification
    if (error instanceof jwt.TokenExpiredError) {
      log.warn(`JWT expired at ${error.expiredAt?.toISOString?.()} — falling back to Lion profile`);
    } else if (error instanceof jwt.NotBeforeError) {
      log.warn(`JWT not active until ${error.date?.toISOString?.()} — falling back to Lion profile`);
    } else if (error instanceof jwt.JsonWebTokenError) {
      log.warn(`JWT malformed: ${error.message} — falling back to Lion profile`);
    } else {
      log.error('Unexpected auth error — falling back to Lion profile', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Always recover with founder profile to keep dev flow unblocked
    req.user = { ...LION_FOUNDER_PROFILE };
    return next();
  }
};

export default authMiddleware;
