/**
 * Two-Factor Authentication Management Controller
 * Single Purpose: Setup, enable, disable, and query 2FA status.
 */

import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { JWT_SECRET, BCRYPT_ROUNDS } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { generateTOTPSecret, generateBackupCodes, verifyTOTP } from './totpUtils.js';
import { db, verifyPassword, getClientIp } from './authCommon.js';

export const setup2faHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const secret = generateTOTPSecret();
    const appName = encodeURIComponent('White Caves CRM');
    const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) throw new AppError('User not found', 404);

    const accountLabel = encodeURIComponent(user.email);
    const otpauthUri = `otpauth://totp/${appName}:${accountLabel}?secret=${secret}&issuer=${appName}&algorithm=SHA1&digits=6&period=30`;

    // Temporarily store secret (not yet enabled — no DB write until /enable confirms)
    // Store as pending in a short-lived signed token so the secret never sits idle in the DB
    const pendingToken = jwt.sign({ userId, totpSecret: secret }, JWT_SECRET, { expiresIn: 600 });

    // Mark twoFactorEnabled as false to indicate setup is in progress
    await db.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false },
    });

    res.status(200).json({
      success: true,
      data: {
        secret,
        otpAuthUrl: otpauthUri,
        pendingToken,
        instructions: [
          '1. Scan the QR code (or enter the secret) in your authenticator app (Google Authenticator, Authy, etc.)',
          '2. Enter the 6-digit code from your app to confirm setup at POST /api/auth/2fa/enable',
        ],
      },
    });
  });

export const enable2faHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { pendingToken, code } = req.body;
    if (!pendingToken || !code) {
      throw new AppError('pendingToken and code are required', 400);
    }

    // Decode the pending token to retrieve the secret
    let totpSecret: string;
    try {
      const payload = jwt.verify(pendingToken, JWT_SECRET, {
        algorithms: ['HS256'],
      }) as {
        userId: string;
        totpSecret: string;
      };
      if (payload.userId !== userId)
        throw new AppError('Token does not match the current user', 403);
      totpSecret = payload.totpSecret;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Setup token is invalid or has expired — please restart 2FA setup', 400);
    }

    if (!verifyTOTP(totpSecret, String(code).trim())) {
      throw new AppError(
        'Verification code is incorrect — ensure your device clock is accurate',
        400
      );
    }

    // Generate backup codes and hash them
    const plainCodes = generateBackupCodes(8);
    const hashedCodes = await Promise.all(plainCodes.map(c => bcrypt.hash(c, BCRYPT_ROUNDS)));

    await db.user.update({
      where: { id: userId },
      data: { totpSecret, totpEnabled: true, totpBackupCodes: hashedCodes },
    });

    logger.info('TOTP 2FA enabled', { userId });
    res.status(200).json({
      success: true,
      data: {
        enabled: true,
        backupCodes: plainCodes,
        message:
          'Two-factor authentication is now active. Store your backup codes in a safe place — they will not be shown again.',
      },
    });
  });

export const disable2faHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { code, currentPassword } = req.body;
    if (!code && !currentPassword) {
      throw new AppError('Verification code or current password required to disable 2FA', 400);
    }

    // Password-based disable path
    if (currentPassword) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          twoFactorEnabled: true,
          twoFactorSecret: true,
          totpEnabled: true,
          totpSecret: true,
          passwordHash: true,
        },
      });
      if (!user) throw new AppError('User not found', 404);

      if (!user.twoFactorEnabled && !user.totpEnabled) {
        throw new AppError('Two-factor authentication is not enabled', 400);
      }

      const valid = await verifyPassword(currentPassword, user.passwordHash || '');
      if (!valid) throw new AppError('Current password is incorrect', 401);

      await db.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          totpEnabled: false,
          totpSecret: null,
        },
      });

      logger.info('2FA disabled via password', { userId });
      res.status(200).json({ success: true, data: { disabled: true } });
      return;
    }

    // TOTP code-based disable path
    const user = (await db.user.findUnique({
      where: { id: userId },
      select: { totpSecret: true, totpEnabled: true, totpBackupCodes: true },
    })) as any;
    if (!user) throw new AppError('User not found', 404);
    if (!user.totpEnabled || !user.totpSecret) {
      throw new AppError('Two-factor authentication is not enabled', 400);
    }

    const codeStr = String(code).trim().toUpperCase();
    let verified = false;

    if (/^\d{6}$/.test(codeStr)) {
      verified = verifyTOTP(user.totpSecret, codeStr);
    } else if (/^[A-F0-9]{8}$/.test(codeStr)) {
      for (const hashed of user.totpBackupCodes) {
        if (await bcrypt.compare(codeStr, hashed)) {
          verified = true;
          break;
        }
      }
    }

    if (!verified) throw new AppError('Invalid verification code', 401);

    await db.user.update({
      where: { id: userId },
      data: {
        totpEnabled: false,
        totpSecret: null,
        totpBackupCodes: [],
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    logger.info('TOTP 2FA disabled', { userId });
    res.status(200).json({
      success: true,
      data: { disabled: true, message: 'Two-factor authentication has been disabled.' },
    });
  });

export const status2faHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const user = (await db.user.findUnique({
      where: { id: userId },
      select: { totpEnabled: true, totpBackupCodes: true },
    })) as any;
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      success: true,
      data: {
        totpEnabled: user.totpEnabled,
        backupCodesRemaining: user.totpBackupCodes.length,
      },
    });
  });
