/**
 * White Caves Journey Engine Service
 * 
 * Manages journey sessions, validation state machine, blocker resolution,
 * readiness score computation, and lifecycle audit timeline emission.
 */

import {
  JourneyDefinition,
  JourneySession,
  JourneyState,
  StepStatus,
  BlockerIssue,
  TimelineEvent,
  JourneyResultOutcome
} from '../../types/journey';

const STORAGE_KEY = 'white_caves_active_journey_sessions';
const HISTORY_KEY = 'white_caves_journey_lifecycle_history';

export class JourneyEngineService {
  /**
   * Initializes a new Journey Session from a definition and optional initial context
   */
  public static createSession(
    definition: JourneyDefinition,
    initialData: Record<string, any> = {},
    entityContext: JourneySession['entityContext'] = {}
  ): JourneySession {
    const mergedData = { ...(definition.defaultData || {}), ...initialData };
    
    // Initialize step statuses: first step is IN_PROGRESS, others LOCKED/AVAILABLE
    const stepStatuses: Record<string, StepStatus> = {};
    definition.steps.forEach((step, idx) => {
      if (idx === 0) {
        stepStatuses[step.id] = 'IN_PROGRESS';
      } else {
        stepStatuses[step.id] = 'LOCKED';
      }
    });

    const initialTimeline: TimelineEvent[] = [
      {
        id: `event-${Date.now()}-0`,
        timestamp: new Date().toISOString(),
        stepId: definition.steps[0]?.id || 'start',
        stepTitle: definition.steps[0]?.title || 'Start',
        title: `Journey Started: ${definition.title}`,
        description: `Agent initiated mission for ${definition.family || 'workflow'}.`,
        actor: 'Current Agent',
        type: 'info'
      }
    ];

    const session: JourneySession = {
      sessionId: `session_${definition.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      journeyId: definition.id,
      state: 'IN_PROGRESS',
      currentStepIndex: 0,
      data: mergedData,
      stepStatuses,
      blockers: [],
      readinessScore: 0,
      timeline: initialTimeline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entityContext
    };

    // Run initial validation & score computation
    const validatedSession = this.evaluateSession(session, definition);
    this.saveSession(validatedSession);
    return validatedSession;
  }

  /**
   * Evaluates validation rules for all accessible steps, identifies blockers,
   * updates step statuses, and computes overall readiness percentage.
   */
  public static evaluateSession(
    session: JourneySession,
    definition: JourneyDefinition
  ): JourneySession {
    const blockers: BlockerIssue[] = [];
    let completedStepsCount = 0;
    let totalEvaluatedWeight = 0;
    let acquiredWeight = 0;

    const newStatuses = { ...session.stepStatuses };

    definition.steps.forEach((step, idx) => {
      // Exclude result or purely automated steps from blocker penalty weight
      const isInformational = step.type === 'processing' || step.type === 'result';
      const stepWeight = isInformational ? 0 : 10;
      totalEvaluatedWeight += stepWeight;

      let stepHasErrors = false;

      // 1. Run step validator if present
      if (step.validate) {
        const stepBlockers = step.validate(session.data);
        if (stepBlockers && stepBlockers.length > 0) {
          blockers.push(...stepBlockers);
          stepHasErrors = true;
        }
      }

      // 2. Check required fields
      if (step.requiredFields && step.requiredFields.length > 0) {
        step.requiredFields.forEach(field => {
          const val = session.data[field];
          const isMissing = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
          if (isMissing) {
            stepHasErrors = true;
            // Only add to blockers if not already captured by step validator
            if (!blockers.some(b => b.stepId === step.id && b.field === field)) {
              blockers.push({
                id: `blocker-${step.id}-${field}`,
                stepId: step.id,
                field,
                title: `Missing ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                description: `Field "${field}" is required in ${step.title}.`,
                actionLabel: `Add ${field.replace(/([A-Z])/g, ' $1')}`,
                severity: 'error'
              });
            }
          }
        });
      }

      // Determine step status
      if (idx < session.currentStepIndex) {
        if (stepHasErrors) {
          newStatuses[step.id] = 'BLOCKED';
          acquiredWeight += stepWeight * 0.5; // Partial credit
        } else {
          newStatuses[step.id] = 'COMPLETED';
          completedStepsCount++;
          acquiredWeight += stepWeight;
        }
      } else if (idx === session.currentStepIndex) {
        newStatuses[step.id] = stepHasErrors ? 'BLOCKED' : 'IN_PROGRESS';
        if (!stepHasErrors && !isInformational) {
          acquiredWeight += stepWeight * 0.8;
        }
      } else {
        // Future steps
        if (idx === session.currentStepIndex + 1 && !stepHasErrors) {
          newStatuses[step.id] = 'AVAILABLE';
        } else {
          newStatuses[step.id] = 'LOCKED';
        }
      }
    });

    const readinessScore = totalEvaluatedWeight > 0 
      ? Math.min(100, Math.round((acquiredWeight / totalEvaluatedWeight) * 100))
      : 100;

    // Session State evaluation
    let state: JourneyState = session.state;
    if (session.state !== 'COMPLETED' && session.state !== 'PROCESSING' && session.state !== 'CANCELLED') {
      if (blockers.some(b => b.severity === 'error' && b.stepId === definition.steps[session.currentStepIndex]?.id)) {
        state = 'BLOCKED';
      } else if (readinessScore >= 90 && session.currentStepIndex === definition.steps.length - 2) {
        state = 'READY';
      } else {
        state = 'IN_PROGRESS';
      }
    }

    return {
      ...session,
      stepStatuses: newStatuses,
      blockers,
      readinessScore,
      state,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Updates session data and triggers re-evaluation
   */
  public static updateSessionData(
    session: JourneySession,
    definition: JourneyDefinition,
    patch: Record<string, any>
  ): JourneySession {
    const updated: JourneySession = {
      ...session,
      data: { ...session.data, ...patch },
      updatedAt: new Date().toISOString()
    };
    const evaluated = this.evaluateSession(updated, definition);
    this.saveSession(evaluated);
    return evaluated;
  }

  /**
   * Moves to the next step if current step is valid
   */
  public static nextStep(
    session: JourneySession,
    definition: JourneyDefinition
  ): { session: JourneySession; blocked: boolean } {
    const currentStep = definition.steps[session.currentStepIndex];
    if (!currentStep) return { session, blocked: false };

    // Check if current step has blocking errors
    const currentStepBlockers = session.blockers.filter(
      b => b.stepId === currentStep.id && b.severity === 'error'
    );

    if (currentStepBlockers.length > 0) {
      const updated = {
        ...session,
        state: 'BLOCKED' as JourneyState,
        stepStatuses: {
          ...session.stepStatuses,
          [currentStep.id]: 'BLOCKED' as StepStatus
        }
      };
      this.saveSession(updated);
      return { session: updated, blocked: true };
    }

    // Step is valid, mark completed and record timeline milestone
    const nextIndex = Math.min(definition.steps.length - 1, session.currentStepIndex + 1);
    const nextStep = definition.steps[nextIndex];

    const timelineEvent: TimelineEvent = {
      id: `event-${Date.now()}-${nextIndex}`,
      timestamp: new Date().toISOString(),
      stepId: currentStep.id,
      stepTitle: currentStep.title,
      title: `Step Completed: ${currentStep.title}`,
      description: currentStep.milestoneTag 
        ? `Milestone Reached: ${currentStep.milestoneTag}`
        : `Successfully verified and finalized ${currentStep.title}.`,
      actor: 'Current Agent',
      type: currentStep.milestoneTag ? 'milestone' : 'success'
    };

    const newStatuses = {
      ...session.stepStatuses,
      [currentStep.id]: 'COMPLETED' as StepStatus,
      [nextStep.id]: (nextStep.type === 'result' ? 'COMPLETED' : 'IN_PROGRESS') as StepStatus
    };

    const updated: JourneySession = {
      ...session,
      currentStepIndex: nextIndex,
      stepStatuses: newStatuses,
      timeline: [...session.timeline, timelineEvent],
      updatedAt: new Date().toISOString()
    };

    const evaluated = this.evaluateSession(updated, definition);
    this.saveSession(evaluated);
    return { session: evaluated, blocked: false };
  }

  /**
   * Moves back to previous step
   */
  public static prevStep(
    session: JourneySession,
    definition: JourneyDefinition
  ): JourneySession {
    if (session.currentStepIndex <= 0) return session;
    const prevIndex = session.currentStepIndex - 1;
    const prevStep = definition.steps[prevIndex];

    const updated: JourneySession = {
      ...session,
      currentStepIndex: prevIndex,
      stepStatuses: {
        ...session.stepStatuses,
        [prevStep.id]: 'IN_PROGRESS'
      },
      updatedAt: new Date().toISOString()
    };

    const evaluated = this.evaluateSession(updated, definition);
    this.saveSession(evaluated);
    return evaluated;
  }

  /**
   * Jumps directly to a specific step (e.g. from "Why am I blocked?" banner)
   */
  public static jumpToStep(
    session: JourneySession,
    definition: JourneyDefinition,
    stepId: string
  ): JourneySession {
    const targetIndex = definition.steps.findIndex(s => s.id === stepId);
    if (targetIndex < 0) return session;

    const updated: JourneySession = {
      ...session,
      currentStepIndex: targetIndex,
      stepStatuses: {
        ...session.stepStatuses,
        [stepId]: 'IN_PROGRESS'
      },
      updatedAt: new Date().toISOString()
    };

    const evaluated = this.evaluateSession(updated, definition);
    this.saveSession(evaluated);
    return evaluated;
  }

  /**
   * Completes a journey and records outcome in lifecycle history
   */
  public static completeJourney(
    session: JourneySession,
    result: JourneyResultOutcome
  ): JourneySession {
    const completedSession: JourneySession = {
      ...session,
      state: 'COMPLETED',
      result,
      readinessScore: 100,
      timeline: [
        ...session.timeline,
        {
          id: `event-complete-${Date.now()}`,
          timestamp: new Date().toISOString(),
          stepId: 'result',
          stepTitle: 'Journey Completed',
          title: result.title,
          description: `Outcome finalized with reference: ${result.referenceNumber || 'N/A'}.`,
          actor: 'White Caves Journey Engine',
          type: 'milestone'
        }
      ],
      updatedAt: new Date().toISOString()
    };

    this.saveSession(completedSession);
    this.appendToLifecycleHistory(completedSession);
    return completedSession;
  }

  // -------------------------------------------------------------
  // Storage & Persistence Layer
  // -------------------------------------------------------------

  public static saveSession(session: JourneySession): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const sessions = this.getStoredSessions();
      sessions[session.sessionId] = session;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Safe fallback if local storage is unavailable
    }
  }

  public static getStoredSessions(): Record<string, JourneySession> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return {};
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public static getActiveSessionForJourney(journeyId: string): JourneySession | null {
    const sessions = this.getStoredSessions();
    const matches = Object.values(sessions).filter(
      s => s.journeyId === journeyId && s.state !== 'COMPLETED' && s.state !== 'CANCELLED'
    );
    if (matches.length === 0) return null;
    // Sort by latest updated
    matches.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return matches[0];
  }

  public static deleteSession(sessionId: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return {};
      const sessions = this.getStoredSessions();
      delete sessions[sessionId];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Safe fallback
    }
  }

  public static appendToLifecycleHistory(session: JourneySession): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const raw = window.localStorage.getItem(HISTORY_KEY);
      const history: JourneySession[] = raw ? JSON.parse(raw) : [];
      history.unshift(session);
      // Keep last 100 lifecycle records
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
    } catch {
      // Safe fallback
    }
  }

  public static getLifecycleHistory(entityId?: string): JourneySession[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const raw = window.localStorage.getItem(HISTORY_KEY);
      const history: JourneySession[] = raw ? JSON.parse(raw) : [];
      if (!entityId) return history;
      return history.filter(s => 
        s.entityContext?.propertyId === entityId ||
        s.entityContext?.landlordId === entityId ||
        s.entityContext?.tenantId === entityId ||
        s.entityContext?.dealId === entityId
      );
    } catch {
      return [];
    }
  }
}
