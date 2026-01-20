import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchKYCProfiles = createAsyncThunk(
  'kycAml/fetchProfiles',
  async ({ status, riskLevel, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (riskLevel) params.append('riskLevel', riskLevel);
      params.append('limit', limit);
      
      const response = await fetch(`/api/compliance/kyc?${params}`);
      if (!response.ok) throw new Error('Failed to fetch profiles');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerificationQueue = createAsyncThunk(
  'kycAml/fetchQueue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/verification-queue');
      if (!response.ok) throw new Error('Failed to fetch queue');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAMLAlerts = createAsyncThunk(
  'kycAml/fetchAlerts',
  async ({ status, severity, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (severity) params.append('severity', severity);
      params.append('limit', limit);
      
      const response = await fetch(`/api/compliance/aml-alerts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComplianceStats = createAsyncThunk(
  'kycAml/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createKYCProfile = createAsyncThunk(
  'kycAml/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error('Failed to create profile');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateKYCProfile = createAsyncThunk(
  'kycAml/updateProfile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compliance/kyc/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyDocument = createAsyncThunk(
  'kycAml/verifyDocument',
  async ({ profileId, documentType, documentData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compliance/kyc/${profileId}/documents/${documentType}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      });
      if (!response.ok) throw new Error('Document verification failed');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const runPEPScreening = createAsyncThunk(
  'kycAml/pepScreening',
  async (screeningData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/pep-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(screeningData)
      });
      if (!response.ok) throw new Error('PEP screening failed');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const runSanctionsCheck = createAsyncThunk(
  'kycAml/sanctionsCheck',
  async (checkData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/sanctions-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkData)
      });
      if (!response.ok) throw new Error('Sanctions check failed');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resolveAMLAlert = createAsyncThunk(
  'kycAml/resolveAlert',
  async ({ alertId, resolution }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compliance/aml-alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resolution)
      });
      if (!response.ok) throw new Error('Failed to resolve alert');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const processDocumentOCR = createAsyncThunk(
  'kycAml/processDocumentOCR',
  async ({ customerId, documentType, filePath }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, documentType, filePath })
      });
      if (!response.ok) throw new Error('Document processing failed');
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateDocumentData = createAsyncThunk(
  'kycAml/validateDocumentData',
  async ({ documentType, extractedData }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/documents/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, extractedData })
      });
      if (!response.ok) throw new Error('Validation failed');
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitDocumentVerification = createAsyncThunk(
  'kycAml/submitDocumentVerification',
  async ({ customerId, documentType, approved, confidence, ocrData, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/compliance/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, documentType, approved, confidence, ocrData, rejectionReason })
      });
      if (!response.ok) throw new Error('Verification submission failed');
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerDocuments = createAsyncThunk(
  'kycAml/fetchCustomerDocuments',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compliance/documents/customer/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch customer documents');
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDocumentStatus = createAsyncThunk(
  'kycAml/fetchDocumentStatus',
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/compliance/documents/${documentId}/status`);
      if (!response.ok) throw new Error('Failed to fetch document status');
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profiles: {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 50, total: 0 }
  },
  verificationQueue: {
    data: [],
    loading: false,
    error: null
  },
  alerts: {
    data: [],
    loading: false,
    error: null,
    unreadCount: 0
  },
  pepScreening: {
    results: [],
    loading: false,
    error: null
  },
  sanctionsCheck: {
    results: [],
    loading: false,
    error: null
  },
  stats: {
    data: null,
    loading: false,
    error: null
  },
  notifications: [],
  activeProfile: null,
  selectedAlert: null,
  filters: {
    status: 'all',
    riskLevel: 'all',
    dateRange: null,
    search: ''
  },
  ui: {
    sidePanel: null,
    activeTab: 'queue',
    showNotifications: false
  }
};

const kycAmlSlice = createSlice({
  name: 'kycAml',
  initialState,
  reducers: {
    setActiveProfile: (state, action) => {
      state.activeProfile = action.payload;
    },
    setSelectedAlert: (state, action) => {
      state.selectedAlert = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },
    setSidePanel: (state, action) => {
      state.ui.sidePanel = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      });
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleNotifications: (state) => {
      state.ui.showNotifications = !state.ui.showNotifications;
    },
    realTimeAlertReceived: (state, action) => {
      const alert = action.payload;
      state.alerts.data.unshift(alert);
      state.alerts.unreadCount += 1;
      state.notifications.unshift({
        id: Date.now(),
        type: 'aml_alert',
        severity: alert.severity,
        title: 'New AML Alert',
        message: alert.description,
        timestamp: new Date().toISOString(),
        read: false,
        alertId: alert.id
      });
    },
    realTimeProfileUpdate: (state, action) => {
      const updated = action.payload;
      const index = state.profiles.data.findIndex(p => p.id === updated.id);
      if (index !== -1) {
        state.profiles.data[index] = updated;
      }
      if (state.activeProfile?.id === updated.id) {
        state.activeProfile = updated;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKYCProfiles.pending, (state) => {
        state.profiles.loading = true;
        state.profiles.error = null;
      })
      .addCase(fetchKYCProfiles.fulfilled, (state, action) => {
        state.profiles.loading = false;
        state.profiles.data = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.profiles.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchKYCProfiles.rejected, (state, action) => {
        state.profiles.loading = false;
        state.profiles.error = action.payload;
      })
      .addCase(fetchVerificationQueue.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(fetchVerificationQueue.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.data = action.payload.data || action.payload;
      })
      .addCase(fetchVerificationQueue.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
      })
      .addCase(fetchAMLAlerts.pending, (state) => {
        state.alerts.loading = true;
        state.alerts.error = null;
      })
      .addCase(fetchAMLAlerts.fulfilled, (state, action) => {
        state.alerts.loading = false;
        state.alerts.data = action.payload.data || action.payload;
      })
      .addCase(fetchAMLAlerts.rejected, (state, action) => {
        state.alerts.loading = false;
        state.alerts.error = action.payload;
      })
      .addCase(fetchComplianceStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchComplianceStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.data = action.payload;
      })
      .addCase(fetchComplianceStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      })
      .addCase(createKYCProfile.fulfilled, (state, action) => {
        state.profiles.data.unshift(action.payload);
      })
      .addCase(updateKYCProfile.fulfilled, (state, action) => {
        const index = state.profiles.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.profiles.data[index] = action.payload;
        }
      })
      .addCase(verifyDocument.fulfilled, (state, action) => {
        if (state.activeProfile) {
          const docIndex = state.activeProfile.documents?.findIndex(
            d => d.type === action.payload.documentType
          );
          if (docIndex !== -1) {
            state.activeProfile.documents[docIndex] = {
              ...state.activeProfile.documents[docIndex],
              ...action.payload.verification
            };
          }
        }
      })
      .addCase(runPEPScreening.pending, (state) => {
        state.pepScreening.loading = true;
        state.pepScreening.error = null;
      })
      .addCase(runPEPScreening.fulfilled, (state, action) => {
        state.pepScreening.loading = false;
        state.pepScreening.results = action.payload;
      })
      .addCase(runPEPScreening.rejected, (state, action) => {
        state.pepScreening.loading = false;
        state.pepScreening.error = action.payload;
      })
      .addCase(runSanctionsCheck.pending, (state) => {
        state.sanctionsCheck.loading = true;
        state.sanctionsCheck.error = null;
      })
      .addCase(runSanctionsCheck.fulfilled, (state, action) => {
        state.sanctionsCheck.loading = false;
        state.sanctionsCheck.results = action.payload;
      })
      .addCase(runSanctionsCheck.rejected, (state, action) => {
        state.sanctionsCheck.loading = false;
        state.sanctionsCheck.error = action.payload;
      })
      .addCase(resolveAMLAlert.fulfilled, (state, action) => {
        const index = state.alerts.data.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts.data[index] = action.payload;
        }
        if (state.selectedAlert?.id === action.payload.id) {
          state.selectedAlert = action.payload;
        }
      })
      // Document Processing
      .addCase(processDocumentOCR.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(processDocumentOCR.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.currentProcessing = action.payload;
      })
      .addCase(processDocumentOCR.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
      })
      // Document Validation
      .addCase(validateDocumentData.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(validateDocumentData.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.validationResult = action.payload;
      })
      .addCase(validateDocumentData.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
      })
      // Document Verification Submission
      .addCase(submitDocumentVerification.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(submitDocumentVerification.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        if (state.activeProfile && action.payload) {
          state.activeProfile = action.payload;
        }
        state.notifications.unshift({
          id: Date.now(),
          type: 'success',
          message: 'Document verified successfully',
          timestamp: new Date().toISOString()
        });
      })
      .addCase(submitDocumentVerification.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
        state.notifications.unshift({
          id: Date.now(),
          type: 'error',
          message: `Verification failed: ${action.payload}`,
          timestamp: new Date().toISOString()
        });
      })
      // Fetch Customer Documents
      .addCase(fetchCustomerDocuments.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(fetchCustomerDocuments.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.customerDocuments = action.payload;
      })
      .addCase(fetchCustomerDocuments.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
      })
      // Fetch Document Status
      .addCase(fetchDocumentStatus.pending, (state) => {
        state.verificationQueue.loading = true;
        state.verificationQueue.error = null;
      })
      .addCase(fetchDocumentStatus.fulfilled, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.documentStatus = action.payload;
      })
      .addCase(fetchDocumentStatus.rejected, (state, action) => {
        state.verificationQueue.loading = false;
        state.verificationQueue.error = action.payload;
      });
  }
});

