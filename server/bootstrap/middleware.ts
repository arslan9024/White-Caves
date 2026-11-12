import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from '../middleware/requestId.js';
import cspMiddleware, { cspReportHandler } from '../middleware/csp.js';
import {
  API_PREFIX,
  API_V1_PREFIX,
  createV1CompatibilityProxy,
  markLegacyApiDeprecated,
} from '../middleware/apiVersioning.js';
import {
  buildAllowedCorsOrigins,
  inferRequestOrigin,
  isCorsOriginAllowed,
} from '../config/cors.js';
import { CORS_ORIGINS } from '../config/env.js';
import {
  apiLimiter,
  authLimiter,
  firebaseSyncLimiter,
  registerLimiter,
  passwordLimiter,
  strictLimiter,
  contactLimiter,
} from '../middleware/rateLimiter.js';
import { sanitizeDeep } from '../utils/sanitize.js';
import logger, { requestLogPath } from '../utils/logger.js';
import type { ServerRuntime } from './runtime.js';
export function configureMiddleware(app: Express, runtime: ServerRuntime): void {
  const allowedCorsOrigins = buildAllowedCorsOrigins(CORS_ORIGINS, process.env.NODE_ENV);
  // Request ID — must be first so every log/response includes correlation ID
  app.use(requestIdMiddleware);

  app.use(async (req: Request, _res: Response, next: NextFunction) => {
    if (runtime.dbInitPromise && req.path !== '/api/health' && req.path !== '/api/v1/health') {
      try {
        await runtime.dbInitPromise;
      } catch {
        // Errors are logged in startServer; allow request to proceed
      }
    }
    next();
  });

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      // Explicit referrer policy: send origin only on same-origin requests; omit on cross-origin
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginEmbedderPolicy: false, // Required for Firebase/Stripe iframes
    })
  );
  app.use(cspMiddleware);

  // Permissions-Policy: restrict access to browser features.
  // Helmet v8 does not bundle permissionsPolicy, so we set it as a custom header.
  // camera/microphone/usb/magnetometer/gyroscope/accelerometer: disabled entirely.
  // geolocation: allowed only from same origin (interactive map feature).
  // payment: allowed from same origin and Stripe's JS domain.
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      [
        'camera=()',
        'microphone=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
        'geolocation=(self)',
        'payment=(self "https://js.stripe.com")',
      ].join(', ')
    );
    next();
  });
  app.use(
    cors((req, callback) => {
      const requestOrigin = inferRequestOrigin(req);
      const origin = req.header('Origin');
      const isAllowed = isCorsOriginAllowed(
        origin,
        allowedCorsOrigins,
        requestOrigin,
        process.env.NODE_ENV
      );

      if (isAllowed) {
        callback(null, { origin: true, credentials: true });
        return;
      }

      callback(null, { origin: false });
    })
  );

  // Compression
  app.use(compression());

  // Static files for uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'public', 'uploads')));

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      const message = `${req.method} ${requestLogPath(req.originalUrl)} ${res.statusCode} ${durationMs}ms`;
      if (res.statusCode >= 500) {
        logger.error(message);
      } else if (res.statusCode >= 400) {
        logger.warn(message);
      } else if (process.env.NODE_ENV !== 'production') {
        logger.info(message);
      }
    });
    next();
  });

  // Body parsing
  app.use(
    express.json({
      limit: '1mb',
      type: ['application/json', 'application/csp-report', 'application/reports+json'],
    })
  );
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Cookie parsing — required for httpOnly refresh-token cookie on /api/auth/refresh
  app.use(cookieParser());

  // Wave 16: versioned API migration.
  // Requests to /api/v1/* are rewritten to /api/* to preserve existing handlers.
  app.use(API_V1_PREFIX, createV1CompatibilityProxy(app));

  // Legacy /api/* responses are kept as compatibility aliases and marked deprecated.
  app.use(API_PREFIX, markLegacyApiDeprecated);

  // Sanitize inbound JSON mutation payloads to reduce XSS storage risk.
  // Note: req.path inside app.use('/api', ...) is relative to the /api mount point,
  // so exempt paths must omit the /api prefix. The req.is('json') guard ensures
  // multipart/form-data upload routes and other non-JSON bodies are not touched.
  const NON_SANITIZED_PATHS = new Set([
    '/whatsapp/webhook',
    '/auth/refresh',
    '/security/csp-report',
    '/csp-report',
  ]);
  app.use('/api', (req: Request, _res: Response, next: NextFunction) => {
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      !NON_SANITIZED_PATHS.has(req.path) &&
      req.is('json') &&
      req.body &&
      typeof req.body === 'object'
    ) {
      req.body = sanitizeDeep(req.body) as Request['body'];
    }
    next();
  });

  // Content-Type validation for mutation endpoints
  // Exempt paths that accept non-JSON bodies (file uploads, webhooks, cookie-only endpoints).
  const NON_JSON_PATHS = new Set([
    '/api/whatsapp/webhook',
    '/api/auth/refresh',
    '/api/media/upload',
    '/api/security/csp-report',
    '/api/csp-report',
  ]);
  app.use('/api', (req: Request, res: Response, next) => {
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      !req.is('json') &&
      !NON_JSON_PATHS.has(req.path)
    ) {
      return res.status(415).json({
        success: false,
        error: 'Content-Type must be application/json',
      });
    }
    next();
  });

  // CSP Violation Reporting Endpoints
  app.post('/api/security/csp-report', cspReportHandler);
  app.post('/api/csp-report', cspReportHandler);

  // Rate limiting
  app.use('/api', apiLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', registerLimiter);
  app.use('/api/auth/password', passwordLimiter);
  app.use('/api/auth/verify-2fa', strictLimiter);
  app.use('/api/auth/2fa/setup', strictLimiter);
  app.use('/api/auth/2fa/enable', strictLimiter);
  app.use('/api/auth/2fa/disable', strictLimiter);
  app.use('/api/auth/refresh', authLimiter);
  app.use('/api/auth/firebase-sync', firebaseSyncLimiter);
  app.use('/api/auth/webauthn/register', authLimiter);
  app.use('/api/auth/webauthn/authenticate', authLimiter);
  app.use('/api/contact', contactLimiter); // Public unauthenticated — stricter: 10/hour/IP

  // ============================================================================
  // HEALTH CHECK ENDPOINT
  // ============================================================================
}
