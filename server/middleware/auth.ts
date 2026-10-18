/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user info to request
 *
 * Authenticated request identity is derived only from a verified JWT.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { JWT_SECRET } from '../config/env.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AuthMiddleware');

const FOUNDER_EMAIL = (process.env.CREATOR_SUPERUSER_EMAIL || 'arslanmalikgoraha@gmail.com')
  .toLowerCase()
  .trim();

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

type JwtPayload = Pick<AuthUser, 'id' | 'email' | 'role'>;

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  if (!authorizationHeader.startsWith('Bearer ')) return null;
  return authorizationHeader.slice('Bearer '.length);
};

export const isLoopbackAddress = (address: string | undefined): boolean => {
  if (!address) return false;

  const normalizedAddress = address.toLowerCase().replace(/^::ffff:/, '');
  return (
    normalizedAddress === '::1' ||
    normalizedAddress === '0:0:0:0:0:0:0:1' ||
    /^127(?:\.\d{1,3}){3}$/.test(normalizedAddress)
  );
};

export const shouldUseDevAuthBypass = (
  nodeEnv: string | undefined,
  bypassFlag: string | undefined,
  remoteAddress: string | undefined
): boolean =>
  nodeEnv === 'development' && bypassFlag === 'true' && isLoopbackAddress(remoteAddress);

const decodeJwt = (token: string): JwtPayload => {
  const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  if (
    typeof payload !== 'object' ||
    payload === null ||
    payload.requires2FA === true ||
    typeof payload.id !== 'string' ||
    payload.id.trim().length === 0 ||
    typeof payload.email !== 'string' ||
    payload.email.trim().length === 0 ||
    typeof payload.role !== 'string' ||
    payload.role.trim().length === 0
  ) {
    throw new AppError('Invalid token', 401);
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
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
  if (user.email?.toLowerCase() === FOUNDER_EMAIL && user.role === 'managing_director') {
    return {
      ...user,
      accessLevel: 5,
      tier: 'LEVEL_5_MASTER',
    };
  }
  return user;
}

const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const authenticatedUser = decodeJwt(token);
    const requestPath = (req.originalUrl || req.path || '').split('?')[0];
    const isSocialSignupCompletion =
      req.method === 'POST' && requestPath.endsWith('/complete-social-registration');
    if (authenticatedUser.role === 'social_signup_pending' && !isSocialSignupCompletion) {
      throw new AppError('Social signup session is restricted to registration completion', 403);
    }

    req.user = enrichFounderPayload(authenticatedUser);
    return next();
  } catch (error: unknown) {
    req.user = undefined;
    const authError = error instanceof AppError ? error : mapJwtErrorToAppError(error);
    log.warn('JWT authentication rejected', { statusCode: authError.statusCode });
    return next(authError);
  }
};

export default authMiddleware;
