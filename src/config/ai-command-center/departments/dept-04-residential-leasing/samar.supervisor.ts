/** Auto‑generated from samar.supervisor.json */
export interface samar_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'samar';
  name: 'Samar';
  gender: 'Female';
  title: 'RERA Rental Index Review Supervisor';
  supervisorSlot: 5;
  department: {
    code: 'DEPT-04';
    name: 'Portfolio Management & Residential Leasing';
  };
  hierarchy: {
    level: 2;
    role: 'AI Department Supervisor';
    reportingTo: 'Nadia';
  };
  assignedTasks: [
    'Official DLD Rental Index Check',
    'Max Legal Increase Calculation',
    '90-Day Legal Notice Dispatch',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const SAMAR_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'samar',
  name: 'Samar',
  gender: 'Female',
  title: 'RERA Rental Index Review Supervisor',
  supervisorSlot: 5,
  department: {
    code: 'DEPT-04',
    name: 'Portfolio Management & Residential Leasing',
  },
  hierarchy: {
    level: 2,
    role: 'AI Department Supervisor',
    reportingTo: 'Nadia',
  },
  assignedTasks: [
    'Official DLD Rental Index Check',
    'Max Legal Increase Calculation',
    '90-Day Legal Notice Dispatch',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as samar_supervisorExport;
