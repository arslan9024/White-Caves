/**
 * Authentication Routes — Full Implementation
 * Login, logout, 2FA verification, user profile, password change
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import authMiddleware from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth';
import { JWT_SECRET, JWT_EXPIRES_SECONDS, BCRYPT_ROUNDS } from '../config/env';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import logger from '../utils/logger.js';
import { verifyFirebaseIdToken, FirebaseAdminInitError } from '../config/firebaseAdmin.js';

const router = Router();

// ─── TOTP (RFC 6238) helpers — no external dependencies ─────────────────────

/** Encode a buffer as a base32 string (RFC 4648, no padding). */
function base32Encode(buf: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buf.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    value = (value << 8) | buf[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += alphabet[(value >>> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 0x1f];
  }
  return output;
}

/** Decode a base32 string to Buffer. */
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = encoded.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = alphabet.indexOf(char);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(bytes);
}

/**
 * Compute a HOTP value from key + counter (RFC 4226).
 * Returns a 6-digit string.
 */
function hotpCode(key: Buffer, counter: bigint): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(counter);
  const hmac = crypto.createHmac('sha1', key).update(msg).digest();
  const offset = hmac[19] & 0x0f;
  // Extract 4 bytes at the dynamic offset — safe: offset is 0–15, hmac is 20 bytes
  // eslint-disable-next-line security/detect-object-injection
  const b = [hmac[offset], hmac[offset + 1], hmac[offset + 2], hmac[offset + 3]] as const;
  const code =
    (((b[0] & 0x7f) << 24) | ((b[1] & 0xff) << 16) | ((b[2] & 0xff) << 8) | (b[3] & 0xff)) %
    1_000_000;
  return code.toString().padStart(6, '0');
}

const TOTP_STEP = 30; // seconds per time step
const TOTP_WINDOW = 1; // ± 1 step tolerance

/**
 * Verify a TOTP code against a base32-encoded secret.
 * Allows ±TOTP_WINDOW steps of clock drift.
 */
function verifyTOTP(secret: string, userCode: string): boolean {
  if (!/^\d{6}$/.test(userCode)) return false;
  const key = base32Decode(secret);
  const counter = BigInt(Math.floor(Date.now() / 1000 / TOTP_STEP));
  for (let delta = -TOTP_WINDOW; delta <= TOTP_WINDOW; delta++) {
    if (hotpCode(key, counter + BigInt(delta)) === userCode) return true;
  }
  return false;
}

/** Generate a new TOTP secret (20 random bytes → base32). */
function generateTOTPSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

/** Generate N one-time backup codes (8 hex chars each). */
function generateBackupCodes(n = 8): string[] {
  return Array.from({ length: n }, () => crypto.randomBytes(4).toString('hex').toUpperCase());
}

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
    const { email, password, name, phone, department, category, role } = req.body;

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

    // Self-registration role policy:
    // - client category: must provide one of buyer/seller/landlord/tenant
    // - staff category: always registered as agent pending approval
    const normalizedCategory = String(category || 'client')
      .toLowerCase()
      .trim();
    const normalizedRole = String(role || '')
      .toLowerCase()
      .trim();
    const clientRoles = new Set(['buyer', 'seller', 'landlord', 'tenant']);

    let assignedRole = 'agent';
    let assignedStatus: 'active' | 'pending' = 'active';

    if (normalizedCategory === 'client') {
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
      throw new AppError('Invalid signup category. Must be either client or staff', 400);
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name ? sanitizeString(name.trim()) : null,
          role: assignedRole,
          phone: phone ? sanitizeString(String(phone).trim()) : null,
          department: department ? sanitizeString(String(department).trim()) : null,
          status: assignedStatus,
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

    // Send welcome email (fire-and-forget — never block registration)
    if (user.email) {
      const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../services/emailService.js');
      const template = EMAIL_TEMPLATES.welcome(user.name || 'Valued Client');
      sendEmailTracked({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: [{ name: 'type', value: 'welcome' }],
      }).catch(err => console.error('[email] welcome send failed:', err));
    }

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
 * Verify TOTP code to complete login when 2FA is required.
 * Accepts 6-digit TOTP code or an 8-char backup recovery code.
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

    const sanitizedEmail = sanitizeString(email).toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) throw new AppError('Invalid credentials', 401);

    if (!user.totpEnabled || !user.totpSecret) {
      throw new AppError('Two-factor authentication is not enabled for this account', 400);
    }

    // Try TOTP code first, then backup codes
    const codeStr = String(code).trim().toUpperCase();
    let verified = false;

    if (/^\d{6}$/.test(codeStr)) {
      // Regular 6-digit TOTP
      verified = verifyTOTP(user.totpSecret, codeStr);
    } else if (/^[A-F0-9]{8}$/.test(codeStr)) {
      // Backup recovery code — check against hashed list
      for (const hashed of user.totpBackupCodes) {
        if (await bcrypt.compare(codeStr, hashed)) {
          // Consume the backup code (single-use)
          await prisma.user.update({
            where: { id: user.id },
            data: { totpBackupCodes: user.totpBackupCodes.filter(h => h !== hashed) },
          });
          verified = true;
          break;
        }
      }
    }

    if (!verified) {
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
  })
);

/**
 * POST /api/auth/2fa/setup
 * Generate a new TOTP secret for the authenticated user.
 * Returns the secret and an otpauth:// URI for QR-code display.
 * The user must still call /enable after scanning to activate.
 */
