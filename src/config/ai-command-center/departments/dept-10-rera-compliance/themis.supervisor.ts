/** Auto‑generated from themis.supervisor.json */
export interface themis_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'themis';
  name: 'Themis';
  gender: 'Female';
  title: 'goAML Cash Threshold & SAR Supervisor';
  supervisorSlot: 2;
  department: {
    code: 'DEPT-10';
    name: 'Regulatory Affairs & RERA Compliance';
  };
  hierarchy: {
    level: 2;
    role: 'AI Department Supervisor';
    reportingTo: 'Sofia';
  };
  assignedTasks: [
    'AED 55k+ Cash Transaction Screening',
    'Suspicious Activity Report (SAR) Draft',
    'FIU Regulatory Submission Queue',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const THEMIS_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'themis',
  name: 'Themis',
  gender: 'Female',
  title: 'goAML Cash Threshold & SAR Supervisor',
  supervisorSlot: 2,
  department: {
    code: 'DEPT-10',
    name: 'Regulatory Affairs & RERA Compliance',
  },
  hierarchy: {
    level: 2,
    role: 'AI Department Supervisor',
    reportingTo: 'Sofia',
  },
  assignedTasks: [
    'AED 55k+ Cash Transaction Screening',
    'Suspicious Activity Report (SAR) Draft',
    'FIU Regulatory Submission Queue',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as themis_supervisorExport;
