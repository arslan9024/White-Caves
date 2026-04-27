/**
 * Authentication Routes — Full Implementation
 * Login, logout, 2FA verification, user profile, password change
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import authMiddleware from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth';
import { JWT_SECRET, JWT_EXPIRES_SECONDS, BCRYPT_ROUNDS } from '../config/env';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import logger from '../utils/logger.js';
import { verifyFirebaseIdToken, FirebaseAdminInitError } from '../config/firebaseAdmin.js';

const router = Router();

const JWT_SIGN_OPTIONS: SignOptions = {
  expiresIn: JWT_EXPIRES_SECONDS,
  algorithm: 'HS256',
  issuer: process.env.JWT_ISSUER || 'white-caves-crm',
  audience: process.env.JWT_AUDIENCE || 'white-caves-clients',
};

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
 * Extract a best-effort client IP from common proxy headers.
 * Falls back to req.ip when no header is present.
 */
const getClientIp = (req: Request): string => {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return (req.ip || req.socket?.remoteAddress || 'unknown').toString();
};

/**
 * Record a failed login attempt for audit purposes.
 * Fire-and-forget — never blocks the response or surfaces errors to the client.
 */
const recordLoginFailure = (
  req: Request,
  reason:
    | 'unknown_user'
    | 'invalid_password'
    | 'inactive'
    | 'no_password'
    | 'locked_out'
    | 'ip_locked_out',
  emailAttempt: string,
  userId?: string
): void => {
  const ip = getClientIp(req);
  const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
  logger.warn('Login failed', { reason, emailAttempt, ip, userAgent, userId });
  // Persist as an Activity row for audit trail; don't await.
  prisma.activity
    .create({
      data: {
        type: 'system',
        action: 'login_failed',
        description: `Failed login attempt for ${emailAttempt} (${reason})`,
        userId: userId ?? null,
        metadata: { reason, emailAttempt, ip, userAgent } as Prisma.InputJsonValue,
      },
    })
    .catch((err: unknown) => {
      logger.warn('Failed to persist login_failed activity', { err });
    });
};

/**
 * Per-account brute-force lockout configuration.
 * Tunable via env so security teams can tighten without a redeploy.
 */
const LOGIN_LOCKOUT_THRESHOLD = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_LOCKOUT_THRESHOLD || '5', 10) || 5
);
const LOGIN_LOCKOUT_WINDOW_MINUTES = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_LOCKOUT_WINDOW_MINUTES || '15', 10) || 15
);

/**
 * Per-IP brute-force threshold — defends against credential-stuffing attacks
 * where a single IP rotates through many usernames so the per-account
 * lockout never triggers. Tunable via env.
 */
const LOGIN_IP_LOCKOUT_THRESHOLD = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_IP_LOCKOUT_THRESHOLD || '20', 10) || 20
);

/**
 * Check whether the source IP should be throttled because it's responsible for
 * too many failed logins (across any number of accounts) inside the rolling
 * window. Returns the same shape as the per-account check so the route can
 * treat both lockouts uniformly.
 */
const checkIpLockout = async (
  ip: string
): Promise<{ locked: boolean; retryAfterSeconds: number; failureCount: number }> => {
  if (!ip || ip === 'unknown') return { locked: false, retryAfterSeconds: 0, failureCount: 0 };
  const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
  const failureCount = await prisma.activity.count({
    where: {
      type: 'system',
      action: 'login_failed',
      createdAt: { gte: since },
      metadata: { path: ['ip'], equals: ip } as Prisma.JsonFilter,
    },
  });
  if (failureCount < LOGIN_IP_LOCKOUT_THRESHOLD) {
    return { locked: false, retryAfterSeconds: 0, failureCount };
  }
  const oldest = await prisma.activity.findFirst({
    where: {
      type: 'system',
      action: 'login_failed',
      createdAt: { gte: since },
      metadata: { path: ['ip'], equals: ip } as Prisma.JsonFilter,
    },
    orderBy: { createdAt: 'asc' },
  });
  const baseTs = oldest?.createdAt?.getTime?.() ?? Date.now();
  const unlockAt = baseTs + LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000;
  const retryAfterSeconds = Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
  return { locked: true, retryAfterSeconds, failureCount };
};

