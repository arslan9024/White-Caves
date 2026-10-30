/**
 * sessionVault.config.ts — Session Vault Configuration & Types
 * Canonical Category: Config / Schemas
 * Single Purpose: Centralized configuration and types for User and WhatsApp sessions.
 */

import path from 'path';

export interface UserSessionRecord {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
}

export interface WhatsAppSessionSummary {
  sessionId: string;
  phoneNumber?: string;
  path: string;
  hasLockfile: boolean;
  isActive: boolean;
  lastModified: number;
}

export const SESSIONS_ROOT = path.resolve(process.cwd(), 'sessions');
export const USER_SESSIONS_DIR = path.join(SESSIONS_ROOT, 'user-sessions');

export const SESSION_LOCK_FILES = [
  'lockfile',
  'SingletonLock',
  'SingletonCookie',
  'SingletonSocket',
];

export const DEFAULT_USER_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

