import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const AI_ASSISTANTS_REGISTRY = {
  mary: {
    id: 'mary',
    name: 'Mary',
    title: 'Inventory & Data Manager',
    department: 'operations',
    icon: 'FileText',
    colorScheme: '#3B82F6',
    avatar: '👩‍💻',
    description: 'Manages DAMAC Hills 2 property inventory with 9,378+ units, data acquisition tools, and asset management',
    capabilities: ['property_crud', 'data_tools', 'asset_fetcher', 'filtering', 'excel_import', 'ocr_extraction'],
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
      today: {
        value: 9378,
        label: 'Properties',
        change: 0
      }
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
    description: 'Manages financial operations, invoicing, payment tracking, and accounting reports',
    capabilities: ['invoice_management', 'payment_tracking', 'financial_reports', 'budget_analysis'],
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
      today: {
        value: 12,
        label: 'Invoices',
        change: 8.5
      }
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
    description: 'Manages marketing campaigns, social media, property listings, and brand communications',
    capabilities: ['campaign_management', 'social_media', 'listing_optimization', 'analytics'],
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
      today: {
        value: 15,
        label: 'Campaigns',
        change: 12.3
      }
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
    description: 'Executive support, calendar management, meeting coordination, and strategic planning assistance',
    capabilities: ['calendar_management', 'meeting_scheduling', 'task_delegation', 'executive_reports'],
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
      today: {
        value: 8,
        label: 'Meetings',
        change: -5.2
      }
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
    description: 'Manages regulatory compliance, legal documentation, KYC/AML processes, and contract reviews',
    capabilities: ['kyc_verification', 'aml_monitoring', 'contract_review', 'compliance_reports'],
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
      today: {
        value: 5,
        label: 'Reviews',
        change: 0
      }
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
    description: 'Manages 23+ agent WhatsApp numbers, conversation routing, template messaging, and lead pre-qualification',
    capabilities: ['conversation_management', 'lead_scoring', 'quick_replies', 'ai_insights', 'agent_status_monitoring', 'broadcast_management'],
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
      today: {
        value: 47,
        label: 'Conversations',
        change: 15.8
      }
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
    description: 'Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics',
    capabilities: ['pipeline_management', 'lead_assignment', 'deal_tracking', 'sales_forecasting'],
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
      today: {
        value: 23,
        label: 'Active Deals',
        change: 4.2
      }
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
    description: 'Manages rental properties, tenant communications, lease agreements, and maintenance requests',
    capabilities: ['lease_management', 'tenant_communications', 'maintenance_tracking', 'rental_analytics'],
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
      today: {
        value: 156,
        label: 'Active Leases',
        change: 2.1
      }
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
    description: 'Manages lead pipeline, qualification, nurturing workflows, and conversion tracking',
    capabilities: ['lead_management', 'qualification', 'nurturing', 'conversion_tracking', 'activity_timeline'],
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
      today: {
        value: 38,
        label: 'Active Leads',
        change: 12.5
      }
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
    description: 'Develops and manages WhatsApp automation bots, conversation flows, and bot analytics',
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
      today: {
        value: 3,
        label: 'Active Bots',
        change: 0
      }
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
    description: 'Manages employee records, recruitment, performance reviews, and HR operations',
    capabilities: ['employee_management', 'recruitment', 'performance_tracking', 'attendance'],
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
      today: {
        value: 24,
        label: 'Employees',
        change: 0
      }
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
    description: 'Oversees all technical operations, system architecture, deployment pipelines, and application portfolio management',
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
      today: {
        value: 99.98,
        label: 'Uptime %',
        change: 0.02
      }
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
  }
};

const DEPARTMENT_COLORS = {
  operations: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  finance: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  marketing: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  executive: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  compliance: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  communications: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  sales: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
  technology: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
};

