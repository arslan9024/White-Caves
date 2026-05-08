/**
 * Linda Opportunity Intelligence — Opportunity Scoring Engine
 *
 * Ported from `arslan9024/whatsapp-bot-linda` → `OpportunityIntelligence.js`
 * Adapted to TypeScript and integrated with the White Caves lead scoring system.
 *
 * This module scores WhatsApp messages and lead profiles to determine
 * opportunity quality, urgency, and project interest using multi-dimensional
 * heuristics derived from Dubai/DAMAC Hills 2 real estate context.
 *
 * The scores produced here augment — not replace — the existing Prisma-backed
 * `calculateLeadScore()` in `server/services/ai/leadScoringService.ts`.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MessageContext {
  message: string;
  phoneNumber?: string;
  previousMessages?: string[];
  leadStage?: string;
  source?: string;
}

export interface LeadProfile {
  name?: string;
  phone?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredAreas?: string[];
  timeline?: string; // "ASAP", "1-3 months", "3-6 months", "6+ months"
  dealType?: 'buy' | 'rent' | 'invest';
  lastContactDays?: number;
  engagementCount?: number;
  source?: string;
}

export interface OpportunityScore {
  total: number; // 0–100
  tier: 'high' | 'medium' | 'low' | 'cold';
  components: {
    urgency: number; // 0–25
    budget: number; // 0–25
    engagement: number; // 0–20
    projectInterest: number; // 0–20
    readiness: number; // 0–10
  };
  signals: string[]; // Human-readable signals detected
  recommendedAction: string;
  confidenceScore: number; // 0–1
}

// ─── Signal Dictionaries ────────────────────────────────────────────────────

const URGENCY_SIGNALS_HIGH = [
  'asap',
  'urgent',
  'immediately',
  'this week',
  'today',
  'now',
  'right away',
  'straight away',
  'need now',
  'as soon as possible',
  'need quickly',
  'move in ready',
];

const URGENCY_SIGNALS_MEDIUM = [
  'next month',
  'soon',
  'couple of months',
  'few weeks',
  'couple months',
  '1-2 months',
  '1 month',
  '2 months',
];

const BUDGET_SIGNALS_STRONG = [
  'cash buyer',
  'full payment',
  'ready to buy',
  'pre-approved',
  'pre approved',
  'approved mortgage',
  'cash purchase',
  'immediate transfer',
  'ready funds',
  'have budget',
  'budget ready',
];

const PROJECT_INTEREST_SIGNALS: Record<string, string[]> = {
  damac_hills_2: [
    'damac hills 2',
    'damac hills two',
    'dh2',
    'd-hills',
    'akoya',
    'akoya oxygen',
    'damac lagoons',
    'ibis',
    'radisson',
    'trump estates',
  ],
  downtown: ['downtown dubai', 'burj khalifa', 'blvd', 'opera district', 'old town'],
  marina: ['dubai marina', 'marina', 'jbr', 'jumeirah beach residence', 'marina walk'],
  jvc: ['jvc', 'jumeirah village circle', 'village circle'],
  palm: ['palm jumeirah', 'palm', 'the palm', 'palm island', 'nakheel'],
  business_bay: ['business bay', 'canal', 'executive towers', 'bay square'],
};

const DEAL_TYPE_SIGNALS: Record<string, string[]> = {
  buy: ['buy', 'purchase', 'buying', 'invest', 'investment', 'mortgage', 'own', 'ownership'],
  rent: ['rent', 'lease', 'rental', 'renting', 'leasing', 'tenant', 'monthly'],
  invest: ['roi', 'yield', 'rental yield', 'gross yield', 'return on investment', 'capital appreciation'],
};

const NEGATIVE_SIGNALS = [
  'just browsing',
  'not interested',
  'too expensive',
  'wrong number',
  'spam',
  'unsubscribe',
  'stop',
  'dont contact',
  "don't contact",
];

// ─── Core scoring functions ─────────────────────────────────────────────────

/**
 * Calculate urgency score (0–25) from message text.
 */
function scoreUrgency(message: string, timeline?: string): number {
  const lowerMsg = message.toLowerCase();
  const lowerTimeline = (timeline ?? '').toLowerCase();
  const combined = `${lowerMsg} ${lowerTimeline}`;

  if (URGENCY_SIGNALS_HIGH.some(s => combined.includes(s))) return 25;
  if (URGENCY_SIGNALS_MEDIUM.some(s => combined.includes(s))) return 15;
  if (combined.includes('3 months') || combined.includes('quarter')) return 10;
  if (combined.includes('6 months') || combined.includes('half year')) return 5;
  return 3; // Baseline — any enquiry shows some urgency
}

/**
 * Calculate budget readiness score (0–25).
 */
