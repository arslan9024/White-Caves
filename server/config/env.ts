/**
 * Centralized Environment Configuration
 * Single source of truth for all server environment variables
 */

import { createLogger } from '../utils/logger.js';
const log = createLogger('EnvConfig');

// â”€â”€â”€ Server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PORT = parseInt(process.env.PORT || '3001', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret && (IS_PRODUCTION || NODE_ENV === 'staging')) {
  throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production/staging');
}
if (!_jwtSecret && NODE_ENV !== 'development' && NODE_ENV !== 'test') {
  throw new Error('CRITICAL: JWT_SECRET must be set for non-development environments');
}
if (!_jwtSecret) {
  log.warn('âš ï¸  JWT_SECRET not set â€” using dev-only fallback. Never deploy without it.');
}
export const JWT_SECRET = _jwtSecret || 'white-caves-dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
export const JWT_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const BCRYPT_ROUNDS = 12;

// â”€â”€â”€ Database â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _databaseUrl = process.env.DATABASE_URL;
if (!_databaseUrl && IS_PRODUCTION) {
  throw new Error('CRITICAL: DATABASE_URL environment variable must be set in production');
}
if (!_databaseUrl) {
  log.warn('âš ï¸  DATABASE_URL not set â€” Prisma will fail to connect. Set it in .env');
}
export const DATABASE_URL = _databaseUrl || '';

// â”€â”€â”€ CORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (!process.env.CORS_ORIGIN && IS_PRODUCTION) {
  throw new Error('CRITICAL: CORS_ORIGIN environment variable must be set in production');
}
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5000')
  .split(',')
  .map(s => s.trim());

// â”€â”€â”€ Webhooks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _whatsappSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
if (!_whatsappSecret && IS_PRODUCTION) {
  throw new Error('CRITICAL: WHATSAPP_WEBHOOK_SECRET environment variable must be set in production');
}
export const WHATSAPP_WEBHOOK_SECRET = _whatsappSecret || '';