const generateActivities = () => {
  const now = Date.now();
  return [
    { id: 1, assistantId: 'linda', action: 'New lead captured from WhatsApp', target: 'Ahmed Al-Rashid', timestamp: new Date(now - 300000).toISOString(), type: 'success' },
    { id: 2, assistantId: 'clara', action: 'Lead stage updated to Qualified', target: 'Sarah Johnson', timestamp: new Date(now - 600000).toISOString(), type: 'success' },
    { id: 3, assistantId: 'mary', action: 'Property data imported', target: '23 new units from Excel', timestamp: new Date(now - 900000).toISOString(), type: 'success' },
    { id: 4, assistantId: 'theodora', action: 'Invoice generated', target: 'INV-2024-0156', timestamp: new Date(now - 1200000).toISOString(), type: 'info' },
    { id: 5, assistantId: 'sophia', action: 'Deal closed successfully', target: 'Villa 348 - AED 2.5M', timestamp: new Date(now - 1500000).toISOString(), type: 'success' },
    { id: 6, assistantId: 'nancy', action: 'Interview scheduled', target: 'Mohammed Ali - Sales Agent', timestamp: new Date(now - 1800000).toISOString(), type: 'pending' },
    { id: 7, assistantId: 'laila', action: 'KYC verification completed', target: 'James Wilson', timestamp: new Date(now - 2100000).toISOString(), type: 'success' },
    { id: 8, assistantId: 'nina', action: 'Bot session started', target: 'Lion0 WhatsApp Bot', timestamp: new Date(now - 2400000).toISOString(), type: 'active' },
    { id: 9, assistantId: 'daisy', action: 'Lease renewal processed', target: 'Unit 156 - Palm Views', timestamp: new Date(now - 2700000).toISOString(), type: 'success' },
    { id: 10, assistantId: 'olivia', action: 'Campaign launched', target: 'Summer Property Showcase', timestamp: new Date(now - 3000000).toISOString(), type: 'success' },
    { id: 11, assistantId: 'aurora', action: 'System health check completed', target: 'All services healthy', timestamp: new Date(now - 3300000).toISOString(), type: 'success' },
    { id: 12, assistantId: 'aurora', action: 'Deployment successful', target: 'WhatsApp CRM v2.4.1', timestamp: new Date(now - 3600000).toISOString(), type: 'success' }
  ];
};

const generateNotifications = () => {
  const now = Date.now();
  return {
    linda: [
      { id: 'n1', type: 'lead', message: 'New lead from WhatsApp', severity: 'info', isRead: false, timestamp: new Date(now - 120000).toISOString() },
      { id: 'n2', type: 'task', message: 'Agent quota exceeded', severity: 'warning', isRead: false, timestamp: new Date(now - 300000).toISOString() }
    ],
    clara: [
      { id: 'n3', type: 'lead', message: 'Lead requires follow-up', severity: 'warning', isRead: false, timestamp: new Date(now - 180000).toISOString() }
    ],
    theodora: [
      { id: 'n4', type: 'payment', message: 'Invoice overdue', severity: 'critical', isRead: false, timestamp: new Date(now - 240000).toISOString() }
    ],
    mary: [],
    nina: [
      { id: 'n5', type: 'bot', message: 'Bot session expired', severity: 'warning', isRead: false, timestamp: new Date(now - 360000).toISOString() }
    ],
    nancy: [],
    sophia: [
      { id: 'n6', type: 'deal', message: 'Deal awaiting approval', severity: 'info', isRead: false, timestamp: new Date(now - 420000).toISOString() }
    ],
    daisy: [],
    olivia: [],
    zoe: [
      { id: 'n7', type: 'meeting', message: 'Meeting in 30 minutes', severity: 'info', isRead: false, timestamp: new Date(now - 60000).toISOString() }
    ],
    laila: [],
    aurora: []
  };
};

const generateTasks = () => ({
  linda: [
    { id: 't1', title: 'Review unassigned conversations', priority: 'high', status: 'pending', assignedTo: null, dueDate: new Date().toISOString() }
  ],
  clara: [
    { id: 't2', title: 'Follow up with hot leads', priority: 'high', status: 'in_progress', assignedTo: 'agent_1', dueDate: new Date().toISOString() }
  ],
  theodora: [
    { id: 't3', title: 'Process pending invoices', priority: 'medium', status: 'pending', assignedTo: null, dueDate: new Date().toISOString() }
  ],
  mary: [],
  nina: [],
  nancy: [],
  sophia: [],
  daisy: [],
  olivia: [],
  zoe: [],
  laila: [],
  aurora: []
});

const getInitialState = () => ({
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
  
  initialized: true
});