function scoreBudget(
  message: string,
  budgetMin?: number,
  budgetMax?: number
): number {
  const lowerMsg = message.toLowerCase();
  let score = 0;

  if (BUDGET_SIGNALS_STRONG.some(s => lowerMsg.includes(s))) {
    score += 20;
  }

  // Budget amount heuristics (AED)
  if (budgetMax !== undefined && budgetMin !== undefined) {
    const avgBudget = (budgetMin + budgetMax) / 2;
    if (avgBudget >= 3_000_000) score += 5; // AED 3M+ — serious buyer
    else if (avgBudget >= 1_000_000) score += 3;
    else if (avgBudget >= 500_000) score += 2;
    else score += 1;
  } else if (budgetMax !== undefined) {
    if (budgetMax >= 2_000_000) score += 4;
    else if (budgetMax >= 800_000) score += 2;
    else score += 1;
  }

  // Extract AED amounts from the message text
  const aedMatches = lowerMsg.match(/aed\s*([\d,]+(?:\.\d+)?(?:k|m|mn)?)/gi) ?? [];
  if (aedMatches.length > 0) score = Math.min(score + 3, 25);

  return Math.min(score, 25);
}

/**
 * Calculate engagement score (0–20) from conversation history.
 */
function scoreEngagement(
  message: string,
  previousMessages?: string[],
  engagementCount?: number
): number {
  let score = 0;
  const messageLength = message.trim().length;

  // Message quality
  if (messageLength > 200) score += 8;
  else if (messageLength > 100) score += 5;
  else if (messageLength > 50) score += 3;
  else score += 1;

  // Questions indicate higher engagement
  const questionCount = (message.match(/\?/g) ?? []).length;
  score += Math.min(questionCount * 2, 6);

  // Previous interaction history
  const historyCount = previousMessages?.length ?? engagementCount ?? 0;
  if (historyCount >= 10) score += 6;
  else if (historyCount >= 5) score += 4;
  else if (historyCount >= 2) score += 2;
  else if (historyCount >= 1) score += 1;

  return Math.min(score, 20);
}

/**
 * Calculate project interest score (0–20).
 */
function scoreProjectInterest(message: string, preferredAreas?: string[]): number {
  const lowerMsg = message.toLowerCase();
  let score = 0;

  for (const [, signals] of Object.entries(PROJECT_INTEREST_SIGNALS)) {
    if (signals.some(s => lowerMsg.includes(s))) {
      score += 10;
      break; // First matching project cluster
    }
  }

  // Preferred areas from profile
  if (preferredAreas && preferredAreas.length > 0) {
    const areaBonus = preferredAreas.some(area =>
      Object.values(PROJECT_INTEREST_SIGNALS).flat().some(s => area.toLowerCase().includes(s))
    );
    if (areaBonus) score += 5;
  }

  // Specific property type interest
  const typeKeywords = ['villa', 'apartment', 'penthouse', 'townhouse', '1br', '2br', '3br', '4br', 'studio', 'duplex'];
  if (typeKeywords.some(k => lowerMsg.includes(k))) score += 5;

  return Math.min(score, 20);
}

/**
 * Calculate deal-readiness score (0–10).
 */
function scoreReadiness(message: string, leadStage?: string, dealType?: LeadProfile['dealType']): number {
  const lowerMsg = message.toLowerCase();
  let score = 0;

  // Lead stage from CRM (1=Acquisition → 10=PnL)
  if (leadStage !== undefined) {
    const stage = parseInt(String(leadStage), 10);
    if (!isNaN(stage)) {
      if (stage >= 6) score += 6; // Deposit / Contract / Handover stage
      else if (stage >= 4) score += 4; // Offer stage
      else if (stage >= 2) score += 2; // Matching/Viewing
    }
  }

  // Deal type specificity in message
  for (const [, signals] of Object.entries(DEAL_TYPE_SIGNALS)) {
    if (signals.some(s => lowerMsg.includes(s))) {
      score += 3;
      break;
    }
  }

  if (dealType) score += 1; // Has a defined deal type

  return Math.min(score, 10);
}

/**
 * Check for negative signals — if found, return a very low score.
 */
function hasNegativeSignals(message: string): boolean {
  const lowerMsg = message.toLowerCase();
  return NEGATIVE_SIGNALS.some(s => lowerMsg.includes(s));
}

/**
 * Map total score to a tier.
 */
function scoreTier(total: number): OpportunityScore['tier'] {
  if (total >= 70) return 'high';
  if (total >= 45) return 'medium';
  if (total >= 20) return 'low';
  return 'cold';
}

/**
 * Generate a recommended action based on the score.
 */