/**
 * Check whether a user account should be temporarily locked due to repeated
 * failed login attempts. Counts only `login_failed` Activity rows for the
 * given userId within the rolling window.
 */
const checkAccountLockout = async (
  userId: string
): Promise<{ locked: boolean; retryAfterSeconds: number; failureCount: number }> => {
  const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
  const failureCount = await prisma.activity.count({
    where: {
      type: 'system',
      action: 'login_failed',
      userId,
      createdAt: { gte: since },
    },
  });
  if (failureCount < LOGIN_LOCKOUT_THRESHOLD) {
    return { locked: false, retryAfterSeconds: 0, failureCount };
  }
  // Unlock window starts from the oldest failure still inside the rolling window.
  const oldest = await prisma.activity.findFirst({
    where: {
      type: 'system',
      action: 'login_failed',
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: 'asc' },
  });
  const baseTs = oldest?.createdAt?.getTime?.() ?? Date.now();
  const unlockAt = baseTs + LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000;
  const retryAfterSeconds = Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
  return { locked: true, retryAfterSeconds, failureCount };
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

    const normalizedEmail = String(email).toLowerCase().trim();

    // Per-IP brute-force throttle — runs first so credential-stuffing attacks
    // that rotate usernames hit the wall regardless of which user they target.
    const clientIp = getClientIp(req);
    const ipLockout = await checkIpLockout(clientIp);
    if (ipLockout.locked) {
      recordLoginFailure(req, 'ip_locked_out', normalizedEmail);
      const minutes = Math.ceil(ipLockout.retryAfterSeconds / 60);
      res.set('Retry-After', String(ipLockout.retryAfterSeconds));
      throw new AppError(
        `Too many failed login attempts from this network (${ipLockout.failureCount}). Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        429
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      recordLoginFailure(req, 'unknown_user', normalizedEmail);
      throw new AppError('Invalid email or password', 401);
    }

    // Only active users can authenticate
    if (user.status && user.status !== 'active') {
      recordLoginFailure(req, 'inactive', normalizedEmail, user.id);
      throw new AppError('Account is inactive. Contact administrator.', 403);
    }

    // Per-account brute-force lockout — checked BEFORE the expensive bcrypt
    // compare so a locked account responds quickly.
    const lockout = await checkAccountLockout(user.id);
    if (lockout.locked) {
      recordLoginFailure(req, 'locked_out', normalizedEmail, user.id);
      const minutes = Math.ceil(lockout.retryAfterSeconds / 60);
      res.set('Retry-After', String(lockout.retryAfterSeconds));
      throw new AppError(
        `Account temporarily locked after ${lockout.failureCount} failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
        429
      );
    }

    // Check password (uses proper passwordHash column)
    const storedHash = user.passwordHash;
    if (storedHash) {
      const valid = await verifyPassword(password, storedHash);
      if (!valid) {
        recordLoginFailure(req, 'invalid_password', normalizedEmail, user.id);
        throw new AppError('Invalid email or password', 401);
      }
      // Auto-migrate legacy hashes to bcrypt on successful login
      if (!storedHash.startsWith('$2a$') && !storedHash.startsWith('$2b$')) {
        const newHash = await hashPassword(password);
        await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
      }
    } else {
      // No password set — reject login (admin must set password first)
      recordLoginFailure(req, 'no_password', normalizedEmail, user.id);
      throw new AppError('Account not configured. Contact administrator.', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    // Log activity with enriched audit metadata (IP + UA) for forensics.
    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'login',
        description: `${user.name || user.email} logged in`,
        userId: user.id,
        metadata: { ip, userAgent } as Prisma.InputJsonValue,
      },
    });
    logger.info('Login successful', { userId: user.id, email: user.email, ip, userAgent });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          photoUrl: user.photoUrl,
        },
      },
      requiresTwoFactor: false, // 2FA can be enabled later
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
    const weakPasswords = [
      'password',
      '12345678',
      'qwerty12',
      'abc12345',
      'admin123',
      'welcome1',
      'letmein12',
      'changeme',
    ];
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
      JWT_SIGN_OPTIONS
    );

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'created',
        description: `New user registered: ${user.name || user.email}`,
        userId: user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        },
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
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DEV_2FA_BYPASS === 'true' &&
      code === '000000'
    ) {
      const user = await prisma.user.findUnique({ where: { email } });
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

    res.status(200).json({ success: true, data: user });
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
      if (url && !/^https?:\/\//i.test(url))
        throw new AppError('Photo URL must be a valid HTTP/HTTPS URL', 400);
      if (url.length > 500) throw new AppError('Photo URL must be 500 characters or less', 400);
      data.photoUrl = url || null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        department: true,
        photoUrl: true,
      },
    });

    res.status(200).json({ success: true, data: user });
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

    if (!firebaseToken || typeof firebaseToken !== 'string') {
      throw new AppError('Firebase token is required', 400);
    }

    let decodedToken;
    try {
      decodedToken = await verifyFirebaseIdToken(firebaseToken);
    } catch (error: unknown) {
      if (error instanceof FirebaseAdminInitError) {
        throw new AppError(
          'Firebase Admin is not configured on the server. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.',
          503
        );
      }
      throw new AppError('Invalid Firebase token', 401);
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

    const isManagingDirector = verifiedEmail === 'arslanmalikgoraha@gmail.com';
    const resolvedName =
      (typeof decodedToken.name === 'string' ? decodedToken.name : null) ||
      (typeof name === 'string' ? sanitizeString(name.trim()) : null);
    const resolvedPhotoUrl =
      (typeof decodedToken.picture === 'string' ? decodedToken.picture : null) ||
      (typeof photoUrl === 'string' ? photoUrl : null);

    let user = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firebaseUid,
          name: resolvedName || user.name,
          photoUrl: resolvedPhotoUrl || user.photoUrl,
          role: isManagingDirector ? 'managing_director' : user.role,
          status: 'active',
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: verifiedEmail,
          name: resolvedName,
          photoUrl: resolvedPhotoUrl,
          firebaseUid,
          role: isManagingDirector ? 'managing_director' : 'agent',
          status: 'active',
        },
      });
    }

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
        description: `${user.name || user.email} logged in via Firebase`,
        userId: user.id,
        metadata: { ip, userAgent, provider: 'firebase' } as Prisma.InputJsonValue,
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
          department: user.department,
          photoUrl: user.photoUrl,
        },
      },
      requiresTwoFactor: false,
    });
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

    res.status(200).json({ success: true, message: 'Logged out successfully' });
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
    const weakPasswords = [
      'password',
      '12345678',
      'qwerty12',
      'abc12345',
      'admin123',
      'welcome1',
      'letmein12',
      'changeme',
    ];
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

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);

    const storedHash = user.passwordHash;
    if (storedHash) {
      if (!currentPassword) {
        // Fire-and-forget audit; never block the 400 response
        prisma.activity
          .create({
            data: {
              type: 'system',
              action: 'password_change_failed',
              description: `Password change rejected for ${user.email}: missing current password`,
              userId,
              metadata: {
                reason: 'missing_current_password',
                ip,
                userAgent,
              } as Prisma.InputJsonValue,
            },
          })
          .catch(err => logger.warn('Failed to audit password_change_failed', { err }));
        throw new AppError('Current password is required to change password', 400);
      }
      const valid = await verifyPassword(currentPassword, storedHash);
      if (!valid) {
        prisma.activity
          .create({
            data: {
              type: 'system',
              action: 'password_change_failed',
              description: `Password change rejected for ${user.email}: invalid current password`,
              userId,
              metadata: {
                reason: 'invalid_current_password',
                ip,
                userAgent,
              } as Prisma.InputJsonValue,
            },
          })
          .catch(err => logger.warn('Failed to audit password_change_failed', { err }));
        throw new AppError('Current password is incorrect', 401);
      }
    }

    // Hash and store the new password
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Audit success
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_changed',
        description: `Password changed for ${user.email}`,
        userId,
        metadata: { ip, userAgent } as Prisma.InputJsonValue,
      },
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  })
);

