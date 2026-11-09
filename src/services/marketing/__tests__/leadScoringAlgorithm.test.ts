import { describe, it, expect } from 'vitest';
import { evaluateLeadScore, LeadScoringProfile } from '../leadScoringAlgorithm';

describe('Performance Marketing: Client Lead Scoring Algorithm', () => {
  it('classifies ready high-net-worth buyer as VIP_PLATINUM with 5-minute SLA', () => {
    const profile: LeadScoringProfile = {
      clientId: 'LEAD-VIP-001',
      budgetAed: 25_000_000,
      timelineDays: 7,
      targetCommunities: ['Palm Jumeirah'],
      hasPreApprovalOrProofOfFunds: true,
      interactionCount: 5,
      lastActiveHoursAgo: 1,
      inquirySource: 'WHATSAPP_CONCIERGE',
      buyerType: 'END_USER'
    };

    const res = evaluateLeadScore(profile);
    expect(res.overallScore).toBe(100);
    expect(res.tier).toBe('VIP_PLATINUM');
    expect(res.routingRecommendation.targetSlaMinutes).toBe(5);
    expect(res.routingRecommendation.assignedDepartment).toBe('DEPT-01-LUXURY');
  });

  it('classifies early stage browser as COLD_NURTURE with 24-hour SLA', () => {
    const profile: LeadScoringProfile = {
      clientId: 'LEAD-COLD-002',
      budgetAed: 1_200_000,
      timelineDays: 180,
      targetCommunities: ['Dubai South'],
      hasPreApprovalOrProofOfFunds: false,
      interactionCount: 1,
      lastActiveHoursAgo: 96,
      inquirySource: 'PORTAL_BAYUT',
      buyerType: 'UNSPECIFIED'
    };

    const res = evaluateLeadScore(profile);
    expect(res.overallScore).toBeLessThan(45);
    expect(res.tier).toBe('COLD_NURTURE');
    expect(res.routingRecommendation.targetSlaMinutes).toBe(1440);
  });
});
