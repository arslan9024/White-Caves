import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export const calculateLeadScore = async (leadId: string) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { activities: true }
    });

    if (!lead) throw new Error('Lead not found');

    let score = 0;
    const breakdown: any = { budget: 0, timeline: 0, engagement: 0 };

    // 1. Budget Match (Basic implementation: having a budget gives points)
    if (lead.budget && lead.budget > 0) {
      score += 20;
      breakdown.budget = 20;
      if (lead.budget > 100000) {
        score += 10;
        breakdown.budget += 10;
      }
    }

    // 2. Timeline (Having tenantRequirements or specific needs)
    if (lead.tenantRequirements) {
      score += 20;
      breakdown.timeline = 20;
    } else if (lead.dealType === 'sale' || lead.dealType === 'buy') {
      score += 10;
      breakdown.timeline = 10;
    }

    // 3. Engagement (Activity points)
    const activityCount = lead.activities?.length || 0;
    const engagementPoints = Math.min(50, activityCount * 10);
    score += engagementPoints;
    breakdown.engagement = engagementPoints;

    // Cap score at 100
    score = Math.min(100, score);

    // Determine Tier
    let tier = 'cold';
    if (score >= 80) tier = 'hot';
    else if (score >= 50) tier = 'warm';

    const previousScore = lead.score || 0;
    const previousTier = lead.scoreTier || 'cold';

    // Update Lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        score,
        scoreTier: tier,
        scoreBreakdown: breakdown,
        lastScoredAt: new Date()
      }
    });

    // Log History if changed
    if (score !== previousScore || tier !== previousTier) {
      await prisma.leadScoreHistory.create({
        data: {
          leadId,
          score,
          tier,
          previousScore,
          previousTier,
          breakdown,
          trigger: 'system_scoring'
        }
      });
    }

    logger.info(`Lead ${leadId} scored: ${score} (${tier})`);
    return updatedLead;

  } catch (error) {
    logger.error('Failed to calculate lead score', error);
    return null;
  }
};
