import { describe, it, expect } from 'vitest';
import {
  evaluateFounderGuard,
  hydrateFounderSession,
  FOUNDER_EMAIL,
  LEVEL_5_MASTER,
} from '../guards/FounderGuard';

describe('Founder Guard Security Law (FounderGuard.ts)', () => {
  it('does not grant master access based on email alone', () => {
    const profile = evaluateFounderGuard(FOUNDER_EMAIL);
    expect(profile.email).toBe(FOUNDER_EMAIL);
    expect(profile.accessLevel).toBe(1);
    expect(profile.isFounder).toBe(false);
  });

  it('accepts the founder identity only with server-provided master role and access level', () => {
    const profile = evaluateFounderGuard(FOUNDER_EMAIL, {
      role: 'managing_director',
      accessLevel: LEVEL_5_MASTER,
    });
    expect(profile.accessLevel).toBe(LEVEL_5_MASTER);
    expect(profile.isFounder).toBe(true);
  });

  it('assigns standard level 1 access to non-founder emails', () => {
    const profile = evaluateFounderGuard('agent@whitecaves.ae');
    expect(profile.accessLevel).toBe(1);
    expect(profile.isFounder).toBe(false);
  });

  it('does not create a founder session when no authenticated token is available', () => {
    const profile = hydrateFounderSession(FOUNDER_EMAIL);
    expect(profile.isFounder).toBe(false);
    expect(profile.accessLevel).toBe(1);
  });
});