/**
 * GET /api/auth/security/login-attempts
 * Admin-only forensic view of recent login activity (success + failed).
 *
 * Query params:
 *   - email   : filter by emailAttempt or user.email (case-insensitive substring)
 *   - status  : 'failed' | 'success' | 'password' | 'all' (default: 'all')
 *   - limit   : 1-200 (default: 50)
 *   - sinceMinutes : restrict to last N minutes (default: 1440 = 24h)
 */
router.get(
  '/security/login-attempts',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const status = String(req.query.status || 'all').toLowerCase();
    const emailFilter = req.query.email ? String(req.query.email).toLowerCase().trim() : null;
    const rawLimit = Number.parseInt(String(req.query.limit ?? '50'), 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 50;
    const rawSince = Number.parseInt(String(req.query.sinceMinutes ?? '1440'), 10);
    const sinceMinutes = Number.isFinite(rawSince)
      ? Math.min(Math.max(rawSince, 1), 60 * 24 * 30)
      : 1440;

    const actions: string[] =
      status === 'failed'
        ? ['login_failed']
        : status === 'success'
          ? ['login']
          : status === 'password'
            ? ['password_changed', 'password_change_failed']
            : [
                'login',
                'login_failed',
                'password_changed',
                'password_change_failed',
                'account_unlocked',
                'ip_unlocked',
              ];

    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);

    const where: Prisma.ActivityWhereInput = {
      type: 'system',
      action: { in: actions },
      createdAt: { gte: since },
    };

    if (emailFilter) {
      where.OR = [
        { description: { contains: emailFilter, mode: 'insensitive' } },
        { user: { is: { email: { contains: emailFilter, mode: 'insensitive' } } } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, email: true, name: true, role: true } } },
    });

    res.status(200).json({
      success: true,
      data: activities.map(a => ({
        id: a.id,
        action: a.action,
        description: a.description,
        createdAt: a.createdAt,
        userId: a.userId,
        user: a.user,
        metadata: a.metadata,
      })),
      meta: { count: activities.length, limit, sinceMinutes, status, emailFilter },
    });
  })
);

