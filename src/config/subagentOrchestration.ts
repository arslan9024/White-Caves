export type ModelTier = 'free' | 'standard' | 'premium';

export type AssistantTaskType =
  | 'research'
  | 'planning'
  | 'implementation'
  | 'review'
  | 'qa'
  | 'compliance'
  | 'documentation';

export interface AssistantExecutionProfile {
  id: string;
  role: string;
  modelPolicy: {
    defaultTier: ModelTier;
    premiumAllowed: boolean;
    requiresContextGate: boolean;
  };
  capabilities: string[];
  taskTypes: AssistantTaskType[];
}

export interface CollaborationEdge {
  from: string;
  to: string;
  reason: string;
}

export interface PremiumQuotaContext {
  weeklyRemaining: number;
  businessDaysRemaining: number;
}

export const ASSISTANT_EXECUTION_PROFILES: Record<string, AssistantExecutionProfile> = {
  linda: {
    id: 'linda',
    role: 'WhatsApp Orchestration Agent',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: false,
      requiresContextGate: false,
    },
    capabilities: [
      'conversation_routing',
      'lead_intake',
      'handoff_to_sales',
      'template_execution',
      'message_audit',
    ],
    taskTypes: ['research', 'planning', 'documentation', 'review'],
  },
  henry: {
    id: 'henry',
    role: 'Record Keeper & Compliance Agent',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: false,
      requiresContextGate: false,
    },
    capabilities: [
      'audit_trail_validation',
      'compliance_review',
      'timeline_tracking',
      'risk_flagging',
      'report_packaging',
    ],
    taskTypes: ['review', 'compliance', 'documentation', 'qa'],
  },
  mira: {
    id: 'mira',
    role: 'Lead Full-Stack Implementer',
    modelPolicy: {
      defaultTier: 'premium',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['feature_build', 'api_design', 'refactoring', 'integration'],
    taskTypes: ['implementation', 'qa', 'review'],
  },
  una: {
    id: 'una',
    role: 'Luxury UI/UX Specialist',
    modelPolicy: {
      defaultTier: 'premium',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['visual_design', 'interaction_design', 'ux_patterns', 'branding'],
    taskTypes: ['planning', 'implementation', 'review'],
  },
  katherine: {
    id: 'katherine',
    role: 'QA & Runtime Guard Lead',
    modelPolicy: {
      defaultTier: 'standard',
      premiumAllowed: true,
      requiresContextGate: true,
    },
    capabilities: ['test_strategy', 'runtime_validation', 'regression_guard'],
    taskTypes: ['qa', 'review', 'compliance'],
  },
};

export const SUBAGENT_COLLABORATION_GRAPH: CollaborationEdge[] = [
  {
    from: 'linda',
    to: 'henry',
    reason: 'Conversation and message events for immutable audit trails',
  },
  { from: 'henry', to: 'katherine', reason: 'Compliance and anomaly findings for QA validation' },
  {
    from: 'katherine',
    to: 'mira',
    reason: 'Actionable bug and validation outcomes for implementation',
  },
  { from: 'mira', to: 'una', reason: 'Functional implementation ready for UI/UX refinement' },
  {
    from: 'una',
    to: 'katherine',
    reason: 'UX changes require accessibility and regression checks',
  },
];

export const getRecommendedCollaborators = (assistantId: string): CollaborationEdge[] =>
  SUBAGENT_COLLABORATION_GRAPH.filter(edge => edge.from === assistantId || edge.to === assistantId);

export const getAssistantExecutionProfile = (
  assistantId: string
): AssistantExecutionProfile | null => {
  switch (assistantId) {
    case 'linda':
      return ASSISTANT_EXECUTION_PROFILES.linda;
    case 'henry':
      return ASSISTANT_EXECUTION_PROFILES.henry;
    case 'mira':
      return ASSISTANT_EXECUTION_PROFILES.mira;
    case 'una':
      return ASSISTANT_EXECUTION_PROFILES.una;
    case 'katherine':
      return ASSISTANT_EXECUTION_PROFILES.katherine;
    default:
      return null;
  }
};

export interface PremiumRequestContext {
  assistantId: string;
  requestedTier: ModelTier;
  contextGateApproved?: boolean;
}

export const canAssistantRequestTier = ({
  assistantId,
  requestedTier,
  contextGateApproved = false,
}: PremiumRequestContext): { allowed: boolean; reason?: string } => {
  const profile = getAssistantExecutionProfile(assistantId);

  if (!profile) {
    return {
      allowed: false,
      reason: `Unknown assistant profile: ${assistantId}`,
    };
  }

  if (requestedTier !== 'premium') {
    return { allowed: true };
  }

  if (!profile.modelPolicy.premiumAllowed) {
    return {
      allowed: false,
      reason: `${assistantId} is not permitted to use premium tier`,
    };
  }

  if (profile.modelPolicy.requiresContextGate && !contextGateApproved) {
    return {
      allowed: false,
      reason: `${assistantId} requires context gate approval before premium tasks`,
    };
  }

  return { allowed: true };
};

export const calculateDailyPremiumCap = ({
  weeklyRemaining,
  businessDaysRemaining,
}: PremiumQuotaContext): number => {
  if (businessDaysRemaining <= 0) {
    return 0;
  }
  return Math.max(0, Math.floor(weeklyRemaining / businessDaysRemaining));
};
