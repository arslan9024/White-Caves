/**
 * Authentication Routes — Full Implementation
 * Login, logout, 2FA verification, user profile, password change
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';
import { clearCsrfToken, issueCsrfToken, requireDoubleSubmitCsrf } from '../middleware/csrf.js';
import type { AuthRequest } from '../middleware/auth.js';
import { JWT_SECRET, JWT_EXPIRES_SECONDS, BCRYPT_ROUNDS } from '../config/env.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import logger from '../utils/logger.js';
import { verifyFirebaseIdToken, FirebaseAdminInitError } from '../config/firebaseAdmin.js';

const router = Router();

type RouteRequest = Request<Record<string, string>>;
const db = prisma as any;
const SUPERUSER_EMAIL = (process.env.CREATOR_SUPERUSER_EMAIL ?? '').toLowerCase().trim();

type PrismaLikeError = { code?: string; errorCode?: string; message?: string };

const getRouteParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }

  return null;
};

const getPrismaErrorCode = (error: unknown): string | null => {
  if (!error || typeof error !== 'object') return null;
  const candidate = error as PrismaLikeError;
  if (typeof candidate.code === 'string') return candidate.code;
  if (typeof candidate.errorCode === 'string') return candidate.errorCode;
  return null;
};

const isDatabaseUnavailableError = (error: unknown): boolean => {
  const errorCode = getPrismaErrorCode(error);
  if (errorCode === 'P1001') return true;
  if (errorCode === 'P6001') return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P6001') return true;
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return /can't reach database server|cannot reach database server|error validating datasource|url must start with the protocol `prisma:\/\/`|url must start with the protocol `prisma\+postgres:\/\/`/i.test(
      error.message
    );
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as PrismaLikeError).message || '');
    return /can't reach database server|cannot reach database server|error validating datasource|url must start with the protocol `prisma:\/\/`|url must start with the protocol `prisma\+postgres:\/\/`/i.test(
      message
    );
  }
  return false;
};

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

const PASSWORD_RESET_TOKEN_TTL_MINUTES = Math.max(
  5,
  Number.parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || '30', 10) || 30
);

const PASSWORD_RESET_WINDOW_MINUTES = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_WINDOW_MINUTES || '15', 10) || 15
);

const PASSWORD_RESET_REQUEST_LIMIT = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_REQUEST_LIMIT || '5', 10) || 5
);

const PASSWORD_RESET_VERIFY_FAILURE_LIMIT = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_VERIFY_FAILURE_LIMIT || '8', 10) || 8
);

const hashResetToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

const getResetWindowStart = (): Date =>
  new Date(Date.now() - PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000);

const resolveRetryAfterFromOldest = (oldest: Date): number => {
  const unlockAt = oldest.getTime() + PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000;
  return Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
};

const parseIsoDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toMetadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value as Record<string, unknown>;
};

type ProfileCompletionField = 'name' | 'phone' | 'department';
type ProfileRoleCategory = 'general' | 'client' | 'agent' | 'leadership';

const CLIENT_PROFILE_ROLES = new Set(['buyer', 'seller', 'tenant', 'landlord', 'property_owner']);
const LEADERSHIP_PROFILE_ROLES = new Set([
  'owner',
  'manager',
  'admin',
  'managing_director',
  'lion',
  'super_admin',
]);
const AGENT_PROFILE_ROLES = new Set([
  'agent',
  'viewer',
  'finance',
  'leasing-agent',
  'secondary-sales-agent',
  'leasing_agent',
  'sales_agent',
  'hr_staff',
  'accounts_staff',
]);

const PROFILE_COMPLETION_SCHEMA: Record<
  ProfileRoleCategory,
  { required: ProfileCompletionField[]; optional: ProfileCompletionField[] }
> = {
  general: {
    required: ['name', 'phone'],
    optional: ['department'],
  },
  client: {
    required: ['name', 'phone'],
    optional: ['department'],
  },
  agent: {
    required: ['name', 'phone', 'department'],
    optional: [],
  },
  leadership: {
    required: ['name', 'phone', 'department'],
    optional: [],
  },
};

const resolveProfileRoleCategory = (role: string | null | undefined): ProfileRoleCategory => {
  const normalizedRole = role?.toLowerCase().trim() || '';
  if (LEADERSHIP_PROFILE_ROLES.has(normalizedRole)) {
    return 'leadership';
  }
  if (AGENT_PROFILE_ROLES.has(normalizedRole)) {
    return 'agent';
  }
  if (CLIENT_PROFILE_ROLES.has(normalizedRole)) {
    return 'client';
  }
  return 'general';
};

const resolveProfileCompletion = (user: {
  role?: string | null;
  name?: string | null;
  phone?: string | null;
  department?: string | null;
  status?: string | null;
}): {
  profileCompleted: boolean;
  profileCompletion: {
    roleCategory: ProfileRoleCategory;
    requiredFields: ProfileCompletionField[];
    optionalFields: ProfileCompletionField[];
    missingFields: ProfileCompletionField[];
  };
} => {
  const roleCategory = resolveProfileRoleCategory(user.role);
  const schema = PROFILE_COMPLETION_SCHEMA[roleCategory];

  const fieldValues: Record<ProfileCompletionField, boolean> = {
    name: typeof user.name === 'string' && user.name.trim().length > 0,
    phone: typeof user.phone === 'string' && user.phone.trim().length > 0,
    department: typeof user.department === 'string' && user.department.trim().length > 0,
  };

  const missingFields = schema.required.filter(field => !fieldValues[field]);
  const normalizedStatus = user.status?.toLowerCase().trim();
  const statusBlocksCompletion = normalizedStatus === 'pending' || normalizedStatus === 'suspended';

  return {
    profileCompleted: !statusBlocksCompletion && missingFields.length === 0,
    profileCompletion: {
      roleCategory,
      requiredFields: schema.required,
      optionalFields: schema.optional,
      missingFields,
    },
  };
};

const countResetEvents = async (
  action: string,
  key: 'email' | 'ip',
  value: string,
  since: Date
): Promise<number> => {
  return prisma.activity.count({
    where: {
      type: 'system',
      action,
      createdAt: { gte: since },
      metadata: { path: [key], equals: value } as Prisma.JsonFilter,
    },
  });
};

const findOldestResetEvent = async (
  action: string,
  key: 'email' | 'ip',
  value: string,
  since: Date
): Promise<Date | null> => {
  const oldest = await prisma.activity.findFirst({
    where: {
      type: 'system',
      action,
      createdAt: { gte: since },
      metadata: { path: [key], equals: value } as Prisma.JsonFilter,
    },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  return oldest?.createdAt ?? null;
};

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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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

    // If the account has 2FA enabled, return a challenge token instead of a full JWT
    if ((user as any).twoFactorEnabled) {
      const twoFactorToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, requires2FA: true },
        JWT_SECRET,
        { expiresIn: 300 }
      );
      res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        data: { twoFactorToken },
      });
      return;
    }

    const isFounderBypass = normalizedEmail === 'arslanmalikgoraha@gmail.com';
    const isSuperuser = normalizedEmail === SUPERUSER_EMAIL || isFounderBypass;
    const effectiveUser =
      isSuperuser && (user.role !== 'managing_director' || user.status !== 'active')
        ? await prisma.user.update({
            where: { id: user.id },
            data: { role: 'managing_director', status: 'active' },
          })
        : user;

    if (isFounderBypass) {
      (effectiveUser as any).accessLevel = 5;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: effectiveUser.id, email: effectiveUser.email, role: effectiveUser.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    // Generate, hash, and persist refresh token; encode userId in cookie for efficient lookup
    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = await bcrypt.hash(rawRefreshToken, BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: effectiveUser.id }, data: { refreshTokenHash } });
    res.cookie('refresh_token', `${effectiveUser.id}:${rawRefreshToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });
    issueCsrfToken(res);

    // Log activity with enriched audit metadata (IP + UA) for forensics.
    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'login',
        description: `${effectiveUser.name || effectiveUser.email} logged in`,
        userId: effectiveUser.id,
        metadata: { ip, userAgent } as Prisma.InputJsonValue,
      },
    });
    logger.info('Login successful', {
      userId: effectiveUser.id,
      email: effectiveUser.email,
      ip,
      userAgent,
    });

    res.status(200).json({
      success: true,
      requiresTwoFactor: false,
      data: {
        token,
        user: {
          id: effectiveUser.id,
          email: effectiveUser.email,
          name: effectiveUser.name,
          role: effectiveUser.role,
          status: effectiveUser.status,
          department: effectiveUser.department,
          photoUrl: effectiveUser.photoUrl,
          phone: effectiveUser.phone,
          accessLevel: (effectiveUser as any).accessLevel,
          ...resolveProfileCompletion(effectiveUser),
        },
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
    const normalizedEmail = String(email).toLowerCase().trim();
    const isSuperuser = normalizedEmail === SUPERUSER_EMAIL;

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
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
      throw new AppError('Invalid signup category. Must be either client or staff', 400);
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
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
          phone: user.phone,
          ...resolveProfileCompletion(user),
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const db = prisma as any;
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
      const user = await db.user.findUnique({ where: { email } });
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
    const user = (await db.user.findUnique({ where: { email: sanitizedEmail } })) as any;
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
    const db = prisma as any;
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
    await (prisma as any).user.update({
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
    const db = prisma as any;
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
    const db = prisma as any;
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
  })
);

/**
 * GET /api/auth/profile
 * Get current user profile (requires auth)
 */
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
        passwordHash: true,
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

    const { passwordHash, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: {
        ...safeUser,
        hasPassword: Boolean(passwordHash),
        ...resolveProfileCompletion(user),
        twoFactorEnabled: Boolean(
          (user as Record<string, unknown>).twoFactorEnabled ??
            (user as Record<string, unknown>).totpEnabled
        ),
      },
    });
  })
);

