/**
 * Aurora Redux Slice
 * Manages Aurora self-analysis, SRS documents, component tracking, and action catalog state
 */

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/authFetch';

const API_BASE = '/api/aurora';

export const fetchProviders = createAsyncThunk(
  'aurora/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/providers`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAnalysis = createAsyncThunk(
  'aurora/fetchAnalysis',
  async ({ refresh = false } = {}, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/analyze?refresh=${refresh}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.analysis;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAnalysisSummary = createAsyncThunk(
  'aurora/fetchAnalysisSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/analyze/summary`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.summary;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scanComponents = createAsyncThunk(
  'aurora/scanComponents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/scan-components`, { method: 'POST' });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComponentCompletion = createAsyncThunk(
  'aurora/fetchComponentCompletion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/components/completion`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateSRS = createAsyncThunk(
  'aurora/generateSRS',
  async (config = {}, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/generate-srs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSRSDocuments = createAsyncThunk(
  'aurora/fetchSRSDocuments',
  async ({ status, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', limit);

      const response = await authFetch(`${API_BASE}/srs?${params}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSRSDocument = createAsyncThunk(
  'aurora/fetchSRSDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/srs/${documentId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.document;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLatestSRS = createAsyncThunk(
  'aurora/fetchLatestSRS',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/srs-latest`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.document;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateAudit = createAsyncThunk(
  'aurora/generateAudit',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/audit`, { method: 'POST' });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActionCatalog = createAsyncThunk(
  'aurora/fetchActionCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/scan-actions`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  providers: {
    list: [],
    available: [],
    loading: false,
    error: null,
  },

  analysis: {
    data: null,
    summary: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },

  components: {
    list: [],
    summary: {},
    analysisRunId: null,
    loading: false,
    error: null,
  },

  srs: {
    documents: [],
    currentDocument: null,
    latestDocument: null,
    generating: false,
    loading: false,
    error: null,
    generationProgress: 0,
  },

  audit: {
    report: null,
    analysisData: null,
    provider: null,
    generating: false,
    error: null,
  },

  actions: {
    catalog: [],
    summary: {},
    loading: false,
    error: null,
  },

  ui: {
    activeTab: 'overview',
    selectedComponent: null,
    selectedDocument: null,
    srsConfig: {
      detailLevel: 'standard',
      format: 'markdown',
      includeDiagrams: true,
      includeCompliance: true,
      includeArabic: false,
      preferredProvider: null,
    },
  },

  // Aurora monitoring extensions for Wednesday plan
  monitoring: {
    realtime: {
      enabled: false,
      interval: 30000, // 30 seconds
      lastUpdate: null,
    },
    vercel: {
      connected: false,
      buildTime: null,
      errorRate: null,
      uptime: null,
      lastCheck: null,
    },
    mongodb: {
      connected: false,
      queryPerformance: null,
      connections: null,
      lastCheck: null,
    },
    alertThresholds: {
      apiResponseTime: 500, // ms
      databaseQueryTime: 100, // ms
      errorRate: 0.005, // 0.5%
      uptime: 0.999, // 99.9%
      concurrentUsers: 80, // out of 100
    },
    alertHistory: [],
    alertsSuppressed: false,
  },
};

const auroraSlice = createSlice({
  name: 'aurora',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },
    setSelectedComponent: (state, action) => {
      state.ui.selectedComponent = action.payload;
    },
    setSelectedDocument: (state, action) => {
      state.ui.selectedDocument = action.payload;
    },
    setSRSConfig: (state, action) => {
      state.ui.srsConfig = { ...state.ui.srsConfig, ...action.payload };
    },
    setGenerationProgress: (state, action) => {
      state.srs.generationProgress = action.payload;
    },
    clearError: (state, action) => {
      const section = action.payload;
      // eslint-disable-next-line security/detect-object-injection
      if (state[section]) {
        // eslint-disable-next-line security/detect-object-injection
        state[section].error = null;
      }
    },
    resetAudit: state => {
      state.audit = initialState.audit;
    },
    // Monitoring actions
    enableRealtimeMonitoring: (state, action) => {
      state.monitoring.realtime.enabled = true;
      state.monitoring.realtime.interval = action.payload?.interval || 30000;
    },
    disableRealtimeMonitoring: state => {
      state.monitoring.realtime.enabled = false;
    },
    updateVercelMonitoring: (state, action) => {
      const { buildTime, errorRate, uptime } = action.payload;
      state.monitoring.vercel = {
        ...state.monitoring.vercel,
        connected: true,
        buildTime,
        errorRate,
        uptime,
        lastCheck: new Date().toISOString(),
      };
    },
    updateMongoDBMonitoring: (state, action) => {
      const { queryPerformance, connections } = action.payload;
      state.monitoring.mongodb = {
        ...state.monitoring.mongodb,
        connected: true,
        queryPerformance,
        connections,
        lastCheck: new Date().toISOString(),
      };
    },
    updateAlertThresholds: (state, action) => {
      state.monitoring.alertThresholds = {
        ...state.monitoring.alertThresholds,
        ...action.payload,
      };
    },
    recordAlert: (state, action) => {
      const { type, severity, message, metric, value, threshold } = action.payload;
      state.monitoring.alertHistory.push({
        id: `alert-${Date.now()}`,
        type,
        severity,
        message,
        metric,
        value,
        threshold,
        recordedAt: new Date().toISOString(),
      });
    },
    suppressAlerts: state => {
      state.monitoring.alertsSuppressed = true;
    },
    unsuppressAlerts: state => {
      state.monitoring.alertsSuppressed = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProviders.pending, state => {
        state.providers.loading = true;
        state.providers.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers.loading = false;
        state.providers.list = action.payload.providers;
        state.providers.available = action.payload.available;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.providers.loading = false;
        state.providers.error = action.payload;
      })

      .addCase(fetchAnalysis.pending, state => {
        state.analysis.loading = true;
        state.analysis.error = null;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.analysis.loading = false;
        state.analysis.data = action.payload;
        state.analysis.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.analysis.loading = false;
        state.analysis.error = action.payload;
      })

      .addCase(fetchAnalysisSummary.pending, state => {
        state.analysis.loading = true;
      })
      .addCase(fetchAnalysisSummary.fulfilled, (state, action) => {
        state.analysis.loading = false;
        state.analysis.summary = action.payload;
      })
      .addCase(fetchAnalysisSummary.rejected, (state, action) => {
        state.analysis.loading = false;
        state.analysis.error = action.payload;
      })

      .addCase(scanComponents.pending, state => {
        state.components.loading = true;
        state.components.error = null;
      })
      .addCase(scanComponents.fulfilled, (state, action) => {
        state.components.loading = false;
        state.components.analysisRunId = action.payload.analysisRunId;
        state.components.summary = action.payload.summary;
      })
      .addCase(scanComponents.rejected, (state, action) => {
        state.components.loading = false;
        state.components.error = action.payload;
      })

      .addCase(fetchComponentCompletion.pending, state => {
        state.components.loading = true;
      })
      .addCase(fetchComponentCompletion.fulfilled, (state, action) => {
        state.components.loading = false;
        state.components.list = action.payload.components || [];
        state.components.summary = action.payload.summary || {};
        state.components.analysisRunId = action.payload.analysisRunId;
      })
      .addCase(fetchComponentCompletion.rejected, (state, action) => {
        state.components.loading = false;
        state.components.error = action.payload;
      })

      .addCase(generateSRS.pending, state => {
        state.srs.generating = true;
        state.srs.error = null;
        state.srs.generationProgress = 10;
      })
      .addCase(generateSRS.fulfilled, (state, action) => {
        state.srs.generating = false;
        state.srs.generationProgress = 100;
        state.srs.currentDocument = {
          ...action.payload.document,
          content: action.payload.content,
        };
        state.srs.latestDocument = action.payload.document;
        state.srs.documents = [action.payload.document, ...state.srs.documents];
      })
      .addCase(generateSRS.rejected, (state, action) => {
        state.srs.generating = false;
        state.srs.generationProgress = 0;
        state.srs.error = action.payload;
      })

      .addCase(fetchSRSDocuments.pending, state => {
        state.srs.loading = true;
      })
      .addCase(fetchSRSDocuments.fulfilled, (state, action) => {
        state.srs.loading = false;
        state.srs.documents = action.payload;
      })
      .addCase(fetchSRSDocuments.rejected, (state, action) => {
        state.srs.loading = false;
        state.srs.error = action.payload;
      })

      .addCase(fetchSRSDocument.pending, state => {
        state.srs.loading = true;
      })
      .addCase(fetchSRSDocument.fulfilled, (state, action) => {
        state.srs.loading = false;
        state.srs.currentDocument = action.payload;
      })
      .addCase(fetchSRSDocument.rejected, (state, action) => {
        state.srs.loading = false;
        state.srs.error = action.payload;
      })

      .addCase(fetchLatestSRS.fulfilled, (state, action) => {
        state.srs.latestDocument = action.payload;
      })

      .addCase(generateAudit.pending, state => {
        state.audit.generating = true;
        state.audit.error = null;
      })
      .addCase(generateAudit.fulfilled, (state, action) => {
        state.audit.generating = false;
        state.audit.report = action.payload.report;
        state.audit.analysisData = action.payload.analysisData;
        state.audit.provider = action.payload.provider;
      })
      .addCase(generateAudit.rejected, (state, action) => {
        state.audit.generating = false;
        state.audit.error = action.payload;
      })

      .addCase(fetchActionCatalog.pending, state => {
        state.actions.loading = true;
      })
      .addCase(fetchActionCatalog.fulfilled, (state, action) => {
        state.actions.loading = false;
        state.actions.catalog = action.payload.catalog;
        state.actions.summary = action.payload.summary;
      })
      .addCase(fetchActionCatalog.rejected, (state, action) => {
        state.actions.loading = false;
        state.actions.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  setSelectedComponent,
  setSelectedDocument,
  setSRSConfig,
  setGenerationProgress,
  clearError,
  resetAudit,
  enableRealtimeMonitoring,
  disableRealtimeMonitoring,
  updateVercelMonitoring,
  updateMongoDBMonitoring,
  updateAlertThresholds,
  recordAlert,
  suppressAlerts,
  unsuppressAlerts,
} = auroraSlice.actions;

const selectAurora = state => state.aurora;

export const selectProviders = createSelector(
  [selectAurora],
  aurora => aurora?.providers || initialState.providers
);

export const selectAnalysis = createSelector(
  [selectAurora],
  aurora => aurora?.analysis || initialState.analysis
);

export const selectComponents = createSelector(
  [selectAurora],
  aurora => aurora?.components || initialState.components
);

export const selectSRS = createSelector([selectAurora], aurora => aurora?.srs || initialState.srs);

export const selectAudit = createSelector(
  [selectAurora],
  aurora => aurora?.audit || initialState.audit
);

export const selectActions = createSelector(
  [selectAurora],
  aurora => aurora?.actions || initialState.actions
);

export const selectUI = createSelector([selectAurora], aurora => aurora?.ui || initialState.ui);

export const selectCompletionScore = createSelector(
  [selectAnalysis],
  analysis =>
    analysis?.summary?.completionScore || analysis?.data?.codeQuality?.completionScore || 0
);

export const selectTotalFiles = createSelector(
  [selectAnalysis],
  analysis => analysis?.summary?.totalFiles || analysis?.data?.summary?.totalFiles || 0
);

export const selectTotalComponents = createSelector(
  [selectAnalysis],
  analysis => analysis?.summary?.components || analysis?.data?.components?.total || 0
);

export default auroraSlice.reducer;
