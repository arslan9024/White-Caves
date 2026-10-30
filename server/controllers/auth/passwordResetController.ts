/**
 * Password Reset Controller
 * Single Purpose: Handle password reset requests and verification tokens.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from '../../middleware/errorHandler.js';
import { JWT_SECRET } from '../../config/env.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import {
  RouteRequest,
  db,
  getClientIp,
  hashResetToken,
  getResetWindowStart,
  resolveRetryAfterFromOldest,
  countResetEvents,
  findOldestResetEvent,
  parseIsoDate,
  toMetadataRecord,
  PASSWORD_RESET_TOKEN_TTL_MINUTES,
  PASSWORD_RESET_REQUEST_LIMIT,
  PASSWORD_RESET_VERIFY_FAILURE_LIMIT,
} from './authCommon.js';

export const forgotPasswordRequestHandler =   asyncHandler(async (req: RouteRequest, res: Response) => {
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

      const { sendEmailTracked } = await import('../../services/emailService.js');
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
  });

export const forgotPasswordVerifyHandler =   asyncHandler(async (req: Request, res: Response) => {
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
  });
