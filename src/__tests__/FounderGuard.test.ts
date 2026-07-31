import { describe, it, expect } from 'vitest';
import { evaluateFounderGuard, shouldShortCircuitToProfile, FOUNDER_EMAIL, LEVEL_5_MASTER } from '../guards/FounderGuard';

describe('Founder Guard Security Law (FounderGuard.ts)', () => {
  it('correctly identifies founder email and injects LEVEL_5_MASTER access level', () => {
    const profile = evaluateFounderGuard(FOUNDER_EMAIL);
    expect(profile.email).toBe(FOUNDER_EMAIL);
    expect(profile.accessLevel).toBe(LEVEL_5_MASTER);
    expect(profile.isFounder).toBe(true);
    expect(profile.role).toBe('Managing Director & Founder');
  });

  it('handles case-insensitive and whitespace email variations cleanly', () => {
    const profile = evaluateFounderGuard('  ARSLANMALIKGORAHA@GMAIL.COM  ');
    expect(profile.accessLevel).toBe(LEVEL_5_MASTER);
    expect(profile.isFounder).toBe(true);
  });

  it('assigns standard level 1 access to non-founder emails', () => {
    const profile = evaluateFounderGuard('agent@whitecaves.ae');
    expect(profile.accessLevel).toBe(1);
    expect(profile.isFounder).toBe(false);
  });

  it('correctly evaluates short-circuit boolean helper', () => {
    expect(shouldShortCircuitToProfile(FOUNDER_EMAIL)).toBe(true);
    expect(shouldShortCircuitToProfile('user@example.com')).toBe(false);
  });
});
