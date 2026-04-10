/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, commissions, activities
 * Now with async thunks for backend API integration
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../utils/authFetch';
import * as crmService from '../services/crmService';
import { logout } from './authSlice';
import type { RootState } from './store';
// In production, async thunks fetch real data from the API.
// Dummy data is only used as fallback initial state in dev mode.
import {
  DUMMY_ALL_LEADS,
  DUMMY_CLIENTS,
  DUMMY_AGENTS,
  DUMMY_ACTIVITIES,
  DUMMY_OVERVIEW_DATA
} from '../data/dummyLeads';

interface CRMItem {
  id: string | number;
  [key: string]: unknown;
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

interface NotificationCollection {
  items: CRMItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface FavoriteCollection {
  items: CRMItem[];
  loading: boolean;
  error: string | null;
}

interface CRMDataState {
  leads: CRMCollection<CRMItem>;
  clients: CRMCollection<CRMItem>;
  agents: CRMCollection<CRMItem>;
  properties: CRMCollection<CRMItem>;
  transactions: CRMCollection<CRMItem>;
  commissions: CommissionCollection;
  notifications: NotificationCollection;
  favorites: FavoriteCollection;
  activities: ActivityCollection;
  overview: Record<string, unknown> | null;
  lastUpdated: string;
}

const initialState: CRMDataState = {
  leads: {
    items: import.meta.env.DEV ? DUMMY_ALL_LEADS : [],
    selected: null,
    loading: false,
    error: null
  },

  clients: {
    items: import.meta.env.DEV ? DUMMY_CLIENTS : [],
    selected: null,
    loading: false,
    error: null
  },

  agents: {
    items: import.meta.env.DEV ? DUMMY_AGENTS : [],
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

  transactions: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },

  commissions: {
    items: [],
    loading: false,
    error: null
  },

  notifications: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null
  },

  favorites: {
    items: [],
    loading: false,
    error: null
  },

  activities: {
    items: import.meta.env.DEV ? DUMMY_ACTIVITIES : [],
    loading: false,
    error: null
  },

  overview: import.meta.env.DEV ? DUMMY_OVERVIEW_DATA : null,

  lastUpdated: new Date().toISOString()
};

// ============================================================================
// ASYNC THUNKS â€” Backend API Integration
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
      const response = await authFetch(`/api/leads?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch leads'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch leads');
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
      const response = await authFetch(`/api/properties?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch properties'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch properties');
    }
  }
);

/** Fetch all agents from the backend API */
export const fetchAgentsFromAPI = createAsyncThunk(
  'crmData/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/users?role=agent');
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch agents'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch agents');
    }
  }
);

/** Fetch dashboard overview from the backend API */
export const fetchDashboardOverview = createAsyncThunk(
  'crmData/fetchDashboardOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/dashboard/summary');
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch dashboard'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch dashboard overview');
    }
  }
);

/** Create a new lead via API */
export const createLeadAPI = createAsyncThunk(
  'crmData/createLead',
  async (leadData: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create lead'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create lead');
    }
  }
);

/** Update a lead via API */
export const updateLeadAPI = createAsyncThunk(
  'crmData/updateLeadAPI',
  async ({ id, ...updates }: { id: string | number } & Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update lead'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update lead');
    }
  }
);

/** Delete a lead via API */
export const deleteLeadAPI = createAsyncThunk(
  'crmData/deleteLeadAPI',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete lead'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete lead');
    }
  }
);

/** Create a new property via API */
export const createPropertyAPI = createAsyncThunk(
  'crmData/createProperty',
  async (propertyData: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create property'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create property');
    }
  }
);

/** Update a property via API */
export const updatePropertyAPI = createAsyncThunk(
  'crmData/updateProperty',
  async ({ id, ...updates }: { id: string | number } & Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update property'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update property');
    }
  }
);

/** Delete a property via API */
export const deletePropertyAPI = createAsyncThunk(
  'crmData/deleteProperty',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete property'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete property');
    }
  }
);

// ============================================================================
// ASYNC THUNKS — Commissions (via crmService)
// ============================================================================

