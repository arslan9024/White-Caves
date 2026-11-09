/**
 * Real-Time Client Lead Scoring & VIP Intent Vector Algorithm
 * Domain: Performance Marketing & Predictive Intelligence (Domain 10, Item #95)
 * Standard: Normalized 0-100 Score, Intent Classification, and SLA Routing
 */

export interface LeadScoringProfile {
  clientId: string;
  budgetAed: number;
  timelineDays: number;
  targetCommunities: string[];
  hasPreApprovalOrProofOfFunds: boolean;
  interactionCount: number;
  lastActiveHoursAgo: number;
  inquirySource: 'WHATSAPP_CONCIERGE' | 'PORTAL_BAYUT' | 'DIRECT_WEBSITE' | 'REFERRAL';
  buyerType: 'END_USER' | 'INVESTOR' | 'UNSPECIFIED';
}

export interface LeadScoringResult {
  clientId: string;
  overallScore: number; // 0 to 100
  tier: 'VIP_PLATINUM' | 'HOT_GOLD' | 'WARM_SILVER' | 'COLD_NURTURE';
  routingRecommendation: {
    assignedDepartment: 'DEPT-01-LUXURY' | 'DEPT-02-OFFPLAN' | 'DEPT-04-LEASING';
    targetSlaMinutes: 5 | 15 | 60 | 1440;
    suggestedAction: string;
  };
  scoringBreakdown: {
    budgetScore: number;
    timelineScore: number;
    qualificationScore: number;
    engagementScore: number;
  };
}

export function evaluateLeadScore(profile: LeadScoringProfile): LeadScoringResult {
  const {
    clientId,
    budgetAed,
    timelineDays,
    hasPreApprovalOrProofOfFunds,
    interactionCount,
    lastActiveHoursAgo,
    inquirySource
  } = profile;

  // 1. Budget Score (Weight: 35%)
  let budgetScore = 10;
  if (budgetAed >= 15_000_000) {
    budgetScore = 35; // Ultra Luxury
  } else if (budgetAed >= 5_000_000) {
    budgetScore = 28;
  } else if (budgetAed >= 2_000_000) {
    budgetScore = 20;
  }

  // 2. Timeline Urgency (Weight: 25%)
  let timelineScore = 5;
  if (timelineDays <= 14) {
    timelineScore = 25;
  } else if (timelineDays <= 30) {
    timelineScore = 20;
  } else if (timelineDays <= 90) {
    timelineScore = 12;
  }

  // 3. Verification & Qualification (Weight: 25%)
  let qualificationScore = 5;
  if (hasPreApprovalOrProofOfFunds) {
    qualificationScore = 25;
  } else if (inquirySource === 'REFERRAL') {
    qualificationScore = 18;
  }

  // 4. Recency & Engagement (Weight: 15%)
  let engagementScore = 3;
  if (lastActiveHoursAgo <= 2 && interactionCount >= 3) {
    engagementScore = 15;
  } else if (lastActiveHoursAgo <= 24) {
    engagementScore = 10;
  } else if (lastActiveHoursAgo <= 72) {
    engagementScore = 6;
  }

  const overallScore = Math.min(100, budgetScore + timelineScore + qualificationScore + engagementScore);

  let tier: LeadScoringResult['tier'] = 'COLD_NURTURE';
  let targetSlaMinutes: LeadScoringResult['routingRecommendation']['targetSlaMinutes'] = 1440;
  let assignedDepartment: LeadScoringResult['routingRecommendation']['assignedDepartment'] = 'DEPT-02-OFFPLAN';
  let suggestedAction = 'Add to automated nurture campaign and weekly newsletter';

  if (overallScore >= 85) {
    tier = 'VIP_PLATINUM';
    targetSlaMinutes = 5;
    assignedDepartment = budgetAed >= 10_000_000 ? 'DEPT-01-LUXURY' : 'DEPT-02-OFFPLAN';
    suggestedAction = 'Direct dispatch to Senior Director with private penthouse viewing schedule';
  } else if (overallScore >= 70) {
    tier = 'HOT_GOLD';
    targetSlaMinutes = 15;
    suggestedAction = 'Immediate WhatsApp outreach with curated brochure';
  } else if (overallScore >= 45) {
    tier = 'WARM_SILVER';
    targetSlaMinutes = 60;
    suggestedAction = 'Standard agent follow-up within 1 hour';
  }

  return {
    clientId,
    overallScore,
    tier,
    routingRecommendation: {
      assignedDepartment,
      targetSlaMinutes,
      suggestedAction
    },
    scoringBreakdown: {
      budgetScore,
      timelineScore,
      qualificationScore,
      engagementScore
    }
  };
}
