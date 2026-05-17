export interface InternalModuleArchitecture {
  moduleId: 'linda-whatsapp-core' | 'henry-records-core';
  assistantId: 'linda' | 'henry';
  displayName: string;
  boundary: {
    mode: 'embedded-ui' | 'external-runtime';
    mountSupports: Array<'native' | 'iframe' | 'api'>;
  };
  consumes: string[];
  emits: string[];
  downstreamOwners: string[];
  complianceSurface: string[];
}

export const INTERNAL_MODULE_ARCHITECTURE: Record<string, InternalModuleArchitecture> = {
  linda: {
    moduleId: 'linda-whatsapp-core',
    assistantId: 'linda',
    displayName: 'Linda WhatsApp Core Runtime',
    boundary: {
      mode: 'embedded-ui',
      mountSupports: ['native', 'iframe', 'api'],
    },
    consumes: ['nina.intent.events', 'mary.inventory.snapshots', 'crm.lead.intake'],
    emits: ['henry.audit.events', 'clara.qualified.leads', 'sales.handoff.queue'],
    downstreamOwners: ['henry', 'clara', 'nadia'],
    complianceSurface: ['whatsapp_conversation_retention', 'lead_routing_traceability'],
  },
  henry: {
    moduleId: 'henry-records-core',
    assistantId: 'henry',
    displayName: 'Henry Records & Compliance Runtime',
    boundary: {
      mode: 'embedded-ui',
      mountSupports: ['native', 'iframe'],
    },
    consumes: ['linda.message.events', 'daisy.leasing.timeline', 'theodora.finance.logs'],
    emits: ['katherine.runtime.flags', 'sofia.compliance.packet', 'margaret.signoff.summary'],
    downstreamOwners: ['katherine', 'sofia', 'margaret'],
    complianceSurface: ['immutable_audit_log', 'regulatory_evidence_packaging'],
  },
};

export const getInternalModuleArchitecture = (
  assistantId: string
): InternalModuleArchitecture | null => {
  switch (assistantId) {
    case 'linda':
      return INTERNAL_MODULE_ARCHITECTURE.linda;
    case 'henry':
      return INTERNAL_MODULE_ARCHITECTURE.henry;
    default:
      return null;
  }
};
