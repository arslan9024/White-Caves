import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
  SliceCaseReducers
} from '@reduxjs/toolkit';
import { RootState } from '../index';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AssistantCapability extends String {
  [index: number]: string;
}

interface AssistantPermissions {
  viewableBy: string[];
  accessibleBy: string[];
  dataAccessLevel: 'full' | 'departmental' | 'limited';
}

interface AssistantMetrics {
  lastActive: string | null;
  tasksCompleted: number;
  activeUsers: number;
  systemHealth: 'optimal' | 'degraded' | 'offline';
}

interface QuickStat {
  value: number | string;
  label: string;
  change: number;
}

interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
}

interface SystemModules {
  [key: string]: boolean;
}

interface DesignMetrics {
  componentCount: number;
  accessibilityScore: number;
  lighthouseScore: number;
  bundleSize: string;
}

interface BackendMetrics {
  apiCount: number;
  avgResponseTime: number;
  cacheHitRate: number;
  dbConnections: number;
}

interface AIAssistant {
  id: string;
  name: string;
  title: string;
  department: string;
  icon: string;
  colorScheme: string;
  avatar: string;
  description: string;
  capabilities: string[];
  permissions: AssistantPermissions;
  metrics: AssistantMetrics;
  quickStats: QuickStat;
  dashboardUrl: string;
  apiEndpoints: string[];
  techStack?: TechStack;
  systemModules?: SystemModules;
  designMetrics?: DesignMetrics;
  backendMetrics?: BackendMetrics;
}

interface AssistantsRegistry {
  byId: Record<string, AIAssistant>;
  allIds: string[];
  isLoading: boolean;
  lastFetched: string | null;
}

interface UIFilters {
  department: string;
  status: string;
  searchQuery: string;
}

interface UIState {
  selectedAssistant: string;
  viewMode: string;
  layout: 'grid' | 'list';
  filters: UIFilters;
  dropdownOpen: boolean;
}

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  activeAssistantId: string | null;
  position: 'left' | 'right';
}

interface Notification {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
  timestamp: string;
  [key: string]: unknown;
}

interface NotificationsState {
  byAssistantId: Record<string, Notification[]>;
  globalUnreadCount: number;
  lastFetched: string | null;
}

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'assigned';
  assignedTo: string | null;
  dueDate: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface TasksState {
  byAssistantId: Record<string, Task[]>;
  activeTasksCount: number;
}

interface Activity {
  id: number;
  assistantId: string;
  action: string;
  target: string;
  timestamp: string;
  type: string;
  [key: string]: unknown;
}

interface AssistantPerformance {
  overallHealth: number;
  activeTasks: number;
  criticalAlerts: Array<Record<string, unknown>>;
  recentActivity: Activity[];
}

interface OwnerPreferences {
  favoriteAssistants: string[];
  defaultAssistant: string;
  dashboardLayout: string;
  notificationSettings: {
    assistantUpdates: boolean;
    criticalAlerts: boolean;
    performanceReports: boolean;
  };
}

interface LiveUpdates {
  lastUpdate: string | null;
  connections: Record<string, unknown>;
  isConnected: boolean;
}

interface ExecutiveSuggestion {
  id: string;
  fromAssistant: string;
  assistantDepartment: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  title: string;
  analysis: string;
  dataPoints: string[];
  projectedImpact: string;
  confidence: number;
  timestamp: string;
  status: 'unreviewed' | 'acknowledged' | 'pending';
}

interface ExecutiveSuggestionsState {
  inbox: ExecutiveSuggestion[];
  filters: {
    priority: string;
    department: string;
    status: string;
  };
  lastRefresh: string;
}

interface MonitoredSite {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  lastCheck: string | null;
  dataPoints?: unknown;
}

interface OliviaInsights {
  priceIndex: number;
  priceChange: number;
  avgRentalYield: number;
  supplyDemandRatio: number;
  hotspots: string[];
  lastUpdated: string;
}

interface OliviaCoordination {
  maryConnected: boolean;
  inventoryAccess: boolean;
  lastInventoryFetch: string | null;
}

interface OliviaAutomationState {
  syncSchedule: string;
  lastPropertySync: string | null;
  lastMarketResearch: string | null;
  activeMonitoring: boolean;
  insightsData: OliviaInsights;
  coordination: OliviaCoordination;
  monitoredSites: MonitoredSite[];
  activityLog: Activity[];
}

interface VaultDocument {
  id: string;
  name: string;
  category: string;
  accessLevel: string;
  createdAt: string;
  accessLog: Array<Record<string, unknown>>;
  meta: Record<string, unknown>;
}

interface VaultAccessRequest {
  id: string;
  documentId: string;
  requesterId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  denyReason?: string;
}

interface VaultStats {
  totalDocuments: number;
  pendingRequests: number;
  recentAccesses: number;
}

interface ConfidentialVaultState {
  documents: VaultDocument[];
  accessRequests: VaultAccessRequest[];
  permissions: Record<string, string[]>;
  vaultStats: VaultStats;
}

interface Lead {
  id: string;
  receivedAt: string;
  initialIntent?: unknown;
  [key: string]: unknown;
}

interface ProcessedLead {
  status: 'qualified' | 'routed';
  assignedIntent: unknown;
  qualificationScore: number;
  structuredData: unknown;
  qualifiedAt: string;
  routedTo: string | null;
  routedAt: string | null;
  currentStage?: string;
}

interface SpecialistPipeline {
  leadIds: string[];
  pipelineStages: string[];
}

interface FunnelMetrics {
  totalIncoming: number;
  rentVsSaleRatio: string;
  avgQualificationTime: string;
  conversionRate: number;
}

interface LeadScoringRules {
  [key: string]: number;
}

interface LeadManagementHubState {
  incomingLeads: Lead[];
  processedLeads: Record<string, ProcessedLead>;
  specialistPipelines: Record<string, SpecialistPipeline>;
  funnelMetrics: FunnelMetrics;
  leadScoringRules: LeadScoringRules;
}

interface AMLMonitor {
  flaggedTransactions: Array<Record<string, unknown>>;
  watchlistMatches: Array<Record<string, unknown>>;
  investigationQueue: string[];
}

interface ComplianceMetrics {
  totalProfiles: number;
  pendingReview: number;
  approvedThisMonth: number;
  riskScore: number;
}

interface ComplianceEngineState {
  kycProfiles: Record<string, unknown>;
  amlMonitor: AMLMonitor;
  auditLog: Array<Record<string, unknown>>;
  complianceMetrics: ComplianceMetrics;
}

