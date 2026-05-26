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
