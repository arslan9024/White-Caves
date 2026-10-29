/**
 * CRMHubPage.config.ts — Layer 5: Configuration & Types
 *
 * Enforces the White Caves 5-Way Architecture Standard:
 * 1. View (*.view.tsx / *.tsx): Pure UI presentation & JSX rendering
 * 2. Logic (*.logic.ts): Custom hooks, state machines, business workflows
 * 3. Styles (*.styles.ts): Styled-components & visual tokens
 * 4. Data (*.data.ts / *.registries.ts): Pure static registries & dataset definitions
 * 5. Config (*.config.ts): TypeScript interfaces, types, and operational constants
 */

export type TopTileId = 'md_office' | 'corporate' | 'ai_command' | null;

export type DashboardTabId = string;

export interface SubGroupItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

export interface SubGroup {
  name: string;
  items: SubGroupItem[];
}

export interface BuildingTierSubGroup {
  name?: string;
  id?: string;
  label?: string;
  icon?: string;
  items?: SubGroupItem[];
}

export interface BuildingTier {
  id: string;
  num: string; // e.g. "Dept 12", "Dept 07", "MD Suite"
  name: string;
  locationTag: string;
  accessLevel: string;
  badgeColor: string;
  icon: string;
  summary: string;
  scope: string[];
  subGroups?: BuildingTierSubGroup[];
  items?: SubGroupItem[];
}

export interface AIAssistantOption {
  id: string;
  num: string;
  name: string;
  role: string;
  icon: string;
  items?: SubGroupItem[];
}

export interface AITeamSquad {
  id: string;
  name: string;
  seniorLead?: string;
  icon?: string;
  color?: string;
  assistantIds?: string[];
  assistants?: string[];
}

export interface CRMHubPageConfig {
  defaultDeptId: string;
  defaultAiId: string;
  zenModeStorageKey: string;
}

export const CRM_HUB_CONFIG: CRMHubPageConfig = {
  defaultDeptId: 'dept-07',
  defaultAiId: 'nadia',
  zenModeStorageKey: 'wc_crm_zen_mode_active',
};

