import { describe, it, expect } from 'vitest';
import { calculateLeadScore } from './leadScoringEngine';

describe('Lead Scoring Engine — Business Rule BR-001', () => {
  it('correctly calculates Hot Lead with budget >= 3M AED, urgent timeline, recent activity, and referral', () => {
    const result = calculateLeadScore({
      budgetAED: 3500000,
      timeline: 'URGENT',
      daysSinceLastActivity: 2,
      source: 'REFERRAL',
    });

    // Baseline 30 + Budget 25 + Urgent 20 + Activity 15 + Referral 10 = 100
    expect(result.finalScore).toBe(100);
    expect(result.tier).toBe('HOT');
    expect(result.requiresPriorityFollowup).toBe(true);
    expect(result.isDormant).toBe(false);
  });

  it('correctly scores Warm Lead with mid-tier budget and 1-3 months timeline', () => {
    const result = calculateLeadScore({
      budgetAED: 1800000,
      timeline: '1_TO_3_MONTHS',
      daysSinceLastActivity: 6,
      source: 'WHATSAPP_INBOUND',
    });

    // Baseline 30 + Budget 15 + 1-3m 15 + Activity 10 + WhatsApp 8 = 78
    expect(result.finalScore).toBe(78);
    expect(result.tier).toBe('WARM');
    expect(result.requiresPriorityFollowup).toBe(false);
  });

  it('penalizes dormant leads with 30+ days inactivity and flags dormancy', () => {
    const result = calculateLeadScore({
      budgetAED: 800000,
      timeline: 'FUTURE_EXPLORING',
      daysSinceLastActivity: 35,
      source: 'COLD_CALL',
    });

    // Baseline 30 + Budget 5 + Timeline 0 - Activity 20 + Source 2 = 17
    expect(result.finalScore).toBe(17);
    expect(result.tier).toBe('COLD');
    expect(result.isDormant).toBe(true);
  });

  it('supports authorized manual score override while keeping auditable breakdown', () => {
    const result = calculateLeadScore({
      budgetAED: 500000,
      timeline: 'FUTURE_EXPLORING',
      daysSinceLastActivity: 40,
      source: 'COLD_CALL',
      manualOverrideScore: 92,
    });

    expect(result.finalScore).toBe(92);
    expect(result.tier).toBe('HOT');
    expect(result.requiresPriorityFollowup).toBe(true);
    expect(result.rawScore).toBeLessThan(40);
  });
});
