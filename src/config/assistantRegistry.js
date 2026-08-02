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
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
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
    title: 'MD Executive Assistant & Strategic Intelligence',
    department: 'executive',
    icon: 'Briefcase',
    color: '#10B981',
    avatar: '👩‍🏫',
    description: 'Executive AI Assistant for Managing Director Arslan Malik. Provides strategic suggestions inbox, business intelligence, KPI dashboards, and cross-department coordination.',
    reportsTo: {
      name: 'Arslan Malik',
      title: 'Managing Director',
      email: 'arslanmalikgoraha@gmail.com'
    },
    capabilities: ['executive_reports', 'suggestion_inbox', 'kpi_dashboard', 'strategic_planning', 'cross_department_coordination', 'md_briefings'],
    permissions: {
      viewableBy: ['md', 'admin'],
      accessibleBy: ['md'],
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
    color: '#EF4444',
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
  },
  // === ADDITIONAL CORE ASSISTANTS (Phase 1 Extension) ===
  penny: {
    id: 'penny',
    name: 'Penny',
    title: 'Commission Tracker & Payment Orchestrator',
    department: 'finance',
    icon: 'CreditCard',
    color: '#EC4899',
    avatar: '💳',
    description: 'Automates commission calculation, payout scheduling, agent performance bonuses, and creates detailed earning reports for all team members',
    capabilities: ['commission_calculation', 'payout_scheduling', 'performance_bonuses', 'earning_reports', 'payment_automation', 'compliance_tracking'],
    permissions: {
      viewableBy: ['owner', 'admin', 'finance_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/commissions', '/api/payouts', '/api/earnings'],
    dataFlows: {
      outputs: ['theodora', 'zoe'],
      inputs: ['sophia', 'clara', 'theodora']
    }
  },
  quinn: {
    id: 'quinn',
    name: 'Quinn',
    title: 'Payment Processor & Gateway Manager',
    department: 'finance',
    icon: 'Zap',
    color: '#00D084',
    avatar: '⚡',
    description: 'Manages payment gateway integrations, transaction processing, refund handling, escrow operations, and reconciliation across all transactions',
    capabilities: ['payment_gateway_management', 'transaction_processing', 'refund_handling', 'escrow_operations', 'reconciliation', 'fraud_detection'],
    permissions: {
      viewableBy: ['owner', 'admin', 'finance_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/payments', '/api/gateway', '/api/escrow'],
    dataFlows: {
      outputs: ['theodora', 'laila'],
      inputs: ['clara', 'theodora', 'daisy']
    }
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus',
    title: 'Campaign Manager & Performance Analyst',
    department: 'marketing',
    icon: 'Gauge',
    color: '#FF6B6B',
    avatar: '📈',
    description: 'Creates and manages multi-channel marketing campaigns, performs A/B testing, allocates budget, and tracks conversion metrics across all platforms',
    capabilities: ['campaign_creation', 'ab_testing', 'performance_tracking', 'budget_allocation', 'channel_optimization', 'attribution_modeling'],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/campaigns', '/api/analytics', '/api/budget'],
    dataFlows: {
      outputs: ['zoe', 'olivia'],
      inputs: ['olivia', 'clara', 'mary']
    }
  },
  stella: {
    id: 'stella',
    name: 'Stella',
    title: 'Content Creator & Asset Manager',
    department: 'marketing',
    icon: 'Sparkles',
    color: '#FFB347',
    avatar: '✨',
    description: 'Manages content calendar, creates property copy, organizes digital assets, maintains brand guidelines, and generates social media content recommendations',
    capabilities: ['content_calendar', 'copywriting', 'asset_management', 'brand_guidelines', 'social_content', 'seo_optimization'],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/content', '/api/assets', '/api/social'],
    dataFlows: {
      outputs: ['olivia', 'marcus'],
      inputs: ['olivia', 'mary']
    }
  },
  vera: {
    id: 'vera',
    name: 'Vera',
    title: 'KYC Specialist & Identity Verification',
    department: 'compliance',
    icon: 'UserCheck',
    color: '#8FB9A8',
    avatar: '✅',
    description: 'Manages complete KYC process, document validation, risk scoring, client onboarding workflows, and multi-layer identity verification',
    capabilities: ['identity_verification', 'document_validation', 'risk_scoring', 'client_onboarding', 'compliance_checks', 'fraud_prevention'],
    permissions: {
      viewableBy: ['owner', 'admin', 'compliance_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/kyc', '/api/identity', '/api/verification'],
    dataFlows: {
      outputs: ['laila', 'clara'],
      inputs: ['laila', 'clara']
    }
  },
  ivy: {
    id: 'ivy',
    name: 'Ivy',
    title: 'Ejari & RERA Specialist',
    department: 'legal',
    icon: 'FileCheck',
    color: '#7B68EE',
    avatar: '📜',
    description: 'Manages Ejari registrations, rental contract compliance, RERA requirements, lease renewals, and automatic compliance reminders for all rental transactions',
    capabilities: ['ejari_management', 'rera_compliance', 'contract_compliance', 'lease_renewal', 'document_generation', 'regulatory_tracking'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/ejari', '/api/rera', '/api/legal-docs'],
    dataFlows: {
      outputs: ['laila', 'daisy'],
      inputs: ['daisy', 'laila']
    }
  },
  max: {
    id: 'max',
    name: 'Max',
    title: 'Document Processor & OCR Engine',
    department: 'legal',
    icon: 'FileText',
    color: '#4A90E2',
    avatar: '📋',
    description: 'Processes and extracts data from legal documents using OCR, manages contract templates, archives documents with full-text search, and generates compliance reports',
    capabilities: ['ocr_processing', 'document_extraction', 'template_management', 'archive_management', 'full_text_search', 'document_generation'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/documents', '/api/ocr', '/api/templates'],
    dataFlows: {
      outputs: ['laila', 'evangeline'],
      inputs: ['laila', 'clara']
    }
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    title: 'Market Analyst & Trend Forecaster',
    department: 'intelligence',
    icon: 'TrendingUp',
    color: '#5FD3BC',
    avatar: '🔍',
    description: 'Analyzes Dubai real estate market dynamics, property pricing trends, competitive landscape, and generates quarterly market intelligence reports for stakeholders',
    capabilities: ['market_analysis', 'pricing_strategy', 'competitive_intelligence', 'trend_forecasting', 'market_reports', 'benchmark_analysis'],
    permissions: {
      viewableBy: ['owner', 'admin', 'investment_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/market', '/api/analytics', '/api/reports'],
    dataFlows: {
      outputs: ['zoe', 'cipher'],
      inputs: ['cipher', 'mary', 'henry']
    }
  },
  // === EXTENDED TEAM MEMBERS (Phase 2) ===
  nova: {
    id: 'nova',
    name: 'Nova',
    title: 'Social Media & Community Manager',
    department: 'marketing',
    icon: 'Share2',
    color: '#FF1493',
    avatar: '📱',
    description: 'Manages social media presence, community engagement, influencer partnerships, and viral content strategies across Instagram, TikTok, LinkedIn, and Twitter',
    capabilities: ['social_media_management', 'community_engagement', 'influencer_partnerships', 'content_scheduling', 'sentiment_analysis', 'viral_marketing'],
    permissions: {
      viewableBy: ['owner', 'admin', 'marketing_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/social', '/api/community', '/api/influencers'],
    dataFlows: {
      outputs: ['olivia', 'marcus'],
      inputs: ['olivia', 'stella']
    }
  },
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    title: 'Customer Feedback & Experience Analytics',
    department: 'operations',
    icon: 'MessageCircle',
    color: '#FF69B4',
    avatar: '💬',
    description: 'Collects customer feedback, performs sentiment analysis, identifies pain points, generates experience improvement recommendations, and tracks NPS metrics',
    capabilities: ['feedback_collection', 'sentiment_analysis', 'pain_point_identification', 'nps_tracking', 'survey_management', 'experience_recommendations'],
    permissions: {
      viewableBy: ['owner', 'admin', 'operations_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/feedback', '/api/surveys', '/api/sentiment'],
    dataFlows: {
      outputs: ['zoe', 'olivia'],
      inputs: ['linda', 'clara', 'daisy']
    }
  },
  orion: {
    id: 'orion',
    name: 'Orion',
    title: 'Quality Assurance & Testing Master',
    department: 'technology',
    icon: 'CheckSquare',
    color: '#1E90FF',
    avatar: '🔬',
    description: 'Conducts automated testing, performance benchmarking, security audits, user acceptance testing, and generates quality metrics for all platform components',
    capabilities: ['automated_testing', 'performance_benchmarking', 'security_audits', 'uat_management', 'bug_tracking', 'quality_metrics'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/qa', '/api/testing', '/api/security'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora', 'hazel', 'willow']
    }
  },
  celeste: {
    id: 'celeste',
    name: 'Celeste',
    title: 'AI/ML Training & Optimization Specialist',
    department: 'technology',
    icon: 'Brain',
    color: '#9370DB',
    avatar: '🧠',
    description: 'Fine-tunes AI models, manages training data pipelines, monitors model performance drift, and optimizes inference for all 32+ assistants across the platform',
    capabilities: ['model_training', 'data_pipeline_management', 'performance_monitoring', 'model_optimization', 'training_data_curation', 'inference_optimization'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/ml', '/api/training', '/api/models'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora', 'henry', 'cipher']
    }
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    title: 'Crisis Management & Incident Response',
    department: 'executive',
    icon: 'AlertTriangle',
    color: '#FF4500',
    avatar: '🔥',
    description: 'Manages emergency incidents, coordinates crisis response across departments, maintains incident timelines, and generates post-mortem analysis reports',
    capabilities: ['incident_detection', 'crisis_coordination', 'emergency_response', 'stakeholder_communication', 'incident_timeline', 'root_cause_analysis'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/incidents', '/api/emergency', '/api/alerts'],
    dataFlows: {
      outputs: ['zoe', 'henry'],
      inputs: ['henry', 'aurora']
    }
  },
  jasper: {
    id: 'jasper',
    name: 'Jasper',
    title: 'Document Lifecycle & Smart Contracts',
    department: 'legal',
    icon: 'ScrollText',
    color: '#FF8C00',
    avatar: '⚖️',
    description: 'Manages end-to-end document lifecycle, implements smart contract templates, handles digital signatures, and automates document workflow approvals',
    capabilities: ['document_lifecycle', 'smart_contracts', 'digital_signatures', 'workflow_automation', 'template_management', 'version_control'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/contracts', '/api/signatures', '/api/workflows'],
    dataFlows: {
      outputs: ['laila', 'evangeline'],
      inputs: ['max', 'laila', 'theodora']
    }
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    title: 'Multilingual & Localization Specialist',
    department: 'marketing',
    icon: 'Globe',
    color: '#4B0082',
    avatar: '🌍',
    description: 'Manages Arabic/English content localization, cultural adaptation, translation quality assurance, and ensures platform supports 15+ languages seamlessly',
    capabilities: ['translation_management', 'localization', 'cultural_adaptation', 'multilingual_seo', 'language_quality_assurance', 'rtl_support'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/i18n', '/api/translation', '/api/localization'],
    dataFlows: {
      outputs: ['stella', 'olivia'],
      inputs: ['stella', 'max']
    }
  },
  kai: {
    id: 'kai',
    name: 'Kai',
    title: 'Voice Assistant & Audio Interface',
    department: 'communications',
    icon: 'Mic',
    color: '#FF6347',
    avatar: '🎙️',
    description: 'Provides voice-based interface for hands-free platform access, manages voice command recognition, audio notifications, and call transcription services',
    capabilities: ['voice_recognition', 'voice_command_processing', 'audio_notifications', 'call_transcription', 'voice_search', 'speech_synthesis'],
    permissions: {
      viewableBy: ['owner', 'admin', 'agent'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/voice', '/api/transcription', '/api/audio'],
    dataFlows: {
      outputs: ['nina', 'clara'],
      inputs: ['nina', 'linda']
    }
  },
  // === SPECIALIZED SUPPORT ROLES (Phase 3) ===
  ember: {
    id: 'ember',
    name: 'Ember',
    title: 'Frontend Engineer & UI Documentation',
    department: 'technology',
    icon: 'Code',
    color: '#FF4500',
    avatar: '🔥',
    description: 'Develops frontend components, maintains UI documentation standards, manages component library versioning, and ensures consistent design patterns',
    capabilities: ['component_development', 'ui_documentation', 'design_pattern_enforcement', 'accessibility_compliance', 'performance_optimization', 'component_testing'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/components', '/api/documentation', '/api/ui'],
    dataFlows: {
      outputs: ['hazel'],
      inputs: ['hazel', 'orion']
    }
  },
  coral: {
    id: 'coral',
    name: 'Coral',
    title: 'Database Architect & Data Manager',
    department: 'technology',
    icon: 'Database',
    color: '#FF7F50',
    avatar: '🪸',
    description: 'Designs database schemas, manages data migrations, optimizes data models, and ensures data integrity across all MongoDB collections',
    capabilities: ['schema_design', 'data_migration', 'data_modeling', 'query_optimization', 'data_integrity', 'backup_management'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/database', '/api/schema', '/api/data'],
    dataFlows: {
      outputs: ['willow'],
      inputs: ['willow', 'henry']
    }
  },
  marina: {
    id: 'marina',
    name: 'Marina',
    title: 'DevOps Engineer & Infrastructure Manager',
    department: 'technology',
    icon: 'Zap',
    color: '#20B2AA',
    avatar: '⚙️',
    description: 'Manages cloud infrastructure, CI/CD pipelines, monitoring and alerting, auto-scaling, and disaster recovery for all platform services',
    capabilities: ['infrastructure_management', 'ci_cd_pipelines', 'monitoring_alerting', 'auto_scaling', 'disaster_recovery', 'performance_optimization'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/infrastructure', '/api/deployments', '/api/monitoring'],
    dataFlows: {
      outputs: ['aurora'],
      inputs: ['aurora', 'orion']
    }
  },
  chloe: {
    id: 'chloe',
    name: 'Chloe',
    title: 'Client Relations & Retention Specialist',
    department: 'sales',
    icon: 'Heart',
    color: '#FF1493',
    avatar: '💝',
    description: 'Manages client relationships post-transaction, identifies churn risks, creates retention campaigns, and ensures ongoing customer satisfaction and loyalty',
    capabilities: ['relationship_management', 'churn_prediction', 'retention_campaigns', 'customer_satisfaction', 'loyalty_programs', 'feedback_integration'],
    permissions: {
      viewableBy: ['owner', 'admin', 'sales_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/clients', '/api/retention', '/api/loyalty'],
    dataFlows: {
      outputs: ['clara', 'sophia'],
      inputs: ['clara', 'kairos', 'lyra']
    }
  },
  iris: {
    id: 'iris',
    name: 'Iris',
    title: 'Contract Specialist & Legal Documentation',
    department: 'legal',
    icon: 'LayoutList',
    color: '#8A2BE2',
    avatar: '📑',
    description: 'Manages contract lifecycle, maintains legal document templates, tracks contract expirations, and coordinates with external legal counsel as needed',
    capabilities: ['contract_management', 'template_library', 'expiration_tracking', 'external_counsel_coordination', 'version_control', 'compliance_review'],
    permissions: {
      viewableBy: ['owner', 'admin', 'legal_manager'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/contracts', '/api/legal', '/api/compliance'],
    dataFlows: {
      outputs: ['laila', 'jasper'],
      inputs: ['jasper', 'max', 'laila']
    }
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    title: 'Voice & Audio Interaction Designer',
    department: 'communications',
    icon: 'Volume2',
    color: '#32CD32',
    avatar: '🔊',
    description: 'Designs voice conversation flows, manages audio quality standards, creates voice-first UX, and ensures natural language processing accuracy for voice interactions',
    capabilities: ['conversation_design', 'audio_quality', 'voice_ux_design', 'nlp_optimization', 'voice_branding', 'transcription_quality'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/voice', '/api/audio', '/api/nlp'],
    dataFlows: {
      outputs: ['kai', 'nina'],
      inputs: ['kai']
    }
  },
  nexus: {
    id: 'nexus',
    name: 'Nexus',
    title: 'Integration Hub & API Manager',
    department: 'technology',
    icon: 'Share',
    color: '#00CED1',
    avatar: '🔗',
    description: 'Manages all external API integrations (Bayut, PropertyFinder, Dubizzle, Skyloov, DLD, RERA, WhatsApp), maintains integration documentation, and handles error reconciliation',
    capabilities: ['api_integration', 'webhook_management', 'data_sync', 'error_handling', 'rate_limiting', 'documentation_management'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner'],
      dataAccessLevel: 'full'
    },
    apiEndpoints: ['/api/integrations', '/api/webhooks', '/api/external'],
    dataFlows: {
      outputs: ['willow', 'aurora'],
      inputs: ['willow', 'mary', 'clara']
    }
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    title: 'Scheduling & Calendar Coordinator',
    department: 'operations',
    icon: 'Calendar',
    color: '#FFD700',
    avatar: '📅',
    description: 'Manages team schedules, coordinates property viewings, books appointments, manages availability, and sends reminders across all departments and clients',
    capabilities: ['schedule_management', 'appointment_booking', 'availability_coordination', 'reminder_automation', 'calendar_sync', 'resource_allocation'],
    permissions: {
      viewableBy: ['owner', 'admin'],
      accessibleBy: ['owner', 'admin'],
      dataAccessLevel: 'departmental'
    },
    apiEndpoints: ['/api/calendar', '/api/appointments', '/api/scheduling'],
    dataFlows: {
      outputs: ['nina', 'clara'],
      inputs: ['clara', 'linda', 'daisy']
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

export const TOTAL_ASSISTANTS = 32; // Complete White Caves AI Ecosystem

export const ASSISTANT_PHASES = {
  phase1: ['zoe', 'clara', 'mary', 'sophia', 'theodora', 'aurora', 'hazel', 'willow', 'linda', 'nina'], // 10 core
  phase2: ['penny', 'quinn', 'hunter', 'kairos', 'olivia', 'marcus', 'stella', 'laila'], // 8 extended
  phase3: ['henry', 'vera', 'evangeline', 'sentinel', 'cipher', 'atlas', 'vesta', 'juno', 'ivy', 'max', 'sage', 'nancy', 'daisy'], // 13 infrastructure
  phase4: ['nova', 'lyra', 'orion', 'celeste', 'phoenix', 'jasper', 'luna', 'kai', 'ember', 'coral', 'marina', 'chloe', 'iris', 'echo', 'nexus', 'aria'] // 16 specialized
};

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
