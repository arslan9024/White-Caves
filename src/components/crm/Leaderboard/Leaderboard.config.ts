/**
 * White Caves Real Estate LLC - Leaderboard Configuration & Constants
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Config)
 * Single Purpose File Law: < 350 lines
 */

import { TierLevel, PromotionCriteria } from './Leaderboard.types';

export const BASE_XP_BY_PRIORITY = {
  P0: 100, // Statutory / Critical (Ejari, Trakheesi, AML)
  P1: 50, // High Operational (Form A, Client Sourcing)
  P2: 25, // Standard Operational (CRM hygiene, Reports)
  P3: 10, // Maintenance (Photos, Celebrations)
} as const;

export const BONUS_MULTIPLIERS = {
  SLA_ON_TIME: 0.2, // +20% for finishing ahead of SLA
  ZERO_DEFECT: 0.15, // +15% for audit zero-defect approval
} as const;

export const PROMOTION_CRITERIA: Record<string, PromotionCriteria> = {
  L4_TO_L3: {
    fromTier: 'L4',
    toTier: 'L3',
    targetRole: 'SUPERVISOR',
    minTasksCompleted: 25,
    minMeritXp: 2500,
    minSlaRate: 90,
    endorsementRequired: true,
    title: 'Promotion to Operational Supervisor (L3)',
    description:
      'Requires 25+ completed tasks, 2,500+ XP, 90%+ on-time SLA, and 1 supervisor endorsement.',
  },
  L3_TO_L2: {
    fromTier: 'L3',
    toTier: 'L2',
    targetRole: 'MANAGER',
    minTasksCompleted: 75,
    minMeritXp: 7500,
    minSlaRate: 95,
    endorsementRequired: true,
    title: 'Promotion to Division Manager (L2)',
    description:
      'Requires 75+ team tasks delivered, 7,500+ XP, 95%+ on-time SLA, and division director review.',
  },
  L2_TO_L1: {
    fromTier: 'L2',
    toTier: 'L1',
    targetRole: 'DIRECTOR',
    minTasksCompleted: 200,
    minMeritXp: 20000,
    minSlaRate: 98,
    endorsementRequired: true,
    title: 'Promotion to Department Director (L1)',
    description:
      'Requires 200+ division tasks delivered, 20,000+ XP, 98%+ SLA compliance, and board sign-off.',
  },
};

export interface TierMeta {
  tier: TierLevel;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
  description: string;
}

export const TIER_METADATA: Record<TierLevel, TierMeta> = {
  L0: {
    tier: 'L0',
    label: 'Managing Director',
    badgeBg: 'bg-purple-900/40',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    iconName: 'Crown',
    description: 'Executive Strategy & Corporate Governance',
  },
  L1: {
    tier: 'L1',
    label: 'Department Director',
    badgeBg: 'bg-amber-900/40',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    iconName: 'ShieldAlert',
    description: 'Departmental P&L & Strategic Authority',
  },
  L2: {
    tier: 'L2',
    label: 'Division Manager',
    badgeBg: 'bg-blue-900/40',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/40',
    iconName: 'Briefcase',
    description: 'Core Division & Workflow Operations',
  },
  L3: {
    tier: 'L3',
    label: 'Operational Supervisor',
    badgeBg: 'bg-emerald-900/40',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    iconName: 'UserCheck',
    description: 'Team Leadership & SLA Enforcement',
  },
  L4: {
    tier: 'L4',
    label: 'Frontline Specialist',
    badgeBg: 'bg-cyan-900/40',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    iconName: 'Users',
    description: 'Direct Task Execution & Brokerage Operations',
  },
  L5: {
    tier: 'L5',
    label: 'Operational Task Unit',
    badgeBg: 'bg-gray-800/40',
    badgeText: 'text-gray-300',
    badgeBorder: 'border-gray-600/40',
    iconName: 'CheckSquare',
    description: 'Statutory Work Unit & Deliverable Node',
  },
};
