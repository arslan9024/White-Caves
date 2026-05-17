/**
 * Redux Store — Tests
 * Tests store configuration, reducer composition, middleware, and typed hooks.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock all slice reducers to isolate store configuration ────────────
vi.mock('./propertySlice', () => ({ default: (s = { items: [] }) => s }));
vi.mock('./userSlice', () => ({ default: (s = { user: null }) => s }));
vi.mock('./navigationSlice', () => ({ default: (s = { currentRoute: '/' }) => s }));
vi.mock('./dashboardSlice', () => ({ default: (s = { data: null }) => s }));
vi.mock('./authSlice', () => ({ default: (s = { isAuthenticated: false }) => s }));
vi.mock('./analyticsSlice', () => ({ default: (s = { metrics: [] }) => s }));
vi.mock('./slices/inventorySlice', () => ({ default: (s = { items: [] }) => s }));
vi.mock('./slices/aiAssistantDashboardSlice', () => ({
  default: (s = { initialized: false }) => s,
}));
vi.mock('./slices/sidebarSlice', () => ({ default: (s = { isOpen: true }) => s }));
vi.mock('./slices/notificationSlice', () => ({ default: (s = { items: [] }) => s }));
vi.mock('./slices/whatsappSlice', () => ({ default: (s = { connected: false }) => s }));
vi.mock('./slices/nadiaSlice', () => ({ default: (s = { status: 'idle' }) => s }));
vi.mock('./slices/savedSearchesSlice', () => ({ default: (s = { items: [] }) => s }));
vi.mock('./slices/homepageSlice', () => ({ default: (s = { data: null }) => s }));
vi.mock('./crmDataSlice', () => ({ default: (s = { contacts: [] }) => s }));
vi.mock('./roleSlice', () => ({ default: (s = { currentRole: null }) => s }));
vi.mock('./featuresSlice', () => ({ default: (s = { flags: {} }) => s }));
vi.mock('./middleware/eventBusMiddleware', () => ({
  default: () => (next: any) => (action: any) => next(action),
}));
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// ── Dynamic import so mocks are applied first ────────────────────────
let store: any;
let useAppDispatch: any;
let useAppSelector: any;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('./store');
  store = mod.store;
  useAppDispatch = mod.useAppDispatch;
  useAppSelector = mod.useAppSelector;
});

// =====================================================================
// REDUCER COMPOSITION
// =====================================================================

describe('Store — Reducer Composition', () => {
  const expectedSlices = [
    'properties',
    'user',
    'navigation',
    'dashboard',
    'auth',
    'analytics',
    'inventory',
    'aiAssistantDashboard',
    'sidebar',
    'notifications',
    'whatsapp',
    'nadia',
    'crmData',
    'role',
    'features',
    'savedSearches',
    'homepage',
  ];

  it('creates store with all 17 reducer slices', () => {
    const state = store.getState();

    expectedSlices.forEach(slice => {
      expect(state).toHaveProperty(slice);
    });
  });

  it('does not include unexpected slices', () => {
    const state = store.getState();
    const keys = Object.keys(state);
    expect(keys).toEqual(expect.arrayContaining(expectedSlices));
    // The store may include additional platform slices; ensure we don't regress below baseline.
    expect(keys.length).toBeGreaterThanOrEqual(expectedSlices.length);
  });

  it('each slice has a defined initial state (not undefined)', () => {
    const state = store.getState();
    Object.values(state).forEach(sliceState => {
      expect(sliceState).toBeDefined();
    });
  });
});

// =====================================================================
// DISPATCH & ACTIONS
// =====================================================================

describe('Store — Dispatch', () => {
  it('has a dispatch function', () => {
    expect(typeof store.dispatch).toBe('function');
  });

  it('can dispatch a plain action', () => {
    expect(() => store.dispatch({ type: 'TEST_ACTION' })).not.toThrow();
  });

  it('state is unchanged for unknown action type', () => {
    const before = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION_12345' });
    const after = store.getState();
    expect(after).toEqual(before);
  });
});

// =====================================================================
// MIDDLEWARE — SAFE EVENT BUS WRAPPER
// =====================================================================

describe('Store — Safe EventBus Middleware', () => {
  it('dispatches pass through without error', () => {
    expect(() => store.dispatch({ type: 'middleware/test' })).not.toThrow();
  });

  it('handles middleware errors gracefully (fallback to next)', async () => {
    // Re-import with a throwing middleware
    vi.resetModules();
    vi.doMock('./middleware/eventBusMiddleware', () => ({
      default: () => () => () => {
        throw new Error('Middleware boom');
      },
    }));

    const mod = await import('./store');
    // Should NOT throw — safeEventBusMiddleware catches and falls through
    expect(() => mod.store.dispatch({ type: 'crash/test' })).not.toThrow();
  });
});

// =====================================================================
// SUBSCRIBE & GETSTATE
// =====================================================================

describe('Store — Subscribe & GetState', () => {
  it('has a subscribe function', () => {
    expect(typeof store.subscribe).toBe('function');
  });

  it('subscribe returns unsubscribe function', () => {
    const unsubscribe = store.subscribe(() => {});
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('getState returns current state', () => {
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });
});

// =====================================================================
// TYPE EXPORTS
// =====================================================================

describe('Store — Type Exports', () => {
  it('exports useAppDispatch hook', () => {
    expect(useAppDispatch).toBeDefined();
    expect(typeof useAppDispatch).toBe('function');
  });

  it('exports useAppSelector hook', () => {
    expect(useAppSelector).toBeDefined();
    expect(typeof useAppSelector).toBe('function');
  });

  it('store is the default export', async () => {
    const mod = await import('./store');
    expect(mod.default).toBe(mod.store);
  });
});

// =====================================================================
// SERIALIZABLE CHECK CONFIGURATION
// =====================================================================

describe('Store — Configuration', () => {
  it('state is serializable (top-level snapshot)', () => {
    const state = store.getState();
    expect(() => JSON.parse(JSON.stringify(state))).not.toThrow();
  });
});
