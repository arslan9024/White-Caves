// ============================================================================
// AI ASSISTANT DASHBOARD — INITIAL STATE FACTORY
// Extracted from aiAssistantDashboardSlice.tsx for maintainability
// ============================================================================

import type { AIAssistantDashboardState } from './types';
import {
  AI_ASSISTANTS_REGISTRY,
  generateActivities,
  generateNotifications,
  generateTasks,
} from './registry';

// ── Magic-number constants ──────────────────────────────────────────────
export const MAX_RECENT_ASSISTANTS = 5;
export const MAX_ACTIVITY_LOG = 50;
export const MAX_AUDIT_LOG = 100;

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================

export const getInitialState = (): AIAssistantDashboardState => ({
  allAssistants: {
    byId: AI_ASSISTANTS_REGISTRY,
    allIds: Object.keys(AI_ASSISTANTS_REGISTRY),
    isLoading: false,
    lastFetched: null,
  },

  ui: {
    selectedAssistant: 'mary',
    viewMode: 'dashboard',
    layout: 'grid',
    filters: { department: 'all', status: 'all', searchQuery: '' },
    dropdownOpen: false,
  },

  sidebar: {
    isOpen: true,
    isCollapsed: false,
    activeAssistantId: null,
    position: 'right',
  },

  notifications: {
    byAssistantId: generateNotifications(),
    globalUnreadCount: 0,
    lastFetched: null,
  },

  tasks: {
    byAssistantId: generateTasks(),
    activeTasksCount: 0,
  },

  assistantPerformance: {
    overallHealth: 95,
    activeTasks: 47,
    criticalAlerts: [],
    recentActivity: generateActivities(),
  },

  favorites: ['nadia', 'mary', 'clara'],
  recent: ['mary', 'nadia'],

  ownerPreferences: {
    favoriteAssistants: ['nadia', 'mary', 'clara'],
    defaultAssistant: 'mary',
    dashboardLayout: 'default',
    notificationSettings: {
      assistantUpdates: true,
      criticalAlerts: true,
      performanceReports: true,
    },
  },

  liveUpdates: {
    lastUpdate: null,
    connections: {},
    isConnected: false,
  },

  executiveSuggestions: {
    inbox: [
      {
        id: 'sugg_001',
        fromAssistant: 'clara',
        assistantDepartment: 'sales',
        priority: 'high',
        type: 'process_improvement',
        title: 'Automate lead follow-up with new AI tool',
        analysis:
          'Weekly research identified 40% of lost leads cited slow response times. Implementing automated follow-up can reduce first-response time from 2hrs to 5min, potentially increasing conversion by 15%.',
        dataPoints: [
          'Source: Dubai Real Estate Market Report Q4',
          'Case Study: PropertyCo saw 18% conversion growth',
        ],
        projectedImpact: 'High impact on sales velocity',
        confidence: 0.85,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed',
      },
      {
        id: 'sugg_002',
        fromAssistant: 'olivia',
        assistantDepartment: 'marketing',
        priority: 'medium',
        type: 'new_opportunity',
        title: 'Video content generates 3x engagement for luxury properties',
        analysis:
          'Research shows video tours for luxury properties get 3x more engagement on Instagram. Suggest reallocating 20% of content budget to 3D virtual tour videos for top listings.',
        dataPoints: [
          'Source: Instagram Business Analytics',
          'Competitor Analysis: Palm Realty increased inquiries 40%',
        ],
        projectedImpact: 'Medium-high impact on lead generation',
        confidence: 0.78,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed',
      },
      {
        id: 'sugg_003',
        fromAssistant: 'nancy',
        assistantDepartment: 'operations',
        priority: 'low',
        type: 'cost_saving',
        title: 'Surge in demand for Sustainability Officers in real estate',
        analysis:
          'Job market scan shows 30% surge in demand for Sustainability Officers. Creating a green initiative role could enhance brand value and attract top talent.',
        dataPoints: [
          'Source: LinkedIn Jobs Report UAE',
          'Industry Trend: ESG-focused firms see 25% lower attrition',
        ],
        projectedImpact: 'Long-term brand and talent benefit',
        confidence: 0.72,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: 'acknowledged',
      },
      {
        id: 'sugg_004',
        fromAssistant: 'theodora',
        assistantDepartment: 'finance',
        priority: 'critical',
        type: 'risk_alert',
        title: 'Payment collection delays increasing DSO',
        analysis:
          'Days Sales Outstanding increased 12% this quarter. Implementing automated payment reminders could recover AED 2.4M in delayed receivables.',
        dataPoints: [
          'Source: Internal Finance Dashboard',
          'Benchmark: Industry average DSO is 15 days lower',
        ],
        projectedImpact: 'Direct cash flow improvement',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed',
      },
    ],
    filters: { priority: 'all', department: 'all', status: 'unreviewed' },
    lastRefresh: new Date().toISOString(),
  },

  oliviaAutomation: {
    syncSchedule: '3days',
    lastPropertySync: null,
    lastMarketResearch: null,
    activeMonitoring: true,
    insightsData: {
      priceIndex: 152.3,
      priceChange: 2.4,
      avgRentalYield: 6.8,
      supplyDemandRatio: 0.78,
      hotspots: ['Dubai Hills', 'DAMAC Hills 2', 'Palm Jumeirah'],
      lastUpdated: new Date().toISOString(),
    },
    coordination: {
      maryConnected: true,
      inventoryAccess: true,
      lastInventoryFetch: null,
    },
    monitoredSites: [
      { name: 'Bayut', status: 'healthy', lastCheck: null },
      { name: 'Property Finder', status: 'healthy', lastCheck: null },
      { name: 'Dubizzle', status: 'healthy', lastCheck: null },
    ],
    activityLog: [],
  },

  confidentialVault: {
    documents: [
      {
        id: 'doc_001',
        name: 'Q4 Acquisition Strategy.pdf',
        category: 'strategy',
        accessLevel: 'executive',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        accessLog: [],
        meta: { pages: 24, size: '2.4MB' },
      },
      {
        id: 'doc_002',
        name: 'Investor Presentation 2026.pptx',
        category: 'finance',
        accessLevel: 'board',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        accessLog: [],
        meta: { pages: 45, size: '8.1MB' },
      },
      {
        id: 'doc_003',
        name: 'HR Compensation Structure.xlsx',
        category: 'hr',
        accessLevel: 'executive',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        accessLog: [],
        meta: { pages: 1, size: '1.2MB' },
      },
    ],
    accessRequests: [],
    permissions: {
      zoe: ['admin', 'view', 'request'],
      theodora: ['view', 'request'],
      nancy: ['request'],
      aurora: ['admin', 'view'],
      laila: ['view', 'request'],
    },
    vaultStats: { totalDocuments: 3, pendingRequests: 0, recentAccesses: 0 },
  },

  leadManagementHub: {
    incomingLeads: [],
    processedLeads: {},
    specialistPipelines: {
      sophia: {
        leadIds: [],
        pipelineStages: ['New', 'Contacted', 'Viewed', 'Negotiation', 'Closed'],
      },
      daisy: {
        leadIds: [],
        pipelineStages: ['New', 'Tour Scheduled', 'Application', 'Approved', 'Lease Signed'],
      },
    },
    funnelMetrics: {
      totalIncoming: 156,
      rentVsSaleRatio: '58:42',
      avgQualificationTime: '1.8h',
      conversionRate: 0.23,
    },
    leadScoringRules: {
      urgencyWeight: 0.3,
      budgetWeight: 0.25,
      engagementWeight: 0.25,
      sourceWeight: 0.2,
    },
  },

  complianceEngine: {
    kycProfiles: {},
    amlMonitor: {
      flaggedTransactions: [],
      watchlistMatches: [],
      investigationQueue: [],
    },
    auditLog: [],
    complianceMetrics: {
      totalProfiles: 89,
      pendingReview: 12,
      approvedThisMonth: 34,
      riskScore: 0.15,
    },
  },

  initialized: true,
});
