// ============================================================================
// AI Assistant Registry - TypeScript
// Converted from assistantRegistry.js with full type safety
// ============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Department {
  id: string;
  label: string;
  color: string;
  gradient: string;
  icon: string;
}

export type DepartmentId =
  | 'communications'
  | 'operations'
  | 'sales'
  | 'finance'
  | 'marketing'
  | 'executive'
  | 'compliance'
  | 'technology'
  | 'legal'
  | 'intelligence'
  | 'customer_experience'
  | 'data_and_ai';

export type AssistantId =
  | 'nadia'
  | 'nina'
  | 'mary'
  | 'nancy'
  | 'daisy'
  | 'clara'
  | 'sophia'
  | 'theodora'
  | 'olivia'
  | 'zoe'
  | 'laila'
  | 'aurora'
  | 'hazel'
  | 'willow'
  | 'evangeline'
  | 'sentinel'
  | 'hunter'
  | 'henry'
  | 'cipher'
  | 'atlas'
  | 'vesta'
  | 'juno'
  | 'kairos'
  | 'maven'
  | 'linda'
  | 'archer'
  | 'prism'
  | 'sage'
  | 'echo'
  | 'mira'
  | 'rex'
  | 'iris'
  | 'apex'
  | 'halo'
  | 'oracle'
  | 'flux'
  | 'nova'
  | 'quill'
  | 'lumen'
  | 'crest';

export type DataAccessLevel = 'full' | 'departmental';

export interface AssistantPermissions {
  viewableBy: string[];
  accessibleBy: string[];
  dataAccessLevel: DataAccessLevel;
}

export interface AssistantDataFlows {
  outputs: string[];
  inputs: string[];
}

export interface Assistant {
  id: AssistantId;
  name: string;
  title: string;
  department: DepartmentId;
  icon: string;
  color: string;
  avatar: string;
  description: string;
  capabilities: string[];
  permissions: AssistantPermissions;
  apiEndpoints: string[];
  dataFlows: AssistantDataFlows;
}

export interface NavigationItem extends Department {
  assistants: Assistant[];
}

// ---------------------------------------------------------------------------
// Department Registry
// ---------------------------------------------------------------------------

export const DEPARTMENTS: Record<DepartmentId, Department> = {
  communications: {
    id: 'communications',
    label: 'Communications',
    color: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: 'MessageSquare',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'Building2',
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    icon: 'TrendingUp',
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'Wallet',
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'Megaphone',
  },
  executive: {
    id: 'executive',
    label: 'Executive',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'Briefcase',
  },
  compliance: {
    id: 'compliance',
    label: 'Compliance',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: 'Shield',
  },
  technology: {
    id: 'technology',
    label: 'Technology',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    icon: 'Server',
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    color: '#D4AF37',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
    icon: 'Scale',
  },
  intelligence: {
    id: 'intelligence',
    label: 'Intelligence',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    icon: 'Brain',
  },
  customer_experience: {
    id: 'customer_experience',
    label: 'Customer Experience',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    icon: 'Heart',
  },
  data_and_ai: {
    id: 'data_and_ai',
    label: 'Data & AI',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    icon: 'Cpu',
  },
};

// ---------------------------------------------------------------------------
// AI Assistants Registry
// ---------------------------------------------------------------------------

