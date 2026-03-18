/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, commissions, activities
 * Now with async thunks for backend API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  DUMMY_ALL_LEADS,
  DUMMY_CLIENTS,
  DUMMY_AGENTS,
  DUMMY_COMMISSIONS,
  DUMMY_ACTIVITIES,
  DUMMY_OVERVIEW_DATA
} from '../data/dummyLeads';

interface CRMItem {
  id: string | number;
  [key: string]: any;
}

interface CRMCollection<T extends CRMItem> {
  items: T[];
  selected: T | null;
  loading: boolean;
  error: string | null;
}

interface CommissionCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface ActivityCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface CRMDataState {
  leads: CRMCollection<CRMItem>;
  clients: CRMCollection<CRMItem>;
  agents: CRMCollection<CRMItem>;
  properties: CRMCollection<CRMItem>;
  commissions: CommissionCollection;
  activities: ActivityCollection;
  overview: any;
  lastUpdated: string;
}

const initialState: CRMDataState = {
  leads: {
    items: DUMMY_ALL_LEADS,
    selected: null,
    loading: false,
    error: null
  },

  clients: {
    items: DUMMY_CLIENTS,
    selected: null,
    loading: false,
    error: null
  },

  agents: {
    items: DUMMY_AGENTS,
    selected: null,
    loading: false,
    error: null
  },

  properties: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },

  commissions: {
    items: DUMMY_COMMISSIONS,
    loading: false,
    error: null
  },

  activities: {
    items: DUMMY_ACTIVITIES,
    loading: false,
    error: null
  },

  overview: DUMMY_OVERVIEW_DATA,

  lastUpdated: new Date().toISOString()
};

// ============================================================================
// ASYNC THUNKS — Backend API Integration
// ============================================================================

/** Fetch all leads from the backend API, falls back to dummy data on error */
export const fetchLeadsFromAPI = createAsyncThunk(
  'crmData/fetchLeads',
  async (params: { page?: number; pageSize?: number; status?: string; source?: string } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
      if (params.status) query.set('status', params.status);
      if (params.source) query.set('source', params.source);
      const response = await fetch(`/api/leads?${query.toString()}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leads');
    }
  }
);

/** Fetch all properties from the backend API */
export const fetchPropertiesFromAPI = createAsyncThunk(
  'crmData/fetchProperties',
  async (params: { page?: number; status?: string; type?: string } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.status) query.set('status', params.status);
      if (params.type) query.set('type', params.type);
      const response = await fetch(`/api/properties?${query.toString()}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch properties');
    }
  }
);

/** Fetch all agents from the backend API */
export const fetchAgentsFromAPI = createAsyncThunk(
  'crmData/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users?role=agent');
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch agents');
    }
  }
);

/** Fetch dashboard overview from the backend API */
export const fetchDashboardOverview = createAsyncThunk(
  'crmData/fetchDashboardOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/dashboard/summary');
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard overview');
    }
  }
);

/** Create a new lead via API */
export const createLeadAPI = createAsyncThunk(
  'crmData/createLead',
  async (leadData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  }
);

/** Update a lead via API */
export const updateLeadAPI = createAsyncThunk(
  'crmData/updateLeadAPI',
  async ({ id, ...updates }: { id: string | number } & Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  }
);

/** Delete a lead via API */
export const deleteLeadAPI = createAsyncThunk(
  'crmData/deleteLeadAPI',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  }
);

/** Create a new property via API */
export const createPropertyAPI = createAsyncThunk(
  'crmData/createProperty',
  async (propertyData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create property');
    }
  }
);

/** Update a property via API */
export const updatePropertyAPI = createAsyncThunk(
  'crmData/updateProperty',
  async ({ id, ...updates }: { id: string | number } & Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update property');
    }
  }
);

/** Delete a property via API */
export const deletePropertyAPI = createAsyncThunk(
  'crmData/deleteProperty',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete property');
    }
  }
);

