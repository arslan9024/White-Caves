/**
 * Wednesday Business & Technology Integrations Plan Redux Slice
 * Manages Zoe's business requirements, Aurora's technical metrics,
 * shared findings, escalations, and knowledge base access
 */

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/authFetch';

// Async thunks for API calls
export const fetchMonitoringMetrics = createAsyncThunk(
  'wednesday/fetchMonitoringMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/aurora/monitoring/health');
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadWednesdayPlan = createAsyncThunk(
  'wednesday/loadPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/wednesday/plan');
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.plan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const INITIAL_STATE = {
  // Plan metadata
  plan: {
    id: 'wednesday-2026-01-22',
    name: 'WEDNESDAY_BUSINESS_TECHNOLOGY_INTEGRATIONS',
    date: '2026-01-22',
    status: 'scheduled', // scheduled, in_progress, completed
    createdAt: '2026-01-17T14:30:00Z',
    lastUpdated: '2026-01-17T14:30:00Z',
    totalTasks: 26,
  },

  // Zoe's business requirements & decisions
  zoe: {
    requirements: {
      buyerJourney: {
        name: 'Buyer Journey: Search → Offer → Contract',
        status: 'pending', // pending, in_progress, completed, blocked
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
      sellerJourney: {
        name: 'Seller Journey: List → Lead → Negotiate → Close',
        status: 'pending',
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
      tenantJourney: {
        name: 'Tenant Journey: Apply → Screen → Contract → Sign',
        status: 'pending',
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
      leasingAgentWorkflow: {
        name: 'Leasing Agent: Screen → Verify → Approve',
        status: 'pending',
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
      salesAgentWorkflow: {
        name: 'Sales Agent: Lead → Deal → Close',
        status: 'pending',
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
      adminOversight: {
        name: 'Admin Dashboard: Monitor All Workflows',
        status: 'pending',
        completionPercent: 0,
        changeLog: [],
        isApproved: true,
        approvalDate: null,
        notes: '',
      },
    },
    metrics: {
      leadConversion: { target: 0.15, actual: null, status: 'not_tested', unit: 'ratio' },
      workflowCompletion: { target: 1.0, actual: null, status: 'not_tested', unit: 'percent' },
      errorRate: { target: 0.001, actual: null, status: 'not_tested', unit: 'percent' },
      apiResponseTime: { target: 500, actual: null, status: 'not_tested', unit: 'ms' },
      concurrentUsers: { target: 100, actual: null, status: 'not_tested', unit: 'users' },
      contractExecutionRate: { target: 0.98, actual: null, status: 'not_tested', unit: 'percent' },
      compliancePassRate: { target: 1.0, actual: null, status: 'not_tested', unit: 'percent' },
    },
    approvedChanges: [],
    decisionLog: [],
    readOnly: false,
  },

  // Aurora's technical metrics & findings
  aurora: {
    monitoring: {
      vercel: {
        status: 'checking',
        deploymentStatus: null,
        buildTime: null,
        errorRate: null,
        uptime: null,
        lastCheck: null,
        history: [],
      },
      mongodb: {
        status: 'checking',
        queryPerformance: null,
        connections: null,
        storage: null,
        indexHealth: null,
        lastCheck: null,
        history: [],
      },
      apiEndpoints: [
        {
          endpoint: '/api/sourcing/opportunities',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        {
          endpoint: '/api/sourcing/analyze-conversation',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        {
          endpoint: '/api/sourcing/opportunities/:id/verify',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        {
          endpoint: '/api/sourcing/opportunities/:id/add-to-inventory',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        {
          endpoint: '/api/sourcing/statistics',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        { endpoint: '/api/owners', status: 'pending', responseTime: null, errorRate: null },
        { endpoint: '/api/owners/:id', status: 'pending', responseTime: null, errorRate: null },
        {
          endpoint: '/api/properties/search',
          status: 'pending',
          responseTime: null,
          errorRate: null,
        },
        { endpoint: '/api/leads', status: 'pending', responseTime: null, errorRate: null },
        { endpoint: '/api/leads/:id', status: 'pending', responseTime: null, errorRate: null },
      ],
      services: [
        {
          service: 'PropertySourcingServices',
          status: 'pending',
          health: null,
          responseTime: null,
        },
        { service: 'LeadScoringEngine', status: 'pending', health: null, responseTime: null },
        { service: 'AgentAssignmentService', status: 'pending', health: null, responseTime: null },
        {
          service: 'ComplianceValidationService',
          status: 'pending',
          health: null,
          responseTime: null,
        },
        { service: 'ChatbotService', status: 'pending', health: null, responseTime: null },
        { service: 'DynamicPricingEngine', status: 'pending', health: null, responseTime: null },
        { service: 'ConversationAnalyzer', status: 'pending', health: null, responseTime: null },
        { service: 'WhatsAppWebIntegration', status: 'pending', health: null, responseTime: null },
        { service: 'PropertyQueryService', status: 'pending', health: null, responseTime: null },
        {
          service: 'ServiceRecommendationEngine',
          status: 'pending',
          health: null,
          responseTime: null,
        },
        {
          service: 'PropertyStatusEventService',
          status: 'pending',
          health: null,
          responseTime: null,
        },
      ],
    },
    findings: {
      criticalIssues: [],
      blockers: [],
      performanceAlerts: [],
      dataIntegrityIssues: [],
      securityConcerns: [],
    },
    systemHealth: {
      overall: 'initializing',
      components: {},
    },
  },

  // Shared escalations & alerts
  escalations: {
    active: [],
    history: [],
    resolutionLog: [],
  },

  // Session timeline tracking
  timeline: {
    morningSession: {
      startTime: null,
      endTime: null,
      completedTasks: [],
      progress: 0,
      status: 'pending',
    },
    afternoonSession: {
      startTime: null,
      endTime: null,
      completedTasks: [],
      progress: 0,
      status: 'pending',
    },
    eveningDebrief: {
      startTime: null,
      endTime: null,
      completedTasks: [],
      summary: null,
      status: 'pending',
    },
  },

  // Knowledge bases
  knowledgeBase: {
    plan: {
      content: null,
      sections: [
        { id: 'company-structure', title: 'Company Structure & Business Model', accessible: true },
        { id: 'user-roles', title: 'Six Core User Roles', accessible: true },
        { id: 'business-services', title: 'Business Services & Processes', accessible: true },
        { id: 'user-workflows', title: 'User Personas & Business Workflows', accessible: true },
        { id: 'technology-architecture', title: 'Technology Architecture', accessible: true },
        { id: 'features', title: 'Complete Feature List', accessible: true },
        {
          id: 'integration-objectives',
          title: 'Wednesday Integration Objectives',
          accessible: true,
        },
        { id: 'success-metrics', title: 'Success Metrics & KPIs', accessible: true },
        { id: 'timeline', title: 'Wednesday Execution Timeline', accessible: true },
        { id: 'deliverables', title: 'Deliverables for Wednesday', accessible: true },
      ],
      searchIndex: {},
      lastLoaded: null,
    },
  },

  // UI state
  ui: {
    activeTab: 'overview',
    selectedWorkflow: null,
    showMetricsPanel: true,
    showEscalations: true,
    notificationCount: 0,
    criticalAlertCount: 0,
  },

  // Loading and error states
  loading: {
    plan: false,
    metrics: false,
    findings: false,
  },
  error: {
    plan: null,
    metrics: null,
    findings: null,
  },
};

const wednesdayPlanSlice = createSlice({
  name: 'wednesday',
  initialState: INITIAL_STATE,
  reducers: {
    // Plan management
    startWednesdayExecution: state => {
      state.plan.status = 'in_progress';
      state.plan.lastUpdated = new Date().toISOString();
    },
    completeWednesdayExecution: state => {
      state.plan.status = 'completed';
      state.plan.lastUpdated = new Date().toISOString();
    },

    // Zoe's requirement updates
    updateRequirementStatus: (state, action) => {
      const { workflowId, status, completionPercent, notes } = action.payload;
      // eslint-disable-next-line security/detect-object-injection
      if (state.zoe.requirements[workflowId]) {
        // eslint-disable-next-line security/detect-object-injection
        state.zoe.requirements[workflowId].status = status;
        // eslint-disable-next-line security/detect-object-injection
        state.zoe.requirements[workflowId].completionPercent = completionPercent || 0;
        // eslint-disable-next-line security/detect-object-injection
        if (notes) state.zoe.requirements[workflowId].notes = notes;
      }
    },
    recordZoeApprovedChange: (state, action) => {
      const { changeDescription, reason, timestamp } = action.payload;
      state.zoe.approvedChanges.push({
        id: `change-${Date.now()}`,
        description: changeDescription,
        reason,
        approvedAt: timestamp || new Date().toISOString(),
        approvedBy: 'Zoe',
      });
    },
    updateMetricActual: (state, action) => {
      const { metricKey, actual, status } = action.payload;
      // eslint-disable-next-line security/detect-object-injection
      if (state.zoe.metrics[metricKey]) {
        // eslint-disable-next-line security/detect-object-injection
        state.zoe.metrics[metricKey].actual = actual;
        // eslint-disable-next-line security/detect-object-injection
        state.zoe.metrics[metricKey].status = status || 'tested';
      }
    },

    // Aurora's monitoring updates
    updateVercelMetrics: (state, action) => {
      const { buildTime, errorRate, uptime, deploymentStatus } = action.payload;
      state.aurora.monitoring.vercel.status = 'checked';
      state.aurora.monitoring.vercel.buildTime = buildTime;
      state.aurora.monitoring.vercel.errorRate = errorRate;
      state.aurora.monitoring.vercel.uptime = uptime;
      state.aurora.monitoring.vercel.deploymentStatus = deploymentStatus;
      state.aurora.monitoring.vercel.lastCheck = new Date().toISOString();
      if (!state.aurora.monitoring.vercel.history) state.aurora.monitoring.vercel.history = [];
      state.aurora.monitoring.vercel.history.push({
        timestamp: new Date().toISOString(),
        buildTime,
        errorRate,
        uptime,
      });
    },
    updateMongoDBMetrics: (state, action) => {
      const { queryPerformance, connections, storage, indexHealth } = action.payload;
      state.aurora.monitoring.mongodb.status = 'checked';
      state.aurora.monitoring.mongodb.queryPerformance = queryPerformance;
      state.aurora.monitoring.mongodb.connections = connections;
      state.aurora.monitoring.mongodb.storage = storage;
      state.aurora.monitoring.mongodb.indexHealth = indexHealth;
      state.aurora.monitoring.mongodb.lastCheck = new Date().toISOString();
      if (!state.aurora.monitoring.mongodb.history) state.aurora.monitoring.mongodb.history = [];
      state.aurora.monitoring.mongodb.history.push({
        timestamp: new Date().toISOString(),
        queryPerformance,
        connections,
        storage,
      });
    },
    updateAPIEndpointStatus: (state, action) => {
      const { endpoint, status, responseTime, errorRate } = action.payload;
      const apiEndpoint = state.aurora.monitoring.apiEndpoints.find(e => e.endpoint === endpoint);
      if (apiEndpoint) {
        apiEndpoint.status = status;
        apiEndpoint.responseTime = responseTime;
        apiEndpoint.errorRate = errorRate;
      }
    },
    updateServiceHealth: (state, action) => {
      const { service, health, responseTime } = action.payload;
      const svc = state.aurora.monitoring.services.find(s => s.service === service);
      if (svc) {
        svc.status = 'checked';
        svc.health = health;
        svc.responseTime = responseTime;
      }
    },

    // Findings & issues
    addCriticalIssue: (state, action) => {
      const { issue, severity, component, timestamp } = action.payload;
      state.aurora.findings.criticalIssues.push({
        id: `issue-${Date.now()}`,
        issue,
        severity,
        component,
        reportedAt: timestamp || new Date().toISOString(),
        reportedBy: 'Aurora',
        status: 'open',
        resolution: null,
      });
      state.ui.criticalAlertCount += 1;
    },
    addBlocker: (state, action) => {
      const { blocker, impact, component, timestamp } = action.payload;
      state.aurora.findings.blockers.push({
        id: `blocker-${Date.now()}`,
        blocker,
        impact,
        component,
        reportedAt: timestamp || new Date().toISOString(),
        reportedBy: 'Aurora',
        status: 'open',
        resolution: null,
      });
    },
    addPerformanceAlert: (state, action) => {
      const { alert, metric, threshold, actual, timestamp } = action.payload;
      state.aurora.findings.performanceAlerts.push({
        id: `perf-${Date.now()}`,
        alert,
        metric,
        threshold,
        actual,
        reportedAt: timestamp || new Date().toISOString(),
        reportedBy: 'Aurora',
        severity: actual > threshold * 1.5 ? 'critical' : 'warning',
      });
    },

    // Escalations
    createEscalation: (state, action) => {
      const { title, description, severity, linkedIssue, recommendedAction } = action.payload;
      const escalation = {
        id: `esc-${Date.now()}`,
        title,
        description,
        severity, // low, medium, high, critical
        linkedIssue,
        recommendedAction,
        createdAt: new Date().toISOString(),
        createdBy: 'Aurora',
        status: 'open',
        zoeNotified: false,
        zoeResponse: null,
        resolvedAt: null,
      };
      state.escalations.active.push(escalation);
      state.ui.notificationCount += 1;
    },
    notifyZoe: (state, action) => {
      const { escalationId } = action.payload;
      const escalation = state.escalations.active.find(e => e.id === escalationId);
      if (escalation) {
        escalation.zoeNotified = true;
        escalation.notifiedAt = new Date().toISOString();
      }
    },
    resolveEscalation: (state, action) => {
      const { escalationId, resolution, resolvedBy } = action.payload;
      const escalation = state.escalations.active.find(e => e.id === escalationId);
      if (escalation) {
        escalation.status = 'resolved';
        escalation.zoeResponse = resolution;
        escalation.resolvedAt = new Date().toISOString();
        escalation.resolvedBy = resolvedBy || 'Zoe';
        state.escalations.history.push(escalation);
        state.escalations.active = state.escalations.active.filter(e => e.id !== escalationId);
        state.ui.notificationCount = Math.max(0, state.ui.notificationCount - 1);
      }
    },

    // Timeline tracking
    startMorningSession: state => {
      state.timeline.morningSession.startTime = new Date().toISOString();
      state.timeline.morningSession.status = 'in_progress';
    },
    completeMorningSession: (state, action) => {
      state.timeline.morningSession.endTime = new Date().toISOString();
      state.timeline.morningSession.status = 'completed';
      state.timeline.morningSession.progress = action.payload.progress || 0;
    },
    startAfternoonSession: state => {
      state.timeline.afternoonSession.startTime = new Date().toISOString();
      state.timeline.afternoonSession.status = 'in_progress';
    },
    completeAfternoonSession: (state, action) => {
      state.timeline.afternoonSession.endTime = new Date().toISOString();
      state.timeline.afternoonSession.status = 'completed';
      state.timeline.afternoonSession.progress = action.payload.progress || 0;
    },
    recordTaskCompletion: (state, action) => {
      const { sessionKey, taskId, taskName } = action.payload;
      // eslint-disable-next-line security/detect-object-injection
      if (state.timeline[sessionKey]) {
        // eslint-disable-next-line security/detect-object-injection
        state.timeline[sessionKey].completedTasks.push({
          id: taskId,
          name: taskName,
          completedAt: new Date().toISOString(),
        });
      }
    },

    // Knowledge base
    loadPlanContent: (state, action) => {
      state.knowledgeBase.plan.content = action.payload;
      state.knowledgeBase.plan.lastLoaded = new Date().toISOString();
    },

    // UI state
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },
    toggleMetricsPanel: state => {
      state.ui.showMetricsPanel = !state.ui.showMetricsPanel;
    },
  },
  extraReducers: builder => {
    // Fetch monitoring metrics
    builder
      .addCase(fetchMonitoringMetrics.pending, state => {
        state.loading.metrics = true;
      })
      .addCase(fetchMonitoringMetrics.fulfilled, (state, _action) => {
        state.loading.metrics = false;
        // Metrics will be processed through specific update actions
      })
      .addCase(fetchMonitoringMetrics.rejected, (state, action) => {
        state.loading.metrics = false;
        state.error.metrics = action.payload;
      });

    // Load Wednesday plan
    builder
      .addCase(loadWednesdayPlan.pending, state => {
        state.loading.plan = true;
      })
      .addCase(loadWednesdayPlan.fulfilled, (state, action) => {
        state.loading.plan = false;
        state.knowledgeBase.plan.content = action.payload;
      })
      .addCase(loadWednesdayPlan.rejected, (state, action) => {
        state.loading.plan = false;
        state.error.plan = action.payload;
      });
  },
});

// Selectors
export const selectWednesdayPlan = state => state.wednesday.plan;
export const selectZoeRequirements = state => state.wednesday.zoe.requirements;
export const selectZoeMetrics = state => state.wednesday.zoe.metrics;
export const selectZoeApprovedChanges = state => state.wednesday.zoe.approvedChanges;
export const selectAuroraMonitoring = state => state.wednesday.aurora.monitoring;
export const selectAuroraFindings = state => state.wednesday.aurora.findings;
export const selectActiveEscalations = state => state.wednesday.escalations.active;
export const selectEscalationHistory = state => state.wednesday.escalations.history;
export const selectTimelineProgress = state => state.wednesday.timeline;
export const selectKnowledgeBase = state => state.wednesday.knowledgeBase.plan;
export const selectUIState = state => state.wednesday.ui;
export const selectCriticalAlerts = createSelector([selectAuroraFindings], findings =>
  findings.criticalIssues.filter(i => i.status === 'open')
);
export const selectOpenBlockers = createSelector([selectAuroraFindings], findings =>
  findings.blockers.filter(b => b.status === 'open')
);

export const {
  startWednesdayExecution,
  completeWednesdayExecution,
  updateRequirementStatus,
  recordZoeApprovedChange,
  updateMetricActual,
  updateVercelMetrics,
  updateMongoDBMetrics,
  updateAPIEndpointStatus,
  updateServiceHealth,
  addCriticalIssue,
  addBlocker,
  addPerformanceAlert,
  createEscalation,
  notifyZoe,
  resolveEscalation,
  startMorningSession,
  completeMorningSession,
  startAfternoonSession,
  completeAfternoonSession,
  recordTaskCompletion,
  loadPlanContent,
  setActiveTab,
  toggleMetricsPanel,
} = wednesdayPlanSlice.actions;

export default wednesdayPlanSlice.reducer;
