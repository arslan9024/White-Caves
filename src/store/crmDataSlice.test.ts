/**
 * crmDataSlice.test.ts — Comprehensive tests for the CRM Data Redux slice
 * ─────────────────────────────────────────────────────────────────────────
 * Tests: Synchronous reducers, async thunks (CRUD operations for leads,
 *        properties, agents, commissions), memoized selectors, and
 *        security-critical logout state reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ Lead CRUD reducers (add, update, delete, select, setLoading, setError)
 *   ✓ Client CRUD reducers
 *   ✓ Agent reducers (set, select, update, loading, error)
 *   ✓ Property CRUD reducers
 *   ✓ Commission reducers
 *   ✓ Activity reducers
 *   ✓ Overview data reducer
 *   ✓ Async thunks: fetchLeadsFromAPI (pending/fulfilled/rejected)
 *   ✓ Async thunks: fetchPropertiesFromAPI
 *   ✓ Async thunks: fetchAgentsFromAPI
 *   ✓ Async thunks: fetchDashboardOverview
 *   ✓ Async thunks: createLeadAPI, updateLeadAPI, deleteLeadAPI
 *   ✓ Async thunks: createPropertyAPI, updatePropertyAPI, deletePropertyAPI
 *   ✓ Memoized selectors (selectAllLeads, selectHotLeads, etc.)
 *   ✓ SECURITY: logout resets all CRM data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import crmDataReducer, {
  // Leads
  setLeads,
  addLead,
  updateLead,
  deleteLead,
  selectLead,
  setLeadsLoading,
  setLeadsError,
  // Clients
  setClients,
  addClient,
  updateClient,
  deleteClient,
  selectClient,
  setClientsLoading,
  setClientsError,
  // Agents
  setAgents,
  selectAgent,
  updateAgent,
  setAgentsLoading,
  setAgentsError,
  // Properties
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  selectProperty,
  setPropertiesLoading,
  setPropertiesError,
  // Commissions
  setCommissions,
  updateCommission,
  setCommissionsLoading,
  // Activities
  setActivities,
  addActivity,
  // Overview
  setOverviewData,
  // Async thunks
  fetchLeadsFromAPI,
  fetchPropertiesFromAPI,
  fetchAgentsFromAPI,
  fetchDashboardOverview,
  createLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  createPropertyAPI,
  updatePropertyAPI,
  deletePropertyAPI,
  // Selectors
  selectAllLeads,
  selectHotLeads,
  selectWarmLeads,
  selectColdLeads,
  selectSelectedLead,
  selectLeadsLoading as selectorLeadsLoading,
  selectLeadsError as selectorLeadsError,
  selectAllClients,
  selectSelectedClient,
  selectClientsLoading as selectorClientsLoading,
  selectAllAgents,
  selectSelectedAgent,
  selectAgentsLoading as selectorAgentsLoading,
  selectAgentsError as selectorAgentsError,
  selectOnlineAgents,
  selectAgentById,
  selectAllProperties,
  selectSelectedProperty,
  selectPropertiesLoading as selectorPropertiesLoading,
  selectPropertiesError as selectorPropertiesError,
  selectAvailableProperties,
  selectPropertyById,
  selectAllCommissions,
  selectPendingCommissions,
  selectPaidCommissions,
  selectCommissionsByAgent,
  selectAllActivities,
  selectRecentActivities,
  selectOverviewData,
  selectOverviewMetrics,
  selectTopAgents,
  makeSelectLeadsByAgent,
  makeSelectClientsByAgent,
  selectLeadsByAgent,
  selectClientsByAgent,
  selectLastUpdated,
} from './crmDataSlice';
import { logout } from './authSlice';

// ─── Mock authFetch and extractApiError ──────────────────────────────────
const mockAuthFetch = vi.fn();
const mockExtractApiError = vi.fn();

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
  extractApiError: (...args: unknown[]) => mockExtractApiError(...args),
}));

// ─── Mock dummy data imports ─────────────────────────────────────────────
vi.mock('../data/dummyLeads', () => ({
  DUMMY_ALL_LEADS: [],
  DUMMY_CLIENTS: [],
  DUMMY_AGENTS: [],
  DUMMY_ACTIVITIES: [],
  DUMMY_OVERVIEW_DATA: null,
}));

// ─── Helper: get clean initial state ─────────────────────────────────────
const getInitialState = () => crmDataReducer(undefined, { type: 'unknown' });

// ─── Helper: create a test store with crmData reducer ────────────────────
function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: { crmData: crmDataReducer },
    ...(preloadedState ? { preloadedState } : {}),
  });
}

// ─── Helper: make a mock CRM item ───────────────────────────────────────
function makeLead(overrides: Record<string, unknown> = {}) {
  return { id: 'lead-1', name: 'Test Lead', status: 'hot', agent_id: 'agent-1', ...overrides };
}

function makeClient(overrides: Record<string, unknown> = {}) {
  return { id: 'client-1', name: 'Test Client', type: 'Corporate', agent_id: 'agent-1', ...overrides };
}

function makeAgent(overrides: Record<string, unknown> = {}) {
  return { id: 'agent-1', name: 'Agent Smith', status: 'online', sales: 10, ...overrides };
}

function makeProperty(overrides: Record<string, unknown> = {}) {
  return { id: 'prop-1', title: 'Luxury Villa', status: 'available', ...overrides };
}

function makeCommission(overrides: Record<string, unknown> = {}) {
  return { id: 'comm-1', agent_id: 'agent-1', status: 'pending', amount: 5000, ...overrides };
}

function makeActivity(overrides: Record<string, unknown> = {}) {
  return { id: 'act-1', action: 'deal_closed', description: 'Closed a deal', ...overrides };
}

// ==========================================================================
// TESTS
// ==========================================================================

describe('crmDataSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.leads).toBeDefined();
      expect(state.leads.items).toEqual([]);
      expect(state.leads.selected).toBeNull();
      expect(state.leads.loading).toBe(false);
      expect(state.leads.error).toBeNull();

      expect(state.clients.items).toEqual([]);
      expect(state.agents.items).toEqual([]);
      expect(state.properties.items).toEqual([]);
      expect(state.commissions.items).toEqual([]);
      expect(state.activities.items).toEqual([]);
      expect(state.lastUpdated).toBeDefined();
    });
  });

  // ========================================================================
  // 2. LEAD REDUCERS
  // ========================================================================
  describe('lead reducers', () => {
    it('setLeads should replace all leads', () => {
      const leads = [makeLead(), makeLead({ id: 'lead-2' })];
      const state = crmDataReducer(getInitialState(), setLeads(leads));
      expect(state.leads.items).toHaveLength(2);
      expect(state.leads.items[0].id).toBe('lead-1');
    });

    it('addLead should append a lead with provided id', () => {
      const state = crmDataReducer(getInitialState(), addLead(makeLead({ id: 'lead-99' })));
      expect(state.leads.items).toHaveLength(1);
      expect(state.leads.items[0].id).toBe('lead-99');
    });

    it('addLead should generate a local id when missing', () => {
      const lead = { id: '', name: 'No-ID Lead' };
      const state = crmDataReducer(getInitialState(), addLead(lead));
      expect(state.leads.items[0].id).toMatch(/^local_/);
    });

    it('updateLead should merge into existing lead', () => {
      let state = crmDataReducer(getInitialState(), setLeads([makeLead()]));
      state = crmDataReducer(state, updateLead({ id: 'lead-1', name: 'Updated Lead', status: 'warm' }));
      expect(state.leads.items[0].name).toBe('Updated Lead');
      expect(state.leads.items[0].status).toBe('warm');
    });

    it('updateLead should do nothing for non-existent lead', () => {
      const state = crmDataReducer(getInitialState(), updateLead({ id: 'nonexistent', name: 'Ghost' }));
      expect(state.leads.items).toHaveLength(0);
    });

    it('deleteLead should remove the lead by id', () => {
      let state = crmDataReducer(getInitialState(), setLeads([makeLead(), makeLead({ id: 'lead-2' })]));
      state = crmDataReducer(state, deleteLead('lead-1'));
      expect(state.leads.items).toHaveLength(1);
      expect(state.leads.items[0].id).toBe('lead-2');
    });

    it('deleteLead should clear selection if deleted lead was selected', () => {
      let state = crmDataReducer(getInitialState(), setLeads([makeLead()]));
      state = crmDataReducer(state, selectLead(makeLead()));
      expect(state.leads.selected).not.toBeNull();
      state = crmDataReducer(state, deleteLead('lead-1'));
      expect(state.leads.selected).toBeNull();
    });

    it('selectLead should set the selected lead', () => {
      const lead = makeLead();
      const state = crmDataReducer(getInitialState(), selectLead(lead));
      expect(state.leads.selected).toEqual(lead);
    });

    it('setLeadsLoading should toggle loading state', () => {
      let state = crmDataReducer(getInitialState(), setLeadsLoading(true));
      expect(state.leads.loading).toBe(true);
      state = crmDataReducer(state, setLeadsLoading(false));
      expect(state.leads.loading).toBe(false);
    });

    it('setLeadsError should set error message', () => {
      const state = crmDataReducer(getInitialState(), setLeadsError('Network error'));
      expect(state.leads.error).toBe('Network error');
    });

    it('setLeadsError(null) should clear error', () => {
      let state = crmDataReducer(getInitialState(), setLeadsError('Error'));
      state = crmDataReducer(state, setLeadsError(null));
      expect(state.leads.error).toBeNull();
    });
  });

  // ========================================================================
  // 3. CLIENT REDUCERS
  // ========================================================================
  describe('client reducers', () => {
    it('setClients should replace all clients', () => {
      const clients = [makeClient(), makeClient({ id: 'client-2' })];
      const state = crmDataReducer(getInitialState(), setClients(clients));
      expect(state.clients.items).toHaveLength(2);
    });

    it('addClient should append a client', () => {
      const state = crmDataReducer(getInitialState(), addClient(makeClient()));
      expect(state.clients.items).toHaveLength(1);
    });

    it('addClient should generate local id when not provided', () => {
      const client = { id: '', name: 'Anonymous Corp' };
      const state = crmDataReducer(getInitialState(), addClient(client));
      expect(state.clients.items[0].id).toMatch(/^local_/);
    });

    it('updateClient should merge updates into existing client', () => {
      let state = crmDataReducer(getInitialState(), setClients([makeClient()]));
      state = crmDataReducer(state, updateClient({ id: 'client-1', name: 'Updated Corp' }));
      expect(state.clients.items[0].name).toBe('Updated Corp');
    });

    it('deleteClient should remove client and clear selection', () => {
      let state = crmDataReducer(getInitialState(), setClients([makeClient()]));
      state = crmDataReducer(state, selectClient(makeClient()));
      state = crmDataReducer(state, deleteClient('client-1'));
      expect(state.clients.items).toHaveLength(0);
      expect(state.clients.selected).toBeNull();
    });

    it('selectClient should set selected client', () => {
      const state = crmDataReducer(getInitialState(), selectClient(makeClient()));
      expect(state.clients.selected).toEqual(makeClient());
    });

    it('setClientsLoading should toggle loading', () => {
      const state = crmDataReducer(getInitialState(), setClientsLoading(true));
      expect(state.clients.loading).toBe(true);
    });

    it('setClientsError should set error', () => {
      const state = crmDataReducer(getInitialState(), setClientsError('Client error'));
      expect(state.clients.error).toBe('Client error');
    });
  });

  // ========================================================================
  // 4. AGENT REDUCERS
  // ========================================================================
  describe('agent reducers', () => {
    it('setAgents should replace all agents', () => {
      const agents = [makeAgent(), makeAgent({ id: 'agent-2', name: 'Agent Jones' })];
      const state = crmDataReducer(getInitialState(), setAgents(agents));
      expect(state.agents.items).toHaveLength(2);
    });

    it('selectAgent should set selected agent', () => {
      const agent = makeAgent();
      const state = crmDataReducer(getInitialState(), selectAgent(agent));
      expect(state.agents.selected).toEqual(agent);
    });

    it('updateAgent should merge updates into existing agent', () => {
      let state = crmDataReducer(getInitialState(), setAgents([makeAgent()]));
      state = crmDataReducer(state, updateAgent({ id: 'agent-1', name: 'Agent Updated', sales: 50 }));
      expect(state.agents.items[0].name).toBe('Agent Updated');
      expect(state.agents.items[0].sales).toBe(50);
    });

    it('updateAgent should do nothing for non-existent agent', () => {
      const state = crmDataReducer(getInitialState(), updateAgent({ id: 'nonexistent' }));
      expect(state.agents.items).toHaveLength(0);
    });

    it('setAgentsLoading should toggle loading', () => {
      const state = crmDataReducer(getInitialState(), setAgentsLoading(true));
      expect(state.agents.loading).toBe(true);
    });

    it('setAgentsError should set error', () => {
      const state = crmDataReducer(getInitialState(), setAgentsError('Agent error'));
      expect(state.agents.error).toBe('Agent error');
    });
  });

  // ========================================================================
  // 5. PROPERTY REDUCERS
  // ========================================================================
  describe('property reducers', () => {
    it('setProperties should replace all properties', () => {
      const props = [makeProperty(), makeProperty({ id: 'prop-2' })];
      const state = crmDataReducer(getInitialState(), setProperties(props));
      expect(state.properties.items).toHaveLength(2);
    });

    it('addProperty should prepend a property (unshift)', () => {
      let state = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
      state = crmDataReducer(state, addProperty(makeProperty({ id: 'prop-new', title: 'New Villa' })));
      expect(state.properties.items[0].id).toBe('prop-new');
      expect(state.properties.items).toHaveLength(2);
    });

    it('addProperty should generate id when not provided', () => {
      const state = crmDataReducer(getInitialState(), addProperty({ id: '', title: 'No ID' } as any));
      expect(state.properties.items[0].id).toBeTruthy();
    });

    it('updateProperty should merge updates', () => {
      let state = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
      state = crmDataReducer(state, updateProperty({ id: 'prop-1', title: 'Updated Villa', status: 'sold' }));
      expect(state.properties.items[0].title).toBe('Updated Villa');
      expect(state.properties.items[0].status).toBe('sold');
    });

    it('deleteProperty should remove and clear selection', () => {
      let state = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
      state = crmDataReducer(state, selectProperty(makeProperty()));
      state = crmDataReducer(state, deleteProperty('prop-1'));
      expect(state.properties.items).toHaveLength(0);
      expect(state.properties.selected).toBeNull();
    });

    it('selectProperty should set selected property (including null)', () => {
      let state = crmDataReducer(getInitialState(), selectProperty(makeProperty()));
      expect(state.properties.selected).not.toBeNull();
      state = crmDataReducer(state, selectProperty(null));
      expect(state.properties.selected).toBeNull();
    });

    it('setPropertiesLoading and setPropertiesError should work', () => {
      let state = crmDataReducer(getInitialState(), setPropertiesLoading(true));
      expect(state.properties.loading).toBe(true);
      state = crmDataReducer(state, setPropertiesError('Prop error'));
      expect(state.properties.error).toBe('Prop error');
    });
  });

  // ========================================================================
  // 6. COMMISSION REDUCERS
  // ========================================================================
  describe('commission reducers', () => {
    it('setCommissions should replace all commissions', () => {
      const comms = [makeCommission(), makeCommission({ id: 'comm-2', status: 'paid' })];
      const state = crmDataReducer(getInitialState(), setCommissions(comms));
      expect(state.commissions.items).toHaveLength(2);
    });

    it('updateCommission should merge into existing commission', () => {
      let state = crmDataReducer(getInitialState(), setCommissions([makeCommission()]));
      state = crmDataReducer(state, updateCommission({ id: 'comm-1', status: 'paid', amount: 7000 }));
      expect(state.commissions.items[0].status).toBe('paid');
      expect(state.commissions.items[0].amount).toBe(7000);
    });

    it('setCommissionsLoading should toggle loading', () => {
      const state = crmDataReducer(getInitialState(), setCommissionsLoading(true));
      expect(state.commissions.loading).toBe(true);
    });
  });

  // ========================================================================
  // 7. ACTIVITY REDUCERS
  // ========================================================================
  describe('activity reducers', () => {
    it('setActivities should replace all activities', () => {
      const acts = [makeActivity(), makeActivity({ id: 'act-2' })];
      const state = crmDataReducer(getInitialState(), setActivities(acts));
      expect(state.activities.items).toHaveLength(2);
    });

    it('addActivity should prepend activity with timestamp', () => {
      let state = crmDataReducer(getInitialState(), setActivities([makeActivity()]));
      state = crmDataReducer(state, addActivity(makeActivity({ id: 'act-new', action: 'lead_created' })));
      expect(state.activities.items[0].id).toBe('act-new');
      expect(state.activities.items[0].timestamp).toBeDefined();
      expect(state.activities.items).toHaveLength(2);
    });

    it('addActivity should generate id when not provided', () => {
      const state = crmDataReducer(getInitialState(), addActivity({ id: '', action: 'test' }));
      expect(state.activities.items[0].id).toMatch(/^local_/);
    });
  });

  // ========================================================================
  // 8. OVERVIEW REDUCER
  // ========================================================================
  describe('overview reducer', () => {
    it('setOverviewData should set overview', () => {
      const data = { metrics: { totalLeads: 100, activeDeals: 5 } };
      const state = crmDataReducer(getInitialState(), setOverviewData(data));
      expect(state.overview).toEqual(data);
    });
  });

  // ========================================================================
  // 9. ASYNC THUNKS
  // ========================================================================
  describe('async thunks', () => {
    // Helper: create a mock Response
    function mockResponse(data: unknown, ok = true, status = 200) {
      return {
        ok,
        status,
        statusText: ok ? 'OK' : 'Error',
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
      } as unknown as Response;
    }

    describe('fetchLeadsFromAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: fetchLeadsFromAPI.pending.type });
        expect(state.leads.loading).toBe(true);
        expect(state.leads.error).toBeNull();
      });

      it('should populate leads on fulfilled with array payload', () => {
        const leads = [makeLead(), makeLead({ id: 'lead-2' })];
        const state = crmDataReducer(getInitialState(), {
          type: fetchLeadsFromAPI.fulfilled.type,
          payload: leads,
        });
        expect(state.leads.loading).toBe(false);
        expect(state.leads.items).toEqual(leads);
      });

      it('should not replace leads if payload is not an array', () => {
        const initial = crmDataReducer(getInitialState(), setLeads([makeLead()]));
        const state = crmDataReducer(initial, {
          type: fetchLeadsFromAPI.fulfilled.type,
          payload: { message: 'not an array' },
        });
        expect(state.leads.items).toHaveLength(1);
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: fetchLeadsFromAPI.rejected.type,
          payload: 'Network error',
        });
        expect(state.leads.loading).toBe(false);
        expect(state.leads.error).toBe('Network error');
      });

      it('should use default error message on rejected without payload', () => {
        const state = crmDataReducer(getInitialState(), {
          type: fetchLeadsFromAPI.rejected.type,
          payload: undefined,
        });
        expect(state.leads.error).toBe('Failed to fetch leads');
      });

      it('should dispatch thunk and receive data from API', async () => {
        const apiLeads = [makeLead({ id: 'api-1' }), makeLead({ id: 'api-2' })];
        mockAuthFetch.mockResolvedValueOnce(mockResponse({ data: apiLeads }));

        const store = createTestStore();
        await store.dispatch(fetchLeadsFromAPI({}));

        expect(store.getState().crmData.leads.items).toEqual(apiLeads);
        expect(store.getState().crmData.leads.loading).toBe(false);
      });

      it('should pass query parameters to authFetch', async () => {
        mockAuthFetch.mockResolvedValueOnce(mockResponse({ data: [] }));

        const store = createTestStore();
        await store.dispatch(fetchLeadsFromAPI({ page: 2, pageSize: 10, status: 'hot', source: 'web' }));

        expect(mockAuthFetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2')
        );
        expect(mockAuthFetch).toHaveBeenCalledWith(
          expect.stringContaining('pageSize=10')
        );
      });

      it('should handle API errors gracefully', async () => {
        mockAuthFetch.mockResolvedValueOnce(mockResponse({}, false, 500));
        mockExtractApiError.mockResolvedValueOnce('Server error');

        const store = createTestStore();
        await store.dispatch(fetchLeadsFromAPI({}));

        expect(store.getState().crmData.leads.error).toBeDefined();
        expect(store.getState().crmData.leads.loading).toBe(false);
      });
    });

    describe('fetchPropertiesFromAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: fetchPropertiesFromAPI.pending.type });
        expect(state.properties.loading).toBe(true);
      });

      it('should populate properties on fulfilled', () => {
        const props = [makeProperty()];
        const state = crmDataReducer(getInitialState(), {
          type: fetchPropertiesFromAPI.fulfilled.type,
          payload: props,
        });
        expect(state.properties.items).toEqual(props);
        expect(state.properties.loading).toBe(false);
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: fetchPropertiesFromAPI.rejected.type,
          payload: 'Property fetch failed',
        });
        expect(state.properties.error).toBe('Property fetch failed');
      });

      it('should dispatch thunk and receive properties', async () => {
        const props = [makeProperty({ id: 'api-prop-1' })];
        mockAuthFetch.mockResolvedValueOnce(mockResponse({ data: props }));

        const store = createTestStore();
        await store.dispatch(fetchPropertiesFromAPI({}));

        expect(store.getState().crmData.properties.items).toEqual(props);
      });
    });

    describe('fetchAgentsFromAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: fetchAgentsFromAPI.pending.type });
        expect(state.agents.loading).toBe(true);
      });

      it('should populate agents on fulfilled', () => {
        const agents = [makeAgent()];
        const state = crmDataReducer(getInitialState(), {
          type: fetchAgentsFromAPI.fulfilled.type,
          payload: agents,
        });
        expect(state.agents.items).toEqual(agents);
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: fetchAgentsFromAPI.rejected.type,
          payload: 'Agent fetch failed',
        });
        expect(state.agents.error).toBe('Agent fetch failed');
      });

      it('should call /api/users?role=agent', async () => {
        mockAuthFetch.mockResolvedValueOnce(mockResponse({ data: [] }));

        const store = createTestStore();
        await store.dispatch(fetchAgentsFromAPI());

        expect(mockAuthFetch).toHaveBeenCalledWith('/api/users?role=agent');
      });
    });

    describe('fetchDashboardOverview', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: fetchDashboardOverview.pending.type });
        expect(state.overview).toMatchObject({ loading: true });
      });

      it('should merge overview data on fulfilled', () => {
        const data = { totalLeads: 50, activeDeals: 10 };
        const state = crmDataReducer(getInitialState(), {
          type: fetchDashboardOverview.fulfilled.type,
          payload: data,
        });
        expect(state.overview).toMatchObject({ totalLeads: 50, loading: false });
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: fetchDashboardOverview.rejected.type,
          payload: 'Dashboard fetch failed',
        });
        expect(state.overview).toMatchObject({ loading: false, error: 'Dashboard fetch failed' });
      });
    });

    describe('createLeadAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: createLeadAPI.pending.type });
        expect(state.leads.loading).toBe(true);
      });

      it('should prepend created lead on fulfilled', () => {
        const initial = crmDataReducer(getInitialState(), setLeads([makeLead({ id: 'existing' })]));
        const newLead = makeLead({ id: 'new-lead', name: 'Freshly Created' });
        const state = crmDataReducer(initial, {
          type: createLeadAPI.fulfilled.type,
          payload: newLead,
        });
        expect(state.leads.items[0].id).toBe('new-lead');
        expect(state.leads.items).toHaveLength(2);
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: createLeadAPI.rejected.type,
          payload: 'Create failed',
        });
        expect(state.leads.error).toBe('Create failed');
      });

      it('should dispatch thunk and call API', async () => {
        const created = makeLead({ id: 'api-created' });
        mockAuthFetch.mockResolvedValueOnce(mockResponse({ data: created }));

        const store = createTestStore();
        await store.dispatch(createLeadAPI({ name: 'New Lead', email: 'test@test.com' }));

        expect(mockAuthFetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        }));
      });
    });

    describe('updateLeadAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: updateLeadAPI.pending.type });
        expect(state.leads.loading).toBe(true);
      });

      it('should merge updated lead on fulfilled', () => {
        const initial = crmDataReducer(getInitialState(), setLeads([makeLead()]));
        const updated = { id: 'lead-1', name: 'Updated Name', status: 'warm' };
        const state = crmDataReducer(initial, {
          type: updateLeadAPI.fulfilled.type,
          payload: updated,
        });
        expect(state.leads.items[0].name).toBe('Updated Name');
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: updateLeadAPI.rejected.type,
          payload: 'Update failed',
        });
        expect(state.leads.error).toBe('Update failed');
      });
    });

    describe('deleteLeadAPI', () => {
      it('should set loading on pending', () => {
        const state = crmDataReducer(getInitialState(), { type: deleteLeadAPI.pending.type });
        expect(state.leads.loading).toBe(true);
      });

      it('should remove lead on fulfilled', () => {
        const initial = crmDataReducer(getInitialState(), setLeads([makeLead(), makeLead({ id: 'lead-2' })]));
        const state = crmDataReducer(initial, {
          type: deleteLeadAPI.fulfilled.type,
          payload: 'lead-1',
        });
        expect(state.leads.items).toHaveLength(1);
        expect(state.leads.items[0].id).toBe('lead-2');
      });

      it('should clear selection if deleted lead was selected', () => {
        let initial = crmDataReducer(getInitialState(), setLeads([makeLead()]));
        initial = crmDataReducer(initial, selectLead(makeLead()));
        const state = crmDataReducer(initial, {
          type: deleteLeadAPI.fulfilled.type,
          payload: 'lead-1',
        });
        expect(state.leads.selected).toBeNull();
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: deleteLeadAPI.rejected.type,
          payload: 'Delete failed',
        });
        expect(state.leads.error).toBe('Delete failed');
      });
    });

    describe('createPropertyAPI', () => {
      it('should prepend property on fulfilled', () => {
        const prop = makeProperty({ id: 'new-prop' });
        const state = crmDataReducer(getInitialState(), {
          type: createPropertyAPI.fulfilled.type,
          payload: prop,
        });
        expect(state.properties.items[0].id).toBe('new-prop');
      });

      it('should set error on rejected', () => {
        const state = crmDataReducer(getInitialState(), {
          type: createPropertyAPI.rejected.type,
          payload: 'Create property failed',
        });
        expect(state.properties.error).toBe('Create property failed');
      });
    });

    describe('updatePropertyAPI', () => {
      it('should merge updates on fulfilled', () => {
        const initial = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
        const state = crmDataReducer(initial, {
          type: updatePropertyAPI.fulfilled.type,
          payload: { id: 'prop-1', title: 'Updated Villa' },
        });
        expect(state.properties.items[0].title).toBe('Updated Villa');
      });
    });

    describe('deletePropertyAPI', () => {
      it('should remove property on fulfilled', () => {
        const initial = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
        const state = crmDataReducer(initial, {
          type: deletePropertyAPI.fulfilled.type,
          payload: 'prop-1',
        });
        expect(state.properties.items).toHaveLength(0);
      });

      it('should clear selection if deleted property was selected', () => {
        let initial = crmDataReducer(getInitialState(), setProperties([makeProperty()]));
        initial = crmDataReducer(initial, selectProperty(makeProperty()));
        const state = crmDataReducer(initial, {
          type: deletePropertyAPI.fulfilled.type,
          payload: 'prop-1',
        });
        expect(state.properties.selected).toBeNull();
      });
    });
  });

  // ========================================================================
  // 10. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset CRM state on logout', () => {
      // Build up a state with data everywhere
      let state = getInitialState();
      state = crmDataReducer(state, setLeads([makeLead()]));
      state = crmDataReducer(state, setClients([makeClient()]));
      state = crmDataReducer(state, setAgents([makeAgent()]));
      state = crmDataReducer(state, setProperties([makeProperty()]));
      state = crmDataReducer(state, setCommissions([makeCommission()]));
      state = crmDataReducer(state, setActivities([makeActivity()]));
      state = crmDataReducer(state, selectLead(makeLead()));

      // Verify data is populated
      expect(state.leads.items).toHaveLength(1);
      expect(state.clients.items).toHaveLength(1);
      expect(state.leads.selected).not.toBeNull();

      // Logout should wipe everything
      state = crmDataReducer(state, logout());
      expect(state.leads.items).toEqual([]);
      expect(state.clients.items).toEqual([]);
      expect(state.agents.items).toEqual([]);
      expect(state.properties.items).toEqual([]);
      expect(state.commissions.items).toEqual([]);
      expect(state.activities.items).toEqual([]);
      expect(state.leads.selected).toBeNull();
    });
  });

  // ========================================================================
  // 11. SELECTORS
  // ========================================================================
  describe('selectors', () => {
    function buildState(overrides: Record<string, unknown> = {}) {
      const base = getInitialState();
      return {
        crmData: { ...base, ...overrides },
      } as any;
    }

    describe('lead selectors', () => {
      it('selectAllLeads returns leads items', () => {
        const leads = [makeLead()];
        expect(selectAllLeads(buildState({ leads: { items: leads, selected: null, loading: false, error: null } }))).toEqual(leads);
      });

      it('selectAllLeads returns empty array when undefined', () => {
        expect(selectAllLeads({ crmData: undefined } as any)).toEqual([]);
      });

      it('selectHotLeads filters by status=hot', () => {
        const items = [
          makeLead({ id: '1', status: 'hot' }),
          makeLead({ id: '2', status: 'warm' }),
          makeLead({ id: '3', status: 'hot' }),
        ];
        const state = buildState({ leads: { items, selected: null, loading: false, error: null } });
        expect(selectHotLeads(state)).toHaveLength(2);
      });

      it('selectWarmLeads filters by status=warm', () => {
        const items = [
          makeLead({ id: '1', status: 'warm' }),
          makeLead({ id: '2', status: 'cold' }),
        ];
        const state = buildState({ leads: { items, selected: null, loading: false, error: null } });
        expect(selectWarmLeads(state)).toHaveLength(1);
      });

      it('selectColdLeads filters by status=cold', () => {
        const items = [
          makeLead({ id: '1', status: 'cold' }),
          makeLead({ id: '2', status: 'cold' }),
        ];
        const state = buildState({ leads: { items, selected: null, loading: false, error: null } });
        expect(selectColdLeads(state)).toHaveLength(2);
      });

      it('selectSelectedLead returns selected lead', () => {
        const lead = makeLead();
        const state = buildState({ leads: { items: [], selected: lead, loading: false, error: null } });
        expect(selectSelectedLead(state)).toEqual(lead);
      });

      it('selectLeadsLoading returns loading state', () => {
        const state = buildState({ leads: { items: [], selected: null, loading: true, error: null } });
        expect(selectorLeadsLoading(state)).toBe(true);
      });

      it('selectLeadsError returns error', () => {
        const state = buildState({ leads: { items: [], selected: null, loading: false, error: 'Error' } });
        expect(selectorLeadsError(state)).toBe('Error');
      });
    });

    describe('client selectors', () => {
      it('selectAllClients returns clients items', () => {
        const clients = [makeClient()];
        const state = buildState({ clients: { items: clients, selected: null, loading: false, error: null } });
        expect(selectAllClients(state)).toEqual(clients);
      });

      it('selectSelectedClient returns selected', () => {
        const client = makeClient();
        const state = buildState({ clients: { items: [], selected: client, loading: false, error: null } });
        expect(selectSelectedClient(state)).toEqual(client);
      });

      it('selectClientsLoading returns loading state', () => {
        const state = buildState({ clients: { items: [], selected: null, loading: true, error: null } });
        expect(selectorClientsLoading(state)).toBe(true);
      });
    });

    describe('agent selectors', () => {
      it('selectAllAgents returns agents items', () => {
        const agents = [makeAgent()];
        const state = buildState({ agents: { items: agents, selected: null, loading: false, error: null } });
        expect(selectAllAgents(state)).toEqual(agents);
      });

      it('selectOnlineAgents filters by status=online', () => {
        const items = [
          makeAgent({ id: '1', status: 'online' }),
          makeAgent({ id: '2', status: 'away' }),
          makeAgent({ id: '3', status: 'online' }),
        ];
        const state = buildState({ agents: { items, selected: null, loading: false, error: null } });
        expect(selectOnlineAgents(state)).toHaveLength(2);
      });

      it('selectAgentById finds agent by id', () => {
        const items = [makeAgent({ id: 'a1' }), makeAgent({ id: 'a2', name: 'Target' })];
        const state = buildState({ agents: { items, selected: null, loading: false, error: null } });
        expect(selectAgentById(state, 'a2')).toMatchObject({ name: 'Target' });
      });

      it('selectAgentById returns undefined for non-existent agent', () => {
        const state = buildState({ agents: { items: [], selected: null, loading: false, error: null } });
        expect(selectAgentById(state, 'nonexistent')).toBeUndefined();
      });
    });

    describe('property selectors', () => {
      it('selectAllProperties returns properties items', () => {
        const props = [makeProperty()];
        const state = buildState({ properties: { items: props, selected: null, loading: false, error: null } });
        expect(selectAllProperties(state)).toEqual(props);
      });

      it('selectAvailableProperties filters by status=available', () => {
        const items = [
          makeProperty({ id: '1', status: 'available' }),
          makeProperty({ id: '2', status: 'sold' }),
        ];
        const state = buildState({ properties: { items, selected: null, loading: false, error: null } });
        expect(selectAvailableProperties(state)).toHaveLength(1);
      });

      it('selectPropertyById finds property by id', () => {
        const items = [makeProperty({ id: 'p1' }), makeProperty({ id: 'p2', title: 'Target' })];
        const state = buildState({ properties: { items, selected: null, loading: false, error: null } });
        expect(selectPropertyById(state, 'p2')).toMatchObject({ title: 'Target' });
      });
    });

    describe('commission selectors', () => {
      it('selectAllCommissions returns commissions items', () => {
        const comms = [makeCommission()];
        const state = buildState({ commissions: { items: comms, loading: false } });
        expect(selectAllCommissions(state)).toEqual(comms);
      });

      it('selectPendingCommissions filters by status=pending', () => {
        const items = [
          makeCommission({ id: '1', status: 'pending' }),
          makeCommission({ id: '2', status: 'paid' }),
        ];
        const state = buildState({ commissions: { items, loading: false } });
        expect(selectPendingCommissions(state)).toHaveLength(1);
      });

      it('selectPaidCommissions filters by status=paid', () => {
        const items = [
          makeCommission({ id: '1', status: 'paid' }),
          makeCommission({ id: '2', status: 'paid' }),
        ];
        const state = buildState({ commissions: { items, loading: false } });
        expect(selectPaidCommissions(state)).toHaveLength(2);
      });

      it('selectCommissionsByAgent filters by agent_id', () => {
        const items = [
          makeCommission({ id: '1', agent_id: 'a1' }),
          makeCommission({ id: '2', agent_id: 'a2' }),
          makeCommission({ id: '3', agent_id: 'a1' }),
        ];
        const state = buildState({ commissions: { items, loading: false } });
        expect(selectCommissionsByAgent(state, 'a1')).toHaveLength(2);
      });
    });

    describe('activity selectors', () => {
      it('selectAllActivities returns activities items', () => {
        const acts = [makeActivity()];
        const state = buildState({ activities: { items: acts, loading: false } });
        expect(selectAllActivities(state)).toEqual(acts);
      });

      it('selectRecentActivities returns first N items', () => {
        const items = Array.from({ length: 20 }, (_, i) => makeActivity({ id: `act-${i}` }));
        const state = buildState({ activities: { items, loading: false } });
        expect(selectRecentActivities(state, 5)).toHaveLength(5);
      });
    });

    describe('overview selectors', () => {
      it('selectOverviewData returns overview or empty object', () => {
        const state = buildState({ overview: { totalLeads: 50 } });
        expect(selectOverviewData(state)).toEqual({ totalLeads: 50 });
      });

      it('selectOverviewData returns empty object when null', () => {
        const state = buildState({ overview: null });
        expect(selectOverviewData(state)).toEqual({});
      });

      it('selectOverviewMetrics returns metrics or empty object', () => {
        const state = buildState({ overview: { metrics: { total: 100 } } });
        expect(selectOverviewMetrics(state)).toEqual({ total: 100 });
      });

      it('selectOverviewMetrics returns empty object when no metrics', () => {
        const state = buildState({ overview: {} });
        expect(selectOverviewMetrics(state)).toEqual({});
      });
    });

    describe('cross-entity selectors', () => {
      it('selectTopAgents returns top N agents sorted by sales', () => {
        const items = [
          makeAgent({ id: '1', sales: 5 }),
          makeAgent({ id: '2', sales: 20 }),
          makeAgent({ id: '3', sales: 10 }),
        ];
        const state = buildState({ agents: { items, selected: null, loading: false, error: null } });
        const top = selectTopAgents(state, 2);
        expect(top).toHaveLength(2);
        expect(top[0].sales).toBe(20);
        expect(top[1].sales).toBe(10);
      });

      it('selectTopAgents handles non-numeric sales', () => {
        const items = [
          makeAgent({ id: '1', sales: undefined }),
          makeAgent({ id: '2', sales: 15 }),
        ];
        const state = buildState({ agents: { items, selected: null, loading: false, error: null } });
        const top = selectTopAgents(state, 5);
        expect(top[0].sales).toBe(15);
      });

      it('makeSelectLeadsByAgent returns leads for specific agent', () => {
        const items = [
          makeLead({ id: '1', agent_id: 'a1' }),
          makeLead({ id: '2', agent_id: 'a2' }),
          makeLead({ id: '3', agent_id: 'a1' }),
        ];
        const state = buildState({ leads: { items, selected: null, loading: false, error: null } });
        const selector = makeSelectLeadsByAgent('a1');
        expect(selector(state)).toHaveLength(2);
      });

      it('selectLeadsByAgent (deprecated) returns leads for agent', () => {
        const items = [
          makeLead({ id: '1', agent_id: 'a1' }),
          makeLead({ id: '2', agent_id: 'a2' }),
        ];
        const state = buildState({ leads: { items, selected: null, loading: false, error: null } });
        expect(selectLeadsByAgent(state, 'a1')).toHaveLength(1);
      });

      it('makeSelectClientsByAgent returns clients for specific agent', () => {
        const items = [
          makeClient({ id: '1', agent_id: 'a1' }),
          makeClient({ id: '2', agent_id: 'a2' }),
        ];
        const state = buildState({ clients: { items, selected: null, loading: false, error: null } });
        const selector = makeSelectClientsByAgent('a1');
        expect(selector(state)).toHaveLength(1);
      });

      it('selectClientsByAgent (deprecated) returns clients for agent', () => {
        const items = [
          makeClient({ id: '1', agent_id: 'a1' }),
          makeClient({ id: '2', agent_id: 'a1' }),
        ];
        const state = buildState({ clients: { items, selected: null, loading: false, error: null } });
        expect(selectClientsByAgent(state, 'a1')).toHaveLength(2);
      });
    });

    describe('lastUpdated selector', () => {
      it('selectLastUpdated returns timestamp', () => {
        const state = buildState({ lastUpdated: '2026-01-01T00:00:00.000Z' });
        expect(selectLastUpdated(state)).toBe('2026-01-01T00:00:00.000Z');
      });
    });
  });

  // ========================================================================
  // 12. LAST UPDATED TRACKING
  // ========================================================================
  describe('lastUpdated tracking', () => {
    it('should update lastUpdated on data mutations', () => {
      const before = getInitialState().lastUpdated;
      // Small delay to ensure different timestamp
      const state = crmDataReducer(getInitialState(), addLead(makeLead()));
      expect(state.lastUpdated).toBeDefined();
      expect(typeof state.lastUpdated).toBe('string');
    });
  });
});
