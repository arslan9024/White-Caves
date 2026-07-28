// Department registry for White Caves Real Estate LLC
export type DepartmentID = 'sales' | 'operations' | 'communications' | 'finance' | 'marketing' | 'executive' | 'compliance' | 'technology' | 'legal' | 'intelligence' | 'leasing' | 'maintenance';

export type AIAssistantName = 'Clara' | 'Sophia' | 'Nadia' | 'Mary' | 'Nancy' | 'Daisy' | 'Sentinel' | 'Nina' | 'Theodora' | 'Olivia' | 'Zoe' | 'Laila' | 'Aurora' | 'Hazel' | 'Willow' | 'Evangeline';

export interface AIAssistantConfig {
  name: AIAssistantName;
  roleTitle: string;
  primaryFocus: string;
  capabilities: string[];
  isPremiumModel: boolean;
  contextMemoryTokenLimit: number;
}

export interface DepartmentRegistryEntry {
  id: DepartmentID;
  name: string;
  colorHex: string;
  leadAIAssistants: AIAssistantConfig[];
  keyResponsibilities: string[];
  teamSizeHumanAgents: number;
  primaryTools: string[];
  kpis: string[];
  apiIntegrationPoints: string[];
}

export const DEPARTMENT_REGISTRY: Record<DepartmentID, DepartmentRegistryEntry> = {
  sales: {
    id: 'sales',
    name: 'Sales Department',
    colorHex: '#EF4444',
    leadAIAssistants: [
      {
        name: 'Clara',
        roleTitle: 'Lead Qualification Specialist',
        primaryFocus: 'Inbound lead analysis and routing',
        capabilities: ['qualification', 'scoring', 'assignment'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
      {
        name: 'Sophia',
        roleTitle: 'Pipeline Conversion Manager',
        primaryFocus: 'Deal tracking and closing ratios',
        capabilities: ['deal_forecasting', 'velocity_tracking'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
      {
        name: 'Nadia',
        roleTitle: 'WhatsApp CRM Sync Engine',
        primaryFocus: 'Instant chat context capture',
        capabilities: ['chat_ingestion', 'sentiment_analysis'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
    ],
    keyResponsibilities: [
      'Lead management & qualification',
      'Deal tracking & closure',
      'Sales pipeline management',
      'Commission calculation & tracking',
      'Agent coordination & performance',
    ],
    teamSizeHumanAgents: 8,
    primaryTools: ['Clara Leads CRM', 'Sophia Pipeline Manager', 'Nadia WhatsApp Hub'],
    kpis: ['Leads/month', 'Conversion Rate', 'Average Deal Size', 'Commission Accuracy'],
    apiIntegrationPoints: ['/api/leads', '/api/deals', '/api/pipeline'],
  },
  operations: {
    id: 'operations',
    name: 'Operations Department',
    colorHex: '#3B82F6',
    leadAIAssistants: [
      {
        name: 'Mary',
        roleTitle: 'Portfolio Inventory Auditor',
        primaryFocus: 'DAMAC Hills 2 asset registry accuracy',
        capabilities: ['unit_audit', 'availability_sync'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 64000,
      },
      {
        name: 'Nancy',
        roleTitle: 'Internal HR Operations Support',
        primaryFocus: 'Staff onboarding and permission management',
        capabilities: ['roster_management', 'rbac_provisioning'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
      {
        name: 'Daisy',
        roleTitle: 'Leasing Lifecycle Administrator',
        primaryFocus: 'Tenant verification and contract milestones',
        capabilities: ['tenant_vetting', 'renewal_tracking'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
      {
        name: 'Sentinel',
        roleTitle: 'IoT Asset Telemetry Watcher',
        primaryFocus: 'Real-time structural health monitoring',
        capabilities: ['anomaly_detection', 'maintenance_triggers'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
    ],
    keyResponsibilities: [
      'Property inventory management (9,378+ units in DAMAC Hills 2)',
      'Employee management & HR',
      'Leasing & tenant management',
      'Maintenance tracking & coordination',
      'Property condition monitoring',
    ],
    teamSizeHumanAgents: 6,
    primaryTools: ['Mary Inventory CRM', 'Nancy HR Portal', 'Daisy Leasing Hub', 'Sentinel IoT Monitor'],
    kpis: ['Inventory Accuracy', 'Property Utilization', 'Tenant Satisfaction', 'Maintenance Response Time'],
    apiIntegrationPoints: ['/api/inventory', '/api/properties', '/api/hr'],
  },
  communications: {
    id: 'communications',
    name: 'Communications Department',
    colorHex: '#25D366',
    leadAIAssistants: [
      {
        name: 'Nadia',
        roleTitle: 'Omnichannel CRM Director',
        primaryFocus: 'Managing 23+ active agent chat numbers',
        capabilities: ['multi_account_routing', 'agent_performance_metrics'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
      {
        name: 'Nina',
        roleTitle: 'Automated WhatsApp Bot Developer',
        primaryFocus: 'First-line customer interactive response',
        capabilities: ['interactive_flows', 'template_validation'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
    ],
    keyResponsibilities: [
      'Customer engagement via WhatsApp',
      'Lead capture & pre-qualification',
      'Bot automation & conversation routing',
      'Message template management',
      'Agent status monitoring',
      'Broadcast campaigns',
    ],
    teamSizeHumanAgents: 4,
    primaryTools: ['Nadia WhatsApp Manager', 'Nina Bot Engine'],
    kpis: ['Response Time', 'Lead Score Accuracy', 'Conversation Conversion Rate', 'Bot Uptime'],
    apiIntegrationPoints: ['/api/whatsapp', '/api/conversations', '/api/templates', '/api/bots'],
  },
  finance: {
    id: 'finance',
    name: 'Finance Department',
    colorHex: '#F59E0B',
    leadAIAssistants: [
      {
        name: 'Theodora',
        roleTitle: 'Virtual Financial Director',
        primaryFocus: 'Automated payroll, disbursements, and ledger matching',
        capabilities: ['ledger_reconciliation', 'stripe_payout_matching', 'commission_split_math'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
    ],
    keyResponsibilities: [
      'Invoice & payment management',
      'Commission calculation & disbursement',
      'Financial reporting & analysis',
      'Escrow account management',
      'Budget management',
      'Payment reconciliation',
    ],
    teamSizeHumanAgents: 2,
    primaryTools: ['Theodora Ledger Component', 'Payment Processing Engine'],
    kpis: ['Payment Accuracy', 'Finance Report Generation Speed', 'Commission Dispute Rate'],
    apiIntegrationPoints: ['/api/finance', '/api/payments', '/api/commissions'],
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Department',
    colorHex: '#EC4899',
    leadAIAssistants: [
      {
        name: 'Olivia',
        roleTitle: 'Marketing Automation Architect',
        primaryFocus: 'Listing syndication optimization and dynamic campaigns',
        capabilities: ['portal_syndication', 'social_media_scheduling'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 64000,
      },
      {
        name: 'Sentinel',
        roleTitle: 'Market Intelligence Scraper',
        primaryFocus: 'Dubai market trend analysis and pricing indices',
        capabilities: ['competitor_pricing_indexing', 'trend_forecasting'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 32000,
      },
    ],
    keyResponsibilities: [
      'Marketing campaigns & social media',
      'Property listing optimization',
      'Market intelligence & trend analysis',
      'Brand communications',
      'Content creation & management',
      'Lead generation strategies',
    ],
    teamSizeHumanAgents: 3,
    primaryTools: ['Olivia Campaign Portal', 'Market Trends Dashboard'],
    kpis: ['Campaign ROI', 'Lead Generation Cost', 'Social Media Engagement', 'Market Intelligence Accuracy'],
    apiIntegrationPoints: ['/api/marketing', '/api/campaigns', '/api/analytics'],
  },
  executive: {
    id: 'executive',
    name: 'Executive Department',
    colorHex: '#10B981',
    leadAIAssistants: [
      {
        name: 'Zoe',
        roleTitle: 'Chief Executive Data Coordinator',
        primaryFocus: 'Full multi-tenant database observation',
        capabilities: ['global_data_aggregation', 'cross_department_routing', 'executive_summarization'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 200000,
      },
    ],
    keyResponsibilities: [
      'Strategic planning & decision making',
      'Business intelligence & KPI tracking',
      'Cross-department coordination',
      'Executive communications',
      'Performance monitoring',
      'Long-term vision alignment',
    ],
    teamSizeHumanAgents: 2,
    primaryTools: ['Zoe Executive Assistant Hub', 'Global High-Density Command Palette'],
    kpis: ['Strategic Goal Achievement', 'Department Coordination Effectiveness', 'Business Intelligence Accuracy'],
    apiIntegrationPoints: ['/api/executive', '/api/admin/'],
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance Department',
    colorHex: '#6366F1',
    leadAIAssistants: [
      {
        name: 'Laila',
        roleTitle: 'Regulatory Compliance Watchdog',
        primaryFocus: 'RERA standards and AML check loops',
        capabilities: ['rera_permit_verification', 'aml_screening', 'kyc_document_validation'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
    ],
    keyResponsibilities: [
      'RERA compliance & regulatory adherence',
      'KYC/AML verification',
      'Contract review & management',
      'Audit trail maintenance',
      'Compliance reporting',
      'Risk assessment & mitigation',
    ],
    teamSizeHumanAgents: 1,
    primaryTools: ['Laila Legal Watchdog App', 'Persistent Audit Logging Tracker'],
    kpis: ['Compliance Score', 'Audit Pass Rate', 'Risk Identification Rate'],
    apiIntegrationPoints: ['/api/compliance', '/api/contracts', '/api/audits'],
  },
  technology: {
    id: 'technology',
    name: 'Technology Department',
    colorHex: '#0EA5E9',
    leadAIAssistants: [
      {
        name: 'Aurora',
        roleTitle: 'Chief Cloud & Systems Architect',
        primaryFocus: 'Multi-agent framework layout and deployment infrastructure',
        capabilities: ['infrastructure_as_code', 'load_balancing_optimization'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
      {
        name: 'Hazel',
        roleTitle: 'UI/UX Frontend Development Lead',
        primaryFocus: 'Luxury dark-themed design tokens and performance metrics',
        capabilities: ['component_optimization', 'accessibility_compliance'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 64000,
      },
      {
        name: 'Willow',
        roleTitle: 'Backend API Optimization Specialist',
        primaryFocus: 'Prisma indexing and local mock recovery systems',
        capabilities: ['query_optimization', 'mock_fallback_generation'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 64000,
      },
    ],
    keyResponsibilities: [
      'System architecture & technical strategy',
      'Frontend development & UX',
      'Backend development & APIs',
      'Performance optimization',
      'Deployment & DevOps',
      'Technical security & compliance',
    ],
    teamSizeHumanAgents: 3,
    primaryTools: ['Antigravity 2.0 Engine', 'Trae AI Container Layer', 'Vercel Build Hooks'],
    kpis: ['System Uptime', 'Deployment Success Rate', 'Linter Cleanliness Metrics', 'Code Quality Bounds'],
    apiIntegrationPoints: ['/api/system/', '/api/dev/*'],
  },
  legal: {
    id: 'legal',
    name: 'Legal Department',
    colorHex: '#DC2626',
    leadAIAssistants: [
      {
        name: 'Evangeline',
        roleTitle: 'Senior Legal Risk Evaluator',
        primaryFocus: 'Dubai real estate transaction contract tracking',
        capabilities: ['ejari_clause_validation', 'eviction_timeline_audits'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
    ],
    keyResponsibilities: [
      'Legal risk analysis & mitigation',
      'Contract monitoring & enforcement',
      'Regulatory compliance tracking',
      'Dispute resolution',
      'Legal communications',
      'Policy development',
    ],
    teamSizeHumanAgents: 1,
    primaryTools: ['Evangeline Smart Contract Interface'],
    kpis: ['Legal Risk Mitigation Success', 'Dispute Resolution Rate', 'Compliance Adherence'],
    apiIntegrationPoints: ['/api/legal', '/api/contracts'],
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence Department',
    colorHex: '#0D9488',
    leadAIAssistants: [
      {
        name: 'Sentinel',
        roleTitle: 'Business Intelligence & Predictive Analytics Core',
        primaryFocus: 'Hotspot identification and occupancy anomaly mapping',
        capabilities: ['predictive_analytics', 'cluster_forecasting', 'data_science_modeling'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
    ],
    keyResponsibilities: [
      'Business intelligence & analytics',
      'Market monitoring & trends',
      'IoT sensor monitoring (property conditions)',
      'Predictive analytics',
      'Data science & insights',
      'Competitive analysis',
    ],
    teamSizeHumanAgents: 1,
    primaryTools: ['Sentinel Deep Intelligence Hub', 'Data Ingestion Engines'],
    kpis: ['Insight Accuracy', 'Prediction Success Rate', 'Market Intelligence Timeliness'],
    apiIntegrationPoints: ['/api/intelligence', '/api/iot', '/api/analytics'],
  },
  leasing: {
    id: 'leasing',
    name: 'Leasing & Tenancy Department',
    colorHex: '#EF4444',
    leadAIAssistants: [
      {
        name: 'Daisy',
        roleTitle: 'Leasing Lifecycle Administrator',
        primaryFocus: 'Ejari registration, PDC cheque tracking, and renewal cycles',
        capabilities: ['ejari_registration', 'pdc_tracking', 'renewal_automation', 'tenant_vetting'],
        isPremiumModel: true,
        contextMemoryTokenLimit: 128000,
      },
    ],
    keyResponsibilities: [
      'Ejari registration & RERA tenancy contracts',
      'Post-dated cheque (PDC) management',
      'Tenant onboarding & KYC verification',
      'Lease renewal & early termination processing',
      'Bounced cheque & eviction workflows (Form 12)',
      'Rental yield reporting',
    ],
    teamSizeHumanAgents: 9,
    primaryTools: ['Daisy Leasing Hub', 'Ejari Registration Portal', 'PDC Tracker'],
    kpis: ['Ejari Completion Rate', 'PDC Default Rate', 'Renewal Rate', 'Tenant Satisfaction Score'],
    apiIntegrationPoints: ['/api/leasing', '/api/tenancy', '/api/ejari'],
  },
  maintenance: {
    id: 'maintenance',
    name: 'Maintenance & Facilities Department',
    colorHex: '#EF4444',
    leadAIAssistants: [
      {
        name: 'Sentinel',
        roleTitle: 'IoT Asset & Maintenance Telemetry Watcher',
        primaryFocus: 'Real-time structural health monitoring and maintenance ticket triage',
        capabilities: ['anomaly_detection', 'maintenance_triggers', 'vendor_dispatch', 'sla_monitoring'],
        isPremiumModel: false,
        contextMemoryTokenLimit: 64000,
      },
    ],
    keyResponsibilities: [
      'Maintenance ticket management & triage',
      'Facility inspection scheduling',
      'Vendor coordination & SLA enforcement',
      'IoT sensor monitoring (DAMAC Hills 2)',
      'Preventive maintenance planning',
      'Common area upkeep & handover inspections',
    ],
    teamSizeHumanAgents: 9,
    primaryTools: ['Sentinel IoT Monitor', 'Maintenance Ticket System', 'Vendor Management Portal'],
    kpis: ['Ticket Resolution Time', 'First-Call Fix Rate', 'Tenant Satisfaction Score', 'SLA Compliance %'],
    apiIntegrationPoints: ['/api/maintenance', '/api/facilities', '/api/iot'],
  },
} as const;

export function getDepartment(id: DepartmentID): DepartmentRegistryEntry {
  return DEPARTMENT_REGISTRY[id];
}

export function listDepartments(): DepartmentRegistryEntry[] {
  return Object.values(DEPARTMENT_REGISTRY);
}
