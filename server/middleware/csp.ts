import type { RequestHandler } from 'express';
import helmet from 'helmet';
import { IS_PRODUCTION } from '../config/env.js';

const REPORT_ONLY_FLAG = process.env.CSP_REPORT_ONLY;

const isReportOnly =
  REPORT_ONLY_FLAG === undefined ? true : REPORT_ONLY_FLAG.toLowerCase() !== 'false';

export const cspMiddleware: RequestHandler = helmet.contentSecurityPolicy({
  useDefaults: true,
  reportOnly: isReportOnly,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://*.firebaseapp.com',
      'https://*.googleapis.com',
    ],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://*.unsplash.com',
      'https://*.googleapis.com',
      'https://*.gstatic.com',
    ],
    connectSrc: [
      "'self'",
      'https://*.firebaseio.com',
      'https://*.googleapis.com',
      'https://*.firebase.com',
      'wss://*.firebaseio.com',
      'https://api.stripe.com',
    ],
    frameSrc: ['https://*.firebaseapp.com', 'https://js.stripe.com'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    ...(IS_PRODUCTION ? { upgradeInsecureRequests: [] } : {}),
  },
});

export default cspMiddleware;
