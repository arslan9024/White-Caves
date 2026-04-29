// ============================================================================
// AI ASSISTANT DASHBOARD — TYPE DEFINITIONS
// Extracted from aiAssistantDashboardSlice.tsx for maintainability
// ============================================================================

export interface AssistantPermissions {
  viewableBy: string[];
  accessibleBy: string[];
  dataAccessLevel: 'full' | 'departmental' | 'limited';
}

export interface AssistantMetrics {
  lastActive: string | null;
  tasksCompleted: number;
  activeUsers: number;
  systemHealth: 'optimal' | 'degraded' | 'offline';
}

export interface QuickStat {
  value: number | string;
  label: string;
  change: number;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
}

export interface SystemModules {
  [key: string]: boolean;
}

export interface DesignMetrics {
  componentCount: number;
  accessibilityScore: number;
  lighthouseScore: number;
  bundleSize: string;
}

export interface BackendMetrics {
  apiCount: number;
  avgResponseTime: number;
  cacheHitRate: number;
  dbConnections: number;
}

export interface AIAssistant {
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

export interface AssistantsRegistry {
  byId: Record<string, AIAssistant>;
  allIds: string[];
  isLoading: boolean;
  lastFetched: string | null;
}

export interface UIFilters {
  department: string;
  status: string;
  searchQuery: string;
}

export interface UIState {
  selectedAssistant: string;
  viewMode: string;
  layout: 'grid' | 'list';
  filters: UIFilters;
  dropdownOpen: boolean;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  activeAssistantId: string | null;
  position: 'left' | 'right';
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
  timestamp: string;
  [key: string]: unknown;
}

export interface NotificationsState {
  byAssistantId: Record<string, Notification[]>;
  globalUnreadCount: number;
  lastFetched: string | null;
}

// ── Task lifecycle ───────────────────────────────────────────────────────

/**
 * The ordered lifecycle stages a task moves through.
 * created → queued → in_progress → pending_review → completed (or failed / cancelled)
 */
export type TaskLifecycleStage =
  | 'created'
  | 'queued'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * A single step / action that occurred within a task's lifecycle.
 * Each action is immutable once written; new entries are appended to the array.
 */
export interface TaskAction {
  /** Unique action ID — e.g. "ta_1714500000000" */
  id: string;
  /** Short camelCase action type — e.g. "file_uploaded", "review_requested", "approved" */
  type: string;
  /** Human-readable description — e.g. "Excel file uploaded with 23 units" */
  description: string;
  /** Who performed the action — assistant id, agent id, or "system" */
  actor: string;
  /** ISO timestamp when the action occurred */
  timestamp: string;
  /** Outcome of this individual action step */
  status: 'success' | 'failed' | 'pending';
  /** Optional short outcome note — e.g. "23 records imported" */
  result?: string;
}

/**
 * The final outcome record written when a task reaches a terminal lifecycle stage.
 */
export interface TaskResult {
  /** Overall outcome */
  outcome: 'success' | 'failed' | 'partial';
  /** Human-readable summary of what was achieved */
  summary: string;
  /** ISO timestamp when the task reached a terminal state */
  completedAt: string;
  /** Optional structured metrics — e.g. { unitsImported: 23, errors: 0 } */
  metrics?: Record<string, unknown>;
  /** Populated when outcome is "failed" or "partial" */
  errorMessage?: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'assigned';
  assignedTo: string | null;
  dueDate: string;
  createdAt?: string;
  // ── Lifecycle fields ──────────────────────────────────────────────────
  /** Current position in the task lifecycle */
  lifecycleStage?: TaskLifecycleStage;
  /** Ordered log of every action / step performed on this task */
  actions?: TaskAction[];
  /** Terminal result — populated when lifecycleStage is "completed" or "failed" */
  result?: TaskResult;
  /** ISO timestamp when the task moved from "queued" to "in_progress" */
  startedAt?: string;
  /** ISO timestamp of the last state change */
  updatedAt?: string;
  /** ISO timestamp when the task reached a terminal lifecycle stage */
  completedAt?: string;
  [key: string]: unknown;
}

export interface TasksState {
  byAssistantId: Record<string, Task[]>;
  activeTasksCount: number;
}

export interface Activity {
  id: number;
  assistantId: string;
  action: string;
  target: string;
  timestamp: string;
  type: string;
  [key: string]: unknown;
}

export interface AssistantPerformance {
  overallHealth: number;
  activeTasks: number;
  criticalAlerts: Array<Record<string, unknown>>;
  recentActivity: Activity[];
}

export interface OwnerPreferences {
  favoriteAssistants: string[];
  defaultAssistant: string;
  dashboardLayout: string;
  notificationSettings: {
    assistantUpdates: boolean;
    criticalAlerts: boolean;
    performanceReports: boolean;
  };
}

export interface LiveUpdates {
  lastUpdate: string | null;
  connections: Record<string, unknown>;
  isConnected: boolean;
}

export interface ExecutiveSuggestion {
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

export interface ExecutiveSuggestionsState {
  inbox: ExecutiveSuggestion[];
  filters: {
    priority: string;
    department: string;
    status: string;
  };
  lastRefresh: string;
}

export interface MonitoredSite {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  lastCheck: string | null;
  dataPoints?: unknown;
}

export interface OliviaInsights {
  priceIndex: number;
  priceChange: number;
  avgRentalYield: number;
  supplyDemandRatio: number;
  hotspots: string[];
  lastUpdated: string;
}

export interface OliviaCoordination {
  maryConnected: boolean;
  inventoryAccess: boolean;
  lastInventoryFetch: string | null;
}

export interface OliviaAutomationState {
  syncSchedule: string;
  lastPropertySync: string | null;
  lastMarketResearch: string | null;
  activeMonitoring: boolean;
  insightsData: OliviaInsights;
  coordination: OliviaCoordination;
  monitoredSites: MonitoredSite[];
  activityLog: Activity[];
}

export interface VaultDocument {
  id: string;
  name: string;
  category: string;
  accessLevel: string;
  createdAt: string;
  accessLog: Array<Record<string, unknown>>;
  meta: Record<string, unknown>;
}

export interface VaultAccessRequest {
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

export interface VaultStats {
  totalDocuments: number;
  pendingRequests: number;
  recentAccesses: number;
}

export interface ConfidentialVaultState {
  documents: VaultDocument[];
  accessRequests: VaultAccessRequest[];
  permissions: Record<string, string[]>;
  vaultStats: VaultStats;
}

export interface Lead {
  id: string;
  receivedAt: string;
  initialIntent?: unknown;
  [key: string]: unknown;
}

export interface ProcessedLead {
  status: 'qualified' | 'routed';
  assignedIntent: unknown;
  qualificationScore: number;
  structuredData: unknown;
  qualifiedAt: string;
  routedTo: string | null;
  routedAt: string | null;
  currentStage?: string;
}

export interface SpecialistPipeline {
  leadIds: string[];
  pipelineStages: string[];
}

export interface FunnelMetrics {
  totalIncoming: number;
  rentVsSaleRatio: string;
  avgQualificationTime: string;
  conversionRate: number;
}

export interface LeadScoringRules {
  [key: string]: number;
}

export interface LeadManagementHubState {
  incomingLeads: Lead[];
  processedLeads: Record<string, ProcessedLead>;
  specialistPipelines: Record<string, SpecialistPipeline>;
  funnelMetrics: FunnelMetrics;
  leadScoringRules: LeadScoringRules;
}

export interface AMLMonitor {
  flaggedTransactions: Array<Record<string, unknown>>;
  watchlistMatches: Array<Record<string, unknown>>;
  investigationQueue: string[];
}

export interface ComplianceMetrics {
  totalProfiles: number;
  pendingReview: number;
  approvedThisMonth: number;
  riskScore: number;
}

export interface ComplianceEngineState {
  kycProfiles: Record<string, unknown>;
  amlMonitor: AMLMonitor;
  auditLog: Array<Record<string, unknown>>;
  complianceMetrics: ComplianceMetrics;
}

export interface AIAssistantDashboardState {
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
  /** Phase 0.8 — markdown plans keyed by assistant id */
  plans: Record<string, string | null>;
  plansLoading: Record<string, boolean>;
  plansError: Record<string, string | null>;
}
