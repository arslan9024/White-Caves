import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JourneyEngineService } from '../../../services/journeys/journeyEngineService';
import { getJourneyById } from '../registry/journeyRegistry';

describe('White Caves Journey Engine', () => {
  const tenancyJourneyDef = getJourneyById('prepare-tenancy-contract')!;

  beforeEach(() => {
    // Setup in-memory localStorage mock for node test environment
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(k => delete store[k]);
      }
    };

    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true
      });
    }
  });

  it('creates a new journey session with correct initial state', () => {
    const session = JourneyEngineService.createSession(tenancyJourneyDef);

    expect(session).toBeDefined();
    expect(session.journeyId).toBe('prepare-tenancy-contract');
    expect(session.currentStepIndex).toBe(0);
    expect(session.state).toBe('IN_PROGRESS');
    expect(session.stepStatuses['property']).toBe('IN_PROGRESS');
    expect(session.timeline.length).toBeGreaterThan(0);
    expect(session.readinessScore).toBeGreaterThan(0);
  });

  it('identifies blockers when required fields are missing', () => {
    const session = JourneyEngineService.createSession(tenancyJourneyDef, {
      propertyName: '',
      landlordEmail: ''
    });

    const evaluated = JourneyEngineService.evaluateSession(session, tenancyJourneyDef);

    expect(evaluated.blockers.length).toBeGreaterThan(0);
    const missingProp = evaluated.blockers.find(b => b.stepId === 'property');
    expect(missingProp).toBeDefined();
  });

  it('prevents advancing to the next step when the current step has blocking errors', () => {
    let session = JourneyEngineService.createSession(tenancyJourneyDef, {
      propertyName: ''
    });

    const { session: nextSession, blocked } = JourneyEngineService.nextStep(session, tenancyJourneyDef);

    expect(blocked).toBe(true);
    expect(nextSession.currentStepIndex).toBe(0);
    expect(nextSession.stepStatuses['property']).toBe('BLOCKED');
  });

  it('advances to next step and emits timeline event when step is valid', () => {
    let session = JourneyEngineService.createSession(tenancyJourneyDef, {
      propertyName: 'Sycamore 131',
      community: 'DAMAC Hills 2'
    });

    const { session: nextSession, blocked } = JourneyEngineService.nextStep(session, tenancyJourneyDef);

    expect(blocked).toBe(false);
    expect(nextSession.currentStepIndex).toBe(1);
    expect(nextSession.stepStatuses['property']).toBe('COMPLETED');
    expect(nextSession.timeline.some(e => e.stepId === 'property')).toBe(true);
  });

  it('allows jumping directly to a step (e.g. from blocker resolution banner)', () => {
    let session = JourneyEngineService.createSession(tenancyJourneyDef);
    const jumped = JourneyEngineService.jumpToStep(session, tenancyJourneyDef, 'terms');

    expect(jumped.currentStepIndex).toBe(3);
    expect(jumped.stepStatuses['terms']).toBe('IN_PROGRESS');
  });

  it('completes the journey, sets readiness to 100%, and archives to lifecycle history', () => {
    let session = JourneyEngineService.createSession(tenancyJourneyDef);
    const completed = JourneyEngineService.completeJourney(session, {
      referenceNumber: 'WC-2026-000184',
      title: 'Tenancy Contract Ready',
      subtitle: 'Sycamore 131 — DAMAC Hills 2',
      summaryItems: [{ label: 'Rent', value: 'AED 95,000' }],
      nextActions: []
    });

    expect(completed.state).toBe('COMPLETED');
    expect(completed.readinessScore).toBe(100);
    expect(completed.result?.referenceNumber).toBe('WC-2026-000184');

    const history = JourneyEngineService.getLifecycleHistory();
    expect(history.length).toBeGreaterThan(0);
  });
});
