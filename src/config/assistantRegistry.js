export const DEPARTMENTS = {
  communications: { 
    id: 'communications',
    label: 'Communications', 
    color: '#25D366', 
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: 'MessageSquare'
  },
  operations: { 
    id: 'operations',
    label: 'Operations', 
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'Building2'
  },
  sales: { 
    id: 'sales',
    label: 'Sales', 
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    icon: 'TrendingUp'
  },
  finance: { 
    id: 'finance',
    label: 'Finance', 
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'Wallet'
  },
  marketing: { 
    id: 'marketing',
    label: 'Marketing', 
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'Megaphone'
  },
  executive: { 
    id: 'executive',
    label: 'Executive', 
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'Briefcase'
  },
  compliance: { 
    id: 'compliance',
    label: 'Compliance', 
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    icon: 'Shield'
  },
  technology: { 
    id: 'technology',
    label: 'Technology', 
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    icon: 'Server'
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    icon: 'Scale'
  },
  intelligence: {
    id: 'intelligence',
    label: 'Intelligence',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    icon: 'Brain'
  }
};

export const AI_ASSISTANTS = {
  linda: {
    id: 'linda',
    name: 'Linda',
    title: 'WhatsApp CRM Manager',
    department: 'communications',
    icon: 'MessageSquare',
    color: '#25D366',
    avatar: '👩‍💼',
    description: 'Manages 23+ agent WhatsApp numbers, conversation routing, template messaging, and lead pre-qualification',
    capabilities: ['conversation_management', 'lead_scoring', 'quick_replies', 'ai_insights', 'agent_status_monitoring', 'broadcast_management'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/whatsapp', '/api/conversations', '/api/templates'],
    dataFlows: {
      outputs: ['clara', 'mary'],
      inputs: ['nina']
    }
  },
  nina: {
    id: 'nina',
    name: 'Nina',
    title: 'WhatsApp Bot Developer',
    department: 'communications',
    icon: 'Bot',
    color: '#06B6D4',
    avatar: '👩‍💻',
    description: 'Develops and manages WhatsApp automation bots, conversation flows, and bot analytics',
    capabilities: ['bot_development', 'flow_design', 'session_management', 'analytics'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/bots', '/api/flows', '/api/sessions'],
    dataFlows: {
      outputs: ['linda'],
      inputs: []
    }
  },
  mary: {
    id: 'mary',
    name: 'Mary',
    title: 'Inventory CRM Manager',
    department: 'operations',
    icon: 'Building2',
    color: '#3B82F6',
    avatar: '👩‍💻',
    description: 'Manages DAMAC Hills 2 property inventory with 9,378+ units, data acquisition tools, and asset management',
    capabilities: ['property_crud', 'data_tools', 'asset_fetcher', 'filtering', 'excel_import', 'ocr_extraction'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/inventory', '/api/properties', '/api/assets'],
    dataFlows: {
      outputs: ['clara', 'linda', 'olivia'],
      inputs: ['clara', 'sentinel']
    }
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
    capabilities: ['employee_management', 'recruitment', 'performance_tracking', 'attendance', 'onboarding'],
    permissions: {
      viewableBy: ['owner', 'admin', 'hr_manager'],
      accessibleBy: ['owner', 'admin', 'hr_manager'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/hr', '/api/employees', '/api/recruitment'],
    dataFlows: {
      outputs: ['zoe'],
      inputs: []
    }
  },
  daisy: {
    id: 'daisy',
    name: 'Daisy',
    title: 'Leasing & Tenant Manager',
    department: 'operations',
    icon: 'Home',
    color: '#14B8A6',
    avatar: '👩‍🔧',
    description: 'Manages rental properties, tenant communications, lease agreements, and maintenance requests',
    capabilities: ['lease_management', 'tenant_communications', 'maintenance_tracking', 'rental_analytics'],
    permissions: {
      viewableBy: ['owner', 'admin', 'leasing_manager'],
      accessibleBy: ['owner', 'admin', 'leasing_manager'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/leasing', '/api/tenants', '/api/maintenance'],
    dataFlows: {
      outputs: ['mary', 'theodora'],
      inputs: ['mary', 'sentinel']
    }
  },
  clara: {
    id: 'clara',
    name: 'Clara',
    title: 'Leads CRM Manager',
    department: 'sales',
    icon: 'Target',
    color: '#EF4444',
    avatar: '👩‍🎯',
    description: 'Manages lead pipeline, qualification, nurturing workflows, and conversion tracking',
    capabilities: ['lead_management', 'qualification', 'nurturing', 'conversion_tracking', 'activity_timeline', 'lead_scoring'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/leads', '/api/pipeline', '/api/activities'],
    dataFlows: {
      outputs: ['mary', 'sophia', 'linda'],
      inputs: ['linda', 'mary', 'hunter']
    }
  },
  sophia: {
    id: 'sophia',
    name: 'Sophia',
    title: 'Sales Pipeline Manager',
    department: 'sales',
    icon: 'TrendingUp',
    color: '#8B5CF6',
    avatar: '👩‍💻',
    description: 'Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics',
    capabilities: ['pipeline_management', 'lead_assignment', 'deal_tracking', 'sales_forecasting', 'commission_calculation'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager', 'agent'],
      accessibleBy: ['owner', 'admin', 'sales_manager'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/sales', '/api/pipeline', '/api/deals'],
    dataFlows: {
      outputs: ['theodora', 'zoe'],
      inputs: ['clara']
    }
  },
  theodora: {
    id: 'theodora',
    name: 'Theodora',
    title: 'Finance Director',
    department: 'finance',
    icon: 'Wallet',
    color: '#F59E0B',
    avatar: '👩‍💼',
    description: 'Manages financial operations, invoicing, payment tracking, escrow, and accounting reports',
    capabilities: ['invoice_management', 'payment_tracking', 'financial_reports', 'budget_analysis', 'escrow_management'],
    permissions: {
      viewableBy: ['owner', 'admin', 'finance_manager'],
      accessibleBy: ['owner', 'admin', 'finance_manager'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/finance', '/api/invoices', '/api/payments'],
    dataFlows: {
      outputs: ['laila', 'zoe'],
      inputs: ['sophia', 'daisy']
    }
  },
  olivia: {
    id: 'olivia',
    name: 'Olivia',
    title: 'Marketing & Automation Manager',
    department: 'marketing',
    icon: 'Megaphone',
    color: '#EC4899',
    avatar: '👩‍🎨',
    description: 'Manages marketing campaigns, social media, property listings, market intelligence, and brand communications',
    capabilities: ['campaign_management', 'social_media', 'listing_optimization', 'analytics', 'market_intelligence', 'content_automation'],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin', 'marketing_manager'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/marketing', '/api/campaigns', '/api/social'],
    dataFlows: {
      outputs: ['zoe'],
      inputs: ['mary']
    }
  },
  zoe: {
    id: 'zoe',
    name: 'Zoe',
    title: 'Executive Assistant & Strategic Intelligence',
    department: 'executive',
    icon: 'Briefcase',
    color: '#10B981',
    avatar: '👩‍🏫',
    description: 'Executive support, strategic suggestions inbox, business intelligence, KPI dashboards, and cross-department coordination',
    capabilities: ['executive_reports', 'suggestion_inbox', 'kpi_dashboard', 'strategic_planning', 'cross_department_coordination'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/executive', '/api/suggestions', '/api/analytics'],
    dataFlows: {
      outputs: [],
      inputs: ['all']
    }
  },
  laila: {
    id: 'laila',
    name: 'Laila',
    title: 'Compliance Officer',
    department: 'compliance',
    icon: 'Shield',
    color: '#6366F1',
    avatar: '👩‍⚖️',
    description: 'Manages regulatory compliance, KYC/AML processes, audit trails, and contract reviews',
    capabilities: ['kyc_verification', 'aml_monitoring', 'contract_review', 'compliance_reports', 'audit_trail'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin', 'legal_manager'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/compliance', '/api/legal', '/api/kyc'],
    dataFlows: {
      outputs: ['zoe', 'evangeline'],
      inputs: ['theodora', 'clara']
    }
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    title: 'CTO & Systems Architect',
    department: 'technology',
    icon: 'Server',
    color: '#0EA5E9',
    avatar: '👩‍💻',
    description: 'Oversees all technical operations, system architecture, deployment pipelines, documentation hub, and AI governance',
    capabilities: ['system_health_monitoring', 'deployment_pipeline', 'application_portfolio', 'performance_analytics', 'documentation_hub', 'ai_governance'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/system', '/api/deployments', '/api/applications'],
    dataFlows: {
      outputs: ['all'],
      inputs: ['all']
    }
  },
  hazel: {
    id: 'hazel',
    name: 'Hazel',
    title: 'Elite Frontend Engineer',
    department: 'technology',
    icon: 'Palette',
    color: '#F472B6',
    avatar: '👩‍🎨',
    description: 'Designs and builds pixel-perfect UI components, maintains the design system, and ensures accessibility compliance',
    capabilities: ['component_library', 'design_system', 'responsive_design', 'accessibility_audit', 'ui_performance', 'theme_management'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/frontend', '/api/components', '/api/design-system'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora']
    }
  },
  willow: {
    id: 'willow',
    name: 'Willow',
    title: 'Elite Backend Engineer',
    department: 'technology',
    icon: 'Database',
    color: '#22C55E',
    avatar: '👨‍💻',
    description: 'Architects backend services, optimizes database queries, manages API performance, and ensures system reliability',
    capabilities: ['api_development', 'database_optimization', 'caching_strategies', 'websocket_realtime', 'data_pipeline', 'security_hardening'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/backend', '/api/performance', '/api/database'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora']
    }
  },
  evangeline: {
    id: 'evangeline',
    name: 'Evangeline',
    title: 'Legal Risk Analyst',
    department: 'legal',
    icon: 'Scale',
    color: '#DC2626',
    avatar: '👩‍⚖️',
    description: 'Proactively identifies, documents, and helps resolve legal issues. Monitors contracts, regulations, and transaction compliance',
    capabilities: ['legal_risk_analysis', 'contract_monitoring', 'regulatory_tracking', 'dispute_prevention', 'best_practices_library'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/legal', '/api/risks', '/api/contracts'],
    dataFlows: {
      outputs: ['zoe', 'laila'],
      inputs: ['laila', 'theodora', 'clara']
    }
  },
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    title: 'Property Monitoring AI',
    department: 'operations',
    icon: 'Eye',
    color: '#7C3AED',
    avatar: '🛡️',
    description: 'IoT integration for property condition monitoring, predictive maintenance scheduling, and emergency response coordination',
    capabilities: ['iot_monitoring', 'predictive_maintenance', 'inspection_scheduling', 'vendor_management', 'emergency_response'],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/monitoring', '/api/maintenance', '/api/inspections'],
    dataFlows: {
      outputs: ['mary', 'daisy'],
      inputs: ['mary']
    }
  },
  hunter: {
    id: 'hunter',
    name: 'Hunter',
    title: 'Lead Prospecting AI',
    department: 'sales',
    icon: 'Search',
    color: '#0D9488',
    avatar: '🎯',
    description: 'Scrapes and analyzes potential client databases, identifies property buying/selling patterns, and manages automated outreach',
    capabilities: ['prospect_analysis', 'market_scanning', 'pattern_detection', 'outreach_automation', 'lead_enrichment'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/prospecting', '/api/outreach', '/api/enrichment'],
    dataFlows: {
      outputs: ['clara'],
      inputs: ['mary', 'olivia']
    }
  },
  henry: {
    id: 'henry',
    name: 'Henry',
    title: 'Record Keeper & Timeline Master',
    department: 'technology',
    icon: 'BookOpen',
    color: '#7C3AED',
    avatar: '📚',
    description: 'Centralized memory and audit system. Creates immutable audit trails, enables cross-system analytics, provides operational clarity, and automates compliance reporting',
    capabilities: ['universal_event_ingestion', 'intelligent_categorization', 'timeline_visualization', 'relationship_mapping', 'search_query_engine', 'sla_monitoring', 'compliance_logging', 'anomaly_detection', 'report_generation', 'data_integrity_guardian'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/events', '/api/timeline', '/api/audit', '/api/reports'],
    dataFlows: {
      outputs: ['zoe', 'laila', 'aurora'],
      inputs: ['all']
    }
  },
  cipher: {
    id: 'cipher',
    name: 'Cipher',
    title: 'Predictive Market Analyst',
    department: 'intelligence',
    icon: 'LineChart',
    color: '#0D9488',
    avatar: '🔮',
    description: 'Uses advanced analytics on DLD transaction data, news, and economic indicators to generate predictive reports on neighborhood trends and property valuation',
    capabilities: ['market_trend_analysis', 'price_prediction', 'demand_forecasting', 'competitor_tracking', 'investment_scoring', 'economic_indicator_monitoring'],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/analytics', '/api/predictions', '/api/market-data'],
    dataFlows: {
      outputs: ['zoe', 'olivia', 'maven'],
      inputs: ['mary', 'henry']
    }
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    title: 'Development & Project Intelligence',
    department: 'intelligence',
    icon: 'Map',
    color: '#6366F1',
    avatar: '🗺️',
    description: 'Analyzes zoning, DLC master plans, market gaps, and developer track records to identify high-potential off-plan projects for investment or brokerage',
    capabilities: ['feasibility_analysis', 'zoning_analysis', 'developer_tracking', 'project_pipeline', 'market_gap_detection', 'roi_projection'],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/projects', '/api/developers', '/api/feasibility'],
    dataFlows: {
      outputs: ['mary', 'clara', 'cipher'],
      inputs: ['cipher', 'mary']
    }
  },
  vesta: {
    id: 'vesta',
    name: 'Vesta',
    title: 'Project & Snagging Coordinator',
    department: 'operations',
    icon: 'ClipboardCheck',
    color: '#F97316',
    avatar: '🏗️',
    description: 'Tracks construction milestones for off-plan buyers, automates communication with developers, and manages the digital snagging process using image recognition',
    capabilities: ['milestone_tracking', 'developer_communication', 'snagging_management', 'defect_reporting', 'handover_coordination', 'image_recognition'],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/construction', '/api/snagging', '/api/handover'],
    dataFlows: {
      outputs: ['mary', 'linda'],
      inputs: ['atlas', 'mary']
    }
  },
  juno: {
    id: 'juno',
    name: 'Juno',
    title: 'Smart Community & Facilities Manager',
    department: 'operations',
    icon: 'Building',
    color: '#14B8A6',
    avatar: '🏢',
    description: 'Integrates with building IoT systems for energy optimization, manages community events, and automates facility service requests between Nina and vendors',
    capabilities: ['iot_integration', 'energy_optimization', 'event_management', 'service_automation', 'access_control', 'utility_monitoring'],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager', 'community_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/facilities', '/api/iot', '/api/community'],
    dataFlows: {
      outputs: ['nina', 'sentinel'],
      inputs: ['sentinel', 'mary']
    }
  },
  kairos: {
    id: 'kairos',
    name: 'Kairos',
    title: 'Luxury Concierge & VIP Experience',
    department: 'sales',
    icon: 'Crown',
    color: '#D97706',
    avatar: '👑',
    description: 'Curates personalized services for high-net-worth clients: viewing schedules, interior design partners, visa/payment coordination, creating white-glove service',
    capabilities: ['vip_client_management', 'concierge_services', 'lifestyle_coordination', 'partner_network', 'exclusive_access', 'personalized_experience'],
    permissions: {
      viewableBy: ['owner', 'admin', 'luxury_sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/concierge', '/api/vip', '/api/lifestyle'],
    dataFlows: {
      outputs: ['clara', 'linda'],
      inputs: ['clara', 'sophia']
    }
  },
  maven: {
    id: 'maven',
    name: 'Maven',
    title: 'Investment Strategy & Portfolio Optimizer',
    department: 'finance',
    icon: 'PieChart',
    color: '#8B5CF6',
    avatar: '📊',
    description: 'Analyzes rental yields, capital appreciation trends, and tax implications to provide data-driven advice on buying, holding, or selling assets for investor clients',
    capabilities: ['portfolio_analysis', 'yield_optimization', 'tax_planning', 'investment_recommendations', 'risk_assessment', 'performance_tracking'],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/portfolio', '/api/investments', '/api/yields'],
    dataFlows: {
      outputs: ['zoe', 'clara'],
      inputs: ['cipher', 'theodora', 'mary']
    }
  }
};

export const getAssistantById = (id) => AI_ASSISTANTS[id] || null;

export const getAssistantsByDepartment = (departmentId) => {
  return Object.values(AI_ASSISTANTS).filter(
    assistant => assistant.department === departmentId
  );
};

export const getAllAssistants = () => Object.values(AI_ASSISTANTS);

export const getAllDepartments = () => Object.values(DEPARTMENTS);

export const getDepartmentById = (id) => DEPARTMENTS[id] || null;

export const getAssistantCount = () => Object.keys(AI_ASSISTANTS).length;

export const getDepartmentCount = () => Object.keys(DEPARTMENTS).length;

export const ASSISTANT_IDS = Object.keys(AI_ASSISTANTS);

export const DEPARTMENT_IDS = Object.keys(DEPARTMENTS);

export const getDepartmentOrder = () => [
  'communications',
  'operations', 
  'sales',
  'finance',
  'marketing',
  'executive',
  'compliance',
  'legal',
  'technology',
  'intelligence'
];

export const getNavigationStructure = () => {
  const order = getDepartmentOrder();
  return order.map(deptId => ({
    ...DEPARTMENTS[deptId],
    assistants: getAssistantsByDepartment(deptId)
  }));
};

export const getDataFlowsForAssistant = (assistantId) => {
  const assistant = AI_ASSISTANTS[assistantId];
  if (!assistant?.dataFlows) return { inputs: [], outputs: [] };
  return {
    inputs: assistant.dataFlows.inputs || [],
    outputs: assistant.dataFlows.outputs || []
  };
};

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
  DEPARTMENT_IDS
};
