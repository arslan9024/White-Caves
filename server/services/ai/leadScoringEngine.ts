/* eslint-disable @typescript-eslint/no-explicit-any, security/detect-object-injection */
/**
 * Lead Scoring Engine — Phase 2A
 *
 * Multi-factor scoring algorithm with 4 weighted categories:
 *   Engagement (40%) + Demographic (30%) + Behavioral (20%) + Source (10%)
 *
 * Score range: 0–100
 * Tiers: hot (80+), warm (60-79), cold (30-59), inactive (<30)
 *
 * Usage:
 *   import { scoreLead, batchRescoreLeads } from './leadScoringEngine';
 *   const result = await scoreLead(leadId);
 *   const batch  = await batchRescoreLeads();
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

// ─── Types ──────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  engagement: number; // 0-40 (40% weight)
  demographic: number; // 0-30 (30% weight)
  behavioral: number; // 0-20 (20% weight)
  source: number; // 0-10 (10% weight)
  total: number; // 0-100
  tier: 'hot' | 'warm' | 'cold' | 'inactive';
  factors: ScoreFactor[];
  lastScoredAt: string;
}

export interface ScoreFactor {
  category: 'engagement' | 'demographic' | 'behavioral' | 'source';
  factor: string;
  points: number;
  maxPoints: number;
  description: string;
}

export interface ScoreResult {
  leadId: string;
  previousScore: number;
  newScore: number;
  previousTier: string;
  newTier: string;
  breakdown: ScoreBreakdown;
  changed: boolean;
}

export interface BatchScoreResult {
  total: number;
  scored: number;
  errors: number;
  upgraded: number; // Tier went up (cold → warm, warm → hot)
  downgraded: number; // Tier went down
  unchanged: number;
  duration: number; // ms
}

// ─── Tier logic ─────────────────────────────────────────────────────────

export function getTier(score: number): 'hot' | 'warm' | 'cold' | 'inactive' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 30) return 'cold';
  return 'inactive';
}

const TIER_RANK: Record<string, number> = { inactive: 0, cold: 1, warm: 2, hot: 3 };

// ─── Scoring functions by category ──────────────────────────────────────

/**
 * ENGAGEMENT (40% weight) — How actively is the lead interacting?
 * Factors: activity count, recency of contact, viewing count, offer count, communication frequency
 */
async function scoreEngagement(leadId: string): Promise<{ score: number; factors: ScoreFactor[] }> {
  const factors: ScoreFactor[] = [];
  let score = 0;

  // 1. Activity count (max 12 points)
  const activityCount = await prisma.activity.count({ where: { leadId } });
  let activityPoints = 0;
  if (activityCount >= 20) activityPoints = 12;
  else if (activityCount >= 10) activityPoints = 9;
  else if (activityCount >= 5) activityPoints = 6;
  else if (activityCount >= 2) activityPoints = 3;
  else if (activityCount >= 1) activityPoints = 1;
  score += activityPoints;
  factors.push({
    category: 'engagement',
    factor: 'activity_count',
    points: activityPoints,
    maxPoints: 12,
    description: `${activityCount} activities logged`,
  });

  // 2. Viewing count (max 10 points)
  const viewingCount = await prisma.viewing.count({ where: { leadId } });
  let viewingPoints = 0;
  if (viewingCount >= 5) viewingPoints = 10;
  else if (viewingCount >= 3) viewingPoints = 8;
  else if (viewingCount >= 2) viewingPoints = 5;
  else if (viewingCount >= 1) viewingPoints = 3;
  score += viewingPoints;
  factors.push({
    category: 'engagement',
    factor: 'viewing_count',
    points: viewingPoints,
    maxPoints: 10,
    description: `${viewingCount} property viewings`,
  });

  // 3. Offer count (max 10 points)
  const offerCount = await prisma.offer.count({ where: { leadId } });
  let offerPoints = 0;
  if (offerCount >= 3) offerPoints = 10;
  else if (offerCount >= 2) offerPoints = 8;
  else if (offerCount >= 1) offerPoints = 5;
  score += offerPoints;
  factors.push({
    category: 'engagement',
    factor: 'offer_count',
    points: offerPoints,
    maxPoints: 10,
    description: `${offerCount} offers submitted`,
  });

  // 4. Last contact recency (max 8 points)
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { lastContact: true, createdAt: true },
  });
  const lastContactDate = lead?.lastContact || lead?.createdAt;
  let recencyPoints = 0;
  if (lastContactDate) {
    const daysSinceContact = (Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceContact <= 1) recencyPoints = 8;
    else if (daysSinceContact <= 3) recencyPoints = 6;
    else if (daysSinceContact <= 7) recencyPoints = 4;
    else if (daysSinceContact <= 14) recencyPoints = 2;
    else if (daysSinceContact <= 30) recencyPoints = 1;
  }
  score += recencyPoints;
  factors.push({
    category: 'engagement',
    factor: 'contact_recency',
    points: recencyPoints,
    maxPoints: 8,
    description: lastContactDate
      ? `Last contact ${Math.round((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24))} days ago`
      : 'No contact recorded',
  });

  return { score: Math.min(40, score), factors };
}

