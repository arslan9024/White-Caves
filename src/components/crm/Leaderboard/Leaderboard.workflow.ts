/**
 * White Caves Real Estate LLC - Gamified Promotion Workflow Engine
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Workflow)
 * Architecture: Pure 4-Stage Workflow (Input -> Process -> Output -> Verify)
 * Single Purpose File Law: < 350 lines
 */

import {
  LeaderboardMember,
  TaskXpInput,
  TaskXpOutput,
  PromotionCriteria,
  CareerMilestone,
  TierLevel,
} from './Leaderboard.types';
import { BASE_XP_BY_PRIORITY, BONUS_MULTIPLIERS, PROMOTION_CRITERIA } from './Leaderboard.config';

/**
 * 1. Task Completion & XP Award Workflow
 * Pure 4-Stage Engine: Input -> Process -> Output -> Verify
 */
export function taskCompletionXpWorkflow(
  member: LeaderboardMember,
  task: TaskXpInput
): { updatedMember: LeaderboardMember; result: TaskXpOutput } {
  // --- Stage 1: Input Validation ---
  if (!member || !member.id) {
    throw new Error('[LeaderboardWorkflow] Invalid member provided for task XP award.');
  }
  if (!task || !task.taskId) {
    throw new Error('[LeaderboardWorkflow] Invalid task provided for XP award.');
  }

  // --- Stage 2: Process ---
  const baseXp = BASE_XP_BY_PRIORITY[task.priority] || BASE_XP_BY_PRIORITY.P2;
  let bonusMultiplier = 0;
  if (task.resolvedAheadOfSla) bonusMultiplier += BONUS_MULTIPLIERS.SLA_ON_TIME;
  if (task.zeroDefectAudit) bonusMultiplier += BONUS_MULTIPLIERS.ZERO_DEFECT;

  const bonusXp = Math.round(baseXp * bonusMultiplier);
  const totalAwarded = baseXp + bonusXp;

  const newTotalXp = member.meritXp + totalAwarded;
  const newTasksCompleted = member.tasksCompleted + 1;

  // Clone member to ensure purity
  const candidateMember: LeaderboardMember = {
    ...member,
    meritXp: newTotalXp,
    tasksCompleted: newTasksCompleted,
  };

  // Re-evaluate eligibility
  const evalResult = evaluatePromotionEligibilityWorkflow(candidateMember);

  const updatedMember: LeaderboardMember = {
    ...candidateMember,
    promotionStatus: evalResult.isEligible ? 'ELIGIBLE' : member.promotionStatus,
    nextTierProgressPercent: evalResult.progressPercent,
  };

  const output: TaskXpOutput = {
    baseXp,
    bonusXp,
    totalXp: totalAwarded,
    newTotalXp,
    newTasksCompleted,
    isNowEligibleForPromotion: evalResult.isEligible,
  };

  // --- Stage 4: Verification ---
  if (output.newTotalXp < member.meritXp) {
    throw new Error('[LeaderboardWorkflow] Invariant violation: XP cannot decrease.');
  }

  return { updatedMember, result: output };
}

/**
 * 2. Evaluate Promotion Eligibility Workflow
 * Checks threshold requirements against current member stats
 */
export function evaluatePromotionEligibilityWorkflow(member: LeaderboardMember): {
  isEligible: boolean;
  criteria: PromotionCriteria | null;
  missingRequirements: string[];
  progressPercent: number;
} {
  // Stage 1: Input Validation
  if (!member) {
    return {
      isEligible: false,
      criteria: null,
      missingRequirements: ['No member record'],
      progressPercent: 0,
    };
  }

  let criteriaKey = '';
  if (member.currentTier === 'L4') criteriaKey = 'L4_TO_L3';
  else if (member.currentTier === 'L3') criteriaKey = 'L3_TO_L2';
  else if (member.currentTier === 'L2') criteriaKey = 'L2_TO_L1';
  else {
    // L1 or L0 already at peak executive level
    return { isEligible: false, criteria: null, missingRequirements: [], progressPercent: 100 };
  }

  const criteria = PROMOTION_CRITERIA[criteriaKey];
  if (!criteria) {
    return {
      isEligible: false,
      criteria: null,
      missingRequirements: ['No promotion criteria defined'],
      progressPercent: 100,
    };
  }

  const missing: string[] = [];
  if (member.tasksCompleted < criteria.minTasksCompleted) {
    missing.push(
      `Requires ${criteria.minTasksCompleted - member.tasksCompleted} more completed tasks`
    );
  }
  if (member.meritXp < criteria.minMeritXp) {
    missing.push(`Requires ${criteria.minMeritXp - member.meritXp} more XP points`);
  }
  if (member.slaOnTimeRate < criteria.minSlaRate) {
    missing.push(`SLA rate ${member.slaOnTimeRate}% is below required ${criteria.minSlaRate}%`);
  }

  const taskProgress = Math.min(
    100,
    Math.round((member.tasksCompleted / criteria.minTasksCompleted) * 100)
  );
  const xpProgress = Math.min(100, Math.round((member.meritXp / criteria.minMeritXp) * 100));
  const progressPercent = Math.min(100, Math.round((taskProgress + xpProgress) / 2));

  const isEligible = missing.length === 0;

  return {
    isEligible,
    criteria,
    missingRequirements: missing,
    progressPercent,
  };
}

/**
 * 3. Execute Tier Promotion Workflow
 * Transitions member to next tier, logs milestone, updates role title
 */
export function executeTierPromotionWorkflow(
  member: LeaderboardMember,
  promotedBy: string = 'Executive Council'
): LeaderboardMember {
  // Stage 1: Validation
  const evalResult = evaluatePromotionEligibilityWorkflow(member);
  if (!evalResult.isEligible || !evalResult.criteria) {
    throw new Error(
      `[LeaderboardWorkflow] Member ${member.name} is not eligible for promotion: ${evalResult.missingRequirements.join(', ')}`
    );
  }

  const { criteria } = evalResult;
  const previousRole = member.currentRole;
  let newRole = previousRole;
  let nextTier: TierLevel | null = null;

  if (criteria.toTier === 'L3') {
    newRole = `Operational Supervisor (${member.departmentName})`;
    nextTier = 'L2';
  } else if (criteria.toTier === 'L2') {
    newRole = `Division Manager (${member.departmentName})`;
    nextTier = 'L1';
  } else if (criteria.toTier === 'L1') {
    newRole = `Director of ${member.departmentName}`;
    nextTier = null;
  }

  const milestone: CareerMilestone = {
    id: `MS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().split('T')[0],
    fromTier: member.currentTier,
    toTier: criteria.toTier,
    previousRole,
    newRole,
    reason: `Promoted on merit: completed ${member.tasksCompleted} tasks with ${member.meritXp} XP and ${member.slaOnTimeRate}% SLA`,
    awardedBy: promotedBy,
    xpAtPromotion: member.meritXp,
  };

  const nextTierProgress = nextTier ? 0 : 100;

  const promotedMember: LeaderboardMember = {
    ...member,
    currentTier: criteria.toTier,
    currentRole: newRole,
    promotionStatus: nextTier ? 'IN_PROGRESS' : 'PROMOTED',
    nextTier,
    nextTierProgressPercent: nextTierProgress,
    milestones: [milestone, ...member.milestones],
    badges: [...new Set([...member.badges, `${criteria.toTier} Leadership Badge`])],
  };

  // Stage 4: Verification
  if (promotedMember.currentTier === member.currentTier) {
    throw new Error('[LeaderboardWorkflow] Invariant violation: Tier failed to advance.');
  }

  return promotedMember;
}
