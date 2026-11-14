/** Auto‑generated from camellia.supervisor.json */
export interface camellia_supervisorExport {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json';
  id: 'camellia';
  name: 'Camellia';
  gender: 'Female';
  title: 'Seller Mortgage Discharge Supervisor';
  supervisorSlot: 4;
  department: {
    code: 'DEPT-11';
    name: 'Conveyancing & Transaction Management';
  };
  hierarchy: {
    level: 2;
    role: 'AI Department Supervisor';
    reportingTo: 'Evangeline';
  };
  assignedTasks: [
    'Seller Bank Liability Letter Request',
    'Mortgage Discharge Coordination',
    'Blocking Fee Escrow Reservation',
  ];
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog';
    targetLookupLatency: '< 10ms (MapIndexHash)';
    complianceAudit: '100% Green';
  };
}
export const CAMELLIA_SUPERVISOR = {
  $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
  id: 'camellia',
  name: 'Camellia',
  gender: 'Female',
  title: 'Seller Mortgage Discharge Supervisor',
  supervisorSlot: 4,
  department: {
    code: 'DEPT-11',
    name: 'Conveyancing & Transaction Management',
  },
  hierarchy: {
    level: 2,
    role: 'AI Department Supervisor',
    reportingTo: 'Evangeline',
  },
  assignedTasks: [
    'Seller Bank Liability Letter Request',
    'Mortgage Discharge Coordination',
    'Blocking Fee Escrow Reservation',
  ],
  performanceStandard: {
    slaResponseTime: '15-Minute Watchdog',
    targetLookupLatency: '< 10ms (MapIndexHash)',
    complianceAudit: '100% Green',
  },
} as camellia_supervisorExport;