/**
 * DEMOGRAPHIC (30% weight) — How qualified is this lead?
 * Factors: budget, email, phone, company, property interest
 */
async function scoreDemographic(
  leadId: string
): Promise<{ score: number; factors: ScoreFactor[] }> {
  const factors: ScoreFactor[] = [];
  let score = 0;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { budget: true, email: true, phone: true, company: true, propertyId: true, tags: true },
  });
  if (!lead) return { score: 0, factors };

  // 1. Budget specified (max 10 points — higher budget = more qualified)
  let budgetPoints = 0;
  if (lead.budget) {
    if (lead.budget >= 5_000_000)
      budgetPoints = 10; // AED 5M+ luxury
    else if (lead.budget >= 2_000_000)
      budgetPoints = 8; // AED 2M+ premium
    else if (lead.budget >= 1_000_000)
      budgetPoints = 6; // AED 1M+ standard
    else if (lead.budget >= 500_000)
      budgetPoints = 4; // AED 500K+
    else if (lead.budget > 0) budgetPoints = 2; // Has budget
  }
  score += budgetPoints;
  factors.push({
    category: 'demographic',
    factor: 'budget',
    points: budgetPoints,
    maxPoints: 10,
    description: lead.budget
      ? `Budget: AED ${lead.budget.toLocaleString()}`
      : 'No budget specified',
  });

  // 2. Contact completeness (max 8 points)
  let contactPoints = 0;
  if (lead.email && lead.phone) contactPoints = 8;
  else if (lead.phone) contactPoints = 5;
  else if (lead.email) contactPoints = 3;
  score += contactPoints;
  factors.push({
    category: 'demographic',
    factor: 'contact_info',
    points: contactPoints,
    maxPoints: 8,
    description: `${lead.email ? '✓ Email' : '✗ Email'} ${lead.phone ? '✓ Phone' : '✗ Phone'}`,
  });

  // 3. Company affiliation (max 4 points)
  const companyPoints = lead.company ? 4 : 0;
  score += companyPoints;
  factors.push({
    category: 'demographic',
    factor: 'company',
    points: companyPoints,
    maxPoints: 4,
    description: lead.company ? `Company: ${lead.company}` : 'No company',
  });

  // 4. Property interest (max 5 points)
  const propertyPoints = lead.propertyId ? 5 : 0;
  score += propertyPoints;
  factors.push({
    category: 'demographic',
    factor: 'property_interest',
    points: propertyPoints,
    maxPoints: 5,
    description: lead.propertyId ? 'Linked to specific property' : 'No property linked',
  });

  // 5. Tags richness (max 3 points)
  const tagCount = lead.tags?.length || 0;
  let tagPoints = 0;
  if (tagCount >= 3) tagPoints = 3;
  else if (tagCount >= 1) tagPoints = 1;
  score += tagPoints;
  factors.push({
    category: 'demographic',
    factor: 'tags',
    points: tagPoints,
    maxPoints: 3,
    description: `${tagCount} tags assigned`,
  });

  return { score: Math.min(30, score), factors };
}