interface AIAssistantDashboardState {
  allAssistants: AssistantsRegistry;
  ui: UIState;
  sidebar: SidebarState;
  notifications: NotificationsState;
  tasks: TasksState;
  assistantPerformance: AssistantPerformance;
  favorites: string[];
  recent: string[];
  ownerPreferences: OwnerPreferences;
  liveUpdates: LiveUpdates;
  executiveSuggestions: ExecutiveSuggestionsState;
  oliviaAutomation: OliviaAutomationState;
  confidentialVault: ConfidentialVaultState;
  leadManagementHub: LeadManagementHubState;
  complianceEngine: ComplianceEngineState;
  initialized: boolean;
}

// ============================================================================
// REGISTRY DATA
// ============================================================================

const AI_ASSISTANTS_REGISTRY: Record<string, AIAssistant> = {
  mary: {
    id: 'mary',
    name: 'Mary',
    title: 'Inventory & Data Manager',
    department: 'operations',
    icon: 'FileText',
    colorScheme: '#3B82F6',
    avatar: '👩‍💻',
    description:
      'Manages DAMAC Hills 2 property inventory with 9,378+ units, data acquisition tools, and asset management',
    capabilities: [
      'property_crud',
      'data_tools',
      'asset_fetcher',
      'filtering',
      'excel_import',
      'ocr_extraction'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 156,
      activeUsers: 3,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 9378,
      label: 'Properties',
      change: 0
    },
    dashboardUrl: '/owner/dashboard?tab=mary',
    apiEndpoints: ['/api/inventory', '/api/properties', '/api/assets']
  },
  theodora: {
    id: 'theodora',
    name: 'Theodora',
    title: 'Finance & Accounts Director',
    department: 'finance',
    icon: 'DollarSign',
    colorScheme: '#F59E0B',
    avatar: '👩‍💼',
    description:
      'Manages financial operations, invoicing, payment tracking, and accounting reports',
    capabilities: [
      'invoice_management',
      'payment_tracking',
      'financial_reports',
      'budget_analysis'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'finance_manager'],
      accessibleBy: ['owner', 'admin', 'finance_manager'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 89,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 12,
      label: 'Invoices',
      change: 8.5
    },
    dashboardUrl: '/owner/dashboard?tab=theodora',
    apiEndpoints: ['/api/finance', '/api/invoices', '/api/payments']
  },
  olivia: {
    id: 'olivia',
    name: 'Olivia',
    title: 'Marketing & Brand Manager',
    department: 'marketing',
    icon: 'Megaphone',
    colorScheme: '#EC4899',
    avatar: '👩‍🎨',
    description:
      'Manages marketing campaigns, social media, property listings, and brand communications',
    capabilities: [
      'campaign_management',
      'social_media',
      'listing_optimization',
      'analytics'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin', 'marketing_manager'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 234,
      activeUsers: 4,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 15,
      label: 'Campaigns',
      change: 12.3
    },
    dashboardUrl: '/owner/dashboard?tab=olivia',
    apiEndpoints: ['/api/marketing', '/api/campaigns', '/api/social']
  },
  zoe: {
    id: 'zoe',
    name: 'Zoe',
    title: 'Executive Assistant',
    department: 'executive',
    icon: 'Briefcase',
    colorScheme: '#10B981',
    avatar: '👩‍🏫',
    description:
      'Executive support, calendar management, meeting coordination, and strategic planning assistance',
    capabilities: [
      'calendar_management',
      'meeting_scheduling',
      'task_delegation',
      'executive_reports'
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 312,
      activeUsers: 1,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 8,
      label: 'Meetings',
      change: -5.2
    },
    dashboardUrl: '/owner/dashboard?tab=zoe',
    apiEndpoints: ['/api/executive', '/api/calendar', '/api/meetings']
  },
  laila: {
    id: 'laila',
    name: 'Laila',
    title: 'Compliance & Legal Officer',
    department: 'compliance',
    icon: 'Shield',
    colorScheme: '#6366F1',
    avatar: '👩‍⚖️',
    description:
      'Manages regulatory compliance, legal documentation, KYC/AML processes, and contract reviews',
    capabilities: [
      'kyc_verification',
      'aml_monitoring',
      'contract_review',
      'compliance_reports'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin', 'legal_manager'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 67,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 5,
      label: 'Reviews',
      change: 0
    },
    dashboardUrl: '/owner/dashboard?tab=laila',
    apiEndpoints: ['/api/compliance', '/api/legal', '/api/kyc']
  },
  linda: {
    id: 'linda',
    name: 'Linda',
    title: 'WhatsApp CRM Manager',
    department: 'communications',
    icon: 'MessageSquare',
    colorScheme: '#25D366',
    avatar: '👩‍💼',
    description:
      'Manages 23+ agent WhatsApp numbers, conversation routing, template messaging, and lead pre-qualification',
    capabilities: [
      'conversation_management',
      'lead_scoring',
      'quick_replies',
      'ai_insights',
      'agent_status_monitoring',
      'broadcast_management'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 892,
      activeUsers: 6,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 47,
      label: 'Conversations',
      change: 15.8
    },
    dashboardUrl: '/owner/dashboard?tab=linda',
    apiEndpoints: ['/api/whatsapp', '/api/conversations', '/api/templates']
  },
  sophia: {
    id: 'sophia',
    name: 'Sophia',
    title: 'Sales Pipeline Manager',
    department: 'sales',
    icon: 'Users',
    colorScheme: '#8B5CF6',
    avatar: '👩‍💻',
    description:
      'Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics',
    capabilities: [
      'pipeline_management',
      'lead_assignment',
      'deal_tracking',
      'sales_forecasting'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 456,
      activeUsers: 8,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 23,
      label: 'Active Deals',
      change: 4.2
    },
    dashboardUrl: '/owner/dashboard?tab=sophia',
    apiEndpoints: ['/api/sales', '/api/pipeline', '/api/deals']
  },
  daisy: {
    id: 'daisy',
    name: 'Daisy',
    title: 'Leasing & Tenant Manager',
    department: 'operations',
    icon: 'Home',
    colorScheme: '#14B8A6',
    avatar: '👩‍🔧',
    description:
      'Manages rental properties, tenant communications, lease agreements, and maintenance requests',
    capabilities: [
      'lease_management',
      'tenant_communications',
      'maintenance_tracking',
      'rental_analytics'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'leasing_manager'],
      accessibleBy: ['owner', 'admin', 'leasing_manager'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 178,
      activeUsers: 5,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 156,
      label: 'Active Leases',
      change: 2.1
    },
    dashboardUrl: '/owner/dashboard?tab=daisy',
    apiEndpoints: ['/api/leasing', '/api/tenants', '/api/maintenance']
  },
  clara: {
    id: 'clara',
    name: 'Clara',
    title: 'Leads CRM Manager',
    department: 'sales',
    icon: 'Target',
    colorScheme: '#EF4444',
    avatar: '👩‍🎯',
    description:
      'Manages lead pipeline, qualification, nurturing workflows, and conversion tracking',
    capabilities: [
      'lead_management',
      'qualification',
      'nurturing',
      'conversion_tracking',
      'activity_timeline'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 234,
      activeUsers: 6,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 38,
      label: 'Active Leads',
      change: 12.5
    },
    dashboardUrl: '/owner/dashboard?tab=clara',
    apiEndpoints: ['/api/leads', '/api/pipeline', '/api/activities']
  },
  nina: {
    id: 'nina',
    name: 'Nina',
    title: 'WhatsApp Bot Developer',
    department: 'communications',
    icon: 'Bot',
    colorScheme: '#06B6D4',
    avatar: '👩‍💻',
    description:
      'Develops and manages WhatsApp automation bots, conversation flows, and bot analytics',
    capabilities: ['bot_development', 'flow_design', 'session_management', 'analytics'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 45,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 3,
      label: 'Active Bots',
      change: 0
    },
    dashboardUrl: '/owner/dashboard?tab=nina',
    apiEndpoints: ['/api/bots', '/api/flows', '/api/sessions']
  },
  nancy: {
    id: 'nancy',
    name: 'Nancy',
    title: 'HR Manager',
    department: 'operations',
    icon: 'Users2',
    colorScheme: '#F97316',
    avatar: '👩‍💼',
    description:
      'Manages employee records, recruitment, performance reviews, and HR operations',
    capabilities: [
      'employee_management',
      'recruitment',
      'performance_tracking',
      'attendance'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'hr_manager'],
      accessibleBy: ['owner', 'admin', 'hr_manager'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 89,
      activeUsers: 3,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 24,
      label: 'Employees',
      change: 0
    },
    dashboardUrl: '/owner/dashboard?tab=nancy',
    apiEndpoints: ['/api/hr', '/api/employees', '/api/recruitment']
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    title: 'Chief Technology Officer',
    department: 'technology',
    icon: 'Server',
    colorScheme: '#0EA5E9',
    avatar: '👩‍💻',
    description:
      'Oversees all technical operations, system architecture, deployment pipelines, and application portfolio management',
    capabilities: [
      'system_health_monitoring',
      'deployment_pipeline',
      'application_portfolio',
      'performance_analytics',
      'dependency_management',
      'infrastructure_monitoring',
      'mobile_app_management',
      'api_performance_tracking'
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 234,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 99.98,
      label: 'Uptime %',
      change: 0.02
    },
    dashboardUrl: '/owner/dashboard?tab=aurora',
    apiEndpoints: ['/api/system', '/api/deployments', '/api/applications'],
    techStack: {
      frontend: ['React 18', 'Redux Toolkit', 'Vite'],
      backend: ['Node.js 20', 'Express', 'MongoDB 7'],
      database: ['MongoDB', 'Redis'],
      infrastructure: ['Replit', 'MongoDB Atlas']
    },
    systemModules: {
      applicationPortfolio: true,
      developmentLifecycle: true,
      systemHealthMonitor: true,
      deploymentPipeline: true,
      apiPerformance: true
    }
  },
  hazel: {
    id: 'hazel',
    name: 'Hazel',
    title: 'Elite Frontend Engineer',
    department: 'technology',
    icon: 'Palette',
    colorScheme: '#F472B6',
    avatar: '👩‍🎨',
    description:
      'Designs and builds pixel-perfect UI components, maintains the design system, and ensures accessibility compliance across all interfaces',
    capabilities: [
      'component_library',
      'design_system',
      'responsive_design',
      'accessibility_audit',
      'ui_performance',
      'animation_system',
      'theme_management'
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 178,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 47,
      label: 'Components',
      change: 3.2
    },
    dashboardUrl: '/owner/dashboard?tab=hazel',
    apiEndpoints: ['/api/frontend', '/api/components', '/api/design-system'],
    designMetrics: {
      componentCount: 47,
      accessibilityScore: 98,
      lighthouseScore: 94,
      bundleSize: '7.9 MB'
    }
  },
  willow: {
    id: 'willow',
    name: 'Willow',
    title: 'Elite Backend Engineer',
    department: 'technology',
    icon: 'Database',
    colorScheme: '#22C55E',
    avatar: '👨‍💻',
    description:
      'Architects backend services, optimizes database queries, manages API performance, and ensures system reliability and scalability',
    capabilities: [
      'api_development',
      'database_optimization',
      'caching_strategies',
      'websocket_realtime',
      'data_pipeline',
      'security_hardening',
      'load_balancing'
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 156,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 45,
      label: 'APIs',
      change: 2.1
    },
    dashboardUrl: '/owner/dashboard?tab=willow',
    apiEndpoints: ['/api/backend', '/api/performance', '/api/database'],
    backendMetrics: {
      apiCount: 45,
      avgResponseTime: 89,
      cacheHitRate: 94.5,
      dbConnections: 12
    }
  },
  evangeline: {
    id: 'evangeline',
    name: 'Evangeline',
    title: 'Legal Risk Analyst',
    department: 'legal',
    icon: 'Scale',
    colorScheme: '#DC2626',
    avatar: '👩‍⚖️',
    description:
      'Proactively identifies, documents, and helps resolve legal issues. Monitors contracts, regulations, and transaction compliance',
    capabilities: [
      'legal_risk_analysis',
      'contract_monitoring',
      'regulatory_tracking',
      'dispute_prevention',
      'best_practices_library',
      'due_diligence'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 45,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 12,
      label: 'Reviews',
      change: 3.5
    },
    dashboardUrl: '/owner/dashboard?tab=evangeline',
    apiEndpoints: ['/api/legal', '/api/risks', '/api/contracts']
  },
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Property Monitoring AI',
    department: 'operations',
    icon: 'Eye',
    colorScheme: '#7C3AED',
    avatar: '🛡️',
    description:
      'IoT integration for property condition monitoring, predictive maintenance scheduling, and emergency response coordination',
    capabilities: [
      'iot_monitoring',
      'predictive_maintenance',
      'inspection_scheduling',
      'vendor_management',
      'emergency_response',
      'property_health_tracking'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 89,
      activeUsers: 3,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 156,
      label: 'Properties',
      change: 0
    },
    dashboardUrl: '/owner/dashboard?tab=sentinel',
    apiEndpoints: ['/api/monitoring', '/api/maintenance', '/api/inspections']
  },
  hunter: {
    id: 'hunter',
    name: 'Hunter',
    title: 'Lead Prospecting AI',
    department: 'sales',
    icon: 'Search',
    colorScheme: '#0D9488',
    avatar: '🎯',
    description:
      'Scrapes and analyzes potential client databases, identifies property buying/selling patterns, and manages automated outreach',
    capabilities: [
      'prospect_analysis',
      'market_scanning',
      'pattern_detection',
      'outreach_automation',
      'lead_enrichment',
      'competitor_tracking'
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    metrics: {
      lastActive: null,
      tasksCompleted: 67,
      activeUsers: 2,
      systemHealth: 'optimal'
    },
    quickStats: {
      value: 34,
      label: 'Prospects',
      change: 8.2
    },
    dashboardUrl: '/owner/dashboard?tab=hunter',
    apiEndpoints: ['/api/prospecting', '/api/outreach', '/api/enrichment']
  }
};

