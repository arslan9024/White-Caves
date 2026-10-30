/**
 * Shared Auth Types, Constants, DB Handles & Security Helpers
 */

import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { prisma } from '../../database.js';
import { JWT_EXPIRES_SECONDS, BCRYPT_ROUNDS } from '../../config/env.js';
import logger from '../../utils/logger.js';

export type RouteRequest = Request<Record<string, string>>;
export const db = prisma as any;
export const SUPERUSER_EMAIL = (process.env.CREATOR_SUPERUSER_EMAIL ?? '').toLowerCase().trim();

export type PrismaLikeError = { code?: string; errorCode?: string; message?: string };

export const getRouteParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }

  return null;
};

export const getPrismaErrorCode = (error: unknown): string | null => {
  if (!error || typeof error !== 'object') return null;
  const candidate = error as PrismaLikeError;
  if (typeof candidate.code === 'string') return candidate.code;
  if (typeof candidate.errorCode === 'string') return candidate.errorCode;
  return null;
};

export const isDatabaseUnavailableError = (error: unknown): boolean => {
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return true;
  }

  const code = getPrismaErrorCode(error);
  if (code && ['P1000', 'P1001', 'P1002', 'P1003', 'P1008', 'P1017'].includes(code)) {
    return true;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message?: unknown }).message || '').toLowerCase();
    return (
      message.includes('can\'t reach database server') ||
      message.includes('connection timed out') ||
      message.includes('database connection failed') ||
      message.includes('prismaclientinitializationerror')
    );
  }

  return false;
};

export const JWT_SIGN_OPTIONS: SignOptions = {
  expiresIn: JWT_EXPIRES_SECONDS,
  algorithm: 'HS256',
  issuer: process.env.JWT_ISSUER || 'white-caves-crm',
  audience: process.env.JWT_AUDIENCE || 'white-caves-clients',
};

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Verify a password against a bcrypt hash.
 * Also handles legacy base64 hashes (auto-migrated on next login).
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
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
 * Use Express's proxy-aware client IP so only headers from configured trusted
 * proxies can affect audit and rate-limit attribution.
 */
export const getClientIp = (req: Request): string => {
  return (req.ip || req.socket?.remoteAddress || 'unknown').toString();
};

/**
 * Record a failed login attempt for audit purposes.
 * Fire-and-forget — never blocks the response or surfaces errors to the client.
 */
export const recordLoginFailure = (
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

export const LOGIN_LOCKOUT_THRESHOLD = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_LOCKOUT_THRESHOLD || '5', 10) || 5
);
export const LOGIN_LOCKOUT_WINDOW_MINUTES = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_LOCKOUT_WINDOW_MINUTES || '15', 10) || 15
);

export const LOGIN_IP_LOCKOUT_THRESHOLD = Math.max(
  1,
  Number.parseInt(process.env.LOGIN_IP_LOCKOUT_THRESHOLD || '20', 10) || 20
);

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = Math.max(
  5,
  Number.parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || '30', 10) || 30
);

export const PASSWORD_RESET_WINDOW_MINUTES = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_WINDOW_MINUTES || '15', 10) || 15
);

export const PASSWORD_RESET_REQUEST_LIMIT = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_REQUEST_LIMIT || '5', 10) || 5
);

export const PASSWORD_RESET_VERIFY_FAILURE_LIMIT = Math.max(
  1,
  Number.parseInt(process.env.PASSWORD_RESET_VERIFY_FAILURE_LIMIT || '8', 10) || 8
);

export const hashResetToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const getResetWindowStart = (): Date =>
  new Date(Date.now() - PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000);

export const resolveRetryAfterFromOldest = (oldest: Date): number => {
  const unlockAt = oldest.getTime() + PASSWORD_RESET_WINDOW_MINUTES * 60 * 1000;
  return Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
};

export const parseIsoDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toMetadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value as Record<string, unknown>;
};

export type ProfileCompletionField = 'name' | 'phone' | 'department';
export type ProfileRoleCategory = 'general' | 'client' | 'agent' | 'leadership';

export const CLIENT_PROFILE_ROLES = new Set(['buyer', 'seller', 'tenant', 'landlord', 'property_owner']);
export const LEADERSHIP_PROFILE_ROLES = new Set([
  'owner',
  'manager',
  'admin',
  'managing_director',
  'lion',
  'super_admin',
]);
export const AGENT_PROFILE_ROLES = new Set([
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

export const PROFILE_COMPLETION_SCHEMA: Record<
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

export const resolveProfileRoleCategory = (role: string | null | undefined): ProfileRoleCategory => {
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

export const resolveProfileCompletion = (user: {
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

export const countResetEvents = async (
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

export const findOldestResetEvent = async (
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

export const checkIpLockout = async (
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

export const checkAccountLockout = async (
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