/**
 * BEHAVIORAL (20% weight) — What actions indicate buying intent?
 * Factors: status progression, transaction stage, commission existence
 */
async function scoreBehavioral(leadId: string): Promise<{ score: number; factors: ScoreFactor[] }> {
  const factors: ScoreFactor[] = [];
  let score = 0;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { status: true },
  });
  if (!lead) return { score: 0, factors };

  // 1. Lead status (max 10 points — further along pipeline = higher score)
  const statusScores: Record<string, number> = {
    new: 1,
    contacted: 2,
    qualified: 4,
    viewing: 5,
    offered: 7,
    negotiating: 9,
    won: 10,
    lost: 0,
    hot: 8,
    warm: 5,
    cold: 2,
  };
  const statusPoints = statusScores[lead.status] ?? 1;
  score += statusPoints;
  factors.push({
    category: 'behavioral',
    factor: 'status',
    points: statusPoints,
    maxPoints: 10,
    description: `Lead status: ${lead.status}`,
  });

  // 2. Active transactions (max 6 points)
  const transactionCount = await prisma.transaction.count({
    where: { leadId, status: { in: ['draft', 'pending', 'active'] } },
  });
  let txPoints = 0;
  if (transactionCount >= 2) txPoints = 6;
  else if (transactionCount >= 1) txPoints = 4;
  score += txPoints;
  factors.push({
    category: 'behavioral',
    factor: 'active_transactions',
    points: txPoints,
    maxPoints: 6,
    description: `${transactionCount} active transactions`,
  });

  // 3. Commission linked (max 4 points — means deal is progressing)
  const commissionCount = await prisma.commission.count({ where: { leadId } });
  const commPoints = commissionCount > 0 ? 4 : 0;
  score += commPoints;
  factors.push({
    category: 'behavioral',
    factor: 'commissions',
    points: commPoints,
    maxPoints: 4,
    description: commissionCount > 0 ? `${commissionCount} commissions linked` : 'No commissions',
  });

  return { score: Math.min(20, score), factors };
}

/**
 * SOURCE (10% weight) — How high-quality is the lead source?
 * Factors: source channel quality, lead age relative to source
 */
function scoreSource(source: string, createdAt: Date): { score: number; factors: ScoreFactor[] } {
  const factors: ScoreFactor[] = [];
  let score = 0;

  // 1. Source quality (max 7 points)
  const sourceScores: Record<string, number> = {
    referral: 7, // Highest quality — personal recommendation
    whatsapp: 6, // Direct engagement channel
    phone: 5, // Proactive caller
    website: 4, // Browsed and submitted form
    marketing: 3, // Campaign-driven
    direct: 2, // Walk-in or unknown
    social: 2, // Social media
    portal: 4, // Property portal (Bayut, PF, Dubizzle)
  };
  const sourcePoints = sourceScores[source] ?? 2;
  score += sourcePoints;
  factors.push({
    category: 'source',
    factor: 'channel',
    points: sourcePoints,
    maxPoints: 7,
    description: `Source: ${source}`,
  });

  // 2. Lead freshness (max 3 points — newer leads from good sources)
  const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  let freshnessPoints = 0;
  if (daysSinceCreation <= 3) freshnessPoints = 3;
  else if (daysSinceCreation <= 7) freshnessPoints = 2;
  else if (daysSinceCreation <= 30) freshnessPoints = 1;
  score += freshnessPoints;
  factors.push({
    category: 'source',
    factor: 'freshness',
    points: freshnessPoints,
    maxPoints: 3,
    description: `Lead age: ${Math.round(daysSinceCreation)} days`,
  });

  return { score: Math.min(10, score), factors };
}

// ─── Main scoring orchestrator ──────────────────────────────────────────