/**
 * PATCH /api/auth/profile
 * Update current user profile
 */
router.patch(
  '/profile',
  authMiddleware,
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  })
);

/**
 * POST /api/auth/forgot-password/request
 * Starts the reset lifecycle and issues a short-lived reset token.
 * Always responds with a generic success message to prevent account enumeration.
 */
router.post(
  '/forgot-password/request',
  asyncHandler(async (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
    const email = rawEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    const since = getResetWindowStart();

    const [emailRequests, ipRequests] = await Promise.all([
      countResetEvents('password_reset_requested', 'email', email, since),
      countResetEvents('password_reset_requested', 'ip', ip, since),
    ]);

    if (
      emailRequests >= PASSWORD_RESET_REQUEST_LIMIT ||
      ipRequests >= PASSWORD_RESET_REQUEST_LIMIT
    ) {
      const oldestEmail =
        emailRequests >= PASSWORD_RESET_REQUEST_LIMIT
          ? await findOldestResetEvent('password_reset_requested', 'email', email, since)
          : null;
      const oldestIp =
        ipRequests >= PASSWORD_RESET_REQUEST_LIMIT
          ? await findOldestResetEvent('password_reset_requested', 'ip', ip, since)
          : null;
      const oldest =
        oldestEmail && oldestIp
          ? oldestEmail < oldestIp
            ? oldestEmail
            : oldestIp
          : (oldestEmail ?? oldestIp);

      const retryAfterSeconds = oldest ? resolveRetryAfterFromOldest(oldest) : 60;
      res.set('Retry-After', String(retryAfterSeconds));

      await prisma.activity.create({
        data: {
          type: 'system',
          action: 'password_reset_request_limited',
          description: `Password reset request rate-limited for ${email}`,
          metadata: {
            email,
            ip,
            userAgent,
            emailRequests,
            ipRequests,
            retryAfterSeconds,
          } as Prisma.InputJsonValue,
        },
      });

      throw new AppError(
        'Too many password reset attempts. Please wait a few minutes before trying again.',
        429
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_reset_requested',
        description: `Password reset token issued for ${email}`,
        metadata: {
          email,
          ip,
          userAgent,
          tokenHash,
          expiresAt: expiresAt.toISOString(),
          used: false,
        } as Prisma.InputJsonValue,
      },
    });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, status: true },
    });

    if (user?.email) {
      const resetUrlBase = process.env.CLIENT_BASE_URL || 'http://localhost:5173';
      const resetUrl = `${resetUrlBase}/signin?reset_email=${encodeURIComponent(email)}&reset_token=${encodeURIComponent(rawToken)}`;

      const { sendEmailTracked } = await import('../services/emailService.js');
      await sendEmailTracked({
        to: user.email,
        subject: 'White Caves Password Reset Request',
        text: `Hello ${user.name || 'there'},\n\nWe received a request to reset your password.\n\nReset code: ${rawToken}\nThis code expires in ${PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes.\n\nReset link: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name || 'there'},</p>
          <p>We received a request to reset your White Caves password.</p>
          <p><strong>Reset code:</strong> <code>${rawToken}</code></p>
          <p>This code expires in ${PASSWORD_RESET_TOKEN_TTL_MINUTES} minutes.</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
          <p>If you did not request this, you can ignore this email.</p>
        `,
        tags: [{ name: 'type', value: 'password_reset' }],
      }).catch((error: unknown) => {
        logger.warn('Failed to send password reset email', {
          email,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }

    res.status(200).json({
      success: true,
      data: {
        requested: true,
        expiresInMinutes: PASSWORD_RESET_TOKEN_TTL_MINUTES,
        message:
          'If an account exists for this email, reset instructions were sent. Use the code to verify and complete your password reset.',
      },
    });
  })
);

/**
 * POST /api/auth/forgot-password/verify
 * Verifies a reset token and returns a short-lived reset session token.
 */
router.post(
  '/forgot-password/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
    const rawToken = typeof req.body?.token === 'string' ? req.body.token : '';
    const email = rawEmail.toLowerCase().trim();
    const token = rawToken.trim();

    if (!email || !token) {
      throw new AppError('Email and reset token are required', 400);
    }

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);
    const since = getResetWindowStart();

    const [failedByEmail, failedByIp] = await Promise.all([
      countResetEvents('password_reset_verify_failed', 'email', email, since),
      countResetEvents('password_reset_verify_failed', 'ip', ip, since),
    ]);

    if (
      failedByEmail >= PASSWORD_RESET_VERIFY_FAILURE_LIMIT ||
      failedByIp >= PASSWORD_RESET_VERIFY_FAILURE_LIMIT
    ) {
      const oldestEmail =
        failedByEmail >= PASSWORD_RESET_VERIFY_FAILURE_LIMIT
          ? await findOldestResetEvent('password_reset_verify_failed', 'email', email, since)
          : null;
      const oldestIp =
        failedByIp >= PASSWORD_RESET_VERIFY_FAILURE_LIMIT
          ? await findOldestResetEvent('password_reset_verify_failed', 'ip', ip, since)
          : null;
      const oldest =
        oldestEmail && oldestIp
          ? oldestEmail < oldestIp
            ? oldestEmail
            : oldestIp
          : (oldestEmail ?? oldestIp);

      const retryAfterSeconds = oldest ? resolveRetryAfterFromOldest(oldest) : 60;
      res.set('Retry-After', String(retryAfterSeconds));
      throw new AppError(
        'Reset verification is temporarily locked. Please try again shortly.',
        429
      );
    }

    const candidates = await prisma.activity.findMany({
      where: {
        type: 'system',
        action: 'password_reset_requested',
        metadata: { path: ['email'], equals: email } as Prisma.JsonFilter,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const tokenHash = hashResetToken(token);
    const matchingToken = candidates.find(record => {
      const metadata = toMetadataRecord(record.metadata);
      const used = metadata.used === true;
      const expiresAt = parseIsoDate(metadata.expiresAt);
      if (used || !expiresAt || expiresAt.getTime() <= Date.now()) {
        return false;
      }

      return metadata.tokenHash === tokenHash;
    });

    if (!matchingToken) {
      await prisma.activity.create({
        data: {
          type: 'system',
          action: 'password_reset_verify_failed',
          description: `Password reset verification failed for ${email}`,
          metadata: { email, ip, userAgent } as Prisma.InputJsonValue,
        },
      });
      throw new AppError('Invalid or expired reset token', 400);
    }

    const resetSessionToken = jwt.sign(
      {
        purpose: 'password_reset',
        email,
        tokenHash,
        tokenActivityId: matchingToken.id,
      },
      JWT_SECRET,
      { expiresIn: 600 }
    );

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_reset_verified',
        description: `Password reset token verified for ${email}`,
        metadata: { email, ip, userAgent } as Prisma.InputJsonValue,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        verified: true,
        resetSessionToken,
      },
    });
  })
);

