/** Auto‑generated from thea.supervisor.json */
export interface thea_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'thea';
  name: 'Thea';
  gender: 'Female';
  title: 'Escrow Account Reconciler';
  supervisorSlot: 1;
  department: {
    code: 'DEPT-06';
    name: 'Revenue, Finance & Treasury';
  };
  hierarchy: {
    level: 2;
    role: 'AI Department Supervisor';
    reportingTo: 'Theodora';
  };
  assignedTasks: [
    'Developer Account Reconciliation',
    'Disbursement Authorization Audit',
    'Escrow Bank Certificate Verification',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const THEA_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'thea',
  name: 'Thea',
  gender: 'Female',
  title: 'Escrow Account Reconciler',
  supervisorSlot: 1,
  department: {
    code: 'DEPT-06',
    name: 'Revenue, Finance & Treasury',
  },
  hierarchy: {
    level: 2,
    role: 'AI Department Supervisor',
    reportingTo: 'Theodora',
  },
  assignedTasks: [
    'Developer Account Reconciliation',
    'Disbursement Authorization Audit',
    'Escrow Bank Certificate Verification',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as thea_supervisorExport;
