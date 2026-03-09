/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, commissions, activities
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  DUMMY_ALL_LEADS,
  DUMMY_CLIENTS,
  DUMMY_AGENTS,
  DUMMY_COMMISSIONS,
  DUMMY_ACTIVITIES,
  DUMMY_OVERVIEW_DATA
} from '../data/dummyLeads';

const initialState = {
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
    setLeads: (state, action) => {
      state.leads.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addLead: (state, action) => {
      state.leads.items.push({
        ...action.payload,
        id: Math.max(...state.leads.items.map(l => l.id)) + 1
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateLead: (state, action) => {
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

    deleteLead: (state, action) => {
      state.leads.items = state.leads.items.filter(
        l => l.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    selectLead: (state, action) => {
      state.leads.selected = action.payload;
    },

    setLeadsLoading: (state, action) => {
      state.leads.loading = action.payload;
    },

    setLeadsError: (state, action) => {
      state.leads.error = action.payload;
    },

    // ============== CLIENTS ==============
    setClients: (state, action) => {
      state.clients.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addClient: (state, action) => {
      state.clients.items.push({
        ...action.payload,
        id: Math.max(...state.clients.items.map(c => c.id)) + 1
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateClient: (state, action) => {
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

    deleteClient: (state, action) => {
      state.clients.items = state.clients.items.filter(
        c => c.id !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },

    selectClient: (state, action) => {
      state.clients.selected = action.payload;
    },

    setClientsLoading: (state, action) => {
      state.clients.loading = action.payload;
    },

    setClientsError: (state, action) => {
      state.clients.error = action.payload;
    },

    // ============== AGENTS ==============
    setAgents: (state, action) => {
      state.agents.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    selectAgent: (state, action) => {
      state.agents.selected = action.payload;
    },

    updateAgent: (state, action) => {
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

    setAgentsLoading: (state, action) => {
      state.agents.loading = action.payload;
    },

    setAgentsError: (state, action) => {
      state.agents.error = action.payload;
    },

    // ============== COMMISSIONS ==============
    setCommissions: (state, action) => {
      state.commissions.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    updateCommission: (state, action) => {
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

    setCommissionsLoading: (state, action) => {
      state.commissions.loading = action.payload;
    },

    // ============== ACTIVITIES ==============
    setActivities: (state, action) => {
      state.activities.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addActivity: (state, action) => {
      state.activities.items.unshift({
        ...action.payload,
        id: Math.max(...state.activities.items.map(a => a.id), 0) + 1,
        timestamp: new Date().toISOString()
      });
      state.lastUpdated = new Date().toISOString();
    },

    // ============== OVERVIEW ==============
    setOverviewData: (state, action) => {
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
export const selectAllLeads = (state) => state.crmData?.leads?.items || [];
export const selectHotLeads = (state) =>
  state.crmData?.leads?.items?.filter(l => l.status === 'hot') || [];
export const selectWarmLeads = (state) =>
  state.crmData?.leads?.items?.filter(l => l.status === 'warm') || [];
export const selectColdLeads = (state) =>
  state.crmData?.leads?.items?.filter(l => l.status === 'cold') || [];
export const selectSelectedLead = (state) => state.crmData?.leads?.selected;
export const selectLeadsLoading = (state) => state.crmData?.leads?.loading;

// Clients
export const selectAllClients = (state) => state.crmData?.clients?.items || [];
export const selectSelectedClient = (state) => state.crmData?.clients?.selected;
export const selectClientsLoading = (state) => state.crmData?.clients?.loading;

// Agents
export const selectAllAgents = (state) => state.crmData?.agents?.items || [];
export const selectSelectedAgent = (state) => state.crmData?.agents?.selected;
export const selectAgentsLoading = (state) => state.crmData?.agents?.loading;

// Agents by status
export const selectOnlineAgents = (state) =>
  state.crmData?.agents?.items?.filter(a => a.status === 'online') || [];

export const selectAgentById = (state, agentId) =>
  state.crmData?.agents?.items?.find(a => a.id === agentId);

// Commissions
export const selectAllCommissions = (state) =>
  state.crmData?.commissions?.items || [];
export const selectPendingCommissions = (state) =>
  state.crmData?.commissions?.items?.filter(c => c.status === 'pending') || [];
export const selectPaidCommissions = (state) =>
  state.crmData?.commissions?.items?.filter(c => c.status === 'paid') || [];

// Commissions by agent
export const selectCommissionsByAgent = (state, agentId) =>
  state.crmData?.commissions?.items?.filter(c => c.agent_id === agentId) || [];

// Activities
export const selectAllActivities = (state) =>
  state.crmData?.activities?.items || [];
export const selectRecentActivities = (state, count = 10) =>
  state.crmData?.activities?.items?.slice(0, count) || [];

// Overview
export const selectOverviewData = (state) => state.crmData?.overview || {};
export const selectOverviewMetrics = (state) =>
  state.crmData?.overview?.metrics || {};

// Summary stats
export const selectTopAgents = (state, count = 5) =>
  state.crmData?.agents?.items?.sort((a, b) => b.sales - a.sales).slice(0, count) || [];

export const selectLeadsByAgent = (state, agentId) =>
  state.crmData?.leads?.items?.filter(l => l.agent_id === agentId) || [];

export const selectClientsByAgent = (state, agentId) =>
  state.crmData?.clients?.items?.filter(c => c.agent_id === agentId) || [];

// Last updated
export const selectLastUpdated = (state) => state.crmData?.lastUpdated;

export default crmDataSlice.reducer;
