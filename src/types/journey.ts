/**
 * White Caves Journey Engine — Core Type Definitions
 * 
 * Philosophy:
 * - Records = What exists (Entities)
 * - Journeys = What needs to happen (Missions / Guided Outcomes)
 * - Lifecycles = What has happened (Timelines / Audit History)
 */

export type JourneyCategory = 
  | 'property'
  | 'landlord'
  | 'tenant'
  | 'leasing'
  | 'sales'
  | 'property-management'
  | 'compliance';

export type JourneyState = 
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'READY'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type StepStatus = 
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'SKIPPED';

export type StepType = 
  | 'entity-selection'
  | 'entity-review'
  | 'form'
  | 'checklist'
  | 'smart-review'
  | 'processing'
  | 'result';

export interface BlockerIssue {
  id: string;
  stepId: string;
  field?: string;
  title: string;
  description: string;
  actionLabel: string;
  severity: 'warning' | 'error';
}

export interface JourneyStep {
  id: string;
  title: string;
  shortLabel?: string;
  description?: string;
  type: StepType;
  milestoneTag?: string;
  requiredFields?: string[];
  validate?: (data: Record<string, any>) => BlockerIssue[];
  config?: Record<string, any>;
}

export interface NextActionRecommendation {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  primary?: boolean;
  targetJourneyId?: string;
  actionType: 'start_journey' | 'download_pdf' | 'send_email' | 'request_signature' | 'external_link' | 'close';
  payload?: Record<string, any>;
}

export interface JourneyResultOutcome {
  referenceNumber?: string;
  title: string;
  subtitle: string;
  summaryItems: Array<{ label: string; value: string; verified?: boolean }>;
  badges?: string[];
  nextActions: NextActionRecommendation[];
}

export interface JourneyDefinition {
  id: string;
  title: string;
  category: JourneyCategory;
  family: string;
  icon: string;
  description: string;
  estimatedMinutes: number;
  steps: JourneyStep[];
  defaultData?: Record<string, any>;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stepId: string;
  stepTitle: string;
  title: string;
  description: string;
  actor: string;
  type: 'info' | 'success' | 'warning' | 'milestone';
}

export interface JourneySession {
  sessionId: string;
  journeyId: string;
  state: JourneyState;
  currentStepIndex: number;
  data: Record<string, any>;
  stepStatuses: Record<string, StepStatus>;
  blockers: BlockerIssue[];
  readinessScore: number;
  timeline: TimelineEvent[];
  result?: JourneyResultOutcome;
  createdAt: string;
  updatedAt: string;
  entityContext?: {
    propertyId?: string;
    landlordId?: string;
    tenantId?: string;
    dealId?: string;
  };
}