/**
 * POST /api/auth/security/unlock
 * Admin-only — clear a locked account by deleting its recent `login_failed`
 * Activity rows inside the rolling lockout window. Persists an audit trail
 * (`account_unlocked`) noting which admin performed the reset.
 *
 * Body: { userId?: string, email?: string }  (one is required)
 */
router.post(
  '/security/unlock',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const { userId, email } = req.body || {};
    if (!userId && !email) {
      throw new AppError('Provide either userId or email', 400);
    }

    const target = userId
      ? await prisma.user.findUnique({ where: { id: String(userId) } })
      : await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });

    if (!target) throw new AppError('User not found', 404);

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const result = await prisma.activity.deleteMany({
      where: {
        type: 'system',
        action: 'login_failed',
        userId: target.id,
        createdAt: { gte: since },
      },
    });

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'account_unlocked',
        description: `Account ${target.email} unlocked by ${req.user?.email || req.user?.id} (${result.count} failed attempts cleared)`,
        userId: target.id,
        metadata: {
          unlockedBy: req.user?.id,
          unlockedByEmail: req.user?.email,
          clearedFailures: result.count,
          ip,
          userAgent,
        } as Prisma.InputJsonValue,
      },
    });

    logger.info('Account unlocked by admin', {
      targetUserId: target.id,
      targetEmail: target.email,
      adminId: req.user?.id,
      clearedFailures: result.count,
    });

    res.status(200).json({
      success: true,
      data: {
        userId: target.id,
        email: target.email,
        clearedFailures: result.count,
      },
    });
  })
);

