/**
 * server/services/__tests__/websocketEngine.test.ts — Unit tests for Wave 32 WebSocket Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { WebSocketEngine, authenticateSocketToken, wsEngine } from '../websocketEngine';

describe('Wave 32 WebSocket Notification Dispatch Engine', () => {
  let engine: WebSocketEngine;

  beforeEach(() => {
    engine = wsEngine;
    engine.reset();
  });

  it('authenticates socket tokens correctly', () => {
    const valid = authenticateSocketToken('valid-token-agent007-agent');
    expect(valid).not.toBeNull();
    expect(valid?.userId).toBe('agent007');
    expect(valid?.role).toBe('agent');

    const invalid = authenticateSocketToken(undefined);
    expect(invalid).toBeNull();
  });

  it('registers connections and room subscriptions', () => {
    const user = { userId: 'u1', email: 'u1@whitecaves.ae', role: 'agent' };
    engine.registerConnection('conn-1', user);

    expect(engine.getActiveConnectionCount()).toBe(1);
    expect(engine.getRoomSubscriberCount('user:u1')).toBe(1);

    engine.joinRoom('conn-1', 'leads:assigned');
    expect(engine.getRoomSubscriberCount('leads:assigned')).toBe(1);

    engine.leaveRoom('conn-1', 'leads:assigned');
    expect(engine.getRoomSubscriberCount('leads:assigned')).toBe(0);

    engine.removeConnection('conn-1');
    expect(engine.getActiveConnectionCount()).toBe(0);
  });

  it('dispatches notification to active room subscribers', () => {
    const user = { userId: 'u2', email: 'u2@whitecaves.ae', role: 'manager' };
    engine.registerConnection('conn-2', user);
    engine.joinRoom('conn-2', 'whatsapp:sla');

    const result = engine.dispatchNotification({
      id: 'n-1',
      type: 'SLA_BREACH',
      channel: 'whatsapp:sla',
      payload: { leadId: 'lead-123' },
      timestamp: new Date().toISOString(),
    });

    expect(result).toBe(true);
  });

  it('triggers SLA breach alert for 15-minute SLA breach', async () => {
    const alert = await engine.triggerSlaBreachAlert('lead-999', 'agent-404', 18);
    expect(alert).toBeDefined();
    expect(alert.type).toBe('SLA_BREACH');
    expect(alert.payload.elapsedMinutes).toBe(18);
    expect(alert.payload.message).toContain('SLA BREACH WARNING');
  });
});
