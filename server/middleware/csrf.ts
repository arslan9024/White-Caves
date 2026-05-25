import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler.js';

export const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
};

export const issueCsrfToken = (res: Response): string => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE_NAME, token, CSRF_COOKIE_OPTIONS);
  return token;
};

export const clearCsrfToken = (res: Response): void => {
  res.clearCookie(CSRF_COOKIE_NAME, { path: '/api/auth' });
};

export const requireDoubleSubmitCsrf = (req: Request, _res: Response, next: NextFunction): void => {
  const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME] as string | undefined;
  const csrfHeader = req.get(CSRF_HEADER_NAME);

  if (!csrfCookie || !csrfHeader) {
    next(new AppError('CSRF token is required', 403, { code: 'CSRF_TOKEN_MISSING' }));
    return;
  }

  const expected = Buffer.from(csrfCookie, 'utf8');
  const received = Buffer.from(csrfHeader, 'utf8');
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    next(new AppError('Invalid CSRF token', 403, { code: 'CSRF_TOKEN_INVALID' }));
    return;
  }

  next();
};
