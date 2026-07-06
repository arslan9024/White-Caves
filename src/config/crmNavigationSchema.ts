import type { RoleTab } from './ROLE_TAB_MAPPING';
import { getCRMModule } from './crmModuleRegistry';

interface CRMModuleEntry {
  label: string;
}

export interface GroupedModuleItem {
  id: string;
  label: string;
  icon: string;
  zone: string;
}

export interface GroupedWorkspace {
  pinned: RoleTab[];
  core: RoleTab[];
}

export interface GroupedModules {
  ai: GroupedModuleItem[];
  core: GroupedModuleItem[];
  advanced: GroupedModuleItem[];
  byZone: Record<string, GroupedModuleItem[]>;
}

export type MDWorkspaceId = 'md-company-workspace' | 'md-ai-command-center';

export interface MDWorkspaceDefinition {
  id: MDWorkspaceId;
  label: string;
  icon: string;
  defaultTabId: string;
}

export interface ModuleWorkspaceOwnership {
  moduleId: string;
  workspaceId: MDWorkspaceId;
}

export interface MDWorkspaceKPIBoundary {
  workspaceId: MDWorkspaceId;
  kpiIds: string[];
  drillDownTabs: string[];
  aiCommandSurface: boolean;
}

const MD_PINNED_WORKSPACE_IDS = ['overview', 'leads', 'analytics', 'ai-command', 'users'];

const ADVANCED_MODULE_IDS = new Set([
  'aurora',
  'hazel',
  'willow',
  'rera',
  'dld',
  'leads',
  'valuation',
  'analytics',
  'henry',
  'henryAudit',
  'atlas',
  'vesta',
  'juno',
  'maven',
  'kairos',
  'cipher',
  'sentinel',
]);

const CORE_MODULE_IDS = new Set([
  'unified',
  'zoe',
  'clara',
  'sophia',
  'mary',
  'theodora',
  'daisy',
  'olivia',
  'laila',
  'nadia',
  'nina',
  'nancy',
  'linda',
]);

const AI_ZONE = 'ai_command';

export const MD_TOP_LEVEL_WORKSPACES: MDWorkspaceDefinition[] = [
  {
    id: 'md-company-workspace',
    label: 'Company Structure & Business Process',
    icon: '🏢',
    defaultTabId: 'overview',
  },
  {
    id: 'md-ai-command-center',
    label: 'AI Command Center',
    icon: '🤖',
    defaultTabId: 'ai-command',
  },
];

export const MD_WORKSPACE_KPI_BOUNDARIES: MDWorkspaceKPIBoundary[] = [
  {
    workspaceId: 'md-company-workspace',
    kpiIds: [
      'properties',
      'leads',
      'revenue',
      'agents',
      'contracts',
      'pipeline_velocity',
      'compliance_health',
    ],
    drillDownTabs: ['overview', 'properties', 'agents', 'leads', 'contracts', 'analytics', 'users'],
    aiCommandSurface: false,
  },
  {
    workspaceId: 'md-ai-command-center',
    kpiIds: [
      'assistant_online',
      'assistant_degraded',
      'queue_pending',
      'queue_stuck',
      'handoff_sla_minutes',
    ],
    drillDownTabs: ['ai-command', 'ai-hub'],
    aiCommandSurface: true,
  },
];

export const ZONE_LABELS: Record<string, string> = {
  executive: 'Executive',
  sales_leads: 'Sales & Leads',
  inventory_listings: 'Inventory & Listings',
  leasing_contracts: 'Leasing & Contracts',
  finance_compliance: 'Finance & Compliance',
  ai_command: 'AI Command',
};

export function groupWorkspacesForMD(tabs: RoleTab[]): GroupedWorkspace {
  const pinned = tabs.filter(tab => MD_PINNED_WORKSPACE_IDS.includes(tab.id));
  const core = tabs.filter(tab => !MD_PINNED_WORKSPACE_IDS.includes(tab.id));
  return { pinned, core };
}

export function getWorkspaceForMDModule(moduleId: string): MDWorkspaceId {
  const moduleDef = getCRMModule(moduleId);
  if (moduleDef?.zone === AI_ZONE) {
    return 'md-ai-command-center';
  }

  return 'md-company-workspace';
}

export function getWorkspaceForMDTab(tabId: string): MDWorkspaceId {
  if (tabId === 'ai-command' || tabId === 'ai-hub') {
    return 'md-ai-command-center';
  }

  return 'md-company-workspace';
}

export function getMDModuleOwnershipMap(
  moduleEntries: Array<[string, CRMModuleEntry]>
): ModuleWorkspaceOwnership[] {
  return moduleEntries
    .map(([moduleId]) => ({
      moduleId,
      workspaceId: getWorkspaceForMDModule(moduleId),
    }))
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId));
}

export function groupModulesForMD(moduleEntries: Array<[string, CRMModuleEntry]>): GroupedModules {
  const grouped: GroupedModules = {
    ai: [],
    core: [],
    advanced: [],
    byZone: {},
  };

  moduleEntries.forEach(([id, module]) => {
    const def = getCRMModule(id);
    if (!def) return;

    const zone = def.zone ?? 'executive';
    const item: GroupedModuleItem = {
      id,
      label: module.label,
      icon: def.icon ?? '🤖',
      zone,
    };

    if (!grouped.byZone[zone]) {
      grouped.byZone[zone] = [];
    }
    grouped.byZone[zone].push(item);

    if (zone === AI_ZONE) {
      grouped.ai.push(item);
      return;
    }

    if (ADVANCED_MODULE_IDS.has(id) && !CORE_MODULE_IDS.has(id)) {
      grouped.advanced.push(item);
      return;
    }

    grouped.core.push(item);
  });

  return grouped;
}
