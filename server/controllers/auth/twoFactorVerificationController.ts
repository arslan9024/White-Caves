/**
 * Two-Factor Authentication Verification Controller
 * Single Purpose: Validate TOTP / backup code on login.
 */

import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET } from '../../config/env.js';
import { issueCsrfToken } from '../../middleware/csrf.js';
import { sanitizeString } from '../../utils/sanitize.js';
import logger from '../../utils/logger.js';
import { verifyTOTP } from './totpUtils.js';
import {
  RouteRequest,
  db,
  JWT_SIGN_OPTIONS,
  getClientIp,
  recordLoginFailure,
  checkAccountLockout,
  checkIpLockout,
  resolveProfileCompletion,
} from './authCommon.js';

export const verify2faHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const db = prisma as any;
    const { email, code, twoFactorToken: body2faToken } = req.body || {};

    if (!email || !code) {
      throw new AppError('Email and verification code are required', 400);
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase().trim();
    const clientIp = getClientIp(req);

    // IP Lockout check
    const ipLockout = await checkIpLockout(clientIp);
    if (ipLockout.locked) {
      recordLoginFailure(req, 'ip_locked_out', sanitizedEmail);
      const minutes = Math.ceil(ipLockout.retryAfterSeconds / 60);
      res.set('Retry-After', String(ipLockout.retryAfterSeconds));
      throw new AppError(
        `Too many failed verification attempts from this network (${ipLockout.failureCount}). Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        429
      );
    }

    // Dev-only 2FA bypass: requires BOTH NODE_ENV=development AND DEV_2FA_BYPASS=true
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DEV_2FA_BYPASS === 'true' &&
      code === '000000'
    ) {
      const user = await db.user.findUnique({ where: { email: sanitizedEmail } });
      if (!user) throw new AppError('User not found', 404);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        JWT_SIGN_OPTIONS
      );

      return res.status(200).json({
        success: true,
        data: { token, verified: true },
      });
    }

    // Cryptographic validation of twoFactorToken if provided (body or Bearer header)
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7).trim()
      : undefined;
    const twoFactorToken = (typeof body2faToken === 'string' && body2faToken.trim()) || bearerToken;

    if (twoFactorToken) {
      try {
        const decoded = jwt.verify(twoFactorToken, JWT_SECRET, {
          algorithms: ['HS256'],
        }) as jwt.JwtPayload;
        if (
          !decoded?.requires2FA ||
          (decoded.email && decoded.email.toLowerCase().trim() !== sanitizedEmail)
        ) {
          throw new AppError('Invalid 2FA challenge token', 401);
        }
      } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError('Invalid or expired 2FA challenge token', 401);
      }
    }

    const user = (await db.user.findUnique({ where: { email: sanitizedEmail } })) as any;
    if (!user) {
      recordLoginFailure(req, 'unknown_user', sanitizedEmail);
      throw new AppError('Invalid credentials', 401);
    }

    // Account status check
    if (user.status && user.status !== 'active') {
      recordLoginFailure(req, 'inactive', sanitizedEmail, user.id);
      throw new AppError('Account is inactive. Contact administrator.', 403);
    }

    // Account Lockout check
    const lockout = await checkAccountLockout(user.id);
    if (lockout.locked) {
      recordLoginFailure(req, 'locked_out', sanitizedEmail, user.id);
      const minutes = Math.ceil(lockout.retryAfterSeconds / 60);
      res.set('Retry-After', String(lockout.retryAfterSeconds));
      throw new AppError(
        `Account temporarily locked after ${lockout.failureCount} failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        429
      );
    }

    const secret = user.totpSecret || user.twoFactorSecret;
    if (!secret && (!Array.isArray(user.totpBackupCodes) || user.totpBackupCodes.length === 0)) {
      throw new AppError('Two-factor authentication is not enabled for this account', 400);
    }

    // Try TOTP code first, then backup codes
    const codeStr = String(code).trim().toUpperCase();
    let verified = false;

    if (/^\d{6}$/.test(codeStr)) {
      // Regular 6-digit TOTP
      if (secret) {
        verified = verifyTOTP(secret, codeStr);
      }
    } else if (/^[A-F0-9]{8}$/.test(codeStr) && Array.isArray(user.totpBackupCodes)) {
      // Backup recovery code — check against hashed list
      for (const hashed of user.totpBackupCodes) {
        if (await bcrypt.compare(codeStr, hashed)) {
          // Consume the backup code (single-use)
          await db.user.update({
            where: { id: user.id },
            data: { totpBackupCodes: user.totpBackupCodes.filter((h: string) => h !== hashed) },
          });
          verified = true;
          break;
        }
      }
    }

    if (!verified) {
      recordLoginFailure(req, 'invalid_password', sanitizedEmail, user.id);
      logger.warn('Failed 2FA attempt', { userId: user.id });
      throw new AppError('Invalid verification code', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    logger.info('2FA verification successful', { userId: user.id });
    res.status(200).json({ success: true, data: { token, verified: true } });
  });
