/**
 * CRMHubPage.registries.ts
 * AI assistant registry, MD Suite, and 12 corporate departments.
 *
 * NOTE: Full registry content is maintained here so CRMHubPage.logic.ts stays lean
 * and can focus on MD Suite landing / isManagingDirector behaviour.
 *
 * If this file is incomplete, restore ALL_AI_ASSISTANTS / MD_SUITE_DEPT /
 * TWELVE_CORPORATE_DEPARTMENTS from main branch history of CRMHubPage.logic.ts.
 */

export interface SubGroup {
  name: string;
  items: { id: string; label: string; icon: string }[];
}

export interface BuildingTier {
  id: string;
  num: string;
  name: string;
  locationTag: string;
  accessLevel: string;
  badgeColor: string;
  icon: string;
  summary: string;
  scope: string[];
  subGroups?: { name?: string; id?: string; label?: string; icon?: string; items?: { id: string; label: string; icon: string }[] }[];
  items?: { id: string; label: string; icon: string }[];
}

export interface AIAssistantOption {
  id: string;
  num: string;
  name: string;
  role: string;
  icon: string;
  items?: { id: string; label: string; icon: string; badge?: string }[];
}

export interface AITeamSquad {
  id: string;
  name: string;
  assistants: string[];
}

/** Placeholder — Copilot PR #2532 / restore from main history fills full list */
export const ALL_AI_ASSISTANTS: AIAssistantOption[] = [
  {
    id: 'nadia',
    num: '3.1',
    name: 'Nadia AI',
    role: 'WhatsApp CRM & Campaigns',
    icon: '💬',
    items: [
      { id: 'nadia-broadcast', label: '3.1.1 Broadcast Campaign Dispatcher', icon: '📢', badge: 'Outbound' },
    ],
  },
  {
    id: 'zoe',
    num: '3.4',
    name: 'Zoe AI',
    role: 'Executive CRM & Operations SLA',
    icon: '👑',
    items: [
      { id: 'zoe-sovereign-override', label: '3.4.4 Sovereign Override Desk', icon: '⚡', badge: 'Level 5 Master' },
    ],
  },
  {
    id: 'theodora',
    num: '3.14',
    name: 'Theodora AI',
    role: 'Finance & VAT 5% Escrow Accounting',
    icon: '💳',
    items: [
      { id: 'theodora-pnl', label: '3.14.10 Profit & Loss Statement (P&L)', icon: '📊', badge: 'P&L' },
    ],
  },
];

export const AI_TEAMS_STRUCTURE: AITeamSquad[] = [
  { id: 'exec', name: 'Executive', assistants: ['zoe', 'theodora'] },
  { id: 'comms', name: 'Communications', assistants: ['nadia'] },
];

export const MD_SUITE_DEPT: BuildingTier = {
  id: 'dept-md',
  scope: [],
  num: 'MD Suite',
  name: 'Office of the Managing Director (MD Suite)',
  locationTag: 'Floor 13: MD Sovereign Suite',
  accessLevel: 'Level 7 (Ultimate Sovereign Access)',
  badgeColor: '#EF4444',
  icon: '👑',
  summary: 'Reserved exclusively for Arslan Malik. Controls global corporate strategy, high-stakes joint ventures, investment allocations, and unilateral override permissions across all lower operational tiers.',
  items: [
    { id: 'overview', label: '1.1 Executive Overview & Live Audit', icon: '👑' },
    { id: 'ai-command', label: '1.2 1-12-108 AI Command Center', icon: '🤖' },
    { id: 'off-plan-tracker', label: '1.3 DH2 & Off-Plan Escrow Matrix', icon: '🏰' },
    { id: 'theodora', label: '1.4 Treasury & VAT Accounting', icon: '💰' },
    { id: 'compliance', label: '1.5 goAML & Statutory Shield', icon: '⚖️' },
    { id: 'journeys', label: '1.6 20 Life Cycle Journeys Hub', icon: '🗺️' },
  ],
};

export const TWELVE_CORPORATE_DEPARTMENTS: BuildingTier[] = [
  {
    id: 'dept-12',
    num: 'Dept 12',
    name: 'Executive & Operations Control Department',
    locationTag: 'Floor 12: Executive Control',
    accessLevel: 'Level 6 (Strategic Command Access)',
    badgeColor: '#EF4444',
    icon: '🏛️',
    summary: 'The elite administrative layer connecting directly to the Level 7 MD Suite.',
    scope: ['Cross-Departmental Performance Management', 'Corporate Governance & Policy Creation'],
    items: [
      { id: 'zoe', label: '12.1 Cross-Department Performance', icon: '⚡' },
      { id: 'governance', label: '12.2 Corporate Governance & Policy', icon: '📜' },
    ],
  },
  {
    id: 'dept-07',
    num: 'Dept 07',
    name: 'Inventory & Property Operations',
    locationTag: 'Floor 07: Inventory Control',
    accessLevel: 'Level 4',
    badgeColor: '#0EA5E9',
    icon: '🏠',
    summary: 'Master property inventory and area matrix.',
    scope: ['Inventory Grid', 'Availability'],
    items: [
      { id: 'mary', label: '7.1 Mary Inventory Hub', icon: '🏠' },
    ],
  },
  {
    id: 'dept-01',
    num: 'Dept 01',
    name: 'Technology, Enterprise Cloud & Security Department',
    locationTag: 'Floor 01: Core Systems',
    accessLevel: 'Level 6',
    badgeColor: '#64748B',
    icon: '🖥️',
    summary: 'Core ERP architecture and security.',
    scope: ['ERP Architecture', 'Security Auditing'],
    items: [
      { id: 'aurora', label: '1.1 Aurora CTO Systems', icon: '🖥️' },
    ],
  },
];
