/**
 * Content Security Policy (CSP) Middleware — White Caves CRM
 * Hardens headers against Cross-Site Scripting (XSS), clickjacking, and code injection.
 * Supports configurable Report-Only vs Enforce modes and violation telemetry.
 */

import type { RequestHandler, Request, Response } from 'express';
import helmet from 'helmet';
import { IS_PRODUCTION } from '../config/env.js';
import logger from '../utils/logger.js';

export const isCspReportOnly = (): boolean => {
  if (process.env.CSP_ENFORCE === 'true') {
    return false;
  }
  const reportOnlyFlag = process.env.CSP_REPORT_ONLY;
  return reportOnlyFlag === undefined ? true : reportOnlyFlag.toLowerCase() !== 'false';
};

export const getCspDirectives = (reportUri = process.env.CSP_REPORT_URI || '/api/security/csp-report') => {
  const isProd = IS_PRODUCTION;

  return {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      ...(isProd ? [] : ["'unsafe-eval'"]),
      'https://*.googleapis.com',
      'https://*.gstatic.com',
      'https://*.firebaseapp.com',
      'https://js.stripe.com',
      'https://maps.googleapis.com',
      'https://va.vercel-scripts.com',
      'https://*.vercel-scripts.com',
      'https://connect.facebook.net',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://unpkg.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://*.unsplash.com',
      'https://*.googleapis.com',
      'https://*.gstatic.com',
      'https://*.tile.openstreetmap.org',
      'https://*.tile.osm.org',
      'https://*.cloudinary.com',
      'https://res.cloudinary.com',
      'https://*.stripe.com',
      'https://*.facebook.com',
    ],
    connectSrc: [
      "'self'",
      'https://*.firebaseio.com',
      'https://*.googleapis.com',
      'https://*.firebase.com',
      'wss://*.firebaseio.com',
      'https://api.stripe.com',
      'https://*.vercel-insights.com',
      'https://vitals.vercel-insights.com',
      'https://maps.googleapis.com',
      'ws:',
      'wss:',
    ],
    frameSrc: [
      "'self'",
      'https://*.firebaseapp.com',
      'https://js.stripe.com',
      'https://hooks.stripe.com',
      'https://www.google.com/maps/',
      'https://maps.google.com/',
    ],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    reportUri: [reportUri],
    ...(isProd ? { upgradeInsecureRequests: [] } : {}),
  };
};

export const createCspMiddleware = (options?: {
  reportOnly?: boolean;
  reportUri?: string;
}): RequestHandler => {
  const reportOnly = options?.reportOnly ?? isCspReportOnly();
  const directives = getCspDirectives(options?.reportUri);

  return helmet.contentSecurityPolicy({
    useDefaults: true,
    reportOnly,
    directives,
  });
};

/**
 * Standard CSP middleware used in Express app pipeline.
 */
export const cspMiddleware: RequestHandler = (req, res, next) => {
  return createCspMiddleware()(req, res, next);
};

/**
 * Request handler for receiving and logging CSP violation telemetry.
 * Registered on POST /api/security/csp-report.
 */
export const cspReportHandler: RequestHandler = (req: Request, res: Response): void => {
  const body = req.body as Record<string, unknown> | undefined;
  const report =
    body && typeof body === 'object' && ('csp-report' in body || 'csp_report' in body)
      ? (body['csp-report'] as Record<string, unknown>) || (body['csp_report'] as Record<string, unknown>)
      : body;

  if (report && Object.keys(report).length > 0) {
    logger.warn('CSP Violation detected:', {
      documentUri: report['document-uri'] || report.documentUri || 'unknown',
      blockedUri: report['blocked-uri'] || report.blockedUri || 'unknown',
      violatedDirective: report['violated-directive'] || report.violatedDirective || 'unknown',
      effectiveDirective: report['effective-directive'] || report.effectiveDirective || 'unknown',
      originalPolicy: report['original-policy'] || report.originalPolicy || 'unknown',
      sourceFile: report['source-file'] || report.sourceFile || 'unknown',
      lineNumber: report['line-number'] || report.lineNumber || 'unknown',
      referrer: req.get('referrer') || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
    });
  } else {
    logger.warn('CSP Violation report received with empty body', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  }

  res.status(204).end();
};

export default cspMiddleware;
