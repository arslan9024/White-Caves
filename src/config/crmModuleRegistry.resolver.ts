import type { CRMModuleDefinition } from './crmModuleRegistry.types.js';
import { CORE_CRM_MODULES } from './crmModuleRegistry.core.js';
import { THEODORA_FINANCE_MODULES } from './crmModuleRegistry.finance.js';
import { OPERATIONS_CRM_MODULES } from './crmModuleRegistry.operations.js';
import { ASSISTANTS_CRM_MODULES } from './crmModuleRegistry.assistants.js';

export const CRM_MODULE_REGISTRY: Record<string, CRMModuleDefinition> = {
  ...CORE_CRM_MODULES,
  ...THEODORA_FINANCE_MODULES,
  ...OPERATIONS_CRM_MODULES,
  ...ASSISTANTS_CRM_MODULES,
};

export const SUPERUSER_CRM_MODULE_ORDER: string[] = [
  'unified',
  'nadia',
  'mary',
  'clara',
  'nina',
  'nancy',
  'sophia',
  'daisy',
  'theodora',
  'olivia',
  'zoe',
  'laila',
  'aurora',
  'hazel',
  'willow',
  'rera',
  'dld',
  'leads',
  'valuation',
  'analytics',
  'agent-task-cockpit',
  'funnel-economics',
  'kpi-tracker',
  'lead-timeline',
];

export const CRM_HUB_MODULE_ORDER: string[] = [
  'clara',
  'mary',
  'sophia',
  'theodora',
  'daisy',
  'nadia',
  'zoe',
];

export const MODERN_DASHBOARD_ASSISTANT_ORDER: string[] = [
  'clara',
  'mary',
  'linda',
  'nancy',
  'theodora',
  'olivia',
  'zoe',
  'aurora',
];

export const getCRMModule = (id: string | undefined | null): CRMModuleDefinition | null => {
  if (!id) return null;
  if (CRM_MODULE_REGISTRY[id]) return CRM_MODULE_REGISTRY[id];

  // Specific alias mappings
  if (id.startsWith('cassie-') || id === 'cassie') {
    return CRM_MODULE_REGISTRY['lead-scoring'] ?? CRM_MODULE_REGISTRY['leads'] ?? null;
  }
  if (id.startsWith('lead-scoring-') || id === 'lead-scoring') {
    return CRM_MODULE_REGISTRY['lead-scoring'] ?? CRM_MODULE_REGISTRY['leads'] ?? null;
  }

  // 20 Flagship Journey mappings
  const journeyKeys = [
    'prepare-tenancy-contract',
    'property-onboarding',
    'landlord-onboarding',
    'tenant-onboarding',
    'leasing-deal-creation',
    'contract-signing',
    'payment-collection',
    'create-ejari',
    'property-handover',
    'tenancy-renewal',
    'secondary-sales-deal',
    'mortgage-preapproval',
    'golden-visa-application',
    'offplan-reservation',
    'property-snagging-inspection',
    'vat-quarterly-filing',
    'tenant-moveout-settlement',
    'aml-pep-sanctions-screening',
    'lead-acquisition-qualification',
    'community-service-ticket',
  ];
  if (journeyKeys.includes(id) || id.startsWith('journey-') || id === 'journeys') {
    return CRM_MODULE_REGISTRY['journeys'] ?? null;
  }

  // Intelligent prefix resolution: e.g. "nadia-broadcast" -> "nadia"
  const prefix = id.split('-')[0];
  if (prefix && CRM_MODULE_REGISTRY[prefix]) {
    return CRM_MODULE_REGISTRY[prefix];
  }

  return null;
};

export const resolveCRMModules = (ids: string[]): CRMModuleDefinition[] =>
  ids.map(id => getCRMModule(id)).filter((m): m is CRMModuleDefinition => Boolean(m));
