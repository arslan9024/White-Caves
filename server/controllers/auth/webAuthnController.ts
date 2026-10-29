/**
 * WebAuthn & Biometric Authentication Controller
 * Single Purpose: Hardware security key / FaceID biometric auth & credentials.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { JWT_SECRET } from '../../config/env.js';
import { prisma } from '../../database.js';
import { clearCsrfToken, issueCsrfToken } from '../../middleware/csrf.js';
import { sanitizeString } from '../../utils/sanitize.js';
import logger from '../../utils/logger.js';
import {
  RouteRequest,
  db,
  getClientIp,
  getRouteParam,
  JWT_SIGN_OPTIONS,
  resolveProfileCompletion,
} from './authCommon.js';

/**
 * In-memory challenge store — keyed by challengeKey (userId or 'anon_<ip>').
 * Challenges expire after 5 minutes.
 */
interface PendingChallenge {
  challenge: string;
  userId?: string;
  expiresAt: number;
}
const pendingChallenges = new Map<string, PendingChallenge>();
const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Prune expired challenges periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, c] of pendingChallenges) {
    if (c.expiresAt <= now) pendingChallenges.delete(key);
  }
}, 60 * 1000).unref();

const generateChallenge = (): string => {
  return crypto.randomBytes(32).toString('base64url');
};

export const webauthnRegisterOptionsHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const authUserId = req.user?.id;
    if (!authUserId) {
      throw new AppError('Authentication required', 401);
    }

    const { userId, userName, displayName } = req.body;

    if (!userId || !userName) {
      throw new AppError('userId and userName are required', 400);
    }

    const sanitizedUserId = sanitizeString(String(userId).trim()).slice(0, 128);
    const sanitizedUserName = sanitizeString(String(userName).trim()).slice(0, 128);
    const sanitizedDisplayName = sanitizeString(String(displayName || userName).trim()).slice(
      0,
      128
    );

    const callerRole = (req.user?.role || '').toLowerCase();
    const isSuperuser = callerRole === 'owner' || callerRole === 'admin';
    if (sanitizedUserId !== authUserId && !isSuperuser) {
      throw new AppError('Forbidden: Cannot register biometrics for another user', 403);
    }

    const challenge = generateChallenge();
    pendingChallenges.set(`reg_${sanitizedUserId}`, {
      challenge,
      userId: sanitizedUserId,
      expiresAt: Date.now() + CHALLENGE_TTL_MS,
    });

    const options = {
      challenge,
      rp: {
        name: process.env.RP_NAME || 'White Caves CRM',
        id:
          process.env.RP_ID ||
          (process.env.NODE_ENV === 'production' ? 'whitecaves.ae' : 'localhost'),
      },
      user: {
        id: Buffer.from(sanitizedUserId).toString('base64url'),
        name: sanitizedUserName,
        displayName: sanitizedDisplayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' as const }, // ES256
        { alg: -257, type: 'public-key' as const }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform' as const,
        userVerification: 'required' as const,
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: 'none' as const,
    };

    res.status(200).json({ success: true, options });
  });

export const webauthnRegisterVerifyHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const authUserId = req.user?.id;
    if (!authUserId) {
      throw new AppError('Authentication required', 401);
    }

    const { userId, credential } = req.body;

    if (!userId || !credential?.id || !credential?.rawId) {
      throw new AppError('userId and credential are required', 400);
    }

    const sanitizedUserId = sanitizeString(String(userId).trim()).slice(0, 128);

    const callerRole = (req.user?.role || '').toLowerCase();
    const isSuperuser = callerRole === 'owner' || callerRole === 'admin';
    if (sanitizedUserId !== authUserId && !isSuperuser) {
      throw new AppError('Forbidden: Cannot register biometrics for another user', 403);
    }

    const pending = pendingChallenges.get(`reg_${sanitizedUserId}`);
    if (!pending || pending.expiresAt <= Date.now()) {
      throw new AppError('Registration challenge expired or not found. Please try again.', 400);
    }
    pendingChallenges.delete(`reg_${sanitizedUserId}`);

    const credentialId = sanitizeString(String(credential.id).trim()).slice(0, 512);
    const rawId = sanitizeString(String(credential.rawId).trim()).slice(0, 512);
    const publicKey = credential.response?.attestationObject
      ? sanitizeString(String(credential.response.attestationObject).trim()).slice(0, 4096)
      : '';

    // Store credential — upsert by credentialId
    await (
      prisma as unknown as { webAuthnCredential: { upsert: (args: unknown) => Promise<unknown> } }
    ).webAuthnCredential.upsert({
      where: { credentialId },
      create: {
        userId: sanitizedUserId,
        credentialId,
        publicKey: publicKey || rawId,
        counter: 0,
        deviceType: 'platform',
        transports: ['internal'],
      },
      update: {
        lastUsedAt: new Date(),
      },
    });

    logger.info('WebAuthn credential registered', { userId: sanitizedUserId, credentialId });

    res.status(200).json({
      success: true,
      message: 'Biometric authentication registered successfully',
    });
  });

export const webauthnAuthenticateOptionsHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const { userId } = req.body;

    const challenge = generateChallenge();
    const challengeKey = userId
      ? `auth_${sanitizeString(String(userId).trim()).slice(0, 128)}`
      : `auth_anon_${getClientIp(req)}`;

    pendingChallenges.set(challengeKey, {
      challenge,
      userId: userId ? sanitizeString(String(userId).trim()).slice(0, 128) : undefined,
      expiresAt: Date.now() + CHALLENGE_TTL_MS,
    });

    const options = {
      challenge,
      timeout: 60000,
      userVerification: 'required' as const,
      rpId:
        process.env.RP_ID ||
        (process.env.NODE_ENV === 'production' ? 'whitecaves.ae' : 'localhost'),
    };

    res.status(200).json({ success: true, options });
  });

export const webauthnAuthenticateVerifyHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const { credential, userId } = req.body;

    if (!credential?.id) {
      throw new AppError('Credential is required', 400);
    }

    const credentialId = sanitizeString(String(credential.id).trim()).slice(0, 512);

    const challengeKey = userId
      ? `auth_${sanitizeString(String(userId).trim()).slice(0, 128)}`
      : `auth_anon_${getClientIp(req)}`;

    const pending = pendingChallenges.get(challengeKey);
    if (!pending || pending.expiresAt <= Date.now()) {
      // Also try without userId in case client sent it differently
      let found = false;
      for (const [key, val] of pendingChallenges) {
        if (key.startsWith('auth_') && val.expiresAt > Date.now()) {
          pendingChallenges.delete(key);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new AppError('Authentication challenge expired or not found. Please try again.', 400);
      }
    } else {
      pendingChallenges.delete(challengeKey);
    }

    // Look up credential in database
    const storedCred = await (
      prisma as unknown as {
        webAuthnCredential: {
          findUnique: (
            args: unknown
          ) => Promise<{ userId: string; credentialId: string; counter: number } | null>;
          update: (args: unknown) => Promise<unknown>;
        };
      }
    ).webAuthnCredential.findUnique({
      where: { credentialId },
    });

    if (!storedCred) {
      throw new AppError('Credential not found. Please register your biometric first.', 401);
    }

    // Look up user by the userId stored with the credential
    const user = await prisma.user.findUnique({
      where: { id: storedCred.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        photoUrl: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError('User account not found', 401);
    }

    if (user.status && user.status !== 'active') {
      throw new AppError('Account is inactive. Contact administrator.', 403);
    }

    // Update last used timestamp and counter
    await (
      prisma as unknown as { webAuthnCredential: { update: (args: unknown) => Promise<unknown> } }
    ).webAuthnCredential.update({
      where: { credentialId },
      data: {
        lastUsedAt: new Date(),
        counter: storedCred.counter + 1,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'login',
        description: `${user.name || user.email} logged in via biometric`,
        userId: user.id,
        metadata: { ip, userAgent, provider: 'webauthn' } as Prisma.InputJsonValue,
      },
    });

    logger.info('WebAuthn authentication successful', { userId: user.id, email: user.email });

    res.status(200).json({
      success: true,
      userId: user.id,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        photoUrl: user.photoUrl,
      },
    });
  });

export const webauthnDeleteCredentialHandler =   asyncHandler(async (req: AuthRequest, res: Response) => {
    const authUserId = req.user?.id;
    if (!authUserId) {
      throw new AppError('Authentication required', 401);
    }

    const rawUserId = getRouteParam(req.params.userId);
    const rawCredId = getRouteParam(req.params.credentialId);

    if (!rawUserId || !rawCredId) {
      throw new AppError('userId and credentialId are required', 400);
    }

    const sanitizedUserId = sanitizeString(decodeURIComponent(rawUserId)).slice(0, 128);
    const sanitizedCredId = sanitizeString(decodeURIComponent(rawCredId)).slice(0, 512);

    const callerRole = (req.user?.role || '').toLowerCase();
    const isSuperuser = callerRole === 'owner' || callerRole === 'admin';
    if (sanitizedUserId !== authUserId && !isSuperuser) {
      throw new AppError('Forbidden: Cannot delete biometrics for another user', 403);
    }

    await (
      prisma as unknown as {
        webAuthnCredential: { deleteMany: (args: unknown) => Promise<unknown> };
      }
    ).webAuthnCredential.deleteMany({
      where: {
        userId: sanitizedUserId,
        credentialId: sanitizedCredId,
      },
    });

    res.status(200).json({ success: true, message: 'Credential removed' });
  });