export const fetchAllAssistants = createAsyncThunk(
  'aiAssistantDashboard/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return {
        assistants: AI_ASSISTANTS_REGISTRY,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAssistantMetricsAsync = createAsyncThunk(
  'aiAssistantDashboard/updateMetrics',
  async ({ assistantId, metrics }, { rejectWithValue }) => {
    try {
      return { assistantId, metrics, timestamp: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aiAssistantDashboardSlice = createSlice({
  name: 'aiAssistantDashboard',
  initialState: getInitialState(),
  reducers: {
    selectAssistant: (state, action) => {
      state.ui.selectedAssistant = action.payload;
      if (!state.recent.includes(action.payload)) {
        state.recent.unshift(action.payload);
        if (state.recent.length > 5) state.recent.pop();
      } else {
        state.recent = state.recent.filter(id => id !== action.payload);
        state.recent.unshift(action.payload);
      }
      state.ui.dropdownOpen = false;
    },
    
    toggleFavorite: (state, action) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) {
        state.favorites.push(action.payload);
      } else {
        state.favorites.splice(index, 1);
      }
      state.ownerPreferences.favoriteAssistants = [...state.favorites];
    },
    
    updateAssistantMetrics: (state, action) => {
      const { assistantId, metrics } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics = {
          ...state.allAssistants.byId[assistantId].metrics,
          ...metrics
        };
      }
    },
    
    updateAssistantHealth: (state, action) => {
      const { assistantId, health } = action.payload;
      if (state.allAssistants.byId[assistantId]) {
        state.allAssistants.byId[assistantId].metrics.systemHealth = health;
      }
    },
    
    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },
    
    setLayout: (state, action) => {
      state.ui.layout = action.payload;
    },
    
    setDepartmentFilter: (state, action) => {
      state.ui.filters.department = action.payload;
    },
    
    setStatusFilter: (state, action) => {
      state.ui.filters.status = action.payload;
    },
    
    setSearchQuery: (state, action) => {
      state.ui.filters.searchQuery = action.payload;
    },
    
    toggleDropdown: (state) => {
      state.ui.dropdownOpen = !state.ui.dropdownOpen;
    },
    
    closeDropdown: (state) => {
      state.ui.dropdownOpen = false;
    },
    
    addActivity: (state, action) => {
      const activity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.assistantPerformance.recentActivity.unshift(activity);
      if (state.assistantPerformance.recentActivity.length > 50) {
        state.assistantPerformance.recentActivity.pop();
      }
    },
    
    addAlert: (state, action) => {
      state.assistantPerformance.criticalAlerts.push(action.payload);
    },
    
    dismissAlert: (state, action) => {
      state.assistantPerformance.criticalAlerts = state.assistantPerformance.criticalAlerts.filter(
        alert => alert.id !== action.payload
      );
    },
    
    updateOwnerPreferences: (state, action) => {
      state.ownerPreferences = {
        ...state.ownerPreferences,
        ...action.payload
      };
    },
    
    setConnectionStatus: (state, action) => {
      state.liveUpdates.isConnected = action.payload;
      state.liveUpdates.lastUpdate = new Date().toISOString();
    },
    
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    
    collapseSidebar: (state, action) => {
      state.sidebar.isCollapsed = action.payload;
    },
    
    setSidebarActiveAssistant: (state, action) => {
      state.sidebar.activeAssistantId = action.payload;
    },
    
    addNotification: (state, action) => {
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
    
    markNotificationRead: (state, action) => {
      const { assistantId, notificationId } = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.notifications.globalUnreadCount = Math.max(0, state.notifications.globalUnreadCount - 1);
        }
      }
    },
    
    markAllNotificationsRead: (state, action) => {
      const assistantId = action.payload;
      const notifications = state.notifications.byAssistantId[assistantId];
      if (notifications) {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        notifications.forEach(n => { n.isRead = true; });
        state.notifications.globalUnreadCount = Math.max(0, state.notifications.globalUnreadCount - unreadCount);
      }
    },
    
    clearNotifications: (state, action) => {
      const assistantId = action.payload;
      state.notifications.byAssistantId[assistantId] = [];
    },
    
    addTask: (state, action) => {
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
    
    updateTaskStatus: (state, action) => {
      const { assistantId, taskId, status } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const wasActive = task.status !== 'completed';
          task.status = status;
          if (status === 'completed' && wasActive) {
            state.tasks.activeTasksCount = Math.max(0, state.tasks.activeTasksCount - 1);
          }
        }
      }
    },
    
    assignTask: (state, action) => {
      const { assistantId, taskId, agentId } = action.payload;
      const tasks = state.tasks.byAssistantId[assistantId];
      if (tasks) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          task.assignedTo = agentId;
          task.status = 'assigned';
        }
      }
    },
    
    triggerUserAction: (state, action) => {
      const { actionType, sourceAssistant, targetAssistants, data } = action.payload;
      targetAssistants.forEach(targetId => {
        if (!state.notifications.byAssistantId[targetId]) {
          state.notifications.byAssistantId[targetId] = [];
        }
        state.notifications.byAssistantId[targetId].unshift({
          id: `n${Date.now()}_${targetId}`,
          type: actionType,
          message: `Action from ${sourceAssistant}: ${data.message || actionType}`,
          severity: data.severity || 'info',
          isRead: false,
          timestamp: new Date().toISOString(),
          sourceAssistant,
          data
        });
        state.notifications.globalUnreadCount += 1;
      });
    },

    updateOliviaSyncSchedule: (state, action) => {
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

    updateOliviaInsights: (state, action) => {
      state.oliviaAutomation.insightsData = {
        ...state.oliviaAutomation.insightsData,
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
    },

    updateOliviaCoordination: (state, action) => {
      state.oliviaAutomation.coordination = {
        ...state.oliviaAutomation.coordination,
        ...action.payload
      };
    },

    updateOliviaSiteStatus: (state, action) => {
      const { siteName, status, dataPoints } = action.payload;
      const site = state.oliviaAutomation.monitoredSites.find(s => s.name === siteName);
      if (site) {
        site.status = status;
        site.lastCheck = new Date().toISOString();
        if (dataPoints !== undefined) site.dataPoints = dataPoints;
      }
    },

    addOliviaActivity: (state, action) => {
      const activity = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.oliviaAutomation.activityLog.unshift(activity);
      if (state.oliviaAutomation.activityLog.length > 50) {
        state.oliviaAutomation.activityLog.pop();
      }
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
  addOliviaActivity
} = aiAssistantDashboardSlice.actions;

const selectAssistantsState = (state) => state.aiAssistantDashboard?.allAssistants?.byId || {};
const selectAllIds = (state) => state.aiAssistantDashboard?.allAssistants?.allIds || [];

export const selectAllAssistantsArray = createSelector(
  [selectAssistantsState, selectAllIds],
  (byId, allIds) => allIds.map(id => byId[id]).filter(Boolean)
);

export const selectAssistantById = (assistantId) => (state) => 
  state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];

export const selectCurrentAssistant = (state) => {
  const selectedId = state.aiAssistantDashboard?.ui?.selectedAssistant;
  return state.aiAssistantDashboard?.allAssistants?.byId?.[selectedId];
};

export const selectUI = (state) => state.aiAssistantDashboard?.ui;
export const selectFavorites = (state) => state.aiAssistantDashboard?.favorites || [];
export const selectRecent = (state) => state.aiAssistantDashboard?.recent || [];
export const selectPerformance = (state) => state.aiAssistantDashboard?.assistantPerformance;
export const selectOwnerPreferences = (state) => state.aiAssistantDashboard?.ownerPreferences;
export const selectRecentActivity = (state) => state.aiAssistantDashboard?.assistantPerformance?.recentActivity || [];

export const selectFilteredAssistants = createSelector(
  [selectAllAssistantsArray, selectUI],
  (assistants, ui) => {
    let filtered = assistants;
    
    if (ui?.filters?.department && ui.filters.department !== 'all') {
      filtered = filtered.filter(a => a.department === ui.filters.department);
    }
    
    if (ui?.filters?.status && ui.filters.status !== 'all') {
      filtered = filtered.filter(a => a.metrics.systemHealth === ui.filters.status);
    }
    
    if (ui?.filters?.searchQuery) {
      const query = ui.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
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
    return assistants.reduce((acc, assistant) => {
      if (!acc[assistant.department]) {
        acc[assistant.department] = [];
      }
      acc[assistant.department].push(assistant);
      return acc;
    }, {});
  }
);

export const selectActiveAssistantsCount = createSelector(
  [selectAllAssistantsArray],
  (assistants) => assistants.filter(a => a.metrics.systemHealth === 'optimal').length
);

export const selectSidebar = (state) => state.aiAssistantDashboard?.sidebar;
export const selectNotifications = (state) => state.aiAssistantDashboard?.notifications;
export const selectTasks = (state) => state.aiAssistantDashboard?.tasks;

export const selectNotificationsByAssistant = (assistantId) => (state) => 
  state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] || [];

export const selectUnreadCountByAssistant = (assistantId) => (state) => {
  const notifications = state.aiAssistantDashboard?.notifications?.byAssistantId?.[assistantId] || [];
  return notifications.filter(n => !n.isRead).length;
};

export const selectTasksByAssistant = (assistantId) => (state) => 
  state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] || [];

export const selectGlobalUnreadCount = (state) => 
  state.aiAssistantDashboard?.notifications?.globalUnreadCount || 0;

export const selectOliviaAutomation = (state) => 
  state.aiAssistantDashboard?.oliviaAutomation || {};

export const selectAllUnreadCounts = createSelector(
  [selectNotifications, selectAllIds],
  (notifications, allIds) => {
    const counts = {};
    allIds.forEach(id => {
      const assistantNotifications = notifications?.byAssistantId?.[id] || [];
      counts[id] = assistantNotifications.filter(n => !n.isRead).length;
    });
    return counts;
  }
);

export const selectAssistantStatus = (assistantId) => (state) => {
  const assistant = state.aiAssistantDashboard?.allAssistants?.byId?.[assistantId];
  const tasks = state.aiAssistantDashboard?.tasks?.byAssistantId?.[assistantId] || [];
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  
  if (!assistant) return 'offline';
  if (activeTasks > 0) return 'busy';
  if (assistant.metrics?.systemHealth === 'optimal') return 'active';
  return 'idle';
};

export { DEPARTMENT_COLORS };

export default aiAssistantDashboardSlice.reducer;