/**
 * Score a single lead — runs all 4 category scorers and persists result.
 * Returns full breakdown with previous vs new score comparison.
 */
export async function scoreLead(leadId: string): Promise<ScoreResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, score: true, scoreTier: true, source: true, createdAt: true },
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Run all 4 category scorers in parallel
  const [engagement, demographic, behavioral] = await Promise.all([
    scoreEngagement(leadId),
    scoreDemographic(leadId),
    scoreBehavioral(leadId),
  ]);
  const source = scoreSource(lead.source, lead.createdAt);

  const totalScore = engagement.score + demographic.score + behavioral.score + source.score;
  const tier = getTier(totalScore);
  const now = new Date();

  const breakdown: ScoreBreakdown = {
    engagement: engagement.score,
    demographic: demographic.score,
    behavioral: behavioral.score,
    source: source.score,
    total: totalScore,
    tier,
    factors: [
      ...engagement.factors,
      ...demographic.factors,
      ...behavioral.factors,
      ...source.factors,
    ],
    lastScoredAt: now.toISOString(),
  };

  // Persist to DB
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: totalScore,
      scoreTier: tier,
      scoreBreakdown: breakdown as any,
      lastScoredAt: now,
    },
  });

  const previousTier = lead.scoreTier || 'cold';
  const changed = lead.score !== totalScore;

  // Record score history for trending (Phase 4A)
  await prisma.leadScoreHistory
    .create({
      data: {
        leadId,
        score: totalScore,
        tier,
        previousScore: lead.score,
        previousTier,
        breakdown: {
          engagement: engagement.score,
          demographic: demographic.score,
          behavioral: behavioral.score,
          source: source.score,
        },
        trigger: 'middleware',
      },
    })
    .catch((err: unknown) => {
      logger.warn('Failed to record score history', { leadId, error: err });
    });

  // Log significant score changes as activities
  if (changed && Math.abs(totalScore - lead.score) >= 10) {
    await prisma.activity
      .create({
        data: {
          type: 'lead',
          action: 'score_changed',
          description: `Lead score ${lead.score} → ${totalScore} (${previousTier} → ${tier})`,
          leadId,
          metadata: {
            previousScore: lead.score,
            newScore: totalScore,
            previousTier,
            newTier: tier,
          },
        },
      })
      .catch((err: unknown) => {
        logger.warn('Failed to log score change activity', { leadId, error: err });
      });
  }

  return {
    leadId,
    previousScore: lead.score,
    newScore: totalScore,
    previousTier,
    newTier: tier,
    breakdown,
    changed,
  };
}

/**
 * Manual score override — sets score + logs justification.
 * Agents can adjust scoring when they have contextual knowledge.
 */
export async function overrideScore(
  leadId: string,
  newScore: number,
  reason: string,
  userId?: string
): Promise<ScoreResult> {
  const clamped = Math.max(0, Math.min(100, Math.round(newScore)));
  const tier = getTier(clamped);

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, score: true, scoreTier: true, scoreBreakdown: true },
  });
  if (!lead) throw new Error(`Lead not found: ${leadId}`);

  const now = new Date();
  const previousBreakdown = (lead.scoreBreakdown as Record<string, unknown>) || {};

  const breakdown: ScoreBreakdown = {
    engagement: (previousBreakdown.engagement as number) || 0,
    demographic: (previousBreakdown.demographic as number) || 0,
    behavioral: (previousBreakdown.behavioral as number) || 0,
    source: (previousBreakdown.source as number) || 0,
    total: clamped,
    tier,
    factors: (previousBreakdown.factors as ScoreFactor[]) || [],
    lastScoredAt: now.toISOString(),
  };

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: clamped,
      scoreTier: tier,
      scoreBreakdown: {
        ...breakdown,
        override: { score: clamped, reason, userId, at: now.toISOString() },
      } as any,
      lastScoredAt: now,
    },
  });

  // Log override as activity
  await prisma.activity
    .create({
      data: {
        type: 'lead',
        action: 'score_override',
        description: `Score manually set to ${clamped} (${tier}): ${reason}`,
        leadId,
        userId: userId || null,
        metadata: { previousScore: lead.score, newScore: clamped, reason },
      },
    })
    .catch((err: unknown) => {
      logger.warn('Failed to log score override activity', { leadId, error: err });
    });

  return {
    leadId,
    previousScore: lead.score,
    newScore: clamped,
    previousTier: lead.scoreTier || 'cold',
    newTier: tier,
    breakdown,
    changed: lead.score !== clamped,
  };
}

