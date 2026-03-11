/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, commissions, activities
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
