import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { prisma } from '../database';
import logger from '../utils/logger.js';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  departmentId: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REMEMBER_ME_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Middleware to validate Remember Me tokens
 * Checks if the token is valid and hasn't expired
 * Extends token expiry on each request if rememberMe is active
 */
export const rememberMeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = verify(token, JWT_SECRET) as TokenPayload;

    // Check if there's an active Remember Me token in database
    const rememberMeToken = await prisma.rememberMeToken.findFirst({
      where: {
        userId: decoded.id,
        expiresAt: { gt: new Date() },
      },
    });

    if (rememberMeToken) {
      // Auto-extend the token expiry
      await prisma.rememberMeToken.update({
        where: { id: rememberMeToken.id },
        data: {
          expiresAt: new Date(Date.now() + REMEMBER_ME_EXPIRY),
          lastUsedAt: new Date(),
        },
      });

      // Extend the JWT expiry in the response
      const newExpiry = new Date();
      newExpiry.setTime(newExpiry.getTime() + REMEMBER_ME_EXPIRY);

      res.setHeader('X-Token-Expiry', newExpiry.toISOString());
    }

    (req as Request & { user?: TokenPayload }).user = decoded;
    next();
  } catch (error) {
    logger.debug('Remember Me validation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    next();
  }
};

/**
 * Cleanup expired Remember Me tokens (run periodically)
 */
export const cleanupExpiredRememberMeTokens = async (): Promise<number> => {
  try {
    const result = await prisma.rememberMeToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    logger.info('Remember Me cleanup completed', {
      deletedTokens: result.count,
    });

    return result.count;
  } catch (error) {
    logger.error('Remember Me cleanup failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
};

/**
 * Revoke all Remember Me tokens for a user (on logout)
 */
export const revokeAllRememberMeTokens = async (userId: string): Promise<void> => {
  try {
    await prisma.rememberMeToken.deleteMany({
      where: { userId },
    });

    logger.info('All Remember Me tokens revoked', { userId });
  } catch (error) {
    logger.error('Remember Me revocation failed', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Get active Remember Me sessions for a user
 */
export const getActiveRememberMeSessions = async (userId: string) => {
  try {
    const sessions = await prisma.rememberMeToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
    });

    return sessions;
  } catch (error) {
    logger.error('Failed to get Remember Me sessions', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
};

/**
 * Revoke a specific Remember Me session
 */
export const revokeRememberMeSession = async (sessionId: string): Promise<boolean> => {
  try {
    const result = await prisma.rememberMeToken.delete({
      where: { id: sessionId },
    });

    logger.info('Remember Me session revoked', { sessionId });
    return !!result;
  } catch (error) {
    logger.error('Failed to revoke Remember Me session', {
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};