/** Fetch all commissions from the backend API */
export const fetchCommissionsAPI = createAsyncThunk(
  'crmData/fetchCommissions',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      return await crmService.fetchCommissions(params);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch commissions');
    }
  }
);

/** Create a new commission via API */
export const createCommissionAPI = createAsyncThunk(
  'crmData/createCommission',
  async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.createCommission(data);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create commission');
    }
  }
);

/** Update a commission via API */
export const updateCommissionAPI = createAsyncThunk(
  'crmData/updateCommission',
  async ({ id, ...updates }: { id: string } & Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.updateCommission(id, updates);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update commission');
    }
  }
);

// ============================================================================
// ASYNC THUNKS — Transactions (via crmService)
// ============================================================================

/** Fetch all transactions from the backend API */
export const fetchTransactionsAPI = createAsyncThunk(
  'crmData/fetchTransactions',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      return await crmService.fetchTransactions(params);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch transactions');
    }
  }
);

/** Create a new transaction via API */
export const createTransactionAPI = createAsyncThunk(
  'crmData/createTransaction',
  async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.createTransaction(data);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create transaction');
    }
  }
);

/** Update a transaction via API */
export const updateTransactionAPI = createAsyncThunk(
  'crmData/updateTransaction',
  async ({ id, ...updates }: { id: string } & Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.updateTransaction(id, updates);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update transaction');
    }
  }
);

/** Delete a transaction via API */
export const deleteTransactionAPI = createAsyncThunk(
  'crmData/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      return await crmService.deleteTransaction(id);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  }
);

// ============================================================================
// ASYNC THUNKS — Clients (via crmService)
// ============================================================================

/** Fetch all clients from the backend API */
export const fetchClientsAPI = createAsyncThunk(
  'crmData/fetchClients',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      return await crmService.fetchClients(params);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch clients');
    }
  }
);

/** Create a new client via API */
export const createClientAPI = createAsyncThunk(
  'crmData/createClient',
  async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.createClient(data);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create client');
    }
  }
);

/** Update a client via API */
export const updateClientAPI = createAsyncThunk(
  'crmData/updateClient',
  async ({ id, ...updates }: { id: string } & Record<string, unknown>, { rejectWithValue }) => {
    try {
      return await crmService.updateClient(id, updates);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update client');
    }
  }
);

/** Delete a client via API */
export const deleteClientAPI = createAsyncThunk(
  'crmData/deleteClient',
  async (id: string, { rejectWithValue }) => {
    try {
      return await crmService.deleteClient(id);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete client');
    }
  }
);

// ============================================================================
// ASYNC THUNKS — Notifications (via crmService)
// ============================================================================

/** Fetch notifications from the backend API */
export const fetchNotificationsAPI = createAsyncThunk(
  'crmData/fetchNotifications',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      return await crmService.fetchNotifications(params);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch notifications');
    }
  }
);

/** Fetch unread notification count */
export const fetchUnreadCountAPI = createAsyncThunk(
  'crmData/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await crmService.fetchUnreadCount();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch unread count');
    }
  }
);

/** Mark a single notification as read */
export const markNotificationReadAPI = createAsyncThunk(
  'crmData/markNotificationRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await crmService.markNotificationRead(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark notification as read');
    }
  }
);

/** Mark all notifications as read */
export const markAllNotificationsReadAPI = createAsyncThunk(
  'crmData/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      return await crmService.markAllNotificationsRead();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark all notifications as read');
    }
  }
);

// ============================================================================
// ASYNC THUNKS — Favorites (via crmService)
// ============================================================================

/** Fetch user's favorite properties */
export const fetchFavoritesAPI = createAsyncThunk(
  'crmData/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await crmService.fetchFavorites();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch favorites');
    }
  }
);

/** Add a property to favorites */
export const addFavoriteAPI = createAsyncThunk(
  'crmData/addFavorite',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      return await crmService.addFavorite(propertyId);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add favorite');
    }
  }
);

