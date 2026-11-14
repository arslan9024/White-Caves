/** Auto‑generated from laila_leasing.supervisor.json */
export interface laila_leasing_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'laila_leasing';
  name: 'Laila';
  gender: 'Female';
  title: 'Bounced Cheque Escalation Supervisor';
  supervisorSlot: 4;
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
    '7-Day Notice Generation',
    'Police Clearance Report Trigger',
    'Rental Dispute Center (RDC) Prep',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const LAILA_LEASING_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'laila_leasing',
  name: 'Laila',
  gender: 'Female',
  title: 'Bounced Cheque Escalation Supervisor',
  supervisorSlot: 4,
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
    '7-Day Notice Generation',
    'Police Clearance Report Trigger',
    'Rental Dispute Center (RDC) Prep',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as laila_leasing_supervisorExport;
