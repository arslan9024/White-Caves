import { describe, expect, it } from 'vitest';
import analyticsReducer, {
  clearKPIs,
  selectConnectionStatus,
  setActiveUsers,
  setConnectionStatus,
  setError,
  setRealtimeKPIs,
  updateUserKPI,
  type AnalyticsState,
  type UserKPI,
} from './analyticsSlice';

describe('store/slices/analyticsSlice', () => {
  it('sets realtime KPI payload and marks connection connected', () => {
    const kpi: UserKPI = {
      userId: 'u1',
      leadsToday: 3,
      leadsThisWeek: 10,
      closedDealsThisMonth: 2,
      totalRevenue: 120000,
      conversionRate: 0.3,
      averageDealSize: 60000,
      followUpsPending: 1,
      timestamp: new Date('2026-07-06T00:00:00.000Z'),
    };

    const next = analyticsReducer(
      undefined,
      setRealtimeKPIs({
        [kpi.userId]: kpi,
      })
    );

    expect(next.realtimeKPIs.u1).toEqual(kpi);
    expect(next.connectionStatus).toBe('connected');
    expect(next.lastUpdate).toBeInstanceOf(Date);
  });

  it('updates/creates personal KPI entries', () => {
    const next = analyticsReducer(
      undefined,
      updateUserKPI({
        userId: 'u2',
        kpi: { leadsToday: 5, followUpsPending: 2 },
      })
    );

    expect(next.realtimeKPIs.u2.userId).toBe('u2');
    expect(next.realtimeKPIs.u2.leadsToday).toBe(5);
    expect(next.realtimeKPIs.u2.followUpsPending).toBe(2);
    expect(next.lastUpdate).toBeInstanceOf(Date);
  });

  it('supports connection, users, error and clear actions', () => {
    const withStatus = analyticsReducer(undefined, setConnectionStatus('reconnecting'));
    const withUsers = analyticsReducer(withStatus, setActiveUsers(12));
    const withError = analyticsReducer(withUsers, setError('connection dropped'));

    expect(withUsers.activeUsers).toBe(12);
    expect(withError.error).toBe('connection dropped');

    const withKpi = analyticsReducer(
      withError,
      setRealtimeKPIs({
        u3: {
          userId: 'u3',
          leadsToday: 1,
          leadsThisWeek: 1,
          closedDealsThisMonth: 0,
          totalRevenue: 0,
          conversionRate: 0,
          averageDealSize: 0,
          followUpsPending: 0,
          timestamp: new Date(),
        },
      })
    );

    const cleared = analyticsReducer(withKpi, clearKPIs());
    expect(cleared.realtimeKPIs).toEqual({});
    expect(cleared.lastUpdate).toBeNull();
  });

  it('selector returns analytics connection status', () => {
    const state: { analytics: AnalyticsState } = {
      analytics: {
        realtimeKPIs: {},
        connectionStatus: 'connected',
        lastUpdate: null,
        activeUsers: 0,
        error: null,
      },
    };

    expect(selectConnectionStatus(state)).toBe('connected');
  });
});
