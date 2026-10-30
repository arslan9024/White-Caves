/**
 * WhatsAppSessionVaultService.ts — WhatsApp Multi-Device Session Operations
 * Canonical Category: Services & I/O
 * Single Purpose: Manage persistent WhatsApp Multi-Device session directories and clean lockfiles.
 */

import fs from 'fs';
import path from 'path';
import {
  SESSIONS_ROOT,
  SESSION_LOCK_FILES,
  type WhatsAppSessionSummary,
} from './sessionVault.config.js';

export class WhatsAppSessionVaultService {
  private readonly rootDir: string;

  constructor(customRootDir?: string) {
    this.rootDir = customRootDir || SESSIONS_ROOT;
  }

  public listSessions(): WhatsAppSessionSummary[] {
    if (!fs.existsSync(this.rootDir)) {
      return [];
    }

    try {
      const entries = fs.readdirSync(this.rootDir, { withFileTypes: true });
      const summaries: WhatsAppSessionSummary[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (!entry.name.startsWith('session-')) continue;

        const sessionDir = path.join(this.rootDir, entry.name);
        let hasLockfile = false;
        let lastModified = 0;

        try {
          const stats = fs.statSync(sessionDir);
          lastModified = stats.mtimeMs;

          for (const lock of SESSION_LOCK_FILES) {
            if (fs.existsSync(path.join(sessionDir, lock))) {
              hasLockfile = true;
              break;
            }
          }
        } catch {
          // stats error fallback
        }

        const phoneMatch = entry.name.match(/^session-(\d+)$/);
        const phoneNumber = phoneMatch ? phoneMatch[1] : undefined;

        summaries.push({
          sessionId: entry.name,
          phoneNumber,
          path: sessionDir,
          hasLockfile,
          isActive: hasLockfile,
          lastModified,
        });
      }

      return summaries;
    } catch {
      return [];
    }
  }

  public cleanOrphanedLocks(sessionId?: string): number {
    let cleaned = 0;
    const targetDirs: string[] = [];

    if (sessionId) {
      targetDirs.push(path.join(this.rootDir, sessionId));
    } else {
      const all = this.listSessions();
      for (const s of all) {
        targetDirs.push(s.path);
      }
    }

    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) continue;

      for (const lock of SESSION_LOCK_FILES) {
        const fullLockPath = path.join(dir, lock);
        if (fs.existsSync(fullLockPath)) {
          try {
            fs.unlinkSync(fullLockPath);
            cleaned++;
          } catch {
            // file may be currently held by active chrome process
          }
        }
      }
    }

    return cleaned;
  }
}

export const whatsAppSessionVault = new WhatsAppSessionVaultService();