/**
 * Batch re-score all active leads (excludes won/lost).
 * Called by cron job every 6 hours.
 */
export async function batchRescoreLeads(): Promise<BatchScoreResult> {
  const startTime = Date.now();
  let scored = 0;
  let errors = 0;
  let upgraded = 0;
  let downgraded = 0;
  let unchanged = 0;

  // Fetch all active leads (not won/lost)
  const leads = await prisma.lead.findMany({
    where: { status: { notIn: ['won', 'lost'] } },
    select: { id: true, scoreTier: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = leads.length;
  logger.info(`[LeadScoring] Batch re-score started — ${total} active leads`);

  // Process in batches of 20 to avoid overwhelming the DB
  const BATCH_SIZE = 20;
  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(batch.map(lead => scoreLead(lead.id)));

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === 'fulfilled') {
        scored++;
        const previousRank = TIER_RANK[batch[j].scoreTier || 'cold'] ?? 1;
        const newRank = TIER_RANK[result.value.newTier] ?? 1;
        if (newRank > previousRank) upgraded++;
        else if (newRank < previousRank) downgraded++;
        else unchanged++;
      } else {
        errors++;
        logger.warn('[LeadScoring] Failed to score lead', {
          leadId: batch[j].id,
          error: result.reason?.message || 'Unknown error',
        });
      }
    }
  }

  const duration = Date.now() - startTime;
  logger.info(
    `[LeadScoring] Batch complete — ${scored}/${total} scored, ${upgraded} upgraded, ${downgraded} downgraded, ${errors} errors (${duration}ms)`
  );

  return { total, scored, errors, upgraded, downgraded, unchanged, duration };
}

export default {
  scoreLead,
  overrideScore,
  batchRescoreLeads,
  getTier,
  getScoreHistory,
  getScoreTrending,
  applyWhatsAppSignal,
};

// ─── Score History & Trending (Phase 4A) ────────────────────────────────

/**
 * Get score history for a lead — used for trending charts.
 */
export async function getScoreHistory(
  leadId: string,
  options: { limit?: number; days?: number } = {}
): Promise<
  Array<{
    score: number;
    tier: string;
    previousScore: number;
    previousTier: string;
    trigger: string;
    breakdown: unknown;
    createdAt: Date;
  }>
> {
  const { limit = 50, days = 90 } = options;

  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.leadScoreHistory.findMany({
    where: {
      leadId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      score: true,
      tier: true,
      previousScore: true,
      previousTier: true,
      trigger: true,
      breakdown: true,
      createdAt: true,
    },
  });
}

/**
 * Get trending data for all leads — warming/cooling detection.
 * Returns leads with significant score changes over a period.
 */
export async function getScoreTrending(
  options: { days?: number; minChange?: number } = {}
): Promise<
  Array<{
    leadId: string;
    currentScore: number;
    oldestScore: number;
    delta: number;
    direction: 'warming' | 'cooling' | 'stable';
    dataPoints: number;
  }>
