/**
 * White Caves AI Assistants Registry
 * Defines all AI assistants with their roles, capabilities, and department assignments
 */

export interface AIAssistant {
  id: string;
  name: string;
  title: string;
  avatar: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'error';
  role?: string; // New: Assistant role for sidebar grouping
  assignedTo?: string[]; // New: Departments assigned to
  department: string; // Department ID
  category: 'communication' | 'inventory' | 'analytics' | 'operations' | 'support';
  description: string;
  capabilities: string[];
  reportsTo: string;
  dashboardPath: string;
  accessLevel: string;
  features: number; // Count of features
  dataFlows: {
    inputs: string[]; // Data sources
    outputs: string[]; // Data consumers
  };
}

export const AI_ASSISTANTS: Record<string, AIAssistant> = {
  // COMMUNICATION LAYER
  nina: {
    id: 'nina',
    name: 'Nina',
    title: 'WhatsApp Bot Developer',
    avatar: '👩‍💻',
    icon: 'Bot',
    color: '#06B6D4',
    status: 'active',
    role: 'WhatsApp Agent',
    assignedTo: ['SALES', 'LEASING'],
    department: 'SALES',
    category: 'communication',
    description: 'Automated WhatsApp bot managing 24/7 conversations, lead qualification, and campaigns',
    capabilities: [
      'WhatsApp Bot Management',
      'Intent Classification',
      'Auto-Reply Generation',
      'Campaign Broadcasting',
      'Lead Scoring',
      'Bilingual Support',
      'Compliance Enforcement',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/nina/dashboard',
    accessLevel: 'P1 - High',
    features: 40,
    dataFlows: {
      inputs: ['WhatsApp Web'],
      outputs: ['Linda', 'Mary', 'Clara'],
    },
  },

  linda: {
    id: 'linda',
    name: 'Linda',
    title: 'WhatsApp Agent CRM',
    avatar: '👩‍💼',
    icon: 'MessageCircle',
    color: '#25D366',
    status: 'active',
    role: 'WhatsApp Agent',
    assignedTo: ['SALES', 'LEASING', 'LEGAL'],
    department: 'SALES',
    category: 'communication',
    description: 'Agent-facing WhatsApp CRM for live conversations, lead pre-qualification, and property search',
    capabilities: [
      'Live Chat Interface',
      'Lead Pre-qualification',
      'Quick Reply Templates',
      'Contact Management',
      'Conversation Filtering',
      'AI Insights Panel',
      'Conversation Archive',
      'Property Search Integration',
    ],
    reportsTo: 'Tariq Al-Farsi (Dir. Sales)',
    dashboardPath: '/linda/dashboard',
    accessLevel: 'P1 - High',
    features: 8,
    dataFlows: {
      inputs: ['Nina', 'Mary'],
      outputs: ['Clara', 'Mary'],
    },
  },

  henry: {
    id: 'henry',
    name: 'Henry',
    title: 'Record Keeper & Compliance Auditor',
    avatar: '📚',
    icon: 'BookOpenCheck',
    color: '#7C3AED',
    status: 'active',
    role: 'Analytics & Reporting',
    assignedTo: ['TECH', 'LEGAL', 'EXEC'],
    department: 'TECH',
    category: 'analytics',
    description: 'Maintains immutable audit trails, validates assistant handoffs, and flags compliance anomalies.',
    capabilities: [
      'Audit Timeline Integrity',
      'Cross-Assistant Event Tracking',
      'Compliance Risk Flagging',
      'Governance Report Packaging',
      'Incident Evidence Chain',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/henry/dashboard',
    accessLevel: 'P1 - High',
    features: 14,
    dataFlows: {
      inputs: ['Linda', 'Daisy', 'Theodora', 'Clara'],
      outputs: ['Katherine QA', 'Executive Reports'],
    },
  },

  // INVENTORY LAYER
  mary: {
    id: 'mary',
    name: 'Mary',
    title: 'Property Inventory Manager',
    avatar: '🏠',
    icon: 'Home',
    color: '#8B5CF6',
    status: 'active',    role: 'Data Management',
    assignedTo: ['INVENTORY', 'SALES'],    department: 'PROPMGMT',
    category: 'inventory',
    description: 'Complete property inventory management with smart import, status tracking, and advanced search',
    capabilities: [
      'Property Inventory Management',
      'Smart Data Import',
      'Multi-dimensional Status Tracking',
      'Advanced Property Search',
      'Ownership Management',
      'Lease Management',
      'Deal Tracking',
      'Reporting & Analytics',
    ],
    reportsTo: 'Layla Hassan (Head Property Mgmt)',
    dashboardPath: '/mary/dashboard',
    accessLevel: 'P1 - High',
    features: 35,
    dataFlows: {
      inputs: ['Excel/CSV Upload', 'Manual Entry'],
      outputs: ['Nina', 'Linda', 'Clara'],
    },
  },

  // SALES & OPERATIONS
  clara: {
    id: 'clara',
    name: 'Clara',
    title: 'Sales Pipeline Manager',
    avatar: '📊',
    icon: 'TrendingUp',
    color: '#3B82F6',
    status: 'active',    role: 'CRM Agent',
    assignedTo: ['SALES'],    department: 'SALES',
    category: 'operations',
    description: 'Manages sales pipeline, lead tracking, commission calculations, and deal management',
    capabilities: [
      'Lead Management',
      'Pipeline Tracking',
      'Commission Calculation',
      'Deal Management',
      'Forecast Analytics',
      'Performance Metrics',
    ],
    reportsTo: 'Tariq Al-Farsi (Dir. Sales)',
    dashboardPath: '/clara/dashboard',
    accessLevel: 'P1 - High',
    features: 18,
    dataFlows: {
      inputs: ['Nina', 'Linda', 'Mary'],
      outputs: ['Zoe', 'Aurora'],
    },
  },

  daisy: {
    id: 'daisy',
    name: 'Daisy',
    title: 'Property Manager',
    avatar: '🔧',
    icon: 'Wrench',
    color: '#EC4899',
    status: 'active',
    department: 'PROPMGMT',
    category: 'operations',
    description: 'Manages property maintenance, vendor coordination, and owner reporting',
    capabilities: [
      'Maintenance Scheduling',
      'Vendor Management',
      'Work Order Tracking',
      'Rent Collection',
      'Owner Reporting',
      'Compliance Tracking',
    ],
    reportsTo: 'Layla Hassan (Head Property Mgmt)',
    dashboardPath: '/daisy/dashboard',
    accessLevel: 'P1 - High',
    features: 16,
    dataFlows: {
      inputs: ['Mary', 'Manual Entry'],
      outputs: ['Owner Reports', 'Finance'],
    },
  },

  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Lease & Compliance Monitor',
    avatar: '⚠️',
    icon: 'AlertTriangle',
    color: '#F59E0B',
    status: 'active',
    department: 'PROPMGMT',
    category: 'operations',
    description: 'Monitors lease agreements, compliance dates, and property status updates',
    capabilities: [
      'Lease Monitoring',
      'Compliance Alerts',
      'Date Tracking',
      'Renewal Management',
      'Violation Detection',
    ],
    reportsTo: 'Layla Hassan (Head Property Mgmt)',
    dashboardPath: '/sentinel/dashboard',
    accessLevel: 'P2 - Medium',
    features: 12,
    dataFlows: {
      inputs: ['Mary', 'Legal System'],
      outputs: ['Alerts', 'Reports'],
    },
  },

  // ANALYTICS LAYER
  zoe: {
    id: 'zoe',
    name: 'Zoe',
    title: 'Executive Analytics Officer',
    avatar: '👨‍💼',
    icon: 'BarChart3',
    color: '#10B981',
    status: 'active',    role: 'Analytics & Reporting',
    assignedTo: ['EXEC'],    department: 'EXEC',
    category: 'analytics',
    description: 'Provides executive dashboards, KPI tracking, and strategic insights',
    capabilities: [
      'Executive Dashboard',
      'KPI Tracking',
      'Performance Analytics',
      'Strategic Insights',
      'Report Generation',
      'Organizational Intelligence',
    ],
    reportsTo: 'Arslan Malik (Managing Director)',
    dashboardPath: '/zoe/dashboard',
    accessLevel: 'P0 - Executive',
    features: 22,
    dataFlows: {
      inputs: ['Clara', 'Mary', 'Finance', 'All Departments'],
      outputs: ['Executive Reports', 'Strategic Plans'],
    },
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora',
    title: 'Data Architect',
    avatar: '🏗️',
    icon: 'Database',
    color: '#14B8A6',
    status: 'active',    role: 'Data Management',
    assignedTo: ['TECH', 'IT'],    department: 'TECH',
    category: 'analytics',
    description: 'Designs data models, manages data pipelines, and ensures data quality',
    capabilities: [
      'Data Architecture',
      'Pipeline Management',
      'Data Quality Assurance',
      'Performance Optimization',
      'Scalability Design',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/aurora/dashboard',
    accessLevel: 'P1 - High',
    features: 14,
    dataFlows: {
      inputs: ['All Systems'],
      outputs: ['All Systems'],
    },
  },

  margaret: {
    id: 'margaret',
    name: 'Margaret',
    title: 'Strategic Planner & Roadmap Architect',
    avatar: '🧭',
    icon: 'Compass',
    color: '#F59E0B',
    status: 'active',
    role: 'Strategic Planning',
    assignedTo: ['EXEC', 'TECH', 'SALES'],
    department: 'EXEC',
    category: 'analytics',
    description: 'Manages master project roadmaps, sprint backlogs, feature coverage matrices, and autonomous autopilot queues',
    capabilities: [
      'Master Roadmap Management',
      'Sprint Backlog Allocation',
      'Traceability Matrix Audit',
      'Dependency-Safe Task Planning',
      'Milestone Progress Verification',
    ],
    reportsTo: 'Arslan Malik (Managing Director)',
    dashboardPath: '/margaret/dashboard',
    accessLevel: 'P0 - Executive',
    features: 25,
    dataFlows: {
      inputs: ['All Plans', 'AEGIS Autopilot'],
      outputs: ['Strategic Roadmaps', 'Sprint Milestones'],
    },
  },

  ada: {
    id: 'ada',
    name: 'Ada',
    title: 'Chief Software Architect',
    avatar: '🏛️',
    icon: 'Cpu',
    color: '#10B981',
    status: 'active',
    role: 'Software Architecture',
    assignedTo: ['TECH', 'IT', 'EXEC'],
    department: 'TECH',
    category: 'operations',
    description: 'Chief architect overseeing system topologies, 4-way folder standards, zero-token local gates, and continuous deduplication',
    capabilities: [
      'System Architecture Topology',
      'Zero-Token Gate Verification',
      'Deduplication Law Enforcement',
      'RBAC 1-12-108 Security Audit',
      'SQA Master Gate Signoff',
    ],
    reportsTo: 'Arslan Malik (Managing Director)',
    dashboardPath: '/ada/dashboard',
    accessLevel: 'P0 - Executive',
    features: 30,
    dataFlows: {
      inputs: ['Source Code AST', 'System Telemetry'],
      outputs: ['Architecture Topologies', 'Gate Certifications'],
    },
  },

  theodora: {
    id: 'theodora',
    name: 'Theodora',
    title: 'Performance Analyst',
    avatar: '📈',
    icon: 'Activity',
    color: '#F59E0B',
    status: 'active',
    department: 'ANALYTICS',
    category: 'analytics',
    description: 'Tracks system performance, identifies bottlenecks, and optimizes operations',
    capabilities: [
      'Performance Monitoring',
      'Bottleneck Detection',
      'Optimization Recommendations',
      'SLA Tracking',
      'Trend Analysis',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/theodora/dashboard',
    accessLevel: 'P1 - High',
    features: 11,
    dataFlows: {
      inputs: ['System Logs', 'Metrics'],
      outputs: ['Performance Reports'],
    },
  },

  // SUPPORT LAYER
  willow: {
    id: 'willow',
    name: 'Willow',
    title: 'Backend Operations Manager',
    avatar: '⚙️',
    icon: 'Settings',
    color: '#A855F7',
    status: 'active',
    department: 'TECH',
    category: 'support',
    description: 'API management, database operations, performance monitoring, and security',
    capabilities: [
      'API Management',
      'Database Operations',
      'Performance Monitoring',
      'Security Management',
      'System Health',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/willow/dashboard',
    accessLevel: 'P1 - High',
    features: 18,
    dataFlows: {
      inputs: ['All Systems'],
      outputs: ['System Health', 'Performance Metrics'],
    },
  },

  morgan: {
    id: 'morgan',
    name: 'Morgan',
    title: 'Design System Manager',
    avatar: '🎨',
    icon: 'Palette',
    color: '#EC4899',
    status: 'active',
    department: 'TECH',
    category: 'support',
    description: 'Manages component library, design system, and UI/UX standards',
    capabilities: [
      'Component Library Management',
      'Design System Maintenance',
      'Accessibility Standards',
      'Theme Management',
      'Design Documentation',
    ],
    reportsTo: 'Tariq Al Qasimi (Dir. Technology)',
    dashboardPath: '/morgan/dashboard',
    accessLevel: 'P2 - Medium',
    features: 12,
    dataFlows: {
      inputs: ['Design Specs'],
      outputs: ['Component Library', 'Design Tokens'],
    },
  },

  nancy: {
    id: 'nancy',
    name: 'Nancy',
    title: 'HR Coordinator',
    avatar: '👥',
    icon: 'Users',
    color: '#06B6D4',
    status: 'active',
    department: 'HR',
    category: 'support',
    description: 'Manages recruitment, onboarding, and employee relations',
    capabilities: [
      'Recruitment Management',
      'Onboarding Coordination',
      'Employee Directory',
      'Performance Reviews',
      'Benefits Administration',
    ],
    reportsTo: 'Sarah Johnson (HR Manager)',
    dashboardPath: '/nancy/dashboard',
    accessLevel: 'P2 - Medium',
    features: 10,
    dataFlows: {
      inputs: ['Applicants', 'Employee Data'],
      outputs: ['Onboarding Tasks', 'Reports'],
    },
  },
};

/**
 * Get all AI assistants
 */
export const getAllAssistants = (): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS);
};

/**
 * Get AI assistant by ID
 */
export const getAssistant = (id: string): AIAssistant | undefined => {
  return AI_ASSISTANTS[id];
};

/**
 * Get assistants by department
 */
export const getAssistantsByDepartment = (departmentId: string): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS).filter(a => a.department === departmentId);
};

/**
 * Get assistants by category
 */
export const getAssistantsByCategory = (
  category: 'communication' | 'inventory' | 'analytics' | 'operations' | 'support'
): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS).filter(a => a.category === category);
};

/**
 * Get active assistants
 */
export const getActiveAssistants = (): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS).filter(a => a.status === 'active');
};

/**
 * Get assistants by role
 */
export const getAssistantsByRole = (role: string): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS).filter(a => a.role === role);
};

/**
 * Get assistants by access level
 */
export const getAssistantsByAccessLevel = (level: string): AIAssistant[] => {
  return Object.values(AI_ASSISTANTS).filter(a => a.accessLevel === level);
};

export default AI_ASSISTANTS;