function recommendAction(tier: OpportunityScore['tier'], signals: string[]): string {
  switch (tier) {
    case 'high':
      return 'Assign to senior agent immediately — hot lead with high conversion probability';
    case 'medium':
      return signals.includes('Budget signals detected')
        ? 'Follow up within 4 hours — warm lead with budget readiness signals'
        : 'Follow up within 24 hours — warm lead';
    case 'low':
      return 'Add to 7-day nurture sequence — low engagement but has interest signals';
    default:
      return 'Add to 30-day cold nurture sequence';
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Score a WhatsApp message against a lead profile to determine opportunity quality.
 *
 * @example
 * const score = scoreOpportunity(
 *   { message: 'Hi I want to buy a villa ASAP, cash payment, budget AED 2.5M' },
 *   { dealType: 'buy', preferredAreas: ['DAMAC Hills 2'] }
 * );
 * // => { total: 87, tier: 'high', ... }
 */
export function scoreOpportunity(context: MessageContext, profile: LeadProfile = {}): OpportunityScore {
  if (hasNegativeSignals(context.message)) {
    return {
      total: 0,
      tier: 'cold',
      components: { urgency: 0, budget: 0, engagement: 0, projectInterest: 0, readiness: 0 },
      signals: ['Negative signal detected — lead opted out or expressed disinterest'],
      recommendedAction: 'Mark as disinterested and remove from active sequences',
      confidenceScore: 0.95,
    };
  }

  const components = {
    urgency: scoreUrgency(context.message, profile.timeline),
    budget: scoreBudget(context.message, profile.budgetMin, profile.budgetMax),
    engagement: scoreEngagement(context.message, context.previousMessages, profile.engagementCount),
    projectInterest: scoreProjectInterest(context.message, profile.preferredAreas),
    readiness: scoreReadiness(context.message, context.leadStage, profile.dealType),
  };

  const total = Math.min(
    components.urgency + components.budget + components.engagement + components.projectInterest + components.readiness,
    100
  );

  const signals: string[] = [];
  if (components.urgency >= 20) signals.push('High urgency detected');
  else if (components.urgency >= 10) signals.push('Medium urgency detected');

  if (components.budget >= 15) signals.push('Budget signals detected');
  if (components.projectInterest >= 10) signals.push('Project/area interest detected');
  if (components.engagement >= 15) signals.push('High engagement (detailed inquiry)');
  if (components.readiness >= 6) signals.push('Lead is in decision/offer stage');

  const tier = scoreTier(total);

  // Confidence is higher when multiple components contribute
  const activeComponents = Object.values(components).filter(v => v > 0).length;
  const confidenceScore = Math.min(activeComponents / 5 + 0.2, 1);

  return {
    total,
    tier,
    components,
    signals,
    recommendedAction: recommendAction(tier, signals),
    confidenceScore,
  };
}

/**
 * Score multiple messages in bulk (e.g., for batch scoring a broadcast response list).
 */
export function scoreOpportunityBatch(
  items: Array<{ context: MessageContext; profile?: LeadProfile }>
): OpportunityScore[] {
  return items.map(({ context, profile }) => scoreOpportunity(context, profile ?? {}));
}

/**
 * Quick message classification without a full lead profile.
 * Useful for real-time classification of incoming WhatsApp messages.
 */
export function classifyMessage(message: string): {
  intent: 'enquiry' | 'objection' | 'request_info' | 'schedule_viewing' | 'make_offer' | 'complaint' | 'unknown';
  confidence: number;
  signals: string[];
} {
  const lower = message.toLowerCase();
  const signals: string[] = [];

  if (NEGATIVE_SIGNALS.some(s => lower.includes(s))) {
    return { intent: 'objection', confidence: 0.9, signals: ['Negative/objection signal'] };
  }

  if (lower.includes('view') || lower.includes('visit') || lower.includes('appointment') || lower.includes('schedule')) {
    signals.push('Viewing/appointment request');
    return { intent: 'schedule_viewing', confidence: 0.85, signals };
  }

  if (lower.includes('offer') || lower.includes('mou') || lower.includes('sign') || lower.includes('proceed')) {
    signals.push('Offer/MOU signal');
    return { intent: 'make_offer', confidence: 0.8, signals };
  }

  if (lower.includes('problem') || lower.includes('issue') || lower.includes('complaint') || lower.includes('unhappy')) {
    signals.push('Complaint signal');
    return { intent: 'complaint', confidence: 0.75, signals };
  }

  if (lower.includes('send') || lower.includes('brochure') || lower.includes('details') || lower.includes('floor plan') || lower.includes('info')) {
    signals.push('Information request');
    return { intent: 'request_info', confidence: 0.7, signals };
  }

  if (lower.includes('interested') || lower.includes('looking') || lower.includes('want') || lower.includes('need') || lower.includes('buy') || lower.includes('rent')) {
    signals.push('Interest signal');
    return { intent: 'enquiry', confidence: 0.65, signals };
  }

  return { intent: 'unknown', confidence: 0.3, signals: [] };
}
