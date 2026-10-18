import { randomBytes } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../database.js', () => ({ prisma: {} }));
import { EncryptionService, type EncryptedMessage } from '../../security/encryption.service';
import { decodeDocument, decodeSource, prepareDocument, prepareSource, referenceHash } from './documentVault';

describe('Henry ciphertext restore drills — synthetic data, no backup job or rotation claim', () => {
  beforeEach(() => {
    vi.stubEnv('DATABASE_URL', 'mongodb://localhost/henry_test_offline');
    vi.stubEnv('ENCRYPTION_KEY', randomBytes(32).toString('hex'));
  });
  afterEach(() => vi.unstubAllEnvs());
  it('exports ciphertext only and restores metadata and originals using a new service instance', () => {
    const metadata = prepareDocument({
      docType: 'title_deed', reviewConfirmed: true,
      extractedJson: { certificateNumber: 'SYNTHETIC', ownerNameEn: 'SYNTHETIC OWNER', plotNumber: '42' },
    }, '123456789012345678901234');
    const bytes = Buffer.from('%PDF-1.7\nSYNTHETIC ORIGINAL');
    const source = prepareSource([{ buffer: bytes, size: bytes.length, mimetype: 'application/pdf' } as Express.Multer.File]);
    const exported = JSON.stringify({ ...metadata, ...source });
    expect(exported).not.toContain('SYNTHETIC');
    const restored = JSON.parse(exported) as typeof metadata & { encryptedSource: string };
    const reloaded = new EncryptionService();
    expect(JSON.parse(reloaded.decryptMessage(JSON.parse(restored.encryptedPayload) as EncryptedMessage, process.env.ENCRYPTION_KEY!)).referenceNumber).toBe('SYNTHETIC');
    expect(decodeSource(restored.encryptedSource, 0).bytes).toEqual(bytes);
    expect(decodeDocument({ ...restored, id: '223456789012345678901234', createdAt: new Date(), updatedAt: new Date() }).authenticity).toBe('not_verified');
  });
  it.each(['ciphertext', 'iv', 'authTag'] as const)('fails authentication after %s tampering', field => {
    const encryption = new EncryptionService();
    const encrypted = encryption.encryptMessage('SYNTHETIC', process.env.ENCRYPTION_KEY!);
    const changed = { ...encrypted, [field]: (encrypted[field][0] === '0' ? '1' : '0') + encrypted[field].slice(1) };
    expect(() => encryption.decryptMessage(changed, process.env.ENCRYPTION_KEY!)).toThrow();
  });
  it('detects wrong keys and demonstrates why changing the single key is not supported rotation', () => {
    const originalKey = process.env.ENCRYPTION_KEY!;
    const encryption = new EncryptionService();
    const encrypted = encryption.encryptMessage('SYNTHETIC', originalKey);
    const previousHash = referenceHash('owner', 'title_deed', 'SYNTHETIC');
    vi.stubEnv('ENCRYPTION_KEY', randomBytes(32).toString('hex'));
    expect(() => encryption.decryptMessage(encrypted, process.env.ENCRYPTION_KEY!)).toThrow();
    expect(referenceHash('owner', 'title_deed', 'SYNTHETIC')).not.toBe(previousHash);
    expect(encryption.decryptMessage(encrypted, originalKey)).toBe('SYNTHETIC');
  });
});