> {
  const { days = 7, minChange = 10 } = options;

  const since = new Date();
  since.setDate(since.getDate() - days);

  // Get all leads with score history in the period
  const leads = await prisma.lead.findMany({
    where: { status: { notIn: ['won', 'lost'] }, score: { gt: 0 } },
    select: { id: true, score: true },
  });

  const trends = [];

  for (const lead of leads) {
    const history = await prisma.leadScoreHistory.findMany({
      where: { leadId: lead.id, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      select: { score: true },
    });

    if (history.length < 2) continue;

    const oldestScore = history[0].score;
    const currentScore = lead.score;
    const delta = currentScore - oldestScore;

    if (Math.abs(delta) < minChange) continue;

    trends.push({
      leadId: lead.id,
      currentScore,
      oldestScore,
      delta,
      direction:
        delta > 0 ? ('warming' as const) : delta < 0 ? ('cooling' as const) : ('stable' as const),
      dataPoints: history.length,
    });
  }

  // Sort by absolute delta (biggest changes first)
  trends.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return trends;
}

// ─── WhatsApp Signal Bridge (Phase 4A) ──────────────────────────────────

/**
 * Apply WhatsApp conversation scoring signals to a CRM lead.
 * Bridges the Nadia/Nina NLP scoring system into the main lead scoring engine.
 *
 * @param leadId - CRM Lead ID
 * @param whatsappSignals - Scoring signals from WhatsApp conversation analysis
 */
export async function applyWhatsAppSignal(
  leadId: string,
  whatsappSignals: {
    intentScore?: number; // 0-25 from messageProcessor
    sentimentScore?: number; // -10 to +15
    engagementScore?: number; // 0-20 based on message count
    responseTimeScore?: number; // 0-10
    conversationScore?: number; // 0-100 overall from messageProcessor
  }
): Promise<ScoreResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      score: true,
      scoreTier: true,
      source: true,
      createdAt: true,
      scoreBreakdown: true,
    },
  });

  if (!lead) throw new Error(`Lead not found: ${leadId}`);

  // Calculate WhatsApp bonus (max 15 points on top of existing score)
  let whatsappBonus = 0;

  if (whatsappSignals.intentScore) {
    // High-intent signals: make_offer (+25), schedule_tour (+20)
    whatsappBonus += Math.min((whatsappSignals.intentScore / 25) * 5, 5); // max 5 pts
  }

  if (whatsappSignals.sentimentScore && whatsappSignals.sentimentScore > 0) {
    whatsappBonus += Math.min((whatsappSignals.sentimentScore / 15) * 3, 3); // max 3 pts
  }

  if (whatsappSignals.engagementScore) {
    whatsappBonus += Math.min((whatsappSignals.engagementScore / 20) * 4, 4); // max 4 pts
  }

  if (whatsappSignals.responseTimeScore) {
    whatsappBonus += Math.min((whatsappSignals.responseTimeScore / 10) * 3, 3); // max 3 pts
  }

  whatsappBonus = Math.round(Math.min(whatsappBonus, 15));

  // First run the standard scoring
  const result = await scoreLead(leadId);

  // Then apply WhatsApp bonus on top
  if (whatsappBonus > 0) {
    const boostedScore = Math.min(100, result.newScore + whatsappBonus);
    const boostedTier = getTier(boostedScore);

    await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: boostedScore,
        scoreTier: boostedTier,
        scoreBreakdown: {
          ...result.breakdown,
          whatsappBonus,
          whatsappSignals,
        } as any,
      },
    });

    // Record the WhatsApp-boosted score in history
    await prisma.leadScoreHistory
      .create({
        data: {
          leadId,
          score: boostedScore,
          tier: boostedTier,
          previousScore: result.newScore,
          previousTier: result.newTier,
          breakdown: { ...result.breakdown, whatsappBonus } as any,
          trigger: 'whatsapp',
        },
      })
      .catch((err: unknown) => {
        logger.warn('Failed to record WhatsApp score history', { leadId, error: err });
      });

    logger.info(
      `[LeadScoring] WhatsApp signal applied: ${result.newScore} + ${whatsappBonus} = ${boostedScore} ` +
        `(${result.newTier} → ${boostedTier}) for ${leadId}`
    );

    return {
      ...result,
      newScore: boostedScore,
      newTier: boostedTier,
      breakdown: {
        ...result.breakdown,
        total: boostedScore,
        tier: boostedTier,
      },
    };
  }

  return result;
}
