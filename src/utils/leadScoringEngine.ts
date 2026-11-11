/**
 * Lead Scoring Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements deterministic lead scoring rules, priority bands, and decay logic
 * per Business Rule BR-001:
 *   - Budget capacity scoring (+5 to +25)
 *   - Timeline urgency scoring (0 to +20)
 *   - Recency & activity decay (+15, +10, +5, -20)
 *   - Inbound source scoring (+2 to +10)
 * Reference: .agents/docs/business-rules.md (BR-001)
 */

export type TimelineUrgency = 'URGENT' | '1_TO_3_MONTHS' | '3_TO_6_MONTHS' | 'FUTURE_EXPLORING';
export type LeadSource = 'REFERRAL' | 'WHATSAPP_INBOUND' | 'PROPERTY_PORTAL' | 'COLD_CALL' | 'WALK_IN' | 'OTHER';
export type LeadTier = 'HOT' | 'WARM' | 'COLD';

export interface LeadScoringInput {
  budgetAED: number;
  timeline: TimelineUrgency;
  daysSinceLastActivity: number;
  source: LeadSource;
  manualOverrideScore?: number;
}

export interface LeadScoreBreakdown {
  budgetScore: number;
  timelineScore: number;
  activityScore: number;
  sourceScore: number;
  rawScore: number;
  finalScore: number;
  tier: LeadTier;
  tierLabel: string;
  isDormant: boolean;
  requiresPriorityFollowup: boolean; // Hot lead requires < 2h follow-up
}

/**
 * Calculates deterministic lead score (0-100) and priority tier per BR-001.
 */
export function calculateLeadScore(input: LeadScoringInput): LeadScoreBreakdown {
  const { budgetAED, timeline, daysSinceLastActivity, source, manualOverrideScore } = input;

  // 1. Budget Score (BR-001-A, B, C)
  let budgetScore = 5;
  if (budgetAED >= 3000000) {
    budgetScore = 25;
  } else if (budgetAED >= 1000000) {
    budgetScore = 15;
  }

  // 2. Timeline Urgency Score (BR-001-D, E, F, G)
  let timelineScore = 0;
  switch (timeline) {
    case 'URGENT':
      timelineScore = 20;
      break;
    case '1_TO_3_MONTHS':
      timelineScore = 15;
      break;
    case '3_TO_6_MONTHS':
      timelineScore = 10;
      break;
    case 'FUTURE_EXPLORING':
    default:
      timelineScore = 0;
      break;
  }

  // 3. Activity Recency & Decay (BR-001-H, I, J, K)
  let activityScore = 0;
  const isDormant = daysSinceLastActivity >= 30;

  if (daysSinceLastActivity <= 3) {
    activityScore = 15;
  } else if (daysSinceLastActivity <= 7) {
    activityScore = 10;
  } else if (daysSinceLastActivity <= 14) {
    activityScore = 5;
  } else if (daysSinceLastActivity >= 30) {
    activityScore = -20;
  }

  // 4. Source Score (BR-001-L, M, N, O)
  let sourceScore = 0;
  switch (source) {
    case 'REFERRAL':
      sourceScore = 10;
      break;
    case 'WHATSAPP_INBOUND':
      sourceScore = 8;
      break;
    case 'PROPERTY_PORTAL':
      sourceScore = 5;
      break;
    case 'COLD_CALL':
    case 'WALK_IN':
      sourceScore = 2;
      break;
    default:
      sourceScore = 0;
      break;
  }

  // Base raw score
  // To normalize to 0-100 with baseline 30
  const baseline = 30;
  const rawScore = baseline + budgetScore + timelineScore + activityScore + sourceScore;

  // Apply manual override if authorized
  const finalScore = manualOverrideScore !== undefined
    ? Math.min(100, Math.max(0, manualOverrideScore))
    : Math.min(100, Math.max(0, rawScore));

  let tier: LeadTier = 'COLD';
  let tierLabel = 'Cold Lead 🔵';
  let requiresPriorityFollowup = false;

  if (finalScore >= 90) {
    tier = 'HOT';
    tierLabel = 'Hot Lead 🔴';
    requiresPriorityFollowup = true;
  } else if (finalScore >= 60) {
    tier = 'WARM';
    tierLabel = 'Warm Lead 🟡';
  }

  return {
    budgetScore,
    timelineScore,
    activityScore,
    sourceScore,
    rawScore,
    finalScore,
    tier,
    tierLabel,
    isDormant,
    requiresPriorityFollowup,
  };
}
