// FILE: src/components/crm/Leaderboard/Leaderboard.types.ts
/**
 * White Caves Real Estate LLC - Gamified Promotion Leaderboard Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Types - Tier 5)
 * Single Purpose File Law: < 350 lines
 */

export type TierLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type TierRole =
  | 'MANAGING_DIRECTOR' // L0
  | 'DIRECTOR' // L1
  | 'MANAGER' // L2
  | 'SUPERVISOR' // L3
  | 'EMPLOYEE'; // L4

export type PromotionStatus = 'IN_PROGRESS' | 'ELIGIBLE' | 'PROMOTED';

export type LeaderboardTimeframe = 'ALL_TIME' | 'THIS_MONTH' | 'THIS_WEEK';

export interface PromotionCriteria {
  fromTier: TierLevel;
  toTier: TierLevel;
  targetRole: TierRole;
  minTasksCompleted: number;
  minMeritXp: number;
  minSlaRate: number; // percentage, e.g. 90
  endorsementRequired: boolean;
  title: string;
  description: string;
}

export interface CareerMilestone {
  id: string;
  timestamp: string;
  fromTier: TierLevel;
  toTier: TierLevel;
  previousRole: string;
  newRole: string;
  reason: string;
  awardedBy: string;
  xpAtPromotion: number;
}

export interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  departmentId: string;
  departmentName: string;
  currentTier: TierLevel;
  currentRole: string;
  meritXp: number;
  tasksCompleted: number;
  slaOnTimeRate: number; // 0 to 100
  promotionStatus: PromotionStatus;
  nextTier: TierLevel | null;
  nextTierProgressPercent: number;
  badges: string[];
  milestones: CareerMilestone[];
  isAiAgent?: boolean;
  rank?: number;
  allTimeXp?: number;
}

export interface TaskXpInput {
  taskId: string;
  taskName: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  resolvedAheadOfSla: boolean;
  zeroDefectAudit: boolean;
}

export interface TaskXpOutput {
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  newTotalXp: number;
  newTasksCompleted: number;
  isNowEligibleForPromotion: boolean;
}
