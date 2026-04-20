/**
 * Lead Auto-Routing Service — Phase 4A
 *
 * Intelligent lead assignment based on agent performance metrics.
 * When a lead's tier upgrades to "hot", it's automatically assigned
 * to the best-performing available agent.
 *
 * Routing rules:
 *   1. Hot leads → top-performing agent by conversion rate
 *   2. Warm leads → balanced distribution by current load
 *   3. Cold leads → round-robin among all agents
 *   4. Property type matching when possible
 *   5. Budget-tier matching (luxury → luxury specialist)
 *
 * Usage:
 *   import { autoRouteHotLead, getRoutingRules, getAgentPerformance } from './leadAutoRouter';
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { onTierChange, type TierChangeEvent } from './leadScoringMiddleware.js';

// ─── Types ──────────────────────────────────────────────────────────────

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  agentEmail: string;
  role: string;
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  wonLeads: number;
  conversionRate: number;  // won / (won + lost)
  averageScore: number;
  currentLoad: number;     // active leads count
  specializations: string[];
}

export interface RoutingRule {
  id: string;
  propertyType: string;
  budget: string;
  budgetMin: number;
  budgetMax: number;
  agent: string;
  agentId: string;
  priority: number;
  conversionRate: number;
  activeLeads: number;
}

export interface RoutingDecision {
  leadId: string;
  assignedAgentId: string;
  assignedAgentName: string;
  reason: string;
  confidence: number;  // 0-1
}

// ─── Agent Performance Calculator ───────────────────────────────────────

/**
 * Calculate performance metrics for all active agents.
 */
export async function getAgentPerformance(): Promise<AgentPerformance[]> {
  // Get all agents (exclude owners for routing purposes)
  const agents = await prisma.user.findMany({
    where: {
      role: { in: ['agent', 'manager', 'admin'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const performances: AgentPerformance[] = [];

  for (const agent of agents) {
    // Count leads by tier and status
    const [totalLeads, hotLeads, warmLeads, wonLeads, lostLeads, currentLoad] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: agent.id } }),
      prisma.lead.count({ where: { assignedToId: agent.id, scoreTier: 'hot' } }),
      prisma.lead.count({ where: { assignedToId: agent.id, scoreTier: 'warm' } }),
      prisma.lead.count({ where: { assignedToId: agent.id, status: 'won' } }),
      prisma.lead.count({ where: { assignedToId: agent.id, status: 'lost' } }),
      prisma.lead.count({
        where: {
          assignedToId: agent.id,
          status: { notIn: ['won', 'lost'] },
        },
      }),
    ]);

    // Calculate conversion rate
    const totalDecided = wonLeads + lostLeads;
    const conversionRate = totalDecided > 0 ? wonLeads / totalDecided : 0;

    // Calculate average lead score
    const avgScore = await prisma.lead.aggregate({
      where: { assignedToId: agent.id, score: { gt: 0 } },
      _avg: { score: true },
    });

    // Determine specializations from high-performing property types
    const specializations: string[] = [];
    if (conversionRate >= 0.3) specializations.push('high-converter');
    if (hotLeads >= 5) specializations.push('hot-lead-specialist');
    if (totalLeads >= 20) specializations.push('experienced');

    performances.push({
      agentId: agent.id,
      agentName: agent.name,
      agentEmail: agent.email,
      role: agent.role,
      totalLeads,
      hotLeads,
      warmLeads,
      wonLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageScore: Math.round(avgScore._avg.score || 0),
      currentLoad,
      specializations,
    });
  }

  // Sort by conversion rate (best performers first)
  performances.sort((a, b) => b.conversionRate - a.conversionRate);

  return performances;
}

// ─── Routing Rules Generator ────────────────────────────────────────────

/**
 * Generate dynamic routing rules based on agent performance.
 * Rules define which agent handles which type of lead.
 */
export async function getRoutingRules(): Promise<RoutingRule[]> {
  const agents = await getAgentPerformance();
  const rules: RoutingRule[] = [];

  // Budget tiers for Dubai real estate
  const budgetTiers = [
    { name: 'Luxury', min: 5_000_000, max: Infinity, label: 'AED 5M+' },
    { name: 'Premium', min: 2_000_000, max: 4_999_999, label: 'AED 2M-5M' },
    { name: 'Standard', min: 1_000_000, max: 1_999_999, label: 'AED 1M-2M' },
    { name: 'Entry', min: 0, max: 999_999, label: 'Under AED 1M' },
  ];

  // Property types
  const propertyTypes = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Commercial', 'Off-Plan'];

  let ruleId = 1;

  // Generate rules: assign best agents to luxury, distribute others
  for (const tier of budgetTiers) {
    // Pick the best available agent for this tier
    const bestAgent = agents.find(a => a.currentLoad < 30) || agents[0];
    if (!bestAgent) continue;

    for (const propType of propertyTypes) {
      rules.push({
        id: `rule-${ruleId++}`,
        propertyType: propType,
        budget: tier.label,
        budgetMin: tier.min,
        budgetMax: tier.max === Infinity ? 999_999_999 : tier.max,
        agent: bestAgent.agentName,
        agentId: bestAgent.agentId,
        priority: tier.min >= 5_000_000 ? 1 : tier.min >= 2_000_000 ? 2 : tier.min >= 1_000_000 ? 3 : 4,
        conversionRate: bestAgent.conversionRate,
        activeLeads: bestAgent.currentLoad,
      });
    }

    // Rotate to next agent for variety
    const idx = agents.indexOf(bestAgent);
    if (idx >= 0 && agents.length > 1) {
      agents.push(agents.splice(idx, 1)[0]);
    }
  }

  return rules;
}