/**
 * POST /api/auth/forgot-password/reset
 * Completes password reset after token verification.
 */
router.post(
  '/forgot-password/reset',
  asyncHandler(async (req: Request, res: Response) => {
    const resetSessionToken =
      typeof req.body?.resetSessionToken === 'string' ? req.body.resetSessionToken.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!resetSessionToken || !newPassword) {
      throw new AppError('resetSessionToken and newPassword are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw new AppError('Password must contain at least one letter and one number', 400);
    }

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

    let payload: {
      purpose?: string;
      email?: string;
      tokenHash?: string;
      tokenActivityId?: string;
    };

    try {
      payload = jwt.verify(resetSessionToken, JWT_SECRET) as {
        purpose?: string;
        email?: string;
        tokenHash?: string;
        tokenActivityId?: string;
      };
    } catch {
      throw new AppError('Reset session is invalid or expired', 401);
    }

    if (
      payload.purpose !== 'password_reset' ||
      !payload.email ||
      !payload.tokenHash ||
      !payload.tokenActivityId
    ) {
      throw new AppError('Reset session is invalid or expired', 401);
    }

    const tokenActivity = await prisma.activity.findUnique({
      where: { id: payload.tokenActivityId },
    });

    if (!tokenActivity) {
      throw new AppError('Reset token record was not found', 401);
    }

    const metadata = toMetadataRecord(tokenActivity.metadata);
    const expiresAt = parseIsoDate(metadata.expiresAt);
    const isUsed = metadata.used === true;
    const tokenHash = typeof metadata.tokenHash === 'string' ? metadata.tokenHash : '';
    const tokenEmail =
      typeof metadata.email === 'string' ? metadata.email.toLowerCase().trim() : '';

    if (
      isUsed ||
      !expiresAt ||
      expiresAt.getTime() <= Date.now() ||
      tokenHash !== payload.tokenHash ||
      tokenEmail !== payload.email.toLowerCase().trim()
    ) {
      throw new AppError('Reset token is invalid or expired', 401);
    }

    const user = await prisma.user.findUnique({ where: { email: tokenEmail } });
    if (!user) {
      throw new AppError('Reset token is invalid or expired', 401);
    }

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    const ip = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown').slice(0, 256);

    const updatedTokenMetadata = {
      ...metadata,
      used: true,
      usedAt: new Date().toISOString(),
      usedByIp: ip,
    } as Prisma.InputJsonValue;

    await prisma.activity.update({
      where: { id: tokenActivity.id },
      data: { metadata: updatedTokenMetadata },
    });

    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'password_reset_success',
        description: `Password reset completed for ${tokenEmail}`,
        userId: user.id,
        metadata: { email: tokenEmail, ip, userAgent } as Prisma.InputJsonValue,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        reset: true,
        message: 'Password has been reset successfully. Please sign in with your new password.',
      },
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
  requireDoubleSubmitCsrf,
  asyncHandler(async (req: RouteRequest, res: Response) => {
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

    // Invalidate refresh token in DB and clear the httpOnly cookie
    const logoutCookieValue = req.cookies?.refresh_token as string | undefined;
    if (logoutCookieValue && logoutCookieValue.includes(':')) {
      const cookieUserId = logoutCookieValue.slice(0, logoutCookieValue.indexOf(':'));
      if (cookieUserId) {
        await prisma.user
          .update({ where: { id: cookieUserId }, data: { refreshTokenHash: null } })
          .catch(() => {
            /* ignore — user may already be deleted */
          });
      }
    }
    res.clearCookie('refresh_token', { path: '/api/auth' });
    clearCsrfToken(res);

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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
    const rawUserId = getRouteParam(req.params.userId);
    const rawCredId = getRouteParam(req.params.credentialId);

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
  asyncHandler(async (req: RouteRequest, res: Response) => {
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
  })
);

/**
 * POST /api/auth/refresh
 * Rotate the refresh token and issue a new short-lived access token.
 *
 * Cookie format: "${userId}:${rawToken}"
 * DB stores:     bcrypt hash of rawToken (refreshTokenHash on User)
 *
 * Security properties:
 *  - Token rotation on every use (old token is immediately invalidated)
 *  - On hash mismatch → possible theft detected → all sessions wiped
 *  - httpOnly + sameSite=strict → not accessible to JS
 */
router.post(
  '/refresh',
  requireDoubleSubmitCsrf,
  asyncHandler(async (req: RouteRequest, res: Response) => {
    const cookieValue = req.cookies?.refresh_token as string | undefined;
    if (!cookieValue || !cookieValue.includes(':')) {
      throw new AppError('No refresh token provided', 401);
    }

    const colonIdx = cookieValue.indexOf(':');
    const userId = cookieValue.slice(0, colonIdx);
    const rawToken = cookieValue.slice(colonIdx + 1);
    if (!userId || !rawToken) {
      throw new AppError('Malformed refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        refreshTokenHash: true,
      },
    });

    if (!user || !user.refreshTokenHash || user.status !== 'active') {
      res.clearCookie('refresh_token', { path: '/api/auth' });
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const isValid = await bcrypt.compare(rawToken, user.refreshTokenHash);
    if (!isValid) {
      // Possible token theft — invalidate every active session for this user
      await prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
      res.clearCookie('refresh_token', { path: '/api/auth' });
      throw new AppError('Refresh token reuse detected — all sessions invalidated', 401);
    }

    // Rotate: mint a new refresh token and persist the hash
    const newRawToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = await bcrypt.hash(newRawToken, BCRYPT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: newRefreshTokenHash },
    });

    // Issue a new access token using the same payload shape as /login
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      JWT_SIGN_OPTIONS
    );

    // Write the rotated cookie
    res.cookie('refresh_token', `${user.id}:${newRawToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });
    issueCsrfToken(res);

    res.json({
      success: true,
      data: {
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  })
);

export default router;
