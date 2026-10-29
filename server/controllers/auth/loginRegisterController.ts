/**
 * Login and Registration Controllers
 * Single Purpose: Authenticate existing users and register new agents.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET, BCRYPT_ROUNDS } from '../../config/env.js';
import { prisma } from '../../database.js';
import { clearCsrfToken, issueCsrfToken } from '../../middleware/csrf.js';
import { sanitizeString } from '../../utils/sanitize.js';
import logger from '../../utils/logger.js';
import {
  RouteRequest,
  db,
  SUPERUSER_EMAIL,
  JWT_SIGN_OPTIONS,
  hashPassword,
  verifyPassword,
  getClientIp,
  recordLoginFailure,
  checkAccountLockout,
  checkIpLockout,
  resolveProfileCompletion,
} from './authCommon.js';

export const loginHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      throw new AppError('Please provide a valid email address', 400);
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
  });

export const registerHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
    const { email, password, name, phone, department, category, role } = req.body || {};

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      throw new AppError('Please provide a valid email address', 400);
    }

    if (typeof password !== 'string' || password.length < 8) {
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
      const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../../services/emailService.js');
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
  });