const DEPARTMENT_COLORS: Record<string, string> = {
  operations: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  finance: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  marketing: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  executive: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  compliance: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  communications: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  sales: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
  technology: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  legal: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateActivities = (): Activity[] => {
  const now = Date.now();
  return [
    {
      id: 1,
      assistantId: 'linda',
      action: 'New lead captured from WhatsApp',
      target: 'Ahmed Al-Rashid',
      timestamp: new Date(now - 300000).toISOString(),
      type: 'success'
    },
    {
      id: 2,
      assistantId: 'clara',
      action: 'Lead stage updated to Qualified',
      target: 'Sarah Johnson',
      timestamp: new Date(now - 600000).toISOString(),
      type: 'success'
    },
    {
      id: 3,
      assistantId: 'mary',
      action: 'Property data imported',
      target: '23 new units from Excel',
      timestamp: new Date(now - 900000).toISOString(),
      type: 'success'
    },
    {
      id: 4,
      assistantId: 'theodora',
      action: 'Invoice generated',
      target: 'INV-2024-0156',
      timestamp: new Date(now - 1200000).toISOString(),
      type: 'info'
    },
    {
      id: 5,
      assistantId: 'sophia',
      action: 'Deal closed successfully',
      target: 'Villa 348 - AED 2.5M',
      timestamp: new Date(now - 1500000).toISOString(),
      type: 'success'
    },
    {
      id: 6,
      assistantId: 'nancy',
      action: 'Interview scheduled',
      target: 'Mohammed Ali - Sales Agent',
      timestamp: new Date(now - 1800000).toISOString(),
      type: 'pending'
    },
    {
      id: 7,
      assistantId: 'laila',
      action: 'KYC verification completed',
      target: 'James Wilson',
      timestamp: new Date(now - 2100000).toISOString(),
      type: 'success'
    },
    {
      id: 8,
      assistantId: 'nina',
      action: 'Bot session started',
      target: 'Lion0 WhatsApp Bot',
      timestamp: new Date(now - 2400000).toISOString(),
      type: 'active'
    },
    {
      id: 9,
      assistantId: 'daisy',
      action: 'Lease renewal processed',
      target: 'Unit 156 - Palm Views',
      timestamp: new Date(now - 2700000).toISOString(),
      type: 'success'
    },
    {
      id: 10,
      assistantId: 'olivia',
      action: 'Campaign launched',
      target: 'Summer Property Showcase',
      timestamp: new Date(now - 3000000).toISOString(),
      type: 'success'
    },
    {
      id: 11,
      assistantId: 'aurora',
      action: 'System health check completed',
      target: 'All services healthy',
      timestamp: new Date(now - 3300000).toISOString(),
      type: 'success'
    },
    {
      id: 12,
      assistantId: 'aurora',
      action: 'Deployment successful',
      target: 'WhatsApp CRM v2.4.1',
      timestamp: new Date(now - 3600000).toISOString(),
      type: 'success'
    }
  ];
};

const generateNotifications = (): Record<string, Notification[]> => {
  const now = Date.now();
  return {
    linda: [
      {
        id: 'n1',
        type: 'lead',
        message: 'New lead from WhatsApp',
        severity: 'info',
        isRead: false,
        timestamp: new Date(now - 120000).toISOString()
      },
      {
        id: 'n2',
        type: 'task',
        message: 'Agent quota exceeded',
        severity: 'warning',
        isRead: false,
        timestamp: new Date(now - 300000).toISOString()
      }
    ],
    clara: [
      {
        id: 'n3',
        type: 'lead',
        message: 'Lead requires follow-up',
        severity: 'warning',
        isRead: false,
        timestamp: new Date(now - 180000).toISOString()
      }
    ],
    theodora: [
      {
        id: 'n4',
        type: 'payment',
        message: 'Invoice overdue',
        severity: 'critical',
        isRead: false,
        timestamp: new Date(now - 240000).toISOString()
      }
    ],
    mary: [],
    nina: [
      {
        id: 'n5',
        type: 'bot',
        message: 'Bot session expired',
        severity: 'warning',
        isRead: false,
        timestamp: new Date(now - 360000).toISOString()
      }
    ],
    nancy: [],
    sophia: [
      {
        id: 'n6',
        type: 'deal',
        message: 'Deal awaiting approval',
        severity: 'info',
        isRead: false,
        timestamp: new Date(now - 420000).toISOString()
      }
    ],
    daisy: [],
    olivia: [],
    zoe: [
      {
        id: 'n7',
        type: 'meeting',
        message: 'Meeting in 30 minutes',
        severity: 'info',
        isRead: false,
        timestamp: new Date(now - 60000).toISOString()
      }
    ],
    laila: [],
    aurora: [],
    hazel: [],
    willow: []
  };
};

const generateTasks = (): Record<string, Task[]> => ({
  linda: [
    {
      id: 't1',
      title: 'Review unassigned conversations',
      priority: 'high',
      status: 'pending',
      assignedTo: null,
      dueDate: new Date().toISOString()
    }
  ],
  clara: [
    {
      id: 't2',
      title: 'Follow up with hot leads',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'agent_1',
      dueDate: new Date().toISOString()
    }
  ],
  theodora: [
    {
      id: 't3',
      title: 'Process pending invoices',
      priority: 'medium',
      status: 'pending',
      assignedTo: null,
      dueDate: new Date().toISOString()
    }
  ],
  mary: [],
  nina: [],
  nancy: [],
  sophia: [],
  daisy: [],
  olivia: [],
  zoe: [],
  laila: [],
  aurora: [],
  hazel: [],
  willow: []
});

const getInitialState = (): AIAssistantDashboardState => ({
  allAssistants: {
    byId: AI_ASSISTANTS_REGISTRY,
    allIds: Object.keys(AI_ASSISTANTS_REGISTRY),
    isLoading: false,
    lastFetched: null
  },

  ui: {
    selectedAssistant: 'mary',
    viewMode: 'dashboard',
    layout: 'grid',
    filters: {
      department: 'all',
      status: 'all',
      searchQuery: ''
    },
    dropdownOpen: false
  },

  sidebar: {
    isOpen: true,
    isCollapsed: false,
    activeAssistantId: null,
    position: 'right'
  },

  notifications: {
    byAssistantId: generateNotifications(),
    globalUnreadCount: 0,
    lastFetched: null
  },

  tasks: {
    byAssistantId: generateTasks(),
    activeTasksCount: 0
  },

  assistantPerformance: {
    overallHealth: 95,
    activeTasks: 47,
    criticalAlerts: [],
    recentActivity: generateActivities()
  },

  favorites: ['linda', 'mary', 'clara'],
  recent: ['mary', 'linda'],

  ownerPreferences: {
    favoriteAssistants: ['linda', 'mary', 'clara'],
    defaultAssistant: 'mary',
    dashboardLayout: 'default',
    notificationSettings: {
      assistantUpdates: true,
      criticalAlerts: true,
      performanceReports: true
    }
  },

  liveUpdates: {
    lastUpdate: null,
    connections: {},
    isConnected: false
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
          'Case Study: PropertyCo saw 18% conversion growth'
        ],
        projectedImpact: 'High impact on sales velocity',
        confidence: 0.85,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed'
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
          'Competitor Analysis: Palm Realty increased inquiries 40%'
        ],
        projectedImpact: 'Medium-high impact on lead generation',
        confidence: 0.78,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed'
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
          'Industry Trend: ESG-focused firms see 25% lower attrition'
        ],
        projectedImpact: 'Long-term brand and talent benefit',
        confidence: 0.72,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        status: 'acknowledged'
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
          'Benchmark: Industry average DSO is 15 days lower'
        ],
        projectedImpact: 'Direct cash flow improvement',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'unreviewed'
      }
    ],
    filters: {
      priority: 'all',
      department: 'all',
      status: 'unreviewed'
    },
    lastRefresh: new Date().toISOString()
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
      lastUpdated: new Date().toISOString()
    },
    coordination: {
      maryConnected: true,
      inventoryAccess: true,
      lastInventoryFetch: null
    },
    monitoredSites: [
      { name: 'Bayut', status: 'healthy', lastCheck: null },
      { name: 'Property Finder', status: 'healthy', lastCheck: null },
      { name: 'Dubizzle', status: 'healthy', lastCheck: null }
    ],
    activityLog: []
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
        meta: { pages: 24, size: '2.4MB' }
      },
      {
        id: 'doc_002',
        name: 'Investor Presentation 2026.pptx',
        category: 'finance',
        accessLevel: 'board',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        accessLog: [],
        meta: { pages: 45, size: '8.1MB' }
      },
      {
        id: 'doc_003',
        name: 'HR Compensation Structure.xlsx',
        category: 'hr',
        accessLevel: 'executive',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        accessLog: [],
        meta: { pages: 1, size: '1.2MB' }
      }
    ],
    accessRequests: [],
    permissions: {
      zoe: ['admin', 'view', 'request'],
      theodora: ['view', 'request'],
      nancy: ['request'],
      aurora: ['admin', 'view'],
      laila: ['view', 'request']
    },
    vaultStats: {
      totalDocuments: 3,
      pendingRequests: 0,
      recentAccesses: 0
    }
  },

  leadManagementHub: {
    incomingLeads: [],
    processedLeads: {},
    specialistPipelines: {
      sophia: {
        leadIds: [],
        pipelineStages: ['New', 'Contacted', 'Viewed', 'Negotiation', 'Closed']
      },
      daisy: {
        leadIds: [],
        pipelineStages: ['New', 'Tour Scheduled', 'Application', 'Approved', 'Lease Signed']
      }
    },
    funnelMetrics: {
      totalIncoming: 156,
      rentVsSaleRatio: '58:42',
      avgQualificationTime: '1.8h',
      conversionRate: 0.23
    },
    leadScoringRules: {
      urgencyWeight: 0.3,
      budgetWeight: 0.25,
      engagementWeight: 0.25,
      sourceWeight: 0.2
    }
  },

  complianceEngine: {
    kycProfiles: {},
    amlMonitor: {
      flaggedTransactions: [],
      watchlistMatches: [],
      investigationQueue: []
    },
    auditLog: [],
    complianceMetrics: {
      totalProfiles: 89,
      pendingReview: 12,
      approvedThisMonth: 34,
      riskScore: 0.15
    }
  },

  initialized: true
});

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchAllAssistants = createAsyncThunk(
  'aiAssistantDashboard/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return {
        assistants: AI_ASSISTANTS_REGISTRY,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const updateAssistantMetricsAsync = createAsyncThunk(
  'aiAssistantDashboard/updateMetrics',
  async (
    payload: { assistantId: string; metrics: Partial<AssistantMetrics> },
    { rejectWithValue }
  ) => {
    try {
      return {
        ...payload,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

// ============================================================================
// SLICE DEFINITION
// ============================================================================

const aiAssistantDashboardSlice = createSlice({
  name: 'aiAssistantDashboard',
  initialState: getInitialState(),
  reducers: {
    selectAssistant: (state, action: PayloadAction<string>) => {
      state.ui.selectedAssistant = action.payload;
      if (!state.recent.includes(action.payload)) {
        state.recent.unshift(action.payload);
        if (state.recent.length > 5) state.recent.pop();
      } else {
        state.recent = state.recent.filter((id) => id !== action.payload);
        state.recent.unshift(action.payload);
      }
      state.ui.dropdownOpen = false;
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
      state.ownerPreferences.favoriteAssistants = [...state.favorites];
    },

    updateAssistantMetrics: (
      state,
      action: PayloadAction<{
        assistantId: string;
        metrics: Partial<AssistantMetrics>;
      }>
    ) => {
      const { assistantId, metrics } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics = {
          ...state.allAssistants.byId[assistantId].metrics,
          ...metrics
        };
      }
    },

    updateAssistantHealth: (
      state,
      action: PayloadAction<{
        assistantId: string;
        health: AssistantMetrics['systemHealth'];
      }>
    ) => {
      const { assistantId, health } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics.systemHealth = health;
      }
    },

    setViewMode: (state, action: PayloadAction<string>) => {
      state.ui.viewMode = action.payload;
    },

    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.ui.layout = action.payload;
    },

    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.ui.filters.department = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.ui.filters.status = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.filters.searchQuery = action.payload;
    },

    toggleDropdown: (state) => {
      state.ui.dropdownOpen = !state.ui.dropdownOpen;
    },

    closeDropdown: (state) => {
      state.ui.dropdownOpen = false;
    },

    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const activity: Activity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.assistantPerformance.recentActivity.unshift(activity);
      if (state.assistantPerformance.recentActivity.length > 50) {
        state.assistantPerformance.recentActivity.pop();
      }
    },

    addAlert: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.assistantPerformance.criticalAlerts.push(action.payload);
    },

    dismissAlert: (state, action: PayloadAction<string>) => {
      state.assistantPerformance.criticalAlerts = state.assistantPerformance.criticalAlerts.filter(
        (alert) => (alert as Record<string, unknown>).id !== action.payload
      );
    },

    updateOwnerPreferences: (
      state,
      action: PayloadAction<Partial<OwnerPreferences>>
    ) => {
      state.ownerPreferences = {
        ...state.ownerPreferences,
        ...action.payload
      };
    },

    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.liveUpdates.isConnected = action.payload;
      state.liveUpdates.lastUpdate = new Date().toISOString();
    },

    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },

    collapseSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isCollapsed = action.payload;
    },

    setSidebarActiveAssistant: (state, action: PayloadAction<string | null>) => {
      state.sidebar.activeAssistantId = action.payload;
    },

    addNotification: (
      state,
      action: PayloadAction<{
        assistantId: string;
        notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>;
      }>
    ) => {
      const { assistantId, notification } = action.payload;
      if (!state.notifications.byAssistantId[assistantId]) {
        state.notifications.byAssistantId[assistantId] = [];
      }
      state.notifications.byAssistantId[assistantId].unshift({
        id: `n${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        ...notification
      });
      state.notifications.globalUnreadCount += 1;
    },

    markNotificationRead: (
      state,
      action: PayloadAction<{ assistantId: string; notificationId: string }>
    ) => {
      const { assistantId, notificationId } = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.notifications.globalUnreadCount = Math.max(
            0,
            state.notifications.globalUnreadCount - 1
          );
        }
      }
    },

    markAllNotificationsRead: (state, action: PayloadAction<string>) => {
      const assistantId = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        notifications.forEach((n) => {
          n.isRead = true;
        });
        state.notifications.globalUnreadCount = Math.max(
          0,
          state.notifications.globalUnreadCount - unreadCount
        );
      }
    },

    clearNotifications: (state, action: PayloadAction<string>) => {
      const assistantId = action.payload;
      state.notifications.byAssistantId[assistantId] = [];
    },

    addTask: (
      state,
      action: PayloadAction<{ assistantId: string; task: Omit<Task, 'id' | 'createdAt' | 'status'> }>
    ) => {
      const { assistantId, task } = action.payload;
      if (!state.tasks.byAssistantId[assistantId]) {
        state.tasks.byAssistantId[assistantId] = [];
      }
      state.tasks.byAssistantId[assistantId].push({
        id: `t${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...task
      });
      state.tasks.activeTasksCount += 1;
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{
        assistantId: string;
        taskId: string;
        status: Task['status'];
      }>
    ) => {
      const { assistantId, taskId, status } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          const wasActive = task.status !== 'completed';
          task.status = status;
          if (status === 'completed' && wasActive) {
            state.tasks.activeTasksCount = Math.max(0, state.tasks.activeTasksCount - 1);
          }
        }
      }
    },

    assignTask: (
      state,
      action: PayloadAction<{
        assistantId: string;
        taskId: string;
        agentId: string;
      }>
    ) => {
      const { assistantId, taskId, agentId } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          task.assignedTo = agentId;
          task.status = 'assigned';
        }
      }
    },

    triggerUserAction: (
      state,
      action: PayloadAction<{
        actionType: string;
        sourceAssistant: string;
        targetAssistants: string[];
        data: Record<string, unknown>;
      }>
    ) => {
      const { actionType, sourceAssistant, targetAssistants, data } = action.payload;
      targetAssistants.forEach((targetId) => {
        if (!state.notifications.byAssistantId[targetId]) {
          state.notifications.byAssistantId[targetId] = [];
        }
        state.notifications.byAssistantId[targetId].unshift({
          id: `n${Date.now()}_${targetId}`,
          type: actionType,
          message: `Action from ${sourceAssistant}: ${(data.message as string) || actionType}`,
          severity: (data.severity as Notification['severity']) || 'info',
          isRead: false,
          timestamp: new Date().toISOString(),
          sourceAssistant,
          data
        });
        state.notifications.globalUnreadCount += 1;
      });
    },

    updateOliviaSyncSchedule: (state, action: PayloadAction<string>) => {
      state.oliviaAutomation.syncSchedule = action.payload;
    },

    toggleOliviaMonitoring: (state) => {
      state.oliviaAutomation.activeMonitoring = !state.oliviaAutomation.activeMonitoring;
    },

    updateOliviaPropertySync: (state) => {
      state.oliviaAutomation.lastPropertySync = new Date().toISOString();
    },

    updateOliviaMarketResearch: (state) => {
      state.oliviaAutomation.lastMarketResearch = new Date().toISOString();
    },

    updateOliviaInsights: (state, action: PayloadAction<Partial<OliviaInsights>>) => {
      state.oliviaAutomation.insightsData = {
        ...state.oliviaAutomation.insightsData,
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
    },

    updateOliviaCoordination: (
      state,
      action: PayloadAction<Partial<OliviaCoordination>>
    ) => {
      state.oliviaAutomation.coordination = {
        ...state.oliviaAutomation.coordination,
        ...action.payload
      };
    },

    updateOliviaSiteStatus: (
      state,
      action: PayloadAction<{
        siteName: string;
        status: MonitoredSite['status'];
        dataPoints?: unknown;
      }>
    ) => {
      const { siteName, status, dataPoints } = action.payload;
      const site = state.oliviaAutomation.monitoredSites.find((s) => s.name === siteName);
      if (site) {
        site.status = status;
        site.lastCheck = new Date().toISOString();
        if (dataPoints !== undefined) site.dataPoints = dataPoints;
      }
    },

    addOliviaActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const activity: Activity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.oliviaAutomation.activityLog.unshift(activity);
      if (state.oliviaAutomation.activityLog.length > 50) {
        state.oliviaAutomation.activityLog.pop();
      }
    },

    addExecutiveSuggestion: (
      state,
      action: PayloadAction<Omit<ExecutiveSuggestion, 'id' | 'timestamp' | 'status'>>
    ) => {
      const suggestion: ExecutiveSuggestion = {
        id: `sugg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'unreviewed',
        ...action.payload
      };
      state.executiveSuggestions.inbox.unshift(suggestion);
    },

    updateSuggestionStatus: (
      state,
      action: PayloadAction<{
        suggestionId: string;
        status: ExecutiveSuggestion['status'];
      }>
    ) => {
      const { suggestionId, status } = action.payload;
      const suggestion = state.executiveSuggestions.inbox.find((s) => s.id === suggestionId);
      if (suggestion) {
        suggestion.status = status;
      }
    },

    setSuggestionFilters: (
      state,
      action: PayloadAction<Partial<ExecutiveSuggestionsState['filters']>>
    ) => {
      state.executiveSuggestions.filters = {
        ...state.executiveSuggestions.filters,
        ...action.payload
      };
    },

    clearSuggestionFilters: (state) => {
      state.executiveSuggestions.filters = {
        priority: 'all',
        department: 'all',
        status: 'unreviewed'
      };
    },

    requestVaultAccess: (
      state,
      action: PayloadAction<{
        documentId: string;
        requesterId: string;
        reason: string;
      }>
    ) => {
      const { documentId, requesterId, reason } = action.payload;
      const request: VaultAccessRequest = {
        id: `req_${Date.now()}`,
        documentId,
        requesterId,
        reason,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null
      };
      state.confidentialVault.accessRequests.push(request);
      state.confidentialVault.vaultStats.pendingRequests += 1;
    },

    approveVaultRequest: (
      state,
      action: PayloadAction<{ requestId: string; approverId: string }>
    ) => {
      const { requestId, approverId } = action.payload;
      const request = state.confidentialVault.accessRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = 'approved';
        request.reviewedBy = approverId;
        request.reviewedAt = new Date().toISOString();
        state.confidentialVault.vaultStats.pendingRequests = Math.max(
          0,
          state.confidentialVault.vaultStats.pendingRequests - 1
        );
        state.confidentialVault.vaultStats.recentAccesses += 1;
        const doc = state.confidentialVault.documents.find((d) => d.id === request.documentId);
        if (doc) {
          doc.accessLog.push({
            accessedBy: request.requesterId,
            accessedAt: new Date().toISOString()
          });
        }
      }
    },

    denyVaultRequest: (
      state,
      action: PayloadAction<{
        requestId: string;
        approverId: string;
        reason: string;
      }>
    ) => {
      const { requestId, approverId, reason } = action.payload;
      const request = state.confidentialVault.accessRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = 'denied';
        request.reviewedBy = approverId;
        request.reviewedAt = new Date().toISOString();
        request.denyReason = reason;
        state.confidentialVault.vaultStats.pendingRequests = Math.max(
          0,
          state.confidentialVault.vaultStats.pendingRequests - 1
        );
      }
    },

    addIncomingLead: (
      state,
      action: PayloadAction<Omit<Lead, 'id' | 'receivedAt'>>
    ) => {
      const lead: Lead = {
        id: `lead_${Date.now()}`,
        receivedAt: new Date().toISOString(),
        initialIntent: undefined,
        ...action.payload
      };
      state.leadManagementHub.incomingLeads.push(lead);
      state.leadManagementHub.funnelMetrics.totalIncoming += 1;
    },

    qualifyLead: (
      state,
      action: PayloadAction<{
        leadId: string;
        assignedIntent: unknown;
        qualificationScore: number;
        structuredData: unknown;
      }>
    ) => {
      const { leadId, assignedIntent, qualificationScore, structuredData } = action.payload;
      const lead = state.leadManagementHub.incomingLeads.find((l) => l.id === leadId);
      if (lead) {
        state.leadManagementHub.processedLeads[leadId] = {
          status: 'qualified',
          assignedIntent,
          qualificationScore,
          structuredData,
          qualifiedAt: new Date().toISOString(),
          routedTo: null,
          routedAt: null
        };
      }
    },

    routeLeadToSpecialist: (
      state,
      action: PayloadAction<{ leadId: string; specialist: string }>
    ) => {
      const { leadId, specialist } = action.payload;
      const processed = state.leadManagementHub.processedLeads[leadId];
      if (processed) {
        processed.status = 'routed';
        processed.routedTo = specialist;
        processed.routedAt = new Date().toISOString();
        if (!state.leadManagementHub.specialistPipelines[specialist]) {
          state.leadManagementHub.specialistPipelines[specialist] = {
            leadIds: [],
            pipelineStages: []
          };
        }
        state.leadManagementHub.specialistPipelines[specialist].leadIds.push(leadId);
      }
    },

    updateLeadPipelineStage: (
      state,
      action: PayloadAction<{
        leadId: string;
        specialist: string;
        stage: string;
      }>
    ) => {
      const { leadId, stage } = action.payload;
      const processed = state.leadManagementHub.processedLeads[leadId];
      if (processed) {
        processed.currentStage = stage;
      }
    },

    addComplianceAuditLog: (
      state,
      action: PayloadAction<Omit<Record<string, unknown>, 'id' | 'timestamp'>>
    ) => {
      const entry = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.complianceEngine.auditLog.unshift(entry);
      if (state.complianceEngine.auditLog.length > 100) {
        state.complianceEngine.auditLog.pop();
      }
    },

    flagTransaction: (
      state,
      action: PayloadAction<Omit<Record<string, unknown>, 'id' | 'flaggedAt' | 'status'>>
    ) => {
      const transaction = {
        id: `tx_${Date.now()}`,
        flaggedAt: new Date().toISOString(),
        status: 'pending_review',
        ...action.payload
      };
      state.complianceEngine.amlMonitor.flaggedTransactions.push(transaction);
      state.complianceEngine.amlMonitor.investigationQueue.push(transaction.id as string);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssistants.pending, (state) => {
        state.allAssistants.isLoading = true;
      })
      .addCase(fetchAllAssistants.fulfilled, (state, action) => {
        state.allAssistants.isLoading = false;
        state.allAssistants.lastFetched = action.payload.timestamp;
      })
      .addCase(updateAssistantMetricsAsync.fulfilled, (state, action) => {
        const { assistantId, metrics } = action.payload;
        if (state.allAssistants.byId[assistantId]) {
          state.allAssistants.byId[assistantId].metrics = {
            ...state.allAssistants.byId[assistantId].metrics,
            ...metrics
          };
        }
      });
  }
});

export const {
  selectAssistant,
  toggleFavorite,
  updateAssistantMetrics,
  updateAssistantHealth,
  setViewMode,
  setLayout,
  setDepartmentFilter,
  setStatusFilter,
  setSearchQuery,
  toggleDropdown,
  closeDropdown,
  addActivity,
  addAlert,
  dismissAlert,
  updateOwnerPreferences,
  setConnectionStatus,
  toggleSidebar,
  collapseSidebar,
  setSidebarActiveAssistant,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  addTask,
  updateTaskStatus,
  assignTask,
  triggerUserAction,
  updateOliviaSyncSchedule,
  toggleOliviaMonitoring,
  updateOliviaPropertySync,
  updateOliviaMarketResearch,
  updateOliviaInsights,
  updateOliviaCoordination,
  updateOliviaSiteStatus,
  addOliviaActivity,
  addExecutiveSuggestion,
  updateSuggestionStatus,
  setSuggestionFilters,
  clearSuggestionFilters,
  requestVaultAccess,
  approveVaultRequest,
  denyVaultRequest,
  addIncomingLead,
  qualifyLead,
  routeLeadToSpecialist,
  updateLeadPipelineStage,
  addComplianceAuditLog,
  flagTransaction
} = aiAssistantDashboardSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

const selectAssistantsState = (state: RootState) =>
  state.aiAssistantDashboard?.allAssistants?.byId || {};
const selectAllIds = (state: RootState) => state.aiAssistantDashboard?.allAssistants?.allIds || [];

export const selectAllAssistantsArray = createSelector(
  [selectAssistantsState, selectAllIds],
  (byId, allIds) => allIds.map((id) => byId[id]).filter(Boolean)
);

export const selectAssistantById = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];

export const selectCurrentAssistant = (state: RootState) => {
  const selectedId = state.aiAssistantDashboard?.ui?.selectedAssistant;
  return state.aiAssistantDashboard?.allAssistants?.byId?.[selectedId];
};

export const selectUI = (state: RootState) => state.aiAssistantDashboard?.ui;
export const selectFavorites = (state: RootState) =>
  state.aiAssistantDashboard?.favorites || [];
export const selectRecent = (state: RootState) => state.aiAssistantDashboard?.recent || [];
export const selectPerformance = (state: RootState) =>
  state.aiAssistantDashboard?.assistantPerformance;
export const selectOwnerPreferences = (state: RootState) =>
  state.aiAssistantDashboard?.ownerPreferences;
export const selectRecentActivity = (state: RootState) =>
  state.aiAssistantDashboard?.assistantPerformance?.recentActivity || [];

export const selectFilteredAssistants = createSelector(
  [selectAllAssistantsArray, selectUI],
  (assistants, ui) => {
    let filtered = assistants;

    if (ui?.filters?.department && ui.filters.department !== 'all') {
      filtered = filtered.filter((a) => a.department === ui.filters.department);
    }

    if (ui?.filters?.status && ui.filters.status !== 'all') {
      filtered = filtered.filter((a) => a.metrics.systemHealth === ui.filters.status);
    }

    if (ui?.filters?.searchQuery) {
      const query = ui.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectAssistantsByDepartment = createSelector(
  [selectAllAssistantsArray],
  (assistants) => {
    return assistants.reduce(
      (acc, assistant) => {
        if (!acc[assistant.department]) {
          acc[assistant.department] = [];
        }
        acc[assistant.department].push(assistant);
        return acc;
      },
      {} as Record<string, AIAssistant[]>
    );
  }
);

export const selectActiveAssistantsCount = createSelector(
  [selectAllAssistantsArray],
  (assistants) => assistants.filter((a) => a.metrics.systemHealth === 'optimal').length
);

export const selectSidebar = (state: RootState) => state.aiAssistantDashboard?.sidebar;
export const selectNotifications = (state: RootState) =>
  state.aiAssistantDashboard?.notifications;
export const selectTasks = (state: RootState) => state.aiAssistantDashboard?.tasks;

export const selectNotificationsByAssistant = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] || [];

export const selectUnreadCountByAssistant = (assistantId: string) => (state: RootState) => {
  const notifications =
    state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] || [];
  return notifications.filter((n) => !n.isRead).length;
};

export const selectTasksByAssistant = (assistantId: string) => (state: RootState) =>
  state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] || [];

export const selectGlobalUnreadCount = (state: RootState) =>
  state.aiAssistantDashboard?.notifications?.globalUnreadCount || 0;

export const selectOliviaAutomation = (state: RootState) =>
  state.aiAssistantDashboard?.oliviaAutomation || {};

export const selectExecutiveSuggestions = (state: RootState) =>
  state.aiAssistantDashboard?.executiveSuggestions || { inbox: [], filters: {} };

export const selectFilteredSuggestions = createSelector([selectExecutiveSuggestions], (suggestions) => {
  let filtered = suggestions.inbox || [];
  const filters = suggestions.filters || {};

  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter((s) => s.priority === filters.priority);
  }
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter((s) => s.assistantDepartment === filters.department);
  }
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((s) => s.status === filters.status);
  }

  return filtered;
});

export const selectUnreviewedSuggestionsCount = createSelector(
  [selectExecutiveSuggestions],
  (suggestions) => (suggestions.inbox || []).filter((s) => s.status === 'unreviewed').length
);

export const selectCriticalSuggestions = createSelector([selectExecutiveSuggestions], (suggestions) =>
  (suggestions.inbox || []).filter(
    (s) => s.priority === 'critical' && s.status === 'unreviewed'
  )
);

export const selectAllUnreadCounts = createSelector(
  [selectNotifications, selectAllIds],
  (notifications, allIds) => {
    const counts: Record<string, number> = {};
    allIds.forEach((id) => {
      const assistantNotifications = notifications?.byAssistantId?.[id] || [];
      counts[id] = assistantNotifications.filter((n) => !n.isRead).length;
    });
    return counts;
  }
);

export const selectAssistantStatus = (assistantId: string) => (state: RootState) => {
  const assistant = state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] || [];
  const activeTasks = tasks.filter((t) => t.status !== 'completed').length;

  if (!assistant) return 'offline';
  if (activeTasks > 0) return 'busy';
  if (assistant.metrics?.systemHealth === 'optimal') return 'active';
  return 'idle';
};

export const selectConfidentialVault = (state: RootState) =>
  state.aiAssistantDashboard?.confidentialVault || {
    documents: [],
    accessRequests: [],
    permissions: {},
    vaultStats: {}
  };

export const selectVaultPendingRequests = createSelector(
  [selectConfidentialVault],
  (vault) => vault.accessRequests.filter((r) => r.status === 'pending')
);

export const selectLeadManagementHub = (state: RootState) =>
  state.aiAssistantDashboard?.leadManagementHub || {
    incomingLeads: [],
    processedLeads: {},
    funnelMetrics: {}
  };

export const selectLeadFunnelMetrics = (state: RootState) =>
  state.aiAssistantDashboard?.leadManagementHub?.funnelMetrics || {};

export const selectComplianceEngine = (state: RootState) =>
  state.aiAssistantDashboard?.complianceEngine || {
    kycProfiles: {},
    amlMonitor: {},
    auditLog: [],
    complianceMetrics: {}
  };

export const selectComplianceMetrics = (state: RootState) =>
  state.aiAssistantDashboard?.complianceEngine?.complianceMetrics || {};

export { DEPARTMENT_COLORS };

export default aiAssistantDashboardSlice.reducer;
