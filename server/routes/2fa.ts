import { Router, Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '../database';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TwoFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

interface VerifyTwoFARequest {
  token: string;
  backupCode?: string;
}

/**
 * POST /api/2fa/setup
 * Generate TOTP secret and QR code
 */
router.post(
  '/setup',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `White Caves (${userId})`,
      issuer: 'White Caves Real Estate',
      length: 32,
    });

    if (!secret.base32) {
      throw new AppError('Failed to generate secret', 500);
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    // Generate 10 backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Temporarily store the secret (user needs to confirm)
    await prisma.twoFASetup.upsert({
      where: { userId },
      update: {
        secret: secret.base32,
        backupCodes: JSON.stringify(backupCodes),
        confirmed: false,
      },
      create: {
        userId,
        secret: secret.base32,
        backupCodes: JSON.stringify(backupCodes),
        confirmed: false,
      },
    });

    return res.status(200).json({
      secret: secret.base32,
      qrCode,
      backupCodes,
      message: 'Scan the QR code with your authenticator app',
    } as TwoFASetupResponse);
  })
);

/**
 * POST /api/2fa/confirm
 * Confirm 2FA setup by verifying the token
 */
router.post(
  '/confirm',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    const { token } = req.body as { token: string };

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!token || typeof token !== 'string' || token.length !== 6) {
      throw new AppError('Invalid verification token format', 400);
    }

    // Get temporary setup
    const setup = await prisma.twoFASetup.findUnique({
      where: { userId },
    });

    if (!setup || setup.confirmed) {
      throw new AppError('No pending 2FA setup', 400);
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: setup.secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new AppError('Invalid verification token', 401);
    }

    // Confirm 2FA setup
    await prisma.twoFASetup.update({
      where: { userId },
      data: { confirmed: true },
    });

    // Enable 2FA for user
    await prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: true },
    });

    const backupCodes = JSON.parse(setup.backupCodes) as string[];

    logger.info('2FA setup confirmed', { userId });

    return res.status(200).json({
      message: '2FA successfully enabled',
      backupCodes,
      warning: 'Save these backup codes in a secure location',
    });
  })
);

/**
 * POST /api/2fa/verify
 * Verify TOTP token during login
 */
router.post(
  '/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, token, backupCode } = req.body as {
      userId: string;
      token?: string;
      backupCode?: string;
    };

    if (!userId) {
      throw new AppError('User ID required', 400);
    }

    // Get 2FA setup
    const setup = await prisma.twoFASetup.findUnique({
      where: { userId },
    });

    if (!setup || !setup.confirmed) {
      throw new AppError('2FA not configured for this user', 400);
    }

    let verified = false;

    // Try TOTP token verification
    if (token && typeof token === 'string' && token.length === 6) {
      verified = speakeasy.totp.verify({
        secret: setup.secret,
        encoding: 'base32',
        token,
        window: 2,
      });
    }

    // Try backup code
    if (!verified && backupCode) {
      const backupCodes = JSON.parse(setup.backupCodes) as string[];
      const codeIndex = backupCodes.indexOf(backupCode.toUpperCase());

      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await prisma.twoFASetup.update({
          where: { userId },
          data: { backupCodes: JSON.stringify(backupCodes) },
        });
        verified = true;

        logger.warn('Backup code used for 2FA', { userId });
      }
    }

    if (!verified) {
      throw new AppError('Invalid verification token or backup code', 401);
    }

    // Generate session token
    const sessionToken = sign({ userId, verified2FA: true }, JWT_SECRET, {
      expiresIn: '24h',
    });

    logger.info('2FA verification successful', { userId });

    return res.status(200).json({
      message: '2FA verification successful',
      sessionToken,
    });
  })
);

/**
 * POST /api/2fa/disable
 * Disable 2FA for user
 */
router.post(
  '/disable',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFAEnabled: false },
    });

    await prisma.twoFASetup.delete({
      where: { userId },
    });

    logger.info('2FA disabled', { userId });

    return res.status(200).json({
      message: '2FA successfully disabled',
    });
  })
);

export default router;