const crmDataSlice = createSlice({
  name: 'crmData',
  initialState,

  reducers: {
    // ============== LEADS ==============
    setLeads: (state, action: PayloadAction<CRMItem[]>) => {
      state.leads.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addLead: (state, action: PayloadAction<CRMItem>) => {
      state.leads.items.push({
        ...action.payload,
        id: Math.max(...state.leads.items.map(l => typeof l.id === 'number' ? l.id : 0)) + 1
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateLead: (state, action: PayloadAction<CRMItem>) => {
      const leadIndex = state.leads.items.findIndex(
        l => l.id === action.payload.id
      );
      if (leadIndex > -1) {
        state.leads.items[leadIndex] = {
          ...state.leads.items[leadIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteLead: (state, action: PayloadAction<string | number>) => {
      state.leads.items = state.leads.items.filter(
        l => l.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    selectLead: (state, action: PayloadAction<CRMItem>) => {
      state.leads.selected = action.payload;
    },

    setLeadsLoading: (state, action: PayloadAction<boolean>) => {
      state.leads.loading = action.payload;
    },

    setLeadsError: (state, action: PayloadAction<string | null>) => {
      state.leads.error = action.payload;
    },

    // ============== CLIENTS ==============
    setClients: (state, action: PayloadAction<CRMItem[]>) => {
      state.clients.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addClient: (state, action: PayloadAction<CRMItem>) => {
      state.clients.items.push({
        ...action.payload,
        id: Math.max(...state.clients.items.map(c => typeof c.id === 'number' ? c.id : 0)) + 1
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateClient: (state, action: PayloadAction<CRMItem>) => {
      const clientIndex = state.clients.items.findIndex(
        c => c.id === action.payload.id
      );
      if (clientIndex > -1) {
        state.clients.items[clientIndex] = {
          ...state.clients.items[clientIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteClient: (state, action: PayloadAction<string | number>) => {
      state.clients.items = state.clients.items.filter(
        c => c.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    selectClient: (state, action: PayloadAction<CRMItem>) => {
      state.clients.selected = action.payload;
    },

    setClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clients.loading = action.payload;
    },

    setClientsError: (state, action: PayloadAction<string | null>) => {
      state.clients.error = action.payload;
    },

    // ============== AGENTS ==============
    setAgents: (state, action: PayloadAction<CRMItem[]>) => {
      state.agents.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    selectAgent: (state, action: PayloadAction<CRMItem>) => {
      state.agents.selected = action.payload;
    },

    updateAgent: (state, action: PayloadAction<CRMItem>) => {
      const agentIndex = state.agents.items.findIndex(
        a => a.id === action.payload.id
      );
      if (agentIndex > -1) {
        state.agents.items[agentIndex] = {
          ...state.agents.items[agentIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    setAgentsLoading: (state, action: PayloadAction<boolean>) => {
      state.agents.loading = action.payload;
    },

    setAgentsError: (state, action: PayloadAction<string | null>) => {
      state.agents.error = action.payload;
    },

    // ============== PROPERTIES ==============
    setProperties: (state, action: PayloadAction<CRMItem[]>) => {
      state.properties.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addProperty: (state, action: PayloadAction<CRMItem>) => {
      state.properties.items.unshift({
        ...action.payload,
        id: action.payload.id || Date.now(),
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateProperty: (state, action: PayloadAction<CRMItem>) => {
      const propIndex = state.properties.items.findIndex(
        p => p.id === action.payload.id
      );
      if (propIndex > -1) {
        state.properties.items[propIndex] = {
          ...state.properties.items[propIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteProperty: (state, action: PayloadAction<string | number>) => {
      state.properties.items = state.properties.items.filter(
        p => p.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    selectProperty: (state, action: PayloadAction<CRMItem | null>) => {
      state.properties.selected = action.payload;
    },

    setPropertiesLoading: (state, action: PayloadAction<boolean>) => {
      state.properties.loading = action.payload;
    },

    setPropertiesError: (state, action: PayloadAction<string | null>) => {
      state.properties.error = action.payload;
    },

    // ============== COMMISSIONS ==============
    setCommissions: (state, action: PayloadAction<CRMItem[]>) => {
      state.commissions.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    updateCommission: (state, action: PayloadAction<CRMItem>) => {
      const commIndex = state.commissions.items.findIndex(
        c => c.id === action.payload.id
      );
      if (commIndex > -1) {
        state.commissions.items[commIndex] = {
          ...state.commissions.items[commIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    setCommissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.commissions.loading = action.payload;
    },

    // ============== ACTIVITIES ==============
    setActivities: (state, action: PayloadAction<CRMItem[]>) => {
      state.activities.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addActivity: (state, action: PayloadAction<CRMItem>) => {
      state.activities.items.unshift({
        ...action.payload,
        id: Math.max(...state.activities.items.map(a => typeof a.id === 'number' ? a.id : 0), 0) + 1,
        timestamp: new Date().toISOString()
      });
      state.lastUpdated = new Date().toISOString();
    },

    // ============== OVERVIEW ==============
    setOverviewData: (state, action: PayloadAction<any>) => {
      state.overview = action.payload;
      state.lastUpdated = new Date().toISOString();
    }
  },

  // ============== EXTRA REDUCERS — Async Thunk Handlers ==============
  extraReducers: (builder) => {
    // --- Fetch Leads ---
    builder
      .addCase(fetchLeadsFromAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(fetchLeadsFromAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (Array.isArray(action.payload)) {
          state.leads.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLeadsFromAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (action.payload as string) || 'Failed to fetch leads';
      });

    // --- Fetch Properties ---
    builder
      .addCase(fetchPropertiesFromAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
      })
      .addCase(fetchPropertiesFromAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (Array.isArray(action.payload)) {
          state.properties.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPropertiesFromAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (action.payload as string) || 'Failed to fetch properties';
      });

    // --- Fetch Agents ---
    builder
      .addCase(fetchAgentsFromAPI.pending, (state) => {
        state.agents.loading = true;
        state.agents.error = null;
      })
      .addCase(fetchAgentsFromAPI.fulfilled, (state, action) => {
        state.agents.loading = false;
        if (Array.isArray(action.payload)) {
          state.agents.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAgentsFromAPI.rejected, (state, action) => {
        state.agents.loading = false;
        state.agents.error = (action.payload as string) || 'Failed to fetch agents';
      });

    // --- Fetch Dashboard Overview ---
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        // Silent — dashboard loads from API in background
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        if (action.payload) {
          state.overview = { ...state.overview, ...action.payload };
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardOverview.rejected, (state) => {
        // Silent fail — overview retains dummy data as fallback
      });

    // --- Create Lead ---
    builder
      .addCase(createLeadAPI.pending, (state) => {
        state.leads.loading = true;
      })
      .addCase(createLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (action.payload) {
          state.leads.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (action.payload as string) || 'Failed to create lead';
      });

    // --- Update Lead ---
    builder
      .addCase(updateLeadAPI.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.leads.items.findIndex(l => l.id === action.payload.id);
          if (idx > -1) {
            state.leads.items[idx] = { ...state.leads.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      });

    // --- Delete Lead ---
    builder
      .addCase(deleteLeadAPI.fulfilled, (state, action) => {
        state.leads.items = state.leads.items.filter(l => l.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      });

    // --- Create Property ---
    builder
      .addCase(createPropertyAPI.pending, (state) => {
        state.properties.loading = true;
      })
      .addCase(createPropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (action.payload) {
          state.properties.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createPropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (action.payload as string) || 'Failed to create property';
      });

    // --- Update Property ---
    builder
      .addCase(updatePropertyAPI.pending, (state) => {
        state.properties.loading = true;
      })
      .addCase(updatePropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (action.payload) {
          const idx = state.properties.items.findIndex(p => p.id === action.payload.id);
          if (idx > -1) {
            state.properties.items[idx] = { ...state.properties.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (action.payload as string) || 'Failed to update property';
      });

    // --- Delete Property ---
    builder
      .addCase(deletePropertyAPI.pending, (state) => {
        state.properties.loading = true;
      })
      .addCase(deletePropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        state.properties.items = state.properties.items.filter(p => p.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deletePropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (action.payload as string) || 'Failed to delete property';
      });
  }
});

// ============== ACTIONS ==============
export const {
  setLeads,
  addLead,
  updateLead,
  deleteLead,
  selectLead,
  setLeadsLoading,
  setLeadsError,
  setClients,
  addClient,
  updateClient,
  deleteClient,
  selectClient,
  setClientsLoading,
  setClientsError,
  setAgents,
  selectAgent,
  updateAgent,
  setAgentsLoading,
  setAgentsError,
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  selectProperty,
  setPropertiesLoading,
  setPropertiesError,
  setCommissions,
  updateCommission,
  setCommissionsLoading,
  setActivities,
  addActivity,
  setOverviewData
} = crmDataSlice.actions;

// ============== SELECTORS ==============
// Leads
export const selectAllLeads = (state: any) => state.crmData?.leads?.items || [];
export const selectHotLeads = (state: any) =>
  state.crmData?.leads?.items?.filter((l: CRMItem) => l.status === 'hot') || [];
export const selectWarmLeads = (state: any) =>
  state.crmData?.leads?.items?.filter((l: CRMItem) => l.status === 'warm') || [];
export const selectColdLeads = (state: any) =>
  state.crmData?.leads?.items?.filter((l: CRMItem) => l.status === 'cold') || [];
export const selectSelectedLead = (state: any) => state.crmData?.leads?.selected;
export const selectLeadsLoading = (state: any) => state.crmData?.leads?.loading;
export const selectLeadsError = (state: any) => state.crmData?.leads?.error;

// Clients
export const selectAllClients = (state: any) => state.crmData?.clients?.items || [];
export const selectSelectedClient = (state: any) => state.crmData?.clients?.selected;
export const selectClientsLoading = (state: any) => state.crmData?.clients?.loading;

// Agents
export const selectAllAgents = (state: any) => state.crmData?.agents?.items || [];
export const selectSelectedAgent = (state: any) => state.crmData?.agents?.selected;
export const selectAgentsLoading = (state: any) => state.crmData?.agents?.loading;

// Agents by status
export const selectOnlineAgents = (state: any) =>
  state.crmData?.agents?.items?.filter((a: CRMItem) => a.status === 'online') || [];

export const selectAgentById = (state: any, agentId: string | number) =>
  state.crmData?.agents?.items?.find((a: CRMItem) => a.id === agentId);

// Properties
export const selectAllProperties = (state: any) => state.crmData?.properties?.items || [];
export const selectSelectedProperty = (state: any) => state.crmData?.properties?.selected;
export const selectPropertiesLoading = (state: any) => state.crmData?.properties?.loading;
export const selectPropertiesError = (state: any) => state.crmData?.properties?.error;
export const selectAvailableProperties = (state: any) =>
  state.crmData?.properties?.items?.filter((p: CRMItem) => p.status === 'available') || [];
export const selectPropertyById = (state: any, propertyId: string | number) =>
  state.crmData?.properties?.items?.find((p: CRMItem) => p.id === propertyId);

// Commissions
export const selectAllCommissions = (state: any) =>
  state.crmData?.commissions?.items || [];
export const selectPendingCommissions = (state: any) =>
  state.crmData?.commissions?.items?.filter((c: CRMItem) => c.status === 'pending') || [];
export const selectPaidCommissions = (state: any) =>
  state.crmData?.commissions?.items?.filter((c: CRMItem) => c.status === 'paid') || [];

// Commissions by agent
export const selectCommissionsByAgent = (state: any, agentId: string | number) =>
  state.crmData?.commissions?.items?.filter((c: CRMItem) => c.agent_id === agentId) || [];

// Activities
export const selectAllActivities = (state: any) =>
  state.crmData?.activities?.items || [];
export const selectRecentActivities = (state: any, count: number = 10) =>
  state.crmData?.activities?.items?.slice(0, count) || [];

// Overview
export const selectOverviewData = (state: any) => state.crmData?.overview || {};
export const selectOverviewMetrics = (state: any) =>
  state.crmData?.overview?.metrics || {};

// Summary stats
export const selectTopAgents = (state: any, count: number = 5) =>
  state.crmData?.agents?.items?.sort((a: CRMItem, b: CRMItem) => {
    const bSales = typeof b.sales === 'number' ? b.sales : 0;
    const aSales = typeof a.sales === 'number' ? a.sales : 0;
    return bSales - aSales;
  }).slice(0, count) || [];

export const selectLeadsByAgent = (state: any, agentId: string | number) =>
  state.crmData?.leads?.items?.filter((l: CRMItem) => l.agent_id === agentId) || [];

export const selectClientsByAgent = (state: any, agentId: string | number) =>
  state.crmData?.clients?.items?.filter((c: CRMItem) => c.agent_id === agentId) || [];

// Last updated
export const selectLastUpdated = (state: any) => state.crmData?.lastUpdated;

export default crmDataSlice.reducer;