/**
 * POST /api/auth/security/unlock-ip
 * Admin-only — release a falsely-flagged source IP (shared NAT, office gateway,
 * VPN exit node) by deleting recent `login_failed` Activity rows whose
 * `metadata.ip` matches inside the rolling lockout window. Persists an
 * `ip_unlocked` Activity noting which admin performed the reset.
 *
 * Body: { ip: string }
 */
router.post(
  '/security/unlock-ip',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const ipRaw = typeof req.body?.ip === 'string' ? req.body.ip.trim() : '';
    if (!ipRaw) throw new AppError('Provide an ip address to unlock', 400);
    if (ipRaw.length > 64) throw new AppError('Invalid ip address', 400);

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const result = await prisma.activity.deleteMany({
      where: {
        type: 'system',
        action: 'login_failed',
        createdAt: { gte: since },
        metadata: { path: ['ip'], equals: ipRaw } as Prisma.JsonFilter,
      },
    });

    const adminIp = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'ip_unlocked',
        description: `IP ${ipRaw} unlocked by ${req.user?.email || req.user?.id} (${result.count} failed attempts cleared)`,
        userId: req.user?.id,
        metadata: {
          unlockedIp: ipRaw,
          unlockedBy: req.user?.id,
          unlockedByEmail: req.user?.email,
          clearedFailures: result.count,
          ip: adminIp,
          userAgent,
        } as Prisma.InputJsonValue,
      },
    });

    logger.info('IP unlocked by admin', {
      ip: ipRaw,
      adminId: req.user?.id,
      clearedFailures: result.count,
    });

    res.status(200).json({
      success: true,
      data: { ip: ipRaw, clearedFailures: result.count },
    });
  })
);

/**
 * GET /api/auth/security/active-lockouts
 * Admin-only — surfaces accounts and IPs that are CURRENTLY locked out
 * (failure count ≥ threshold inside the rolling window). Returned items
 * include a retryAfterSeconds derived from the oldest in-window failure so
 * SecOps can see how long the lockout has left to run before an admin
 * needs to intervene.
 *
 * Returns:
 *   {
 *     windowMinutes, accountThreshold, ipThreshold,
 *     accounts: Array<{ userId, email, failures, retryAfterSeconds }>,
 *     ips:      Array<{ ip, failures, retryAfterSeconds }>,
 *   }
 */
router.get(
  '/security/active-lockouts',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const since = new Date(Date.now() - LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000);
    const rows = await prisma.activity.findMany({
      where: {
        type: 'system',
        action: 'login_failed',
        createdAt: { gte: since },
      },
      select: {
        userId: true,
        createdAt: true,
        metadata: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5000,
    });

    interface Bucket {
      key: string;
      label: string | null;
      failures: number;
      oldest: Date;
    }
    const accountBuckets = new Map<string, Bucket>();
    const ipBuckets = new Map<string, Bucket>();

    for (const r of rows) {
      const md = (r.metadata || {}) as Record<string, unknown>;
      if (r.userId) {
        const b = accountBuckets.get(r.userId);
        if (b) {
          b.failures += 1;
        } else {
          accountBuckets.set(r.userId, {
            key: r.userId,
            label: r.user?.email ?? null,
            failures: 1,
            oldest: r.createdAt,
          });
        }
      }
      const ip = typeof md.ip === 'string' ? md.ip : null;
      if (ip && ip !== 'unknown') {
        const b = ipBuckets.get(ip);
        if (b) {
          b.failures += 1;
        } else {
          ipBuckets.set(ip, { key: ip, label: ip, failures: 1, oldest: r.createdAt });
        }
      }
    }

    const now = Date.now();
    const windowMs = LOGIN_LOCKOUT_WINDOW_MINUTES * 60 * 1000;
    const computeRetry = (oldest: Date): number =>
      Math.max(1, Math.ceil((oldest.getTime() + windowMs - now) / 1000));

    const accounts = [...accountBuckets.values()]
      .filter(b => b.failures >= LOGIN_LOCKOUT_THRESHOLD)
      .sort((a, b) => b.failures - a.failures)
      .map(b => ({
        userId: b.key,
        email: b.label,
        failures: b.failures,
        retryAfterSeconds: computeRetry(b.oldest),
      }));

    const ips = [...ipBuckets.values()]
      .filter(b => b.failures >= LOGIN_IP_LOCKOUT_THRESHOLD)
      .sort((a, b) => b.failures - a.failures)
      .map(b => ({
        ip: b.key,
        failures: b.failures,
        retryAfterSeconds: computeRetry(b.oldest),
      }));

    res.status(200).json({
      success: true,
      data: {
        windowMinutes: LOGIN_LOCKOUT_WINDOW_MINUTES,
        accountThreshold: LOGIN_LOCKOUT_THRESHOLD,
        ipThreshold: LOGIN_IP_LOCKOUT_THRESHOLD,
        accounts,
        ips,
      },
    });
  })
);

