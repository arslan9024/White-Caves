import { describe, it, expect } from 'vitest';
import {
  calculateDailyPremiumCap,
  canAssistantRequestTier,
  getAssistantExecutionProfile,
} from './subagentOrchestration';

describe('subagentOrchestration config helpers', () => {
  it('returns profile for known assistant', () => {
    const profile = getAssistantExecutionProfile('linda');
    expect(profile).not.toBeNull();
    expect(profile?.id).toBe('linda');
  });

  it('returns null for unknown assistant', () => {
    expect(getAssistantExecutionProfile('unknown')).toBeNull();
  });

  it('blocks premium for free-only assistants', () => {
    const result = canAssistantRequestTier({
      assistantId: 'linda',
      requestedTier: 'premium',
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('not permitted');
  });

  it('requires context gate for gated assistants requesting premium', () => {
    const result = canAssistantRequestTier({
      assistantId: 'mira',
      requestedTier: 'premium',
      contextGateApproved: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('context gate approval');
  });

  it('allows premium when assistant and context gate are both valid', () => {
    const result = canAssistantRequestTier({
      assistantId: 'mira',
      requestedTier: 'premium',
      contextGateApproved: true,
    });

    expect(result.allowed).toBe(true);
  });

  it('computes daily cap from weekly remaining and business days', () => {
    expect(calculateDailyPremiumCap({ weeklyRemaining: 23, businessDaysRemaining: 5 })).toBe(4);
    expect(calculateDailyPremiumCap({ weeklyRemaining: 23, businessDaysRemaining: 0 })).toBe(0);
  });
});
