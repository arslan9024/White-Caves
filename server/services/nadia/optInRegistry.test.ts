import { describe, it, expect, beforeEach } from 'vitest';
import { OptInRegistry, requiresOptIn } from './optInRegistry.js';

describe('OptInRegistry', () => {
  let registry: OptInRegistry;

  beforeEach(() => {
    registry = new OptInRegistry();
  });

  it('records an opt-in and returns the record', () => {
    const record = registry.record('971501234567', 'web_form', 'I agree to receive updates');
    expect(record.phone).toBe('971501234567');
    expect(record.source).toBe('web_form');
    expect(record.consentText).toBe('I agree to receive updates');
    expect(record.optedInAt).toBeInstanceOf(Date);
    expect(record.expiresAt).toBeInstanceOf(Date);
    expect(record.optedOutAt).toBeUndefined();
  });

  it('isOptedIn returns true for a fresh opt-in', () => {
    registry.record('971501111111', 'portal');
    expect(registry.isOptedIn('971501111111')).toBe(true);
  });

  it('isOptedIn returns false for an unknown number', () => {
    expect(registry.isOptedIn('971509999999')).toBe(false);
  });

  it('revoke sets optedOutAt and isOptedIn returns false', () => {
    registry.record('971502222222', 'portal');
    registry.revoke('971502222222');
    expect(registry.isOptedIn('971502222222')).toBe(false);
    const rec = registry.getRecord('971502222222');
    expect(rec?.optedOutAt).toBeInstanceOf(Date);
  });

  it('revoke on unknown number does not throw', () => {
    expect(() => registry.revoke('971500000000')).not.toThrow();
  });

  it('re-consent after revoke restores isOptedIn', () => {
    registry.record('971503333333', 'portal');
    registry.revoke('971503333333');
    expect(registry.isOptedIn('971503333333')).toBe(false);

    registry.record('971503333333', 'portal', undefined);
    expect(registry.isOptedIn('971503333333')).toBe(true);
  });

  it('isOptedIn returns false when opt-in is expired', () => {
    // Expire in 1 ms
    registry.record('971504444444', 'web', undefined, 1);
    // Wait 10 ms
    const past = Date.now() - 10;
    // Directly mutate the stored record's expiresAt to simulate past expiry
    const rec = registry.getRecord('971504444444');
    if (rec) (rec as { expiresAt: Date }).expiresAt = new Date(past);
    expect(registry.isOptedIn('971504444444')).toBe(false);
  });

  it('getRecord returns undefined for unknown phone', () => {
    expect(registry.getRecord('000')).toBeUndefined();
  });

  it('getAll returns all records including revoked', () => {
    registry.record('111', 'a');
    registry.record('222', 'b');
    registry.revoke('222');
    const all = registry.getAll();
    expect(all).toHaveLength(2);
  });

  it('countActive counts only non-revoked, non-expired records', () => {
    registry.record('aaa', 'x');
    registry.record('bbb', 'y');
    registry.revoke('bbb');
    expect(registry.countActive()).toBe(1);
  });

  it('countActive returns 0 when registry is empty', () => {
    expect(registry.countActive()).toBe(0);
  });

  it('countActive excludes expired records', () => {
    registry.record('ccc', 'z');
    const rec = registry.getRecord('ccc');
    if (rec) (rec as { expiresAt: Date }).expiresAt = new Date(Date.now() - 10);
    expect(registry.countActive()).toBe(0);
  });
});

describe('requiresOptIn', () => {
  it('returns true for MARKETING', () => {
    expect(requiresOptIn('MARKETING')).toBe(true);
  });

  it('returns false for UTILITY', () => {
    expect(requiresOptIn('UTILITY')).toBe(false);
  });

  it('returns false for AUTHENTICATION', () => {
    expect(requiresOptIn('AUTHENTICATION')).toBe(false);
  });

  it('returns false for unknown category', () => {
    expect(requiresOptIn('TRANSACTIONAL')).toBe(false);
  });
});
