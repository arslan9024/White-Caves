import { AI_ASSISTANTS_REGISTRY } from './registry';

export const MOUNTED_API_PREFIXES = [
  '/api/properties',
  '/api/leasing-inventory',
  '/api/documents',
  '/api/finance',
  '/api/invoices',
  '/api/transactions',
  '/api/homepage',
  '/api/analytics',
  '/api/communications',
  '/api/orchestration',
  '/api/activities',
  '/api/compliance',
  '/api/nadia',
  '/api/linda',
  '/api/leads',
  '/api/crm',
  '/api/leases',
  '/api/tenants',
  '/api/maintenance',
  '/api/users',
  '/api/job-applications',
  '/api/integrations',
  '/api/assistants',
] as const;

export const ACTIVE_CONTRACT_ASSISTANT_IDS = [
  'mary',
  'theodora',
  'olivia',
  'zoe',
  'laila',
  'nadia',
  'linda',
  'sophia',
  'daisy',
  'clara',
  'nina',
  'nancy',
  'aurora',
  'henry',
] as const;

export interface EndpointContractIssue {
  assistantId: string;
  endpoint: string;
  reason: 'invalid-format' | 'unmapped-prefix';
}

export const isEndpointMapped = (endpoint: string, mountedPrefixes: readonly string[]): boolean =>
  mountedPrefixes.some(prefix => endpoint.startsWith(prefix));

export const validateAssistantEndpointContract = (
  mountedPrefixes: readonly string[] = MOUNTED_API_PREFIXES,
  assistantIds: readonly string[] = ACTIVE_CONTRACT_ASSISTANT_IDS
): EndpointContractIssue[] => {
  const issues: EndpointContractIssue[] = [];

  for (const assistant of Object.values(AI_ASSISTANTS_REGISTRY)) {
    if (!assistantIds.includes(assistant.id)) continue;

    for (const endpoint of assistant.apiEndpoints) {
      if (!endpoint.startsWith('/api/')) {
        issues.push({
          assistantId: assistant.id,
          endpoint,
          reason: 'invalid-format',
        });
        continue;
      }

      if (!isEndpointMapped(endpoint, mountedPrefixes)) {
        issues.push({
          assistantId: assistant.id,
          endpoint,
          reason: 'unmapped-prefix',
        });
      }
    }
  }

  return issues;
};

export const getAssistantEndpointCoverage = (
  mountedPrefixes: readonly string[] = MOUNTED_API_PREFIXES,
  assistantIds: readonly string[] = ACTIVE_CONTRACT_ASSISTANT_IDS
): { totalEndpoints: number; mappedEndpoints: number; coveragePct: number } => {
  const allEndpoints = Object.values(AI_ASSISTANTS_REGISTRY)
    .filter(assistant => assistantIds.includes(assistant.id))
    .flatMap(assistant => assistant.apiEndpoints);
  const mappedEndpoints = allEndpoints.filter(endpoint =>
    isEndpointMapped(endpoint, mountedPrefixes)
  ).length;
  const totalEndpoints = allEndpoints.length;

  return {
    totalEndpoints,
    mappedEndpoints,
    coveragePct:
      totalEndpoints === 0 ? 100 : Number(((mappedEndpoints / totalEndpoints) * 100).toFixed(2)),
  };
};