// ─── Auto-Route Hot Lead ────────────────────────────────────────────────

/**
 * Automatically assign a hot lead to the best-performing agent.
 * Called when a lead's tier upgrades to "hot".
 */
export async function autoRouteHotLead(leadId: string): Promise<RoutingDecision | null> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      name: true,
      assignedToId: true,
      budget: true,
      score: true,
      scoreTier: true,
      propertyId: true,
    },
  });

  if (!lead) {
    logger.warn(`[LeadAutoRouter] Lead not found: ${leadId}`);
    return null;
  }

  // Don't re-route if already assigned
  if (lead.assignedToId) {
    logger.info(`[LeadAutoRouter] Lead ${leadId} already assigned to ${lead.assignedToId} — skipping auto-route`);
    return null;
  }

  const agents = await getAgentPerformance();
  if (agents.length === 0) {
    logger.warn('[LeadAutoRouter] No agents available for routing');
    return null;
  }

  // Scoring algo: best conversion rate, lowest current load, experience bonus
  let bestAgent: AgentPerformance | null = null;
  let bestScore = -1;

  for (const agent of agents) {
    // Skip agents at capacity (>30 active leads)
    if (agent.currentLoad >= 30) continue;

    let routeScore = 0;

    // 1. Conversion rate (max 50 points)
    routeScore += agent.conversionRate * 50;

    // 2. Lower load = higher score (max 30 points)
    const loadPenalty = Math.min(agent.currentLoad / 30, 1);
    routeScore += (1 - loadPenalty) * 30;

    // 3. Experience bonus (max 20 points)
    if (agent.totalLeads >= 50) routeScore += 20;
    else if (agent.totalLeads >= 20) routeScore += 15;
    else if (agent.totalLeads >= 10) routeScore += 10;
    else if (agent.totalLeads >= 5) routeScore += 5;

    if (routeScore > bestScore) {
      bestScore = routeScore;
      bestAgent = agent;
    }
  }

  if (!bestAgent) {
    logger.warn(`[LeadAutoRouter] All agents at capacity — cannot route lead ${leadId}`);
    return null;
  }

  // Assign the lead
  await prisma.lead.update({
    where: { id: leadId },
    data: { assignedToId: bestAgent.agentId },
  });

  // Log the assignment as an activity
  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'updated',
      description: `Hot lead auto-routed to ${bestAgent.agentName} (conversion rate: ${Math.round(bestAgent.conversionRate * 100)}%, load: ${bestAgent.currentLoad})`,
      leadId,
      metadata: {
        autoRouted: true,
        agentId: bestAgent.agentId,
        agentName: bestAgent.agentName,
        conversionRate: bestAgent.conversionRate,
        currentLoad: bestAgent.currentLoad,
        routeScore: Math.round(bestScore),
      },
    },
  }).catch((err: unknown) => {
    logger.warn('[LeadAutoRouter] Failed to log auto-route activity', { leadId, error: err });
  });

  const confidence = Math.min(bestScore / 100, 1);

  logger.info(
    `[LeadAutoRouter] Lead ${leadId} auto-routed to ${bestAgent.agentName} ` +
    `(score: ${Math.round(bestScore)}, confidence: ${Math.round(confidence * 100)}%)`
  );

  return {
    leadId,
    assignedAgentId: bestAgent.agentId,
    assignedAgentName: bestAgent.agentName,
    reason: `Best-performing agent: ${Math.round(bestAgent.conversionRate * 100)}% conversion, ${bestAgent.currentLoad} active leads`,
    confidence,
  };
}

// ─── Register Auto-Routing on Tier Change ───────────────────────────────

let isRegistered = false;

/**
 * Start the auto-routing system.
 * Listens for tier change events and routes hot leads automatically.
 */
export function startAutoRouting(): () => void {
  if (isRegistered) {
    logger.warn('[LeadAutoRouter] Already registered');
    return () => {};
  }

  isRegistered = true;

  const unsubscribe = onTierChange(async (event: TierChangeEvent) => {
    // Only auto-route on upgrade to hot tier
    if (event.newTier === 'hot' && event.direction === 'upgraded') {
      logger.info(`[LeadAutoRouter] Hot lead detected: ${event.leadId} (${event.previousTier} → hot)`);
      try {
        await autoRouteHotLead(event.leadId);
      } catch (err) {
        logger.error(`[LeadAutoRouter] Failed to auto-route: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  });

  logger.info('[LeadAutoRouter] Auto-routing active — hot leads will be assigned to best agents');

  return () => {
    unsubscribe();
    isRegistered = false;
    logger.info('[LeadAutoRouter] Auto-routing stopped');
  };
}

export default {
  getAgentPerformance,
  getRoutingRules,
  autoRouteHotLead,
  startAutoRouting,
};
