/** Auto‑generated from isabella.supervisor.json */
export interface isabella_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'isabella';
  name: 'Isabella';
  gender: 'Female';
  title: 'Broker Mandates Supervisor';
  supervisorSlot: 9;
  department: {
    code: 'DEPT-01';
    name: 'Luxury Sales & Brokerage';
  };
  hierarchy: {
    level: 2;
    role: 'AI Department Supervisor';
    reportingTo: 'Clara';
  };
  assignedTasks: [
    'Form B Brokerage Agreements',
    'Offer Negotiation Scripts',
    'Deposit Escrow Verification',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const ISABELLA_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'isabella',
  name: 'Isabella',
  gender: 'Female',
  title: 'Broker Mandates Supervisor',
  supervisorSlot: 9,
  department: {
    code: 'DEPT-01',
    name: 'Luxury Sales & Brokerage',
  },
  hierarchy: {
    level: 2,
    role: 'AI Department Supervisor',
    reportingTo: 'Clara',
  },
  assignedTasks: [
    'Form B Brokerage Agreements',
    'Offer Negotiation Scripts',
    'Deposit Escrow Verification',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as isabella_supervisorExport;