export const AI_ASSISTANTS: Record<AssistantId, Assistant> = {
  nadia: {
    id: 'nadia',
    name: 'Nadia',
    title: 'WhatsApp CRM Manager',
    department: 'communications',
    icon: 'MessageSquare',
    color: '#25D366',
    avatar: '👩‍💼',
    description:
      'Manages 23+ agent WhatsApp numbers, conversation routing, template messaging, and lead pre-qualification',
    capabilities: [
      'conversation_management',
      'lead_scoring',
      'quick_replies',
      'ai_insights',
      'agent_status_monitoring',
      'broadcast_management',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/whatsapp', '/api/conversations', '/api/templates'],
    dataFlows: {
      outputs: ['clara', 'mary'],
      inputs: ['nina'],
    },
  },
  nina: {
    id: 'nina',
    name: 'Nina',
    title: 'WhatsApp Bot Developer',
    department: 'communications',
    icon: 'Bot',
    color: '#06B6D4',
    avatar: '👩‍💻',
    description:
      'Develops and manages WhatsApp automation bots, conversation flows, and bot analytics',
    capabilities: ['bot_development', 'flow_design', 'session_management', 'analytics'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/bots', '/api/flows', '/api/sessions'],
    dataFlows: {
      outputs: ['nadia'],
      inputs: [],
    },
  },
  mary: {
    id: 'mary',
    name: 'Mary',
    title: 'Inventory CRM Manager',
    department: 'operations',
    icon: 'Building2',
    color: '#3B82F6',
    avatar: '👩‍💻',
    description:
      'Manages DAMAC Hills 2 property inventory with 9,378+ units, data acquisition tools, and asset management',
    capabilities: [
      'property_crud',
      'data_tools',
      'asset_fetcher',
      'filtering',
      'excel_import',
      'ocr_extraction',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/inventory', '/api/properties', '/api/assets'],
    dataFlows: {
      outputs: ['clara', 'nadia', 'olivia'],
      inputs: ['clara', 'sentinel'],
    },
  },
  nancy: {
    id: 'nancy',
    name: 'Nancy',
    title: 'HR Manager',
    department: 'operations',
    icon: 'Users2',
    color: '#F97316',
    avatar: '👩‍💼',
    description: 'Manages employee records, recruitment, performance reviews, and HR operations',
    capabilities: [
      'employee_management',
      'recruitment',
      'performance_tracking',
      'attendance',
      'onboarding',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'hr_manager'],
      accessibleBy: ['owner', 'admin', 'hr_manager'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/hr', '/api/employees', '/api/recruitment'],
    dataFlows: {
      outputs: ['zoe'],
      inputs: [],
    },
  },
  daisy: {
    id: 'daisy',
    name: 'Daisy',
    title: 'Leasing & Tenant Manager',
    department: 'operations',
    icon: 'Home',
    color: '#14B8A6',
    avatar: '👩‍🔧',
    description:
      'Manages rental properties, tenant communications, lease agreements, and maintenance requests',
    capabilities: [
      'lease_management',
      'tenant_communications',
      'maintenance_tracking',
      'rental_analytics',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'leasing_manager'],
      accessibleBy: ['owner', 'admin', 'leasing_manager'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/leasing', '/api/tenants', '/api/maintenance'],
    dataFlows: {
      outputs: ['mary', 'theodora'],
      inputs: ['mary', 'sentinel'],
    },
  },
  clara: {
    id: 'clara',
    name: 'Clara',
    title: 'Leads CRM Manager',
    department: 'sales',
    icon: 'Target',
    color: '#EF4444',
    avatar: '👩‍🎯',
    description:
      'Manages lead pipeline, qualification, nurturing workflows, and conversion tracking',
    capabilities: [
      'lead_management',
      'qualification',
      'nurturing',
      'conversion_tracking',
      'activity_timeline',
      'lead_scoring',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/leads', '/api/pipeline', '/api/activities'],
    dataFlows: {
      outputs: ['mary', 'sophia', 'nadia'],
      inputs: ['nadia', 'mary', 'hunter'],
    },
  },
  sophia: {
    id: 'sophia',
    name: 'Sophia',
    title: 'Sales Pipeline Manager',
    department: 'sales',
    icon: 'TrendingUp',
    color: '#8B5CF6',
    avatar: '👩‍💻',
    description:
      'Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics',
    capabilities: [
      'pipeline_management',
      'lead_assignment',
      'deal_tracking',
      'sales_forecasting',
      'commission_calculation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/sales', '/api/pipeline', '/api/deals'],
    dataFlows: {
      outputs: ['theodora', 'zoe'],
      inputs: ['clara'],
    },
  },
  theodora: {
    id: 'theodora',
    name: 'Theodora',
    title: 'Finance Director',
    department: 'finance',
    icon: 'Wallet',
    color: '#F59E0B',
    avatar: '👩‍💼',
    description:
      'Manages financial operations, invoicing, payment tracking, escrow, and accounting reports',
    capabilities: [
      'invoice_management',
      'payment_tracking',
      'financial_reports',
      'budget_analysis',
      'escrow_management',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'finance_manager'],
      accessibleBy: ['owner', 'admin', 'finance_manager'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/finance', '/api/invoices', '/api/payments'],
    dataFlows: {
      outputs: ['laila', 'zoe'],
      inputs: ['sophia', 'daisy'],
    },
  },
  olivia: {
    id: 'olivia',
    name: 'Olivia',
    title: 'Marketing & Automation Manager',
    department: 'marketing',
    icon: 'Megaphone',
    color: '#EC4899',
    avatar: '👩‍🎨',
    description:
      'Manages marketing campaigns, social media, property listings, market intelligence, and brand communications',
    capabilities: [
      'campaign_management',
      'social_media',
      'listing_optimization',
      'analytics',
      'market_intelligence',
      'content_automation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin', 'marketing_manager'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/marketing', '/api/campaigns', '/api/social'],
    dataFlows: {
      outputs: ['zoe'],
      inputs: ['mary'],
    },
  },
  zoe: {
    id: 'zoe',
    name: 'Zoe',
    title: 'Executive Assistant & Strategic Intelligence',
    department: 'executive',
    icon: 'Briefcase',
    color: '#10B981',
    avatar: '👩‍🏫',
    description:
      'Executive support, strategic suggestions inbox, business intelligence, KPI dashboards, and cross-department coordination',
    capabilities: [
      'executive_reports',
      'suggestion_inbox',
      'kpi_dashboard',
      'strategic_planning',
      'cross_department_coordination',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/executive', '/api/suggestions', '/api/analytics'],
    dataFlows: {
      outputs: [],
      inputs: ['all'],
    },
  },
  laila: {
    id: 'laila',
    name: 'Laila',
    title: 'Compliance Officer',
    department: 'compliance',
    icon: 'Shield',
    color: '#6366F1',
    avatar: '👩‍⚖️',
    description:
      'Manages regulatory compliance, KYC/AML processes, audit trails, and contract reviews',
    capabilities: [
      'kyc_verification',
      'aml_monitoring',
      'contract_review',
      'compliance_reports',
      'audit_trail',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin', 'legal_manager'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/compliance', '/api/legal', '/api/kyc'],
    dataFlows: {
      outputs: ['zoe', 'evangeline'],
      inputs: ['theodora', 'clara'],
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    title: 'CTO & Systems Architect',
    department: 'technology',
    icon: 'Server',
    color: '#0EA5E9',
    avatar: '👩‍💻',
    description:
      'Oversees all technical operations, system architecture, deployment pipelines, documentation hub, and AI governance',
    capabilities: [
      'system_health_monitoring',
      'deployment_pipeline',
      'application_portfolio',
      'performance_analytics',
      'documentation_hub',
      'ai_governance',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/system', '/api/deployments', '/api/applications'],
    dataFlows: {
      outputs: ['all'],
      inputs: ['all'],
    },
  },
  hazel: {
    id: 'hazel',
    name: 'Hazel',
    title: 'Elite Frontend Engineer',
    department: 'technology',
    icon: 'Palette',
    color: '#F472B6',
    avatar: '👩‍🎨',
    description:
      'Designs and builds pixel-perfect UI components, maintains the design system, and ensures accessibility compliance',
    capabilities: [
      'component_library',
      'design_system',
      'responsive_design',
      'accessibility_audit',
      'ui_performance',
      'theme_management',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/frontend', '/api/components', '/api/design-system'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora'],
    },
  },
  willow: {
    id: 'willow',
    name: 'Willow',
    title: 'Elite Backend Engineer',
    department: 'technology',
    icon: 'Database',
    color: '#22C55E',
    avatar: '👨‍💻',
    description:
      'Architects backend services, optimizes database queries, manages API performance, and ensures system reliability',
    capabilities: [
      'api_development',
      'database_optimization',
      'caching_strategies',
      'websocket_realtime',
      'data_pipeline',
      'security_hardening',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/backend', '/api/performance', '/api/database'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora'],
    },
  },
  evangeline: {
    id: 'evangeline',
    name: 'Evangeline',
    title: 'Legal Risk Analyst',
    department: 'legal',
    icon: 'Scale',
    color: '#D4AF37',
    avatar: '👩‍⚖️',
    description:
      'Proactively identifies, documents, and helps resolve legal issues. Monitors contracts, regulations, and transaction compliance',
    capabilities: [
      'legal_risk_analysis',
      'contract_monitoring',
      'regulatory_tracking',
      'dispute_prevention',
      'best_practices_library',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/legal', '/api/risks', '/api/contracts'],
    dataFlows: {
      outputs: ['zoe', 'laila'],
      inputs: ['laila', 'theodora', 'clara'],
    },
  },
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Property Monitoring AI',
    department: 'operations',
    icon: 'Eye',
    color: '#7C3AED',
    avatar: '🛡️',
    description:
      'IoT integration for property condition monitoring, predictive maintenance scheduling, and emergency response coordination',
    capabilities: [
      'iot_monitoring',
      'predictive_maintenance',
      'inspection_scheduling',
      'vendor_management',
      'emergency_response',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/monitoring', '/api/maintenance', '/api/inspections'],
    dataFlows: {
      outputs: ['mary', 'daisy'],
      inputs: ['mary'],
    },
  },
  hunter: {
    id: 'hunter',
    name: 'Hunter',
    title: 'Lead Prospecting AI',
    department: 'sales',
    icon: 'Search',
    color: '#0D9488',
    avatar: '🎯',
    description:
      'Scrapes and analyzes potential client databases, identifies property buying/selling patterns, and manages automated outreach',
    capabilities: [
      'prospect_analysis',
      'market_scanning',
      'pattern_detection',
      'outreach_automation',
      'lead_enrichment',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/prospecting', '/api/outreach', '/api/enrichment'],
    dataFlows: {
      outputs: ['clara'],
      inputs: ['mary', 'olivia'],
    },
  },
  henry: {
    id: 'henry',
    name: 'Henry',
    title: 'Record Keeper & Timeline Master',
    department: 'technology',
    icon: 'BookOpen',
    color: '#7C3AED',
    avatar: '📚',
    description:
      'Centralized memory and audit system. Creates immutable audit trails, enables cross-system analytics, provides operational clarity, and automates compliance reporting',
    capabilities: [
      'universal_event_ingestion',
      'intelligent_categorization',
      'timeline_visualization',
      'relationship_mapping',
      'search_query_engine',
      'sla_monitoring',
      'compliance_logging',
      'anomaly_detection',
      'report_generation',
      'data_integrity_guardian',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/events', '/api/timeline', '/api/audit', '/api/reports'],
    dataFlows: {
      outputs: ['zoe', 'laila', 'aurora'],
      inputs: ['all'],
    },
  },
  cipher: {
    id: 'cipher',
    name: 'Cipher',
    title: 'Predictive Market Analyst',
    department: 'intelligence',
    icon: 'LineChart',
    color: '#0D9488',
    avatar: '🔮',
    description:
      'Uses advanced analytics on DLD transaction data, news, and economic indicators to generate predictive reports on neighborhood trends and property valuation',
    capabilities: [
      'market_trend_analysis',
      'price_prediction',
      'demand_forecasting',
      'competitor_tracking',
      'investment_scoring',
      'economic_indicator_monitoring',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/analytics', '/api/predictions', '/api/market-data'],
    dataFlows: {
      outputs: ['zoe', 'olivia', 'maven'],
      inputs: ['mary', 'henry'],
    },
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    title: 'Development & Project Intelligence',
    department: 'intelligence',
    icon: 'Map',
    color: '#6366F1',
    avatar: '🗺️',
    description:
      'Analyzes zoning, DLC master plans, market gaps, and developer track records to identify high-potential off-plan projects for investment or brokerage',
    capabilities: [
      'feasibility_analysis',
      'zoning_analysis',
      'developer_tracking',
      'project_pipeline',
      'market_gap_detection',
      'roi_projection',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/projects', '/api/developers', '/api/feasibility'],
    dataFlows: {
      outputs: ['mary', 'clara', 'cipher'],
      inputs: ['cipher', 'mary'],
    },
  },
  vesta: {
    id: 'vesta',
    name: 'Vesta',
    title: 'Project & Snagging Coordinator',
    department: 'operations',
    icon: 'ClipboardCheck',
    color: '#F97316',
    avatar: '🏗️',
    description:
      'Tracks construction milestones for off-plan buyers, automates communication with developers, and manages the digital snagging process using image recognition',
    capabilities: [
      'milestone_tracking',
      'developer_communication',
      'snagging_management',
      'defect_reporting',
      'handover_coordination',
      'image_recognition',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/construction', '/api/snagging', '/api/handover'],
    dataFlows: {
      outputs: ['mary', 'nadia'],
      inputs: ['atlas', 'mary'],
    },
  },
  juno: {
    id: 'juno',
    name: 'Juno',
    title: 'Smart Community & Facilities Manager',
    department: 'operations',
    icon: 'Building',
    color: '#14B8A6',
    avatar: '🏢',
    description:
      'Integrates with building IoT systems for energy optimization, manages community events, and automates facility service requests between Nina and vendors',
    capabilities: [
      'iot_integration',
      'energy_optimization',
      'event_management',
      'service_automation',
      'access_control',
      'utility_monitoring',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager', 'community_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/facilities', '/api/iot', '/api/community'],
    dataFlows: {
      outputs: ['nina', 'sentinel'],
      inputs: ['sentinel', 'mary'],
    },
  },
  kairos: {
    id: 'kairos',
    name: 'Kairos',
    title: 'Luxury Concierge & VIP Experience',
    department: 'sales',
    icon: 'Crown',
    color: '#D97706',
    avatar: '👑',
    description:
      'Curates personalized services for high-net-worth clients: viewing schedules, interior design partners, visa/payment coordination, creating white-glove service',
    capabilities: [
      'vip_client_management',
      'concierge_services',
      'lifestyle_coordination',
      'partner_network',
      'exclusive_access',
      'personalized_experience',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'luxury_sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/concierge', '/api/vip', '/api/lifestyle'],
    dataFlows: {
      outputs: ['clara', 'nadia'],
      inputs: ['clara', 'sophia'],
    },
  },
  maven: {
    id: 'maven',
    name: 'Maven',
    title: 'Investment Strategy & Portfolio Optimizer',
    department: 'finance',
    icon: 'PieChart',
    color: '#8B5CF6',
    avatar: '📊',
    description:
      'Analyzes rental yields, capital appreciation trends, and tax implications to provide data-driven advice on buying, holding, or selling assets for investor clients',
    capabilities: [
      'portfolio_analysis',
      'yield_optimization',
      'tax_planning',
      'investment_recommendations',
      'risk_assessment',
      'performance_tracking',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/portfolio', '/api/investments', '/api/yields'],
    dataFlows: {
      outputs: ['zoe', 'clara'],
      inputs: ['cipher', 'theodora', 'mary'],
    },
  },
  linda: {
    id: 'linda',
    name: 'Linda',
    title: 'WhatsApp LocalAuth Bot Manager',
    department: 'communications',
    icon: 'Smartphone',
    color: '#8B5CF6',
    avatar: '🤖',
    description:
      'Manages agent-side WhatsApp sessions with LocalAuth, real estate command execution, contact sync, and AI opportunity scoring',
    capabilities: [
      'local_auth_management',
      'multi_account_coordination',
      'qr_device_linking',
      'contact_sync_import',
      'ai_opportunity_scoring',
      'command_execution',
      'conversation_routing',
      'session_recovery',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: [
      '/api/linda/sessions',
      '/api/linda/send-message',
      '/api/linda/contacts',
      '/api/linda/analytics',
    ],
    dataFlows: {
      outputs: ['nadia', 'clara'],
      inputs: ['nadia'],
    },
  },
  archer: {
    id: 'archer',
    name: 'Archer',
    title: 'Lead Scoring Engine',
    department: 'sales',
    icon: 'Target',
    color: '#EF4444',
    avatar: '🎯',
    description:
      'Calculates lead conversion probability scores (0–100) using enquiry source, budget signals, area preference, and engagement history to prioritise the sales pipeline',
    capabilities: [
      'lead_scoring',
      'conversion_prediction',
      'engagement_tracking',
      'budget_analysis',
      'priority_ranking',
      'pipeline_optimization',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/leads/:id/score', '/api/scoring/rules', '/api/scoring/history'],
    dataFlows: {
      outputs: ['clara', 'sophia'],
      inputs: ['clara', 'cipher'],
    },
  },
  prism: {
    id: 'prism',
    name: 'Prism',
    title: 'AI Property Matching Engine',
    department: 'sales',
    icon: 'Layers',
    color: '#0EA5E9',
    avatar: '🔭',
    description:
      'Matches buyer and tenant requirements to the best-fit properties using vector similarity search across the full inventory, ranked by suitability score',
    capabilities: [
      'requirement_parsing',
      'vector_similarity_search',
      'inventory_matching',
      'ranked_recommendations',
      'preference_learning',
      'match_explanation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: [
      '/api/matching/properties',
      '/api/matching/preferences',
      '/api/matching/history',
    ],
    dataFlows: {
      outputs: ['clara', 'sophia'],
      inputs: ['mary', 'archer'],
    },
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    title: 'Mortgage & Financing Advisor',
    department: 'finance',
    icon: 'Calculator',
    color: '#14B8A6',
    avatar: '💰',
    description:
      'Provides mortgage eligibility calculations, EIBOR rate tracking, bank comparison, and financing pathway guidance for buyers and investors',
    capabilities: [
      'mortgage_calculation',
      'eligibility_assessment',
      'rate_comparison',
      'bank_referrals',
      'affordability_analysis',
      'financing_pathways',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/finance/mortgage-calc', '/api/finance/rates', '/api/finance/banks'],
    dataFlows: {
      outputs: ['theodora', 'clara'],
      inputs: ['theodora', 'cipher'],
    },
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    title: 'Client Communication History & Timeline',
    department: 'customer_experience',
    icon: 'Clock',
    color: '#6366F1',
    avatar: '📜',
    description:
      'Maintains a full, searchable communication timeline per client across all channels — WhatsApp, email, calls, and meetings — providing context to every agent interaction',
    capabilities: [
      'timeline_management',
      'cross_channel_aggregation',
      'communication_search',
      'context_retrieval',
      'thread_linking',
      'audit_trail',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/cx/timeline/:clientId', '/api/cx/communications', '/api/cx/search'],
    dataFlows: {
      outputs: ['clara', 'kairos'],
      inputs: ['nadia', 'linda', 'nina'],
    },
  },
  mira: {
    id: 'mira',
    name: 'Mira',
    title: 'Multilingual Translation Engine',
    department: 'customer_experience',
    icon: 'Globe',
    color: '#10B981',
    avatar: '🌍',
    description:
      'Provides real-time Arabic ↔ English translation for client communications, marketing content, and documents, ensuring seamless bilingual service across all touchpoints',
    capabilities: [
      'real_time_translation',
      'arabic_rtl_support',
      'document_translation',
      'tone_preservation',
      'property_terminology',
      'message_localisation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/translate', '/api/translate/document', '/api/translate/detect'],
    dataFlows: {
      outputs: ['nadia', 'nina', 'echo'],
      inputs: [],
    },
  },
  rex: {
    id: 'rex',
    name: 'Rex',
    title: 'Regulatory Document Verifier',
    department: 'compliance',
    icon: 'FileCheck',
    color: '#DC2626',
    avatar: '📋',
    description:
      'Verifies authenticity of title deeds, NOCs, Emirates IDs, and government documents using DLD API and layout integrity checks to protect against fraud',
    capabilities: [
      'document_verification',
      'title_deed_check',
      'noc_validation',
      'id_verification',
      'dld_api_integration',
      'fraud_detection',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: [
      '/api/compliance/documents/verify',
      '/api/compliance/dld-check',
      '/api/compliance/id-verify',
    ],
    dataFlows: {
      outputs: ['laila', 'evangeline'],
      inputs: ['laila'],
    },
  },
  iris: {
    id: 'iris',
    name: 'Iris',
    title: 'Virtual Staging & 3D Visualization AI',
    department: 'technology',
    icon: 'Eye',
    color: '#A855F7',
    avatar: '🎨',
    description:
      'Generates AI-powered virtual staging images, interactive 3D floor plans, and AR property tours to enhance listing appeal and buyer engagement',
    capabilities: [
      'virtual_staging',
      '3d_rendering',
      'ar_tour_generation',
      'floor_plan_conversion',
      'style_recommendations',
      'image_enhancement',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/staging/generate', '/api/staging/3d', '/api/staging/ar'],
    dataFlows: {
      outputs: ['olivia', 'mary'],
      inputs: ['mary', 'hazel'],
    },
  },
  apex: {
    id: 'apex',
    name: 'Apex',
    title: 'Agent Performance Coach',
    department: 'marketing',
    icon: 'TrendingUp',
    color: '#F59E0B',
    avatar: '🏆',
    description:
      'Monitors and coaches sales agents on performance metrics, client communication quality, and personal branding, with AI-generated improvement recommendations',
    capabilities: [
      'performance_tracking',
      'coaching_recommendations',
      'communication_analysis',
      'personal_branding',
      'target_setting',
      'benchmark_comparison',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: [
      '/api/marketing/agent-performance',
      '/api/marketing/coaching',
      '/api/agents/metrics',
    ],
    dataFlows: {
      outputs: ['zoe', 'sophia'],
      inputs: ['sophia', 'clara', 'halo'],
    },
  },
  halo: {
    id: 'halo',
    name: 'Halo',
    title: 'Client Satisfaction & NPS Tracker',
    department: 'customer_experience',
    icon: 'Star',
    color: '#F472B6',
    avatar: '⭐',
    description:
      'Measures Net Promoter Score and CSAT after every sale, lease, and key client interaction; surfaces feedback to the right departments for service improvement',
    capabilities: [
      'nps_surveys',
      'csat_measurement',
      'feedback_collection',
      'trend_analysis',
      'alert_thresholds',
      'department_routing',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: ['/api/cx/nps/survey', '/api/cx/nps/scores', '/api/cx/feedback'],
    dataFlows: {
      outputs: ['zoe', 'olivia', 'apex'],
      inputs: ['sophia', 'daisy'],
    },
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    title: 'Market Analyst Bot',
    department: 'data_and_ai',
    icon: 'BarChart2',
    color: '#0D9488',
    avatar: '🔮',
    description:
      'Synthesises real-time DLD transaction data, portal price feeds, and economic indicators into narrative market summaries and investment opportunity alerts',
    capabilities: [
      'market_synthesis',
      'dld_data_analysis',
      'price_trend_reporting',
      'opportunity_alerts',
      'competitor_tracking',
      'report_generation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: [
      '/api/intelligence/market-report',
      '/api/intelligence/summary',
      '/api/intelligence/alerts',
    ],
    dataFlows: {
      outputs: ['zoe', 'olivia', 'cipher'],
      inputs: ['flux', 'cipher'],
    },
  },
  flux: {
    id: 'flux',
    name: 'Flux',
    title: 'Real-Time Market Data Feed',
    department: 'data_and_ai',
    icon: 'Activity',
    color: '#3B82F6',
    avatar: '⚡',
    description:
      'Continuously ingests DLD transaction records, portal price changes, UAE news, and developer announcements to keep the entire intelligence layer current',
    capabilities: [
      'dld_feed_ingestion',
      'portal_price_monitoring',
      'news_scraping',
      'developer_updates',
      'data_normalisation',
      'freshness_monitoring',
    ],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: [
      '/api/intelligence/news-feed',
      '/api/intelligence/transactions',
      '/api/intelligence/prices',
    ],
    dataFlows: {
      outputs: ['oracle', 'cipher', 'atlas'],
      inputs: [],
    },
  },
  nova: {
    id: 'nova',
    name: 'Nova',
    title: 'New Development & Off-Plan Tracker',
    department: 'data_and_ai',
    icon: 'Building',
    color: '#8B5CF6',
    avatar: '🏗️',
    description:
      'Monitors DAMAC, Emaar, and other developer project milestones, payment plan releases, and launch events to keep the sales team ahead of new inventory',
    capabilities: [
      'milestone_tracking',
      'launch_alerts',
      'payment_plan_monitoring',
      'developer_news',
      'handover_schedule',
      'inventory_preview',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental',
    },
    apiEndpoints: [
      '/api/intelligence/off-plan',
      '/api/intelligence/developers',
      '/api/intelligence/launches',
    ],
    dataFlows: {
      outputs: ['atlas', 'clara', 'mary'],
      inputs: ['flux', 'atlas'],
    },
  },
  quill: {
    id: 'quill',
    name: 'Quill',
    title: 'Document Generation Engine',
    department: 'data_and_ai',
    icon: 'FileText',
    color: '#6366F1',
    avatar: '✍️',
    description:
      'Generates professionally formatted SPAs, lease agreements, NOCs, invoices, market reports, and board summaries from templates and live CRM data',
    capabilities: [
      'spa_generation',
      'lease_drafting',
      'invoice_generation',
      'report_pdf',
      'noc_drafting',
      'template_management',
      'bulk_generation',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager', 'finance_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/documents/generate', '/api/documents/templates', '/api/documents/preview'],
    dataFlows: {
      outputs: ['evangeline', 'theodora', 'zoe'],
      inputs: ['theodora', 'evangeline', 'daisy'],
    },
  },
  lumen: {
    id: 'lumen',
    name: 'Lumen',
    title: 'Visual Analytics & Reporting Engine',
    department: 'data_and_ai',
    icon: 'BarChart',
    color: '#EC4899',
    avatar: '📊',
    description:
      'Renders charts, heat maps, geospatial visualisations, and exportable dashboards from CRM and market data, powering every reporting surface in the platform',
    capabilities: [
      'chart_rendering',
      'heatmap_generation',
      'geospatial_mapping',
      'dashboard_builder',
      'pdf_export',
      'real_time_refresh',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'marketing_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/reports/charts/:type', '/api/reports/dashboards', '/api/reports/export'],
    dataFlows: {
      outputs: ['zoe', 'olivia'],
      inputs: ['oracle', 'cipher', 'flux'],
    },
  },
  crest: {
    id: 'crest',
    name: 'Crest',
    title: 'Property Valuation Engine (AVM)',
    department: 'data_and_ai',
    icon: 'TrendingUp',
    color: '#10B981',
    avatar: '🏠',
    description:
      'Provides automated property valuations based on comparable DLD transactions, area trends, property condition, and market demand signals with a confidence score',
    capabilities: [
      'automated_valuation',
      'comparable_analysis',
      'confidence_scoring',
      'bulk_valuation',
      'valuation_history',
      'market_adjustment',
    ],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full',
    },
    apiEndpoints: ['/api/valuation/property', '/api/valuation/bulk', '/api/valuation/history'],
    dataFlows: {
      outputs: ['clara', 'theodora', 'maven'],
      inputs: ['flux', 'cipher', 'mary'],
    },
  },
};

// ---------------------------------------------------------------------------
// Accessor Functions
// ---------------------------------------------------------------------------

export const getAssistantById = (id: AssistantId): Assistant | null =>
  // eslint-disable-next-line security/detect-object-injection
  AI_ASSISTANTS[id] || null;

export const getAssistantsByDepartment = (departmentId: DepartmentId): Assistant[] => {
  return Object.values(AI_ASSISTANTS).filter(assistant => assistant.department === departmentId);
};

export const getAllAssistants = (): Assistant[] => Object.values(AI_ASSISTANTS);

export const getAllDepartments = (): Department[] => Object.values(DEPARTMENTS);

export const getDepartmentById = (id: DepartmentId): Department | null =>
  // eslint-disable-next-line security/detect-object-injection
  DEPARTMENTS[id] || null;

export const getAssistantCount = (): number => Object.keys(AI_ASSISTANTS).length;

export const getDepartmentCount = (): number => Object.keys(DEPARTMENTS).length;

export const ASSISTANT_IDS: AssistantId[] = Object.keys(AI_ASSISTANTS) as AssistantId[];

export const DEPARTMENT_IDS: DepartmentId[] = Object.keys(DEPARTMENTS) as DepartmentId[];

export const getDepartmentOrder = (): DepartmentId[] => [
  'communications',
  'operations',
  'sales',
  'finance',
  'marketing',
  'executive',
  'compliance',
  'legal',
  'technology',
  'intelligence',
  'customer_experience',
  'data_and_ai',
];

export const getNavigationStructure = (): NavigationItem[] => {
  const order = getDepartmentOrder();
  return order.map(deptId => ({
    // eslint-disable-next-line security/detect-object-injection
    ...DEPARTMENTS[deptId],
    assistants: getAssistantsByDepartment(deptId),
  }));
};

export const getDataFlowsForAssistant = (assistantId: AssistantId): AssistantDataFlows => {
  // eslint-disable-next-line security/detect-object-injection
  const assistant = AI_ASSISTANTS[assistantId];
  if (!assistant?.dataFlows) return { inputs: [], outputs: [] };
  return {
    inputs: assistant.dataFlows.inputs || [],
    outputs: assistant.dataFlows.outputs || [],
  };
};

// ---------------------------------------------------------------------------
// Default Export (matches original)
// ---------------------------------------------------------------------------

export default {
  AI_ASSISTANTS,
  DEPARTMENTS,
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
};