export const {
  setActiveProfile,
  setSelectedAlert,
  setFilters,
  clearFilters,
  setActiveTab,
  setSidePanel,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  toggleNotifications,
  realTimeAlertReceived,
  realTimeProfileUpdate
} = kycAmlSlice.actions;

export const selectKYCProfiles = (state) => state.kycAml?.profiles || initialState.profiles;
export const selectVerificationQueue = (state) => state.kycAml?.verificationQueue || initialState.verificationQueue;
export const selectAMLAlerts = (state) => state.kycAml?.alerts || initialState.alerts;
export const selectPEPScreening = (state) => state.kycAml?.pepScreening || initialState.pepScreening;
export const selectSanctionsCheck = (state) => state.kycAml?.sanctionsCheck || initialState.sanctionsCheck;
export const selectComplianceStats = (state) => state.kycAml?.stats || initialState.stats;
export const selectActiveProfile = (state) => state.kycAml?.activeProfile || null;
export const selectSelectedAlert = (state) => state.kycAml?.selectedAlert || null;
export const selectFilters = (state) => state.kycAml?.filters || initialState.filters;
export const selectNotifications = (state) => state.kycAml?.notifications || [];
export const selectUnreadNotifications = (state) => 
  (state.kycAml?.notifications || []).filter(n => !n.read);
export const selectUIState = (state) => state.kycAml?.ui || initialState.ui;

export const selectHighRiskProfiles = (state) => 
  (state.kycAml?.profiles?.data || []).filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'PROHIBITED');

export const selectPendingVerifications = (state) =>
  (state.kycAml?.verificationQueue?.data || []).filter(p => p.status === 'PENDING_VERIFICATION');

export const selectActiveAlerts = (state) =>
  (state.kycAml?.alerts?.data || []).filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING');

export default kycAmlSlice.reducer;
