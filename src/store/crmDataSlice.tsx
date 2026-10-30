/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, properties, commissions, invoices, expenses, activities
 * Decomposed into modular domain sub-slices under src/store/slices/crm/
 * Conforms strictly to Single Purpose File Law (< 350 lines).
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import {
  initialState,
  CRMItem,
  CRMDataState,
  addLeadsExtraReducers,
  addPropertiesExtraReducers,
  addFinanceExtraReducers,
  addOperationsExtraReducers,
} from './slices/crm';

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
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateLead: (state, action: PayloadAction<CRMItem>) => {
      const leadIndex = state.leads.items.findIndex(l => l.id === action.payload.id);
      if (leadIndex > -1) {
        state.leads.items[leadIndex] = {
          ...state.leads.items[leadIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteLead: (state, action: PayloadAction<string | number>) => {
      state.leads.items = state.leads.items.filter(l => l.id !== action.payload);
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
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateClient: (state, action: PayloadAction<CRMItem>) => {
      const clientIndex = state.clients.items.findIndex(c => c.id === action.payload.id);
      if (clientIndex > -1) {
        state.clients.items[clientIndex] = {
          ...state.clients.items[clientIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteClient: (state, action: PayloadAction<string | number>) => {
      state.clients.items = state.clients.items.filter(c => c.id !== action.payload);
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
      const agentIndex = state.agents.items.findIndex(a => a.id === action.payload.id);
      if (agentIndex > -1) {
        state.agents.items[agentIndex] = {
          ...state.agents.items[agentIndex],
          ...action.payload,
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
      const propIndex = state.properties.items.findIndex(p => p.id === action.payload.id);
      if (propIndex > -1) {
        state.properties.items[propIndex] = {
          ...state.properties.items[propIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteProperty: (state, action: PayloadAction<string | number>) => {
      state.properties.items = state.properties.items.filter(p => p.id !== action.payload);
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
      const commIndex = state.commissions.items.findIndex(c => c.id === action.payload.id);
      if (commIndex > -1) {
        state.commissions.items[commIndex] = {
          ...state.commissions.items[commIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    setCommissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.commissions.loading = action.payload;
    },

    // ============== INVOICES ==============
    setInvoices: (state, action: PayloadAction<CRMItem[]>) => {
      state.invoices.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setInvoicesLoading: (state, action: PayloadAction<boolean>) => {
      state.invoices.loading = action.payload;
    },

    // ============== EXPENSES ==============
    setExpenses: (state, action: PayloadAction<CRMItem[]>) => {
      state.expenses.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setExpensesLoading: (state, action: PayloadAction<boolean>) => {
      state.expenses.loading = action.payload;
    },

    // ============== TRANSACTIONS ==============
    setTransactions: (state, action: PayloadAction<CRMItem[]>) => {
      state.transactions.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setTransactionsLoading: (state, action: PayloadAction<boolean>) => {
      state.transactions.loading = action.payload;
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
        timestamp: new Date().toISOString(),
      });
      state.lastUpdated = new Date().toISOString();
    },

    // ============== OVERVIEW ==============
    setOverviewData: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.overview = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
  },

  // ============== EXTRA REDUCERS â€” Async Thunk Handlers ==============

  extraReducers: builder => {
    addLeadsExtraReducers(builder);
    addPropertiesExtraReducers(builder);
    addFinanceExtraReducers(builder);
    addOperationsExtraReducers(builder);
    // SECURITY: Reset all CRM data on logout to prevent data leaks
    builder.addCase(logout, () => initialState);
  },
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
  setInvoices,
  setInvoicesLoading,
  setExpenses,
  setExpensesLoading,
  setTransactions,
  setTransactionsLoading,
  setActivities,
  addActivity,
  setOverviewData,
} = crmDataSlice.actions;

// Re-export all domain types, selectors, and async thunks
export * from './slices/crm';

// Aliases for backwards compatibility
import {
  fetchClientsFromAPI,
  fetchCommissionsFromAPI,
  fetchActivitiesFromAPI,
  updateActivityAPI,
  deleteActivityAPI,
} from './slices/crm';

export const fetchClientsAPI = fetchClientsFromAPI;
export const fetchCommissionsAPI = fetchCommissionsFromAPI;
export const fetchNotificationsAPI = fetchActivitiesFromAPI;
export const markNotificationReadAPI = updateActivityAPI;
export const markAllNotificationsReadAPI = updateActivityAPI;
export const fetchFavoritesAPI = fetchActivitiesFromAPI;
export const removeFavoriteAPI = deleteActivityAPI;

export default crmDataSlice.reducer;
