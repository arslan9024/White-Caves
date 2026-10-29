/**
 * leadScoringController.ts
 * Handlers for AI lead scoring, score overrides, batch rescore, routing rules, and WhatsApp signals.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import {
  scoreLead,
  overrideScore,
  batchRescoreLeads,
  getScoreHistory,
  getScoreTrending,
  applyWhatsAppSignal,
} from '../../services/ai/leadScoringEngine.js';
import {
  getRoutingRules,
  getAgentPerformance,
  autoRouteHotLead,
} from '../../services/ai/leadAutoRouter.js';
import { RouteRequest, routeParamToString } from './leadCommon.js';

export async function getScoredLeads(req: RouteRequest, res: Response): Promise<void> {
  const {
    tier,
    minScore,
    maxScore,
    page = '1',
    pageSize = '50',
  } = req.query as Record<string, string | undefined>;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

  const where: Record<string, unknown> = {
    score: { gt: 0 },
  };

  if (tier && typeof tier === 'string') {
    where.scoreTier = tier;
  }
  if (minScore || maxScore) {
    const scoreFilter: Record<string, number> = { gt: 0 };
    if (minScore) {
      const parsed = parseInt(minScore as string, 10);
      if (!isNaN(parsed)) scoreFilter.gte = parsed;
    }
    if (maxScore) {
      const parsed = parseInt(maxScore as string, 10);
      if (!isNaN(parsed)) scoreFilter.lte = parsed;
    }
    where.score = scoreFilter;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { score: 'desc' },
      skip: (pageNum - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        score: true,
        scoreTier: true,
        scoreBreakdown: true,
        lastScoredAt: true,
        budget: true,
        budgetCurrency: true,
        source: true,
        status: true,
        email: true,
        phone: true,
        company: true,
        tags: true,
        lastContact: true,
        createdAt: true,
        assignedTo: { select: { id: true, name: true } },
        property: { select: { id: true, title: true, type: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  const [hotCount, warmCount, coldCount, inactiveCount] = await Promise.all([
    prisma.lead.count({ where: { scoreTier: 'hot', score: { gt: 0 } } }),
    prisma.lead.count({ where: { scoreTier: 'warm', score: { gt: 0 } } }),
    prisma.lead.count({ where: { scoreTier: 'cold', score: { gt: 0 } } }),
    prisma.lead.count({ where: { scoreTier: 'inactive', score: { gt: 0 } } }),
  ]);

  res.status(200).json({
    success: true,
    leads: leads.map(l => ({
      id: l.id,
      name: l.name,
      score: l.score,
      tier: l.scoreTier,
      budget: l.budget ? `${l.budgetCurrency} ${l.budget.toLocaleString()}` : 'N/A',
      interest: l.property?.title || 'General',
      source: l.source,
      assignedAgent: l.assignedTo?.name || 'Unassigned',
      email: l.email,
      phone: l.phone,
      company: l.company,
      tags: l.tags,
      lastContact: l.lastContact,
      lastScoredAt: l.lastScoredAt,
      breakdown: l.scoreBreakdown,
    })),
    distribution: { hot: hotCount, warm: warmCount, cold: coldCount, inactive: inactiveCount },
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getRoutingRulesList(_req: RouteRequest, res: Response): Promise<void> {
  const rules = await getRoutingRules();
  const agents = await getAgentPerformance();

  res.status(200).json({
    success: true,
    rules,
    agents: agents.map(a => ({
      id: a.agentId,
      name: a.agentName,
      conversionRate: a.conversionRate,
      currentLoad: a.currentLoad,
      totalLeads: a.totalLeads,
      specializations: a.specializations,
    })),
  });
}

export async function getTrendingLeads(req: RouteRequest, res: Response): Promise<void> {
  const { days = '7', minChange = '10' } = req.query as Record<string, string | undefined>;

  const trends = await getScoreTrending({
    days: parseInt(days as string) || 7,
    minChange: parseInt(minChange as string) || 10,
  });

  const warming = trends.filter(t => t.direction === 'warming');
  const cooling = trends.filter(t => t.direction === 'cooling');

  res.status(200).json({
    success: true,
    data: {
      trends,
      summary: {
        warming: warming.length,
        cooling: cooling.length,
        total: trends.length,
      },
    },
  });
}

export async function autoRouteLead(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const decision = await autoRouteHotLead(leadId);

  if (!decision) {
    res.status(200).json({
      success: true,
      data: null,
      message: 'Lead already assigned or no agents available',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: decision,
  });
}

export async function getLeadScore(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const result = await scoreLead(leadId);

  res.status(200).json({
    success: true,
    data: {
      leadId: result.leadId,
      score: result.newScore,
      previousScore: result.previousScore,
      tier: result.breakdown.tier,
      previousTier: result.previousTier,
      changed: result.changed,
      breakdown: {
        engagement: result.breakdown.engagement,
        demographic: result.breakdown.demographic,
        behavioral: result.breakdown.behavioral,
        source: result.breakdown.source,
      },
      factors: result.breakdown.factors,
      lastScoredAt: result.breakdown.lastScoredAt,
    },
  });
}

export async function overrideLeadScore(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const { score, reason } = req.body;

  if (typeof score !== 'number' || score < 0 || score > 100) {
    throw new AppError('Score must be a number between 0 and 100', 400);
  }
  if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
    throw new AppError('Please provide a reason for the score override (min 3 characters)', 400);
  }

  const result = await overrideScore(
    leadId,
    score,
    sanitizeString(reason.trim().slice(0, 500)),
    req.user?.id
  );

  res.status(200).json({
    success: true,
    data: {
      leadId: result.leadId,
      score: result.newScore,
      previousScore: result.previousScore,
      tier: result.breakdown.tier,
      changed: result.changed,
    },
  });
}

export async function batchRescore(req: RouteRequest, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Only managers can trigger batch re-scoring', 403);
  }

  const result = await batchRescoreLeads();

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function getScoreHistoryList(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const { limit = '50', days = '90' } = req.query as Record<string, string | undefined>;
  const history = await getScoreHistory(leadId, {
    limit: Math.min(200, parseInt(limit as string) || 50),
    days: Math.min(365, parseInt(days as string) || 90),
  });

  res.status(200).json({
    success: true,
    data: {
      leadId,
      history,
      count: history.length,
    },
  });
}

export async function scoreWhatsApp(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const { intentScore, sentimentScore, engagementScore, responseTimeScore, conversationScore } =
    req.body;
  const result = await applyWhatsAppSignal(leadId, {
    intentScore: typeof intentScore === 'number' ? intentScore : undefined,
    sentimentScore: typeof sentimentScore === 'number' ? sentimentScore : undefined,
    engagementScore: typeof engagementScore === 'number' ? engagementScore : undefined,
    responseTimeScore: typeof responseTimeScore === 'number' ? responseTimeScore : undefined,
    conversationScore: typeof conversationScore === 'number' ? conversationScore : undefined,
  });

  res.status(200).json({
    success: true,
    data: {
      leadId: result.leadId,
      score: result.newScore,
      previousScore: result.previousScore,
      tier: result.newTier,
      changed: result.changed,
    },
  });
}
