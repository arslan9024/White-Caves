/**
 * UserSessionVaultService.ts — User Login Session Persistence Vault
 * Canonical Category: Services & I/O
 * Single Purpose: Securely store, retrieve, and invalidate White Caves user login sessions.
 */

import fs from 'fs';
import path from 'path';
import {
  USER_SESSIONS_DIR,
  DEFAULT_USER_SESSION_TTL_MS,
  type UserSessionRecord,
} from './sessionVault.config.js';

export class UserSessionVaultService {
  private readonly storageDir: string;
  private readonly memoryCache: Map<string, UserSessionRecord> = new Map();

  constructor(customDir?: string) {
    this.storageDir = customDir || USER_SESSIONS_DIR;
    this.ensureDirectory();
  }

  private ensureDirectory(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  private getSessionFilePath(sessionId: string): string {
    const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '');
    return path.join(this.storageDir, `${safeId}.json`);
  }

  public createSession(
    payload: Omit<UserSessionRecord, 'createdAt' | 'expiresAt' | 'lastActiveAt'> & {
      ttlMs?: number;
    }
  ): UserSessionRecord {
    const now = Date.now();
    const ttl = payload.ttlMs || DEFAULT_USER_SESSION_TTL_MS;
    const session: UserSessionRecord = {
      sessionId: payload.sessionId,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      deviceInfo: payload.deviceInfo,
      ipAddress: payload.ipAddress,
      createdAt: now,
      expiresAt: now + ttl,
      lastActiveAt: now,
    };

    this.memoryCache.set(session.sessionId, session);
    try {
      this.ensureDirectory();
      fs.writeFileSync(this.getSessionFilePath(session.sessionId), JSON.stringify(session, null, 2), 'utf8');
    } catch {
      // In-memory fallback if disk is read-only
    }

    return session;
  }

  public getSession(sessionId: string): UserSessionRecord | null {
    if (this.memoryCache.has(sessionId)) {
      const cached = this.memoryCache.get(sessionId)!;
      if (Date.now() > cached.expiresAt) {
        this.revokeSession(sessionId);
        return null;
      }
      cached.lastActiveAt = Date.now();
      return cached;
    }

    const filePath = this.getSessionFilePath(sessionId);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const session = JSON.parse(raw) as UserSessionRecord;
      if (Date.now() > session.expiresAt) {
        this.revokeSession(sessionId);
        return null;
      }
      session.lastActiveAt = Date.now();
      this.memoryCache.set(sessionId, session);
      return session;
    } catch {
      return null;
    }
  }

  public revokeSession(sessionId: string): boolean {
    this.memoryCache.delete(sessionId);
    const filePath = this.getSessionFilePath(sessionId);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  public revokeUserSessions(userId: string): number {
    let revoked = 0;
    for (const [sId, session] of this.memoryCache.entries()) {
      if (session.userId === userId) {
        this.memoryCache.delete(sId);
        revoked++;
      }
    }

    if (fs.existsSync(this.storageDir)) {
      try {
        const files = fs.readdirSync(this.storageDir);
        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          const fullPath = path.join(this.storageDir, file);
          try {
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as UserSessionRecord;
            if (data.userId === userId) {
              fs.unlinkSync(fullPath);
              revoked++;
            }
          } catch {
            // ignore corrupted files
          }
        }
      } catch {
        // ignore dir read errors
      }
    }

    return revoked;
  }
}

export const userSessionVault = new UserSessionVaultService();
