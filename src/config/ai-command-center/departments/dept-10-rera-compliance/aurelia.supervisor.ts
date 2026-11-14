/** Auto‑generated from aurelia.supervisor.json */
export interface aurelia_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'aurelia';
  name: 'Aurelia';
  gender: 'Female';
  title: 'Broker RERA Card Validity Supervisor';
  supervisorSlot: 7;
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
    'DLD Broker Card Number Verification',
    'Annual RERA Exam Renewal Alerts',
    'Unlicensed Activity Interception',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const AURELIA_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'aurelia',
  name: 'Aurelia',
  gender: 'Female',
  title: 'Broker RERA Card Validity Supervisor',
  supervisorSlot: 7,
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
    'DLD Broker Card Number Verification',
    'Annual RERA Exam Renewal Alerts',
    'Unlicensed Activity Interception',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as aurelia_supervisorExport;