/**
 * GET /api/auth/security/stats
 * Admin-only — aggregate counts for the Login Security dashboard.
 *
 * Query params:
 *   - sinceMinutes : restrict to last N minutes (default: 1440 = 24h, max: 30d)
 *
 * Returns:
 *   {
 *     totals: { logins, loginFailures, passwordChanges, passwordChangeFailures, accountUnlocks },
 *     uniqueIpCount: number,
 *     topOffendingIps: Array<{ ip: string, failures: number }>,  // top 5
 *     topTargetedEmails: Array<{ email: string, failures: number }>, // top 5
 *     windowMinutes: number,
 *   }
 */
router.get(
  '/security/stats',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role;
    const allowedRoles = ['owner', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      throw new AppError('Forbidden — admin access required', 403);
    }

    const rawSince = Number.parseInt(String(req.query.sinceMinutes ?? '1440'), 10);
    const sinceMinutes = Number.isFinite(rawSince)
      ? Math.min(Math.max(rawSince, 1), 60 * 24 * 30)
      : 1440;
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);

    const trackedActions = [
      'login',
      'login_failed',
      'password_changed',
      'password_change_failed',
      'account_unlocked',
      'ip_unlocked',
    ];

    const rows = await prisma.activity.findMany({
      where: {
        type: 'system',
        action: { in: trackedActions },
        createdAt: { gte: since },
      },
      select: {
        action: true,
        description: true,
        metadata: true,
        user: { select: { email: true } },
      },
      take: 5000, // hard ceiling — we only need aggregates
    });

    const totals = {
      logins: 0,
      loginFailures: 0,
      passwordChanges: 0,
      passwordChangeFailures: 0,
      accountUnlocks: 0,
      ipUnlocks: 0,
    };

    const ipCounts = new Map<string, number>(); // failures by ip
    const emailCounts = new Map<string, number>(); // failures by targeted email
    const uniqueIps = new Set<string>();

    for (const r of rows) {
      const md = (r.metadata || {}) as Record<string, unknown>;
      const ip = typeof md.ip === 'string' ? md.ip : null;
      if (ip) uniqueIps.add(ip);

      switch (r.action) {
        case 'login':
          totals.logins += 1;
          break;
        case 'login_failed': {
          totals.loginFailures += 1;
          if (ip) ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
          const email =
            (typeof md.emailAttempt === 'string' && md.emailAttempt) || r.user?.email || null;
          if (email) emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
          break;
        }
        case 'password_changed':
          totals.passwordChanges += 1;
          break;
        case 'password_change_failed':
          totals.passwordChangeFailures += 1;
          break;
        case 'account_unlocked':
          totals.accountUnlocks += 1;
          break;
        case 'ip_unlocked':
          totals.ipUnlocks += 1;
          break;
      }
    }

    const topOffendingIps = [...ipCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ip, failures]) => ({ ip, failures }));
    const topTargetedEmails = [...emailCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, failures]) => ({ email, failures }));

    res.status(200).json({
      success: true,
      data: {
        totals,
        uniqueIpCount: uniqueIps.size,
        topOffendingIps,
        topTargetedEmails,
        windowMinutes: sinceMinutes,
      },
    });
  })
);

export default router;
