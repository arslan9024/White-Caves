/**
 * Centralized Environment Configuration
 * Single source of truth for all server environment variables
 */

import dotenv from 'dotenv';

// Load environment variables as early as possible to prevent import-order issues.
// In production, load .env.production on top of .env for local production-like runs.
const runtimeEnv = process.env.NODE_ENV;
const isTestRuntime = runtimeEnv === 'test' || process.env.VITEST === 'true';

if (!isTestRuntime) {
  dotenv.config({ quiet: true });
}
if (!isTestRuntime && runtimeEnv === 'production') {
  dotenv.config({ path: '.env.production', override: true, quiet: true });
}

// ─── Server ──────────────────────────────────────────────────────────────
export const PORT = parseInt(process.env.PORT || '3001', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// ─── Auth ────────────────────────────────────────────────────────────────
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret && (IS_PRODUCTION || NODE_ENV === 'staging')) {
  throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production/staging');
}
if (!_jwtSecret && NODE_ENV !== 'development' && NODE_ENV !== 'test') {
  throw new Error('CRITICAL: JWT_SECRET must be set for non-development environments');
}
if (!_jwtSecret) {
  console.warn('⚠️  JWT_SECRET not set — using dev-only fallback. Never deploy without it.');
}
export const JWT_SECRET = _jwtSecret || 'white-caves-dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
export const JWT_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const BCRYPT_ROUNDS = 12;

// ─── Database ────────────────────────────────────────────────────────────
const _databaseUrl = process.env.DATABASE_URL;
const _legacyMongoUri = process.env.MONGODB_URI;
const _usingLegacyMongoAlias = !_databaseUrl && Boolean(_legacyMongoUri);
const _resolvedDatabaseUrl = _databaseUrl || _legacyMongoUri || '';

if (_usingLegacyMongoAlias && !isTestRuntime) {
  console.warn(
    '⚠️  MONGODB_URI is deprecated. Please migrate to DATABASE_URL (canonical) as soon as possible.'
  );
}

if (!_resolvedDatabaseUrl && IS_PRODUCTION) {
  throw new Error('CRITICAL: DATABASE_URL environment variable must be set in production');
}
if (!_resolvedDatabaseUrl) {
  console.warn('⚠️  DATABASE_URL not set — Prisma will fail to connect. Set it in .env');
}
export const DATABASE_URL = _resolvedDatabaseUrl;

// ─── CORS ────────────────────────────────────────────────────────────────
if (!process.env.CORS_ORIGIN && IS_PRODUCTION) {
  throw new Error('CRITICAL: CORS_ORIGIN environment variable must be set in production');
}
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5000')
  .split(',')
  .map(s => s.trim());

// ─── Webhooks ────────────────────────────────────────────────────────────
const _whatsappSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
if (!_whatsappSecret && IS_PRODUCTION) {
  throw new Error(
    'CRITICAL: WHATSAPP_WEBHOOK_SECRET environment variable must be set in production'
  );
}
export const WHATSAPP_WEBHOOK_SECRET = _whatsappSecret || '';

// ─── Linda LocalAuth WhatsApp ─────────────────────────────────────────────
export const LINDA_ENABLED = process.env.LINDA_ENABLED !== 'false'; // opt-out flag
export const LINDA_SESSIONS_PATH = process.env.LINDA_SESSIONS_PATH || './.linda-sessions';
export const LINDA_BOT_MASTER_NUMBER = process.env.LINDA_BOT_MASTER_NUMBER || '';
export const LINDA_HEADLESS = process.env.LINDA_HEADLESS !== 'false';
export const LINDA_RECONNECT_DELAY = parseInt(process.env.LINDA_RECONNECT_DELAY || '5000', 10);
export const LINDA_MAX_RECONNECT_ATTEMPTS = parseInt(
  process.env.LINDA_MAX_RECONNECT_ATTEMPTS || '999',
  10
);
export const LINDA_GOOGLE_SHEET_ID = process.env.LINDA_GOOGLE_SHEET_ID || '';
export const LINDA_GOOGLE_KEYS_BASE64 = process.env.LINDA_GOOGLE_KEYS_BASE64 || '';
export const LINDA_CORE_MODE = process.env.LINDA_CORE_MODE || 'legacy';

// ─── Henry Document Hub ───────────────────────────────────────────────────
export const HENRY_UPLOADS_PATH = process.env.HENRY_UPLOADS_PATH || './uploads/henry';
export const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
export const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