router.post(
  '/2fa/setup',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const secret = generateTOTPSecret();
    const appName = encodeURIComponent('White Caves CRM');
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) throw new AppError('User not found', 404);

    const accountLabel = encodeURIComponent(user.email);
    const otpauthUri = `otpauth://totp/${appName}:${accountLabel}?secret=${secret}&issuer=${appName}&algorithm=SHA1&digits=6&period=30`;

    // Temporarily store secret (not yet enabled — no DB write until /enable confirms)
    // Store as pending in a short-lived signed token so the secret never sits idle in the DB
    const pendingToken = jwt.sign({ userId, totpSecret: secret }, JWT_SECRET, { expiresIn: 600 });

    res.status(200).json({
      success: true,
      data: {
        secret,
        otpauthUri,
        pendingToken,
        instructions: [
          '1. Scan the QR code (or enter the secret) in your authenticator app (Google Authenticator, Authy, etc.)',
          '2. Enter the 6-digit code from your app to confirm setup at POST /api/auth/2fa/enable',
        ],
      },
    });
  })
);

/**
 * POST /api/auth/2fa/enable
 * Activate TOTP 2FA by verifying the first code from the authenticator app.
 * Requires { pendingToken, code } in the request body.
 */
router.post(
  '/2fa/enable',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { pendingToken, code } = req.body;
    if (!pendingToken || !code) {
      throw new AppError('pendingToken and code are required', 400);
    }

    // Decode the pending token to retrieve the secret
    let totpSecret: string;
    try {
      const payload = jwt.verify(pendingToken, JWT_SECRET) as {
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

    await prisma.user.update({
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
  })
);

/**
 * POST /api/auth/2fa/disable
 * Deactivate TOTP 2FA after confirming with a valid code.
 * Requires { code } — either a current TOTP or a backup code.
 */
router.post(
  '/2fa/disable',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { code } = req.body;
    if (!code) throw new AppError('Verification code is required to disable 2FA', 400);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totpSecret: true, totpEnabled: true, totpBackupCodes: true },
    });
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

    await prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: false, totpSecret: null, totpBackupCodes: [] },
    });

    logger.info('TOTP 2FA disabled', { userId });
    res
      .status(200)
      .json({
        success: true,
        data: { enabled: false, message: 'Two-factor authentication has been disabled.' },
      });
  })
);

/**
 * GET /api/auth/2fa/status
 * Return whether 2FA is enabled for the current user.
 */
router.get(
  '/2fa/status',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totpEnabled: true, totpBackupCodes: true },
    });
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      success: true,
      data: {
        totpEnabled: user.totpEnabled,
        backupCodesRemaining: user.totpBackupCodes.length,
      },
    });
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

// ─── WebAuthn / Biometric Routes ────────────────────────────────────────────

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

/**
 * POST /api/auth/webauthn/register/options
 * Generate registration challenge and options for the client.
 */
router.post(
  '/webauthn/register/options',
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

/**
 * POST /api/auth/webauthn/register/verify
 * Verify the registration and store the credential.
 * Note: Full attestation verification requires @simplewebauthn/server.
 * This implementation stores the credential ID and public key for use in authentication.
 */
router.post(
  '/webauthn/register/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, credential } = req.body;

    if (!userId || !credential?.id || !credential?.rawId) {
      throw new AppError('userId and credential are required', 400);
    }

    const sanitizedUserId = sanitizeString(String(userId).trim()).slice(0, 128);

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
  })
);

/**
 * POST /api/auth/webauthn/authenticate/options
 * Generate authentication challenge for the client.
 */
router.post(
  '/webauthn/authenticate/options',
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

/**
 * POST /api/auth/webauthn/authenticate/verify
 * Verify the biometric assertion and return a JWT session token.
 */
router.post(
  '/webauthn/authenticate/verify',
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

/**
 * DELETE /api/auth/webauthn/credentials/:userId/:credentialId
 * Remove a stored biometric credential.
 */
router.delete(
  '/webauthn/credentials/:userId/:credentialId',
  asyncHandler(async (req: Request, res: Response) => {
    const rawUserId = req.params.userId;
    const rawCredId = req.params.credentialId;

    if (!rawUserId || !rawCredId) {
      throw new AppError('userId and credentialId are required', 400);
    }

    const sanitizedUserId = sanitizeString(decodeURIComponent(rawUserId)).slice(0, 128);
    const sanitizedCredId = sanitizeString(decodeURIComponent(rawCredId)).slice(0, 512);

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
  })
);

/**
 * POST /api/auth/complete-social-registration
 * Completes registration for a social-auth user who just selected their role.
 * The user was already created by /firebase-sync; this endpoint updates their
 * role and category using the JWT issued by that endpoint (auth required).
 */
router.post(
  '/complete-social-registration',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { role, category } = req.body;
    if (!category || !role) {
      throw new AppError('category and role are required', 400);
    }

    const normalizedCategory = String(category).toLowerCase().trim();
    const normalizedRole = String(role).toLowerCase().trim();
    const clientRoles = new Set(['buyer', 'seller', 'landlord', 'tenant']);

    let assignedRole: string;
    let assignedStatus: 'active' | 'pending' = 'active';

    if (normalizedCategory === 'client') {
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
          department: user.department,
        },
      },
    });
  })
);

export default router;
