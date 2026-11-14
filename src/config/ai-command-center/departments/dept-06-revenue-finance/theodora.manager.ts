/** Auto‑generated from theodora.manager.json */
export interface theodora_managerExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'theodora';
  name: 'Theodora';
  gender: 'Female';
  title: 'Chief Financial Officer & Treasury Supervisor';
  department: {
    code: 'DEPT-06';
    name: 'Revenue, Finance & Treasury';
    color: '#F59E0B';
  };
  hierarchy: {
    level: 1;
    role: 'AI Department Manager';
    reportingTo: 'AI Zoe (COO)';
  };
  responsibilities: [
    'FTA Form 201 VAT 5% filing & audit verification',
    'Corporate Tax 9% & Small Business Relief compliance',
    'Director Loan Account (DLA) & multi-currency escrow',
  ];
  supervisorsManagedCount: 9;
  slaWatchdogThresholdMinutes: 15;
}
export const THEODORA_MANAGER = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'theodora',
  name: 'Theodora',
  gender: 'Female',
  title: 'Chief Financial Officer & Treasury Supervisor',
  department: {
    code: 'DEPT-06',
    name: 'Revenue, Finance & Treasury',
    color: '#F59E0B',
  },
  hierarchy: {
    level: 1,
    role: 'AI Department Manager',
    reportingTo: 'AI Zoe (COO)',
  },
  responsibilities: [
    'FTA Form 201 VAT 5% filing & audit verification',
    'Corporate Tax 9% & Small Business Relief compliance',
    'Director Loan Account (DLA) & multi-currency escrow',
  ],
  supervisorsManagedCount: 9,
  slaWatchdogThresholdMinutes: 15,
} as theodora_managerExport;
