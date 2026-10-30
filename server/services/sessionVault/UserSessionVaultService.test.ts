import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { UserSessionVaultService } from './UserSessionVaultService';

describe('UserSessionVaultService', () => {
  const testDir = path.resolve(process.cwd(), 'temp-test-user-sessions');
  let service: UserSessionVaultService;

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    service = new UserSessionVaultService(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('creates and retrieves a valid user session', () => {
    const session = service.createSession({
      sessionId: 'sess-abc-123',
      userId: 'usr-999',
      email: 'test@whitecaves.com',
      role: 'agent',
    });

    expect(session.sessionId).toBe('sess-abc-123');
    expect(session.userId).toBe('usr-999');

    const fetched = service.getSession('sess-abc-123');
    expect(fetched).not.toBeNull();
    expect(fetched?.email).toBe('test@whitecaves.com');
  });

  it('revokes an active user session from memory and disk', () => {
    service.createSession({
      sessionId: 'sess-to-revoke',
      userId: 'usr-888',
      email: 'revoke@whitecaves.com',
      role: 'tenant',
    });

    const revoked = service.revokeSession('sess-to-revoke');
    expect(revoked).toBe(true);

    const fetched = service.getSession('sess-to-revoke');
    expect(fetched).toBeNull();
  });

  it('handles expired sessions gracefully', () => {
    service.createSession({
      sessionId: 'sess-expired',
      userId: 'usr-777',
      email: 'expired@whitecaves.com',
      role: 'buyer',
      ttlMs: -1000, // already expired
    });

    const fetched = service.getSession('sess-expired');
    expect(fetched).toBeNull();
  });
});
