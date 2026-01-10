import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import crmDataService from '../../services/CRMDataService';

export const loadLeads = createAsyncThunk(
  'leads/loadLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crmDataService.getRecentLeads();
      return response.leads || response.data || [];
    } catch (error) {
      console.error('Failed to load leads:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const loadLeadMetrics = createAsyncThunk(
  'leads/loadMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crmDataService.getLeadMetrics();
      return response.metrics || response;
    } catch (error) {
      console.error('Failed to load lead metrics:', error);
      return rejectWithValue(error.message);
    }
  }
);

const LEAD_STAGES = [
  { id: 'initial', label: 'Initial Contact', color: '#6b7280' },
  { id: 'qualified', label: 'Qualified', color: '#3b82f6' },
  { id: 'viewing', label: 'Viewing Scheduled', color: '#8b5cf6' },
  { id: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
  { id: 'offer', label: 'Offer Made', color: '#10b981' },
  { id: 'closed', label: 'Closed', color: '#059669' }
];

const LEAD_SOURCES = [
  { id: 'website', label: 'Website', color: '#3b82f6' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25d366' },
  { id: 'referral', label: 'Referral', color: '#8b5cf6' },
  { id: 'walk-in', label: 'Walk-in', color: '#f59e0b' },
  { id: 'social-media', label: 'Social Media', color: '#ec4899' },
  { id: 'property-finder', label: 'Property Finder', color: '#ef4444' },
  { id: 'bayut', label: 'Bayut', color: '#10b981' },
  { id: 'dubizzle', label: 'Dubizzle', color: '#f97316' }
];

const initialState = {
  leads: [],
  metrics: {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    negotiating: 0,
    converted: 0,
    lost: 0,
    conversionRate: 0
  },
  filters: {
    status: null,
    stage: null,
    source: null,
    assignedAgent: null,
    searchQuery: ''
  },
  stages: LEAD_STAGES,
  sources: LEAD_SOURCES,
  selectedLeadId: null,
  loading: false,
  metricsLoading: false,
  error: null
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeadFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearLeadFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectLead: (state, action) => {
      state.selectedLeadId = action.payload;
    },
    updateLeadStatus: (state, action) => {
      const { leadId, status } = action.payload;
      const lead = state.leads.find(l => l.id === leadId || l._id === leadId);
      if (lead) {
        lead.status = status;
      }
    },
    updateLeadStage: (state, action) => {
      const { leadId, stage } = action.payload;
      const lead = state.leads.find(l => l.id === leadId || l._id === leadId);
      if (lead) {
        lead.stage = stage;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(loadLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(loadLeadMetrics.pending, (state) => {
        state.metricsLoading = true;
      })
      .addCase(loadLeadMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = { ...state.metrics, ...action.payload };
      })
      .addCase(loadLeadMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const {
  setLeadFilter,
  clearLeadFilters,
  selectLead,
  updateLeadStatus,
  updateLeadStage
} = leadsSlice.actions;

const selectLeadsState = state => state.leads;

export const selectAllLeads = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState?.leads || []
);

export const selectLeadFilters = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState?.filters || initialState.filters
);

export const selectFilteredLeads = createSelector(
  [selectAllLeads, selectLeadFilters],
  (leads, filters) => {
    return leads.filter(lead => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableFields = [
          lead.name,
          lead.email,
          lead.phone
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchableFields.includes(query)) return false;
      }
      
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.stage && lead.stage !== filters.stage) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.assignedAgent && lead.assignedAgent !== filters.assignedAgent) return false;
      
      return true;
    });
  }
);

export const selectLeadMetrics = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState?.metrics || initialState.metrics
);

export const selectLeadStages = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState?.stages || LEAD_STAGES
);

export const selectLeadSources = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState?.sources || LEAD_SOURCES
);

export const selectLeadsByStage = createSelector(
  [selectAllLeads],
  (leads) => {
    const byStage = {};
    leads.forEach(lead => {
      const stage = lead.stage || 'initial';
      if (!byStage[stage]) byStage[stage] = [];
      byStage[stage].push(lead);
    });
    return byStage;
  }
);

export const selectLeadsBySource = createSelector(
  [selectAllLeads],
  (leads) => {
    const bySource = {};
    leads.forEach(lead => {
      const source = lead.source || 'unknown';
      if (!bySource[source]) bySource[source] = [];
      bySource[source].push(lead);
    });
    return bySource;
  }
);

export const selectHotLeads = createSelector(
  [selectAllLeads],
  (leads) => leads.filter(lead => lead.status === 'hot' || lead.score >= 70)
);

export default leadsSlice.reducer;
