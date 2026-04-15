/**
 * Authentication Routes — Full Implementation
 * Login, logout, 2FA verification, user profile, password change
 */

import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import authMiddleware from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth';
import { JWT_SECRET, JWT_EXPIRES_SECONDS, BCRYPT_ROUNDS } from '../config/env';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import logger from '../utils/logger.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

const router = Router();

/**
 * Hash a password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Verify a password against a bcrypt hash.
 * Also handles legacy base64 hashes (auto-migrated on next login).
 */
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!hash) return false;
  // Modern bcrypt hash
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return bcrypt.compare(password, hash);
  }
  // Legacy base64 hash from earlier dev (auto-migrate on next login)
  if (hash.startsWith('wc$')) {
    return Buffer.from(hash.slice(3), 'base64').toString() === password;
  }
  // No plain-text fallback — reject unknown hash formats
  return false;
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password (uses proper passwordHash column)
    const storedHash = user.passwordHash;
    if (storedHash) {
      const valid = await verifyPassword(password, storedHash);
      if (!valid) {
        throw new AppError('Invalid email or password', 401);
      }
      // Auto-migrate legacy hashes to bcrypt on successful login
      if (!storedHash.startsWith('$2a$') && !storedHash.startsWith('$2b$')) {
        const newHash = await hashPassword(password);
        await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
      }
    } else {
      // No password set — reject login (admin must set password first)
      throw new AppError('Account not configured. Contact administrator.', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_SECONDS }
    );

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'login',
        description: `${user.name || user.email} logged in`,
        userId: user.id,
      },
    });

    sendSuccess(res, {
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
  })
);

/**
 * POST /api/auth/register
 * Register a new user (always assigned 'agent' role — admin must upgrade)
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, phone, department } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      throw new AppError('Please provide a valid email address', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }
    // Require at least one letter and one number
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      throw new AppError('Password must contain at least one letter and one number', 400);
    }
    // Block common weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty12', 'abc12345', 'admin123', 'welcome1', 'letmein12', 'changeme'];
    if (weakPasswords.includes(password.toLowerCase())) {
      throw new AppError('Password is too common. Please choose a stronger password.', 400);
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Security: Always assign 'agent' role on self-registration
    // Admin-only endpoint required for elevated role assignment
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name ? sanitizeString(name.trim()) : null,
          role: 'agent',
          phone: phone ? sanitizeString(String(phone).trim()) : null,
          department: department ? sanitizeString(String(department).trim()) : null,
          status: 'active',
          passwordHash: hashedPassword,
        },
      });
    } catch (err: unknown) {
      // Handle race condition: two simultaneous registrations with same email
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new AppError('Email already registered', 409);
      }
      throw err;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_SECONDS }
    );

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'created',
        description: `New user registered: ${user.name || user.email}`,
        userId: user.id,
      },
    });

    sendCreated(res, {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        },
      });
  })
);

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA code (placeholder — ready for SMS/TOTP integration)
 */
router.post(
  '/verify-2fa',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, code } = req.body;

    if (!email || !code) {
      throw new AppError('Email and verification code are required', 400);
    }

    // Dev-only 2FA bypass: requires BOTH NODE_ENV=development AND DEV_2FA_BYPASS=true
    if (process.env.NODE_ENV === 'development' && process.env.DEV_2FA_BYPASS === 'true' && code === '000000') {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AppError('User not found', 404);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_SECONDS }
      );

      sendSuccess(res, { token, verified: true });
      return;
    }

    // TODO: Implement real 2FA verification (Twilio SMS or TOTP)
    throw new AppError('2FA verification not yet configured', 501);
  })
);

/**
 * GET /api/auth/profile
 * Get current user profile (requires auth)
 */
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        photoUrl: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            leadsAssigned: true,
            commissions: true,
            properties: true,
          },
        },
      },
    });

    if (!user) throw new AppError('User not found', 404);

    sendSuccess(res, user);
  })
);

/**
 * PATCH /api/auth/profile
 * Update current user profile
 */
router.patch(
  '/profile',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { name, phone, photoUrl } = req.body;
    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      const sanitized = sanitizeString(name.trim());
      if (sanitized.length > 100) throw new AppError('Name must be 100 characters or less', 400);
      data.name = sanitized;
    }
    if (phone !== undefined) {
      const sanitized = sanitizeString((phone || '').trim());
      if (sanitized.length > 30) throw new AppError('Phone must be 30 characters or less', 400);
      data.phone = sanitized || null;
    }
    if (photoUrl !== undefined) {
      const url = (photoUrl || '').trim();
      if (url && !/^https?:\/\//i.test(url)) throw new AppError('Photo URL must be a valid HTTP/HTTPS URL', 400);
      if (url.length > 500) throw new AppError('Photo URL must be 500 characters or less', 400);
      data.photoUrl = url || null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, department: true, photoUrl: true,
      },
    });

    sendSuccess(res, user);
  })
);

/**
 * POST /api/auth/firebase-sync
 * Sync a Firebase-authenticated user with the backend.
 * If the user exists (by email), issues a JWT.
 * If the user doesn't exist, creates them and issues a JWT.
 * This bridges Firebase social/phone auth with backend JWT auth.
 */
router.post(
  '/firebase-sync',
  asyncHandler(async (req: Request, res: Response) => {
    const { firebaseUid, email, name, photoUrl, firebaseToken } = req.body;

    if (!firebaseUid) {
      throw new AppError('Firebase UID is required', 400);
    }

    // SECURITY: Block this endpoint until Firebase Admin SDK is configured.
    // Without firebase-admin, we CANNOT verify the token server-side, so accepting it
    // would allow account takeover by anyone who knows a user's email.
    // This MUST remain disabled in ALL environments until firebase-admin token verification is added.
    //
    // TODO: When firebase-admin is installed and configured:
    //   1. Verify firebaseToken with admin.auth().verifyIdToken(firebaseToken)
    //   2. Find or create user by firebaseUid (source of truth), then by email
    //   3. Generate JWT and return user data
    throw new AppError(
      'Firebase sync is disabled until firebase-admin SDK is configured for server-side token verification. ' +
      'Contact your administrator to enable this endpoint.',
      503
    );
  })
);

/**
 * POST /api/auth/logout
 * Logout user (requires auth)
 */
router.post(
  '/logout',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'logout',
        description: 'User logged out',
        userId,
      },
    });

    sendSuccess(res, null, 'Logged out successfully');
  })
);

/**
 * PUT /api/auth/password
 * Change password (requires auth)
 */
router.put(
  '/password',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    // Block common weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty12', 'abc12345', 'admin123', 'welcome1', 'letmein12', 'changeme'];
    if (weakPasswords.includes(newPassword.toLowerCase())) {
      throw new AppError('Password is too common. Please choose a stronger password.', 400);
    }

    // Require at least one letter and one number
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw new AppError('Password must contain at least one letter and one number', 400);
    }

    // Verify current password if one exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const storedHash = user.passwordHash;
    if (storedHash) {
      if (!currentPassword) {
        throw new AppError('Current password is required to change password', 400);
      }
      const valid = await verifyPassword(currentPassword, storedHash);
      if (!valid) {
        throw new AppError('Current password is incorrect', 401);
      }
    }

    // Hash and store the new password
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    sendSuccess(res, null, 'Password updated successfully');
  })
);

export default router;
