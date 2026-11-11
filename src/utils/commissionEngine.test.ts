import { describe, it, expect } from 'vitest';
import { calculateAgentPayout, calculateMultiAgentSplit } from './commissionEngine';

describe('Commission Engine — calculateAgentPayout', () => {
  it('gives 70% split for onboarding agents', () => {
    const result = calculateAgentPayout(100000, true, 0);
    expect(result.agentPayout).toBe(70000);
    expect(result.companyRevenue).toBe(30000);
    expect(result.currentTierPct).toBe(0.7);
    expect(result.tierName).toBe('Accelerated Onboarding (70/30)');
  });

  it('gives 75% uncapped split for Chairman Circle champions', () => {
    const result = calculateAgentPayout(100000, false, 20000, true);
    expect(result.agentPayout).toBe(75000);
    expect(result.companyRevenue).toBe(25000);
    expect(result.currentTierPct).toBe(0.75);
  });

  it('applies correct standard performance tiers based on monthly run-rate', () => {
    // Executive Consultant (< 50,000 AED)
    const t1 = calculateAgentPayout(40000, false, 30000);
    expect(t1.currentTierPct).toBe(0.5);
    expect(t1.agentPayout).toBe(20000);

    // Silver Producer (50,000 - 99,999 AED)
    const t2 = calculateAgentPayout(40000, false, 75000);
    expect(t2.currentTierPct).toBe(0.55);
    expect(t2.agentPayout).toBe(22000);

    // Gold Producer (100,000 - 149,999 AED)
    const t3 = calculateAgentPayout(40000, false, 120000);
    expect(t3.currentTierPct).toBe(0.6);
    expect(t3.agentPayout).toBe(24000);

    // Platinum Elite (150,000+ AED)
    const t4 = calculateAgentPayout(40000, false, 180000);
    expect(t4.currentTierPct).toBe(0.7);
    expect(t4.agentPayout).toBe(28000);
  });

  it('handles zero or negative gross commission gracefully', () => {
    const result = calculateAgentPayout(0);
    expect(result.agentPayout).toBe(0);
    expect(result.companyRevenue).toBe(0);
  });
});

describe('Commission Engine — calculateMultiAgentSplit', () => {
  it('correctly calculates 50/50 internal co-broke deals', () => {
    const split = calculateMultiAgentSplit({
      grossCommission: 100000,
      dealType: 'INTERNAL_CO_BROKE',
      agentAPercentage: 0.5,
      agentAIsOnboarding: true, // gets 70% of his 50k share = 35k
    });

    expect(split.referralFee).toBe(0);
    expect(split.agentAPayout).toBe(35000);
    expect(split.agentBPayout).toBe(25000); // 50% of 50k = 25k
    expect(split.companyRevenue).toBe(40000);
    expect(split.agentAPayout + split.agentBPayout + split.companyRevenue).toBe(100000);
  });

  it('correctly deducts external referral fee capped at 25%', () => {
    const split = calculateMultiAgentSplit({
      grossCommission: 100000,
      dealType: 'REFERRAL',
      referralPercentage: 0.2, // 20%
    });

    expect(split.referralFee).toBe(20000);
    expect(split.netCommissionPool).toBe(80000);
    expect(split.agentAPayout).toBe(40000); // 50% of 80k
    expect(split.companyRevenue).toBe(40000);
  });
});
