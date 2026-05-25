import { describe, it, expect, beforeEach } from 'vitest';
import {
  TemplateRegistry,
  type TemplateGovernanceRecord,
} from './templateGovernance.js';

function makeRecord(
  overrides: Partial<TemplateGovernanceRecord> = {}
): TemplateGovernanceRecord {
  return {
    name: 'rent_reminder',
    category: 'UTILITY',
    qualityStatus: 'approved',
    language: 'en',
    parameters: ['{{1}}', '{{2}}'],
    lastChecked: new Date(),
    ...overrides,
  };
}

describe('TemplateRegistry', () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = new TemplateRegistry();
  });

  it('registers a template and allows retrieval', () => {
    registry.register(makeRecord({ name: 'welcome' }));
    const all = registry.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe('welcome');
  });

  it('check returns allowed=true for an approved template', () => {
    registry.register(makeRecord({ name: 'promo', qualityStatus: 'approved' }));
    const result = registry.check('promo');
    expect(result.allowed).toBe(true);
    expect(result.record?.name).toBe('promo');
  });

  it('check returns allowed=false for a pending template', () => {
    registry.register(makeRecord({ name: 'new_listing', qualityStatus: 'pending' }));
    const result = registry.check('new_listing');
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/pending/i);
  });

  it('check returns allowed=false for a rejected template with reason', () => {
    registry.register(
      makeRecord({ name: 'spam', qualityStatus: 'rejected', rejectReason: 'prohibited content' })
    );
    const result = registry.check('spam');
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/rejected/i);
    expect(result.reason).toMatch(/prohibited content/);
  });

  it('check returns allowed=false for a paused template', () => {
    registry.register(makeRecord({ name: 'promo_paused', qualityStatus: 'paused' }));
    const result = registry.check('promo_paused');
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/paused/i);
  });

  it('check returns allowed=false for an unknown template', () => {
    const result = registry.check('ghost_template');
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not registered/i);
    expect(result.record).toBeUndefined();
  });

  it('updateQuality changes status from approved to paused', () => {
    registry.register(makeRecord({ name: 'payment_due', qualityStatus: 'approved' }));
    registry.updateQuality('payment_due', 'paused', 'quality rating drop');
    const result = registry.check('payment_due');
    expect(result.allowed).toBe(false);
    expect(result.record?.qualityStatus).toBe('paused');
    expect(result.record?.rejectReason).toBe('quality rating drop');
  });

  it('updateQuality is a no-op for unknown templates', () => {
    // Should not throw
    expect(() => registry.updateQuality('nonexistent', 'approved')).not.toThrow();
  });

  it('register overwrites an existing record (upsert)', () => {
    registry.register(makeRecord({ name: 'overwrite_me', qualityStatus: 'pending' }));
    registry.register(makeRecord({ name: 'overwrite_me', qualityStatus: 'approved' }));
    const all = registry.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].qualityStatus).toBe('approved');
  });

  it('getAll returns all registered records', () => {
    registry.register(makeRecord({ name: 'a' }));
    registry.register(makeRecord({ name: 'b' }));
    registry.register(makeRecord({ name: 'c' }));
    expect(registry.getAll()).toHaveLength(3);
  });

  it('MARKETING template is registered and checked correctly', () => {
    registry.register(makeRecord({ name: 'mkt_promo', category: 'MARKETING', qualityStatus: 'approved' }));
    const result = registry.check('mkt_promo');
    expect(result.allowed).toBe(true);
    expect(result.record?.category).toBe('MARKETING');
  });

  it('AUTHENTICATION template is registered and checked correctly', () => {
    registry.register(
      makeRecord({ name: 'otp_code', category: 'AUTHENTICATION', qualityStatus: 'approved' })
    );
    const result = registry.check('otp_code');
    expect(result.allowed).toBe(true);
  });
});
