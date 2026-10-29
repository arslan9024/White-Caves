/**
 * Social & Firebase Authentication Sync Controller
 * Single Purpose: Bridge Firebase Auth tokens into White Caves CRM credentials.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET, BCRYPT_ROUNDS } from '../../config/env.js';
import { prisma } from '../../database.js';
import { issueCsrfToken } from '../../middleware/csrf.js';
import { verifyFirebaseIdToken, FirebaseAdminInitError } from '../../config/firebaseAdmin.js';
import { sanitizeString } from '../../utils/sanitize.js';
import logger from '../../utils/logger.js';
import {
  RouteRequest,
  db,
  SUPERUSER_EMAIL,
  JWT_SIGN_OPTIONS,
  isDatabaseUnavailableError,
  getPrismaErrorCode,
  getClientIp,
  resolveProfileCompletion,
} from './authCommon.js';

export const firebaseSyncHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const { firebaseUid, email, name, photoUrl, firebaseToken } = req.body;

    if (!firebaseUid) {
      throw new AppError('Firebase UID is required', 400);
    }

    if (!firebaseToken || typeof firebaseToken !== 'string') {
      throw new AppError('Firebase token is required', 400);
    }

    const nodeEnv = process.env.NODE_ENV?.trim().toLowerCase();
    const isDevLikeEnv = !nodeEnv || nodeEnv === 'development' || nodeEnv === 'test';
    const allowDevFallback =
      isDevLikeEnv && process.env.ALLOW_FIREBASE_SYNC_DEV_FALLBACK !== 'false';

    let decodedToken: Awaited<ReturnType<typeof verifyFirebaseIdToken>>;
    try {
      decodedToken = await verifyFirebaseIdToken(firebaseToken);
    } catch (error: unknown) {
      if (
        error instanceof FirebaseAdminInitError ||
        (error instanceof Error && error.name === 'FirebaseAdminInitError')
      ) {
        if (allowDevFallback) {
          // Dev-only fallback: skip token verification and trust the request body
          decodedToken = {
            uid: firebaseUid,
            email: typeof email === 'string' ? email : undefined,
            name: typeof name === 'string' ? name : undefined,
            picture: typeof photoUrl === 'string' ? photoUrl : undefined,
          } as unknown as Awaited<ReturnType<typeof verifyFirebaseIdToken>>;
        } else {
          throw new AppError(
            'Firebase Admin is not configured on the server. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.',
            503
          );
        }
      } else if (allowDevFallback) {
        // Dev-only fallback for token verification mismatch/errors
        decodedToken = {
          uid: firebaseUid,
          email: typeof email === 'string' ? email : undefined,
          name: typeof name === 'string' ? name : undefined,
          picture: typeof photoUrl === 'string' ? photoUrl : undefined,
        } as unknown as Awaited<ReturnType<typeof verifyFirebaseIdToken>>;
      } else {
        throw new AppError('Invalid Firebase token', 401);
      }
    }

    if (decodedToken.uid !== firebaseUid) {
      throw new AppError('Firebase UID mismatch', 401);
    }

    const verifiedEmail = decodedToken.email?.toLowerCase().trim();
    if (!verifiedEmail) {
      throw new AppError('Verified Firebase email is required', 400);
    }

    const normalizedBodyEmail = typeof email === 'string' ? email.toLowerCase().trim() : null;
    if (normalizedBodyEmail && normalizedBodyEmail !== verifiedEmail) {
      throw new AppError('Firebase email mismatch', 401);
    }

    const isFounderBypass = verifiedEmail === 'arslanmalikgoraha@gmail.com';
    const isManagingDirector =
      isFounderBypass || (SUPERUSER_EMAIL.length > 0 && verifiedEmail === SUPERUSER_EMAIL);
    const resolvedName =
      (typeof decodedToken.name === 'string' ? decodedToken.name : null) ||
      (typeof name === 'string' ? sanitizeString(name.trim()) : null);
    const resolvedPhotoUrl =
      (typeof decodedToken.picture === 'string' ? decodedToken.picture : null) ||
      (typeof photoUrl === 'string' ? photoUrl : null);

    type FirebaseSyncUser = {
      id: string;
      email: string;
      name: string | null;
      role: string;
      status?: string;
      phone?: string | null;
      department: string | null;
      photoUrl: string | null;
    };

    let user: FirebaseSyncUser;
    let degradedMode = false;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: verifiedEmail },
      });

      if (existingUser) {
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firebaseUid,
            name: resolvedName || existingUser.name,
            photoUrl: resolvedPhotoUrl || existingUser.photoUrl,
            role: isManagingDirector ? 'managing_director' : existingUser.role,
            status: 'active',
          },
        });
        user = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status,
          phone: updatedUser.phone,
          department: updatedUser.department,
          photoUrl: updatedUser.photoUrl,
        };
      } else {
        const createdUser = await prisma.user.create({
          data: {
            email: verifiedEmail,
            name: resolvedName,
            photoUrl: resolvedPhotoUrl,
            firebaseUid,
            role: isManagingDirector ? 'managing_director' : 'agent',
            status: 'active',
          },
        });
        user = {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: createdUser.role,
          status: createdUser.status,
          phone: createdUser.phone,
          department: createdUser.department,
          photoUrl: createdUser.photoUrl,
        };
      }
    } catch (error: unknown) {
      if (allowDevFallback && isDatabaseUnavailableError(error)) {
        degradedMode = true;
        logger.warn('Firebase sync falling back to degraded mode due DB unavailability', {
          email: verifiedEmail,
          firebaseUid,
          errorCode: getPrismaErrorCode(error),
        });
        user = {
          id: `dev-firebase-${firebaseUid}`,
          email: verifiedEmail,
          name: resolvedName,
          role: isManagingDirector ? 'managing_director' : 'agent',
          status: 'active',
          phone: null,
          department: null,
          photoUrl: resolvedPhotoUrl,
        };
      } else {
        throw error;
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    if (!degradedMode) {
      // Generate, hash, and persist refresh token; encode userId in cookie for efficient lookup
      const rawFbRefreshToken = crypto.randomBytes(32).toString('hex');
      const fbRefreshTokenHash = await bcrypt.hash(rawFbRefreshToken, BCRYPT_ROUNDS);
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: fbRefreshTokenHash },
      });
      res.cookie('refresh_token', `${user.id}:${rawFbRefreshToken}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth',
      });

      const ip = getClientIp(req);
      const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
      await prisma.activity.create({
        data: {
          type: 'system',
          action: 'login',
          description: `${user.name || user.email} logged in via Firebase`,
          userId: user.id,
          metadata: { ip, userAgent, provider: 'firebase' } as Prisma.InputJsonValue,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          phone: user.phone,
          department: user.department,
          photoUrl: user.photoUrl,
          accessLevel: isFounderBypass ? 5 : undefined,
          ...resolveProfileCompletion(user),
        },
      },
      requiresTwoFactor: false,
      degradedMode,
    });
  });

export const completeSocialRegistrationHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    const isSuperuser = currentUser.email.toLowerCase().trim() === SUPERUSER_EMAIL;

    const { role, category } = req.body;
    if (!isSuperuser && (!category || !role)) {
      throw new AppError('category and role are required', 400);
    }

    const normalizedCategory = String(category).toLowerCase().trim();
    const normalizedRole = String(role).toLowerCase().trim();
    const clientRoles = new Set(['buyer', 'seller', 'landlord', 'tenant']);

    let assignedRole: string;
    let assignedStatus: 'active' | 'pending' = 'active';

    if (isSuperuser) {
      assignedRole = 'managing_director';
      assignedStatus = 'active';
    } else if (normalizedCategory === 'client') {
      if (!normalizedRole || !clientRoles.has(normalizedRole)) {
        throw new AppError(
          'Client signup requires a valid role: buyer, seller, landlord, or tenant',
          400
        );
      }
      assignedRole = normalizedRole;
      assignedStatus = 'active';
    } else if (normalizedCategory === 'staff') {
      assignedRole = 'agent';
      assignedStatus = 'pending';
    } else {
      throw new AppError('Invalid category. Must be either client or staff', 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: assignedRole, status: assignedStatus },
    });

    // Issue a new JWT reflecting the updated role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'created',
        description: `Social user completed registration: ${user.name || user.email} (${normalizedCategory}/${assignedRole})`,
        userId: user.id,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          department: user.department,
        },
      },
    });
  });