/** Remove a property from favorites */
export const removeFavoriteAPI = createAsyncThunk(
  'crmData/removeFavorite',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      await crmService.removeFavorite(propertyId);
      return propertyId;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove favorite');
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
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
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
      if (state.leads.selected?.id === action.payload) {
        state.leads.selected = null;
      }
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
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
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
      if (state.clients.selected?.id === action.payload) {
        state.clients.selected = null;
      }
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
      if (state.properties.selected?.id === action.payload) {
        state.properties.selected = null;
      }
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
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date().toISOString()
      });
      state.lastUpdated = new Date().toISOString();
    },

    // ============== OVERVIEW ==============
    setOverviewData: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.overview = action.payload;
      state.lastUpdated = new Date().toISOString();
    }
  },

  // ============== EXTRA REDUCERS â€” Async Thunk Handlers ==============
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
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch leads';
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
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch properties';
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
        state.agents.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch agents';
      });

    // --- Fetch Dashboard Overview ---
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overview = { ...state.overview, loading: true, error: null };
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        if (action.payload) {
          state.overview = { ...state.overview, ...action.payload, loading: false, error: null };
        } else {
          state.overview = { ...state.overview, loading: false };
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.overview = {
          ...state.overview,
          loading: false,
          error: (typeof action.payload === 'string' ? action.payload : null) || 'Failed to load dashboard overview',
        };
      });

    // --- Create Lead ---
    builder
      .addCase(createLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
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
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create lead';
      });

    // --- Update Lead ---
    builder
      .addCase(updateLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(updateLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (action.payload) {
          const idx = state.leads.items.findIndex(l => l.id === action.payload.id);
          if (idx > -1) {
            state.leads.items[idx] = { ...state.leads.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update lead';
      });

    // --- Delete Lead ---
    builder
      .addCase(deleteLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(deleteLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        state.leads.items = state.leads.items.filter(l => l.id !== action.payload);
        if (state.leads.selected?.id === action.payload) {
          state.leads.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete lead';
      });

    // --- Create Property ---
    builder
      .addCase(createPropertyAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
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
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create property';
      });

    // --- Update Property ---
    builder
      .addCase(updatePropertyAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
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
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update property';
      });

    // --- Delete Property ---
    builder
      .addCase(deletePropertyAPI.pending, (state) => {
        state.properties.loading = true;
      })
      .addCase(deletePropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        state.properties.items = state.properties.items.filter(p => p.id !== action.payload);
        if (state.properties.selected?.id === action.payload) {
          state.properties.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deletePropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete property';
      });

    // --- Fetch Commissions ---
    builder
      .addCase(fetchCommissionsAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(fetchCommissionsAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (Array.isArray(action.payload)) {
          state.commissions.items = action.payload as CRMItem[];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCommissionsAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch commissions';
      });

    // --- Create Commission ---
    builder
      .addCase(createCommissionAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(createCommissionAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (action.payload) {
          state.commissions.items.unshift(action.payload as CRMItem);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createCommissionAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create commission';
      });

    // --- Update Commission ---
    builder
      .addCase(updateCommissionAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(updateCommissionAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (action.payload) {
          const idx = state.commissions.items.findIndex(c => c.id === (action.payload as CRMItem).id);
          if (idx > -1) {
            state.commissions.items[idx] = { ...state.commissions.items[idx], ...(action.payload as CRMItem) };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCommissionAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update commission';
      });

    // --- Fetch Transactions ---
    builder
      .addCase(fetchTransactionsAPI.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(fetchTransactionsAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        if (Array.isArray(action.payload)) {
          state.transactions.items = action.payload as CRMItem[];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTransactionsAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch transactions';
      });

    // --- Create Transaction ---
    builder
      .addCase(createTransactionAPI.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(createTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        if (action.payload) {
          state.transactions.items.unshift(action.payload as CRMItem);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create transaction';
      });

    // --- Update Transaction ---
    builder
      .addCase(updateTransactionAPI.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(updateTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        if (action.payload) {
          const idx = state.transactions.items.findIndex(t => t.id === (action.payload as CRMItem).id);
          if (idx > -1) {
            state.transactions.items[idx] = { ...state.transactions.items[idx], ...(action.payload as CRMItem) };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update transaction';
      });

    // --- Delete Transaction ---
    builder
      .addCase(deleteTransactionAPI.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(deleteTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.items = state.transactions.items.filter(t => t.id !== action.payload);
        if (state.transactions.selected?.id === action.payload) {
          state.transactions.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete transaction';
      });

    // --- Fetch Clients (API) ---
    builder
      .addCase(fetchClientsAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(fetchClientsAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (Array.isArray(action.payload)) {
          state.clients.items = action.payload as CRMItem[];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchClientsAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch clients';
      });

    // --- Create Client (API) ---
    builder
      .addCase(createClientAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(createClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (action.payload) {
          state.clients.items.unshift(action.payload as CRMItem);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create client';
      });

    // --- Update Client (API) ---
    builder
      .addCase(updateClientAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(updateClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (action.payload) {
          const idx = state.clients.items.findIndex(c => c.id === (action.payload as CRMItem).id);
          if (idx > -1) {
            state.clients.items[idx] = { ...state.clients.items[idx], ...(action.payload as CRMItem) };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update client';
      });

    // --- Delete Client (API) ---
    builder
      .addCase(deleteClientAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(deleteClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        state.clients.items = state.clients.items.filter(c => c.id !== action.payload);
        if (state.clients.selected?.id === action.payload) {
          state.clients.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete client';
      });

    // --- Fetch Notifications ---
    builder
      .addCase(fetchNotificationsAPI.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.error = null;
      })
      .addCase(fetchNotificationsAPI.fulfilled, (state, action) => {
        state.notifications.loading = false;
        if (Array.isArray(action.payload)) {
          state.notifications.items = action.payload as CRMItem[];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchNotificationsAPI.rejected, (state, action) => {
        state.notifications.loading = false;
        state.notifications.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch notifications';
      });

    // --- Fetch Unread Count ---
    builder
      .addCase(fetchUnreadCountAPI.pending, (state) => {
        state.notifications.error = null;
      })
      .addCase(fetchUnreadCountAPI.fulfilled, (state, action) => {
        if (action.payload && typeof (action.payload as { unreadCount?: number }).unreadCount === 'number') {
          state.notifications.unreadCount = (action.payload as { unreadCount: number }).unreadCount;
        }
      })
      .addCase(fetchUnreadCountAPI.rejected, (state, action) => {
        state.notifications.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch unread count';
      });

    // --- Mark Notification Read ---
    builder
      .addCase(markNotificationReadAPI.fulfilled, (state, action) => {
        const idx = state.notifications.items.findIndex(n => n.id === action.payload);
        if (idx > -1) {
          state.notifications.items[idx] = { ...state.notifications.items[idx], read: true };
        }
        if (state.notifications.unreadCount > 0) {
          state.notifications.unreadCount -= 1;
        }
      });

    // --- Mark All Notifications Read ---
    builder
      .addCase(markAllNotificationsReadAPI.fulfilled, (state) => {
        state.notifications.items = state.notifications.items.map(n => ({ ...n, read: true }));
        state.notifications.unreadCount = 0;
      });

    // --- Fetch Favorites ---
    builder
      .addCase(fetchFavoritesAPI.pending, (state) => {
        state.favorites.loading = true;
        state.favorites.error = null;
      })
      .addCase(fetchFavoritesAPI.fulfilled, (state, action) => {
        state.favorites.loading = false;
        if (Array.isArray(action.payload)) {
          state.favorites.items = action.payload as CRMItem[];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchFavoritesAPI.rejected, (state, action) => {
        state.favorites.loading = false;
        state.favorites.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch favorites';
      });

    // --- Add Favorite ---
    builder
      .addCase(addFavoriteAPI.pending, (state) => {
        state.favorites.loading = true;
        state.favorites.error = null;
      })
      .addCase(addFavoriteAPI.fulfilled, (state, action) => {
        state.favorites.loading = false;
        if (action.payload) {
          state.favorites.items.push(action.payload as CRMItem);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addFavoriteAPI.rejected, (state, action) => {
        state.favorites.loading = false;
        state.favorites.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to add favorite';
      });

    // --- Remove Favorite ---
    builder
      .addCase(removeFavoriteAPI.pending, (state) => {
        state.favorites.loading = true;
        state.favorites.error = null;
      })
      .addCase(removeFavoriteAPI.fulfilled, (state, action) => {
        state.favorites.loading = false;
        state.favorites.items = state.favorites.items.filter(
          f => f.id !== action.payload && (f as CRMItem & { propertyId?: string }).propertyId !== action.payload
        );
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFavoriteAPI.rejected, (state, action) => {
        state.favorites.loading = false;
        state.favorites.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to remove favorite';
      });

    // --- SECURITY: Reset all CRM data on logout to prevent data leaks ---
    builder.addCase(logout, () => initialState);
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

// ============== SELECTORS (memoized with createSelector) ==============

// ── Base selectors (stable references — no new objects) ──
const selectLeadsSlice = (state: RootState) => state.crmData?.leads;
const selectClientsSlice = (state: RootState) => state.crmData?.clients;
const selectAgentsSlice = (state: RootState) => state.crmData?.agents;
const selectPropertiesSlice = (state: RootState) => state.crmData?.properties;
const selectTransactionsSlice = (state: RootState) => state.crmData?.transactions;
const selectCommissionsSlice = (state: RootState) => state.crmData?.commissions;
const selectNotificationsSlice = (state: RootState) => state.crmData?.notifications;
const selectFavoritesSlice = (state: RootState) => state.crmData?.favorites;
const selectActivitiesSlice = (state: RootState) => state.crmData?.activities;

// ── Leads ──
export const selectAllLeads = createSelector(
  selectLeadsSlice,
  (leads) => leads?.items || []
);
export const selectHotLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'hot')
);
export const selectWarmLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'warm')
);
export const selectColdLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'cold')
);
export const selectSelectedLead = (state: RootState) => state.crmData?.leads?.selected;
export const selectLeadsLoading = (state: RootState) => state.crmData?.leads?.loading;
export const selectLeadsError = (state: RootState) => state.crmData?.leads?.error;

// ── Clients ──
export const selectAllClients = createSelector(
  selectClientsSlice,
  (clients) => clients?.items || []
);
export const selectSelectedClient = (state: RootState) => state.crmData?.clients?.selected;
export const selectClientsLoading = (state: RootState) => state.crmData?.clients?.loading;
export const selectClientsError = (state: RootState) => state.crmData?.clients?.error;

// ── Agents ──
export const selectAllAgents = createSelector(
  selectAgentsSlice,
  (agents) => agents?.items || []
);
export const selectSelectedAgent = (state: RootState) => state.crmData?.agents?.selected;
export const selectAgentsLoading = (state: RootState) => state.crmData?.agents?.loading;
export const selectAgentsError = (state: RootState) => state.crmData?.agents?.error;

export const selectOnlineAgents = createSelector(
  selectAllAgents,
  (items) => items.filter((a: CRMItem) => a.status === 'online')
);

export const selectAgentById = (state: RootState, agentId: string | number) =>
  state.crmData?.agents?.items?.find((a: CRMItem) => a.id === agentId);

// ── Properties ──
export const selectAllProperties = createSelector(
  selectPropertiesSlice,
  (properties) => properties?.items || []
);
export const selectSelectedProperty = (state: RootState) => state.crmData?.properties?.selected;
export const selectPropertiesLoading = (state: RootState) => state.crmData?.properties?.loading;
export const selectPropertiesError = (state: RootState) => state.crmData?.properties?.error;

export const selectAvailableProperties = createSelector(
  selectAllProperties,
  (items) => items.filter((p: CRMItem) => p.status === 'available')
);

export const selectPropertyById = (state: RootState, propertyId: string | number) =>
  state.crmData?.properties?.items?.find((p: CRMItem) => p.id === propertyId);

// ── Commissions ──
export const selectAllCommissions = createSelector(
  selectCommissionsSlice,
  (commissions) => commissions?.items || []
);
export const selectPendingCommissions = createSelector(
  selectAllCommissions,
  (items) => items.filter((c: CRMItem) => c.status === 'pending')
);
export const selectPaidCommissions = createSelector(
  selectAllCommissions,
  (items) => items.filter((c: CRMItem) => c.status === 'paid')
);

export const selectCommissionsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.commissions?.items?.filter((c: CRMItem) => c.agent_id === agentId) || [];

export const selectCommissionsLoading = (state: RootState) => state.crmData?.commissions?.loading;
export const selectCommissionsError = (state: RootState) => state.crmData?.commissions?.error;

// ── Transactions ──
export const selectAllTransactions = createSelector(
  selectTransactionsSlice,
  (transactions) => transactions?.items || []
);
export const selectSelectedTransaction = (state: RootState) => state.crmData?.transactions?.selected;
export const selectTransactionsLoading = (state: RootState) => state.crmData?.transactions?.loading;
export const selectTransactionsError = (state: RootState) => state.crmData?.transactions?.error;

// ── Notifications ──
export const selectAllNotifications = createSelector(
  selectNotificationsSlice,
  (notifications) => notifications?.items || []
);
export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (items) => items.filter((n: CRMItem) => !n.read)
);
export const selectUnreadCount = (state: RootState) => state.crmData?.notifications?.unreadCount ?? 0;
export const selectNotificationsLoading = (state: RootState) => state.crmData?.notifications?.loading;
export const selectNotificationsError = (state: RootState) => state.crmData?.notifications?.error;

// ── Favorites ──
export const selectAllFavorites = createSelector(
  selectFavoritesSlice,
  (favorites) => favorites?.items || []
);
export const selectFavoritesLoading = (state: RootState) => state.crmData?.favorites?.loading;
export const selectFavoritesError = (state: RootState) => state.crmData?.favorites?.error;

// ── Activities ──
export const selectAllActivities = createSelector(
  selectActivitiesSlice,
  (activities) => activities?.items || []
);
export const selectRecentActivities = createSelector(
  (state: RootState) => state.crmData?.activities?.items,
  (_state: RootState, count: number = 10) => count,
  (items, count) => items ? items.slice(0, count) : []
);

// ── Overview ──
const EMPTY_OVERVIEW: Record<string, unknown> = Object.freeze({});
const EMPTY_METRICS: Record<string, unknown> = Object.freeze({});
export const selectOverviewData = (state: RootState) => state.crmData?.overview ?? EMPTY_OVERVIEW;
export const selectOverviewMetrics = (state: RootState) =>
  state.crmData?.overview?.metrics ?? EMPTY_METRICS;

// ── Summary stats (memoized — uses spread copy to avoid mutating state) ──
export const selectTopAgents = createSelector(
  selectAllAgents,
  (_state: RootState, count: number = 5) => count,
  (items, count) => [...items].sort((a: CRMItem, b: CRMItem) => {
    const bSales = typeof b.sales === 'number' ? b.sales : 0;
    const aSales = typeof a.sales === 'number' ? a.sales : 0;
    return bSales - aSales;
  }).slice(0, count)
);

export const makeSelectLeadsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.leads?.items,
    (items) => items?.filter((l: CRMItem) => l.agent_id === agentId) ?? []
  );
/** @deprecated Use makeSelectLeadsByAgent(agentId) instead for memoized results */
export const selectLeadsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.leads?.items?.filter((l: CRMItem) => l.agent_id === agentId) || [];

export const makeSelectClientsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.clients?.items,
    (items) => items?.filter((c: CRMItem) => c.agent_id === agentId) ?? []
  );
/** @deprecated Use makeSelectClientsByAgent(agentId) instead for memoized results */
export const selectClientsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.clients?.items?.filter((c: CRMItem) => c.agent_id === agentId) || [];

// Last updated
export const selectLastUpdated = (state: RootState) => state.crmData?.lastUpdated;

export default crmDataSlice.reducer;
