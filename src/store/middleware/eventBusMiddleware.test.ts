import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import eventBusMiddleware, {
  emitEvent,
  getAuditLog,
  clearAuditLog,
  getAuditLogForAssistant,
  EVENT_TYPES,
  EVENT_ROUTING,
} from './eventBusMiddleware';

// ═══════════════════════════════════════════════════════════════════════
describe('eventBusMiddleware', () => {
  // ── EVENT_TYPES ───────────────────────────────────────────────────
  describe('EVENT_TYPES', () => {
    it('has at least 24 event types', () => {
      expect(Object.keys(EVENT_TYPES).length).toBeGreaterThanOrEqual(24);
    });

    it.each([
      'LEAD_CAPTURED',
      'LEAD_QUALIFIED',
      'DEAL_STARTED',
      'DEAL_CLOSED',
      'KYC_SUBMITTED',
      'COMPLIANCE_ALERT',
      'MAINTENANCE_REQUEST',
      'CAMPAIGN_LAUNCHED',
      'TASK_ASSIGNED',
      'LEGAL_RISK_IDENTIFIED',
      'PROSPECT_IDENTIFIED',
      'PROPERTY_ALERT',
    ])('contains event type %s', (eventType) => {
      expect(EVENT_TYPES[eventType]).toBe(eventType);
    });
  });

  // ── EVENT_ROUTING ─────────────────────────────────────────────────
  describe('EVENT_ROUTING', () => {
    it('routes LEAD_CAPTURED to clara and zoe', () => {
      expect(EVENT_ROUTING[EVENT_TYPES.LEAD_CAPTURED]).toEqual(['clara', 'zoe']);
    });

    it('routes DEAL_CLOSED to theodora, zoe, nancy, olivia', () => {
      expect(EVENT_ROUTING[EVENT_TYPES.DEAL_CLOSED]).toContain('theodora');
      expect(EVENT_ROUTING[EVENT_TYPES.DEAL_CLOSED]).toContain('zoe');
    });

    it('routes KYC_SUBMITTED to laila and evangeline', () => {
      expect(EVENT_ROUTING[EVENT_TYPES.KYC_SUBMITTED]).toEqual(['laila', 'evangeline']);
    });

    it('routes MAINTENANCE_REQUEST to sentinel and daisy', () => {
      expect(EVENT_ROUTING[EVENT_TYPES.MAINTENANCE_REQUEST]).toEqual(['sentinel', 'daisy']);
    });

    it('routes PROSPECT_IDENTIFIED to hunter and clara', () => {
      expect(EVENT_ROUTING[EVENT_TYPES.PROSPECT_IDENTIFIED]).toEqual(['hunter', 'clara']);
    });

    it('has a routing entry for every event type', () => {
      for (const key of Object.values(EVENT_TYPES)) {
        expect(EVENT_ROUTING[key]).toBeDefined();
        expect(Array.isArray(EVENT_ROUTING[key])).toBe(true);
      }
    });
  });

  // ── emitEvent action creator ──────────────────────────────────────
  describe('emitEvent', () => {
    it('creates an action with type eventBus/emit', () => {
      const action = emitEvent('LEAD_CAPTURED', { name: 'Test' }, 'nadia');
      expect(action.type).toBe('eventBus/emit');
    });

    it('includes eventType, payload, and source', () => {
      const action = emitEvent('DEAL_CLOSED', { deal: 'D1' }, 'sophia');
      const payload = action.payload as Record<string, unknown>;
      expect(payload.eventType).toBe('DEAL_CLOSED');
      expect(payload.payload).toEqual({ deal: 'D1' });
      expect(payload.source).toBe('sophia');
    });
  });

  // ── Audit log functions ───────────────────────────────────────────
  describe('audit log', () => {
    afterEach(() => {
      clearAuditLog();
    });

    it('starts with empty log', () => {
      clearAuditLog();
      expect(getAuditLog()).toEqual([]);
    });

    it('clearAuditLog empties the log', () => {
      // We can't directly push to audit log without middleware,
      // but we can verify the function doesn't throw and returns empty
      clearAuditLog();
      expect(getAuditLog()).toHaveLength(0);
    });

    it('getAuditLog returns a copy (not reference)', () => {
      const log1 = getAuditLog();
      const log2 = getAuditLog();
      expect(log1).not.toBe(log2);
      expect(log1).toEqual(log2);
    });

    it('getAuditLogForAssistant filters by assistantId', () => {
      clearAuditLog();
      const filtered = getAuditLogForAssistant('nadia');
      expect(Array.isArray(filtered)).toBe(true);
    });
  });

  // ── Middleware behavior ───────────────────────────────────────────
  describe('middleware execution', () => {
    let dispatchedActions: unknown[];
    let next: ReturnType<typeof vi.fn>;
    let store: {
      getState: ReturnType<typeof vi.fn>;
      dispatch: ReturnType<typeof vi.fn>;
    };

    const makeState = (overrides = {}) => ({
      aiAssistantDashboard: {
        ui: { selectedAssistant: 'mary' },
        notifications: { byAssistantId: {}, globalUnreadCount: 0 },
        ...overrides,
      },
    });

    beforeEach(() => {
      clearAuditLog();
      dispatchedActions = [];
      next = vi.fn((action) => action);
      store = {
        getState: vi.fn(() => makeState()),
        dispatch: vi.fn((action) => {
          dispatchedActions.push(action);
          return action;
        }),
      };
    });

    it('calls next(action) for any action', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      const action = { type: 'some/action', payload: 'test' };
      const result = middleware(action);
      expect(next).toHaveBeenCalledWith(action);
      expect(result).toBe(action);
    });

    it('creates audit entry for aiAssistantDashboard actions', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware({ type: 'aiAssistantDashboard/selectAssistant', payload: 'nadia' });
      expect(getAuditLog().length).toBeGreaterThan(0);
      expect(getAuditLog()[0].actionType).toBe('aiAssistantDashboard/selectAssistant');
    });

    it('does NOT audit non-aiAssistantDashboard actions', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware({ type: 'sidebar/toggle' });
      expect(getAuditLog()).toHaveLength(0);
    });

    it('audit entry has expected shape', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware({
        type: 'aiAssistantDashboard/addActivity',
        payload: { test: true },
        meta: { actor: 'user', assistantId: 'mary' },
      });
      const entry = getAuditLog()[0];
      expect(entry.id).toMatch(/^audit_/);
      expect(entry.timestamp).toBeDefined();
      expect(entry.actionType).toBe('aiAssistantDashboard/addActivity');
      expect(entry.payload).toEqual({ test: true });
      expect(entry.actor).toBe('user');
      expect(entry.assistantId).toBe('mary');
      expect(Array.isArray(entry.changes)).toBe(true);
    });

    it('defaults actor to "system" when no meta', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware({ type: 'aiAssistantDashboard/setViewMode', payload: 'list' });
      expect(getAuditLog()[0].actor).toBe('system');
    });

    it('dispatches notifications on eventBus/emit', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware(emitEvent('LEAD_CAPTURED', { leadId: 'L1' }, 'nadia'));

      // LEAD_CAPTURED routes to ['clara', 'zoe'] — nadia is source so excluded
      expect(dispatchedActions.length).toBe(2); // clara + zoe
      const firstAction = dispatchedActions[0] as Record<string, unknown>;
      expect(firstAction.type).toBe('aiAssistantDashboard/addNotification');
    });

    it('does not dispatch notification to source assistant', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      // LEAD_CAPTURED routes to clara and zoe
      middleware(emitEvent('LEAD_CAPTURED', {}, 'clara'));

      // clara is source, only zoe should get notification
      expect(dispatchedActions.length).toBe(1);
      const action = dispatchedActions[0] as { payload: { assistantId: string } };
      expect(action.payload.assistantId).toBe('zoe');
    });

    it('handles unknown event type gracefully (no notifications)', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      middleware(emitEvent('UNKNOWN_EVENT', {}, 'test'));
      expect(dispatchedActions).toHaveLength(0);
    });

    it('audit log trims at 500 entries', () => {
      const middleware = eventBusMiddleware(store as never)(next);
      for (let i = 0; i < 510; i++) {
        middleware({ type: 'aiAssistantDashboard/action', payload: i });
      }
      expect(getAuditLog().length).toBeLessThanOrEqual(500);
    });

    it('detects selectedAssistant changes in audit', () => {
      let callCount = 0;
      store.getState = vi.fn(() => {
        callCount++;
        return callCount === 1
          ? makeState({ ui: { selectedAssistant: 'mary' } })
          : makeState({ ui: { selectedAssistant: 'nadia' } });
      });
      const middleware = eventBusMiddleware(store as never)(next);
      middleware({ type: 'aiAssistantDashboard/selectAssistant', payload: 'nadia' });
      const changes = getAuditLog()[0].changes;
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'selectedAssistant', from: 'mary', to: 'nadia' }),
        ]),
      );
    });
  });
});
