import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { WhatsAppSessionVaultService } from './WhatsAppSessionVaultService';

describe('WhatsAppSessionVaultService', () => {
  const testRootDir = path.resolve(process.cwd(), 'temp-test-wa-sessions');
  let service: WhatsAppSessionVaultService;

  beforeEach(() => {
    if (fs.existsSync(testRootDir)) {
      fs.rmSync(testRootDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testRootDir, { recursive: true });
    service = new WhatsAppSessionVaultService(testRootDir);
  });

  afterEach(() => {
    if (fs.existsSync(testRootDir)) {
      fs.rmSync(testRootDir, { recursive: true, force: true });
    }
  });

  it('lists discovered WhatsApp session directories and extracts phone numbers', () => {
    const s1 = path.join(testRootDir, 'session-971505760056');
    const s2 = path.join(testRootDir, 'session-971507160096');
    fs.mkdirSync(s1, { recursive: true });
    fs.mkdirSync(s2, { recursive: true });

    const sessions = service.listSessions();
    expect(sessions.length).toBe(2);

    const phones = sessions.map(s => s.phoneNumber).sort();
    expect(phones).toEqual(['971505760056', '971507160096']);
  });

  it('cleans up orphaned Chromium lock files from session directories', () => {
    const s1 = path.join(testRootDir, 'session-971505760056');
    fs.mkdirSync(s1, { recursive: true });
    const lock = path.join(s1, 'SingletonLock');
    fs.writeFileSync(lock, 'dummy-lock');

    expect(fs.existsSync(lock)).toBe(true);
    const cleaned = service.cleanOrphanedLocks();
    expect(cleaned).toBe(1);
    expect(fs.existsSync(lock)).toBe(false);
  });
});
