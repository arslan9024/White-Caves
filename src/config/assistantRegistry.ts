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
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #8b5cf6 100%)',
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
    color: '#C9A84C',
    gradient: 'linear-gradient(135deg, #C9A84C 0%, #a8883a 100%)',
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
      'Nadia is the central hub for all WhatsApp communications across 23+ live agent numbers. She intelligently routes incoming conversations to the correct agent based on lead source, property type, and agent availability, enforces SLA response timers, and fires automated quick-reply sequences when agents are offline. She pre-qualifies leads by parsing natural-language enquiries — extracting budget, preferred community, and urgency signals — and pushes scored lead cards directly into Clara. Nadia also manages broadcast campaigns (e.g., new project launch announcements to 10,000+ opted-in contacts), monitors per-agent activity dashboards, and flags any session drops or delivery failures in real time.',
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
      'Nina designs, builds, and maintains the WhatsApp automation bots that serve as the first responders in the White Caves communications stack. She uses a visual conversation-flow builder to create decision-tree dialogues that handle property enquiries, viewing bookings, payment-plan requests, and FAQ responses — all without human intervention. She manages session lifecycles (open, active, timed-out, closed), trains intent classifiers on new real-estate terminology, integrates webhook callbacks from external booking and CRM systems, and delivers bot-performance analytics — message open-rates, resolution rates, escalation ratios — to Nadia and Aurora for review.',
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
      'Mary is the single source of truth for all property inventory at White Caves, currently holding 9,378+ units across DAMAC Hills 2 and other communities. She ingests new unit data through bulk Excel/CSV uploads, OCR extraction from developer brochures, and direct API feeds from portals. Every property record includes unit type, floor level, view, size, price, availability status, floor plan, and photos. Mary enforces data quality rules — flagging duplicates, incomplete records, and price outliers — and pushes clean, enriched inventory to Clara (for matching), Nadia (for agent sharing), and Olivia (for listing portals). She also provides an advanced filter/search interface so agents can instantly surface available units matching a client brief.',
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
    description:
      'Nancy manages the full employee lifecycle at White Caves — from the moment a candidate applies to their final exit interview. She maintains structured profiles for all staff: contracts, RERA license numbers, visa expiry dates, commission tiers, and performance scores. Nancy runs the recruitment pipeline (job postings, CV screening, interview scheduling, offer letters), automates onboarding checklists for new agents, tracks daily attendance via biometric or app check-in, and schedules quarterly performance reviews. She surfaces HR KPIs — headcount, turnover rate, average revenue-per-agent — to Zoe, and alerts management when RERA licenses or visas approach expiry.',
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
      'Daisy oversees every aspect of the rental portfolio — from listing a unit for rent to collecting the final cheque on move-out. She manages tenant profiles, drafts and stores Ejari-registered tenancy contracts, tracks rent-payment schedules (including PDC cheques), and handles the full maintenance-request lifecycle: logging, vendor assignment, cost approval, and completion sign-off. Daisy sends automated renewal reminders 90, 60, and 30 days before lease expiry and flags chronic late-payers to Theodora for financial escalation. She also produces rental yield summaries and occupancy-rate reports for investor clients through Maven.',
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
      'Clara is the lead-lifecycle engine of the White Caves CRM. She receives raw leads from WhatsApp (Nadia), web forms, portals, and referrals and immediately begins qualification: tagging each lead with source, budget band, preferred area, property type, and timeline to purchase. She drives structured nurturing sequences — automated follow-up messages, property suggestions, viewing invitations — and maintains a granular activity timeline for every contact (calls, messages, viewings, offers). Clara calculates lead scores in collaboration with Archer, escalates hot leads to Sophia for pipeline action, and surfaces conversion analytics so managers can identify where leads are being lost.',
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
      'Sophia controls the end-to-end sales pipeline, from the moment a qualified lead is handed over by Clara to the final deal closure. She assigns leads to the right agents based on language, specialisation, and current workload, tracks deal stages (Viewing Scheduled → Offer Made → SPA Signed → Registration), monitors individual and team targets versus actuals in real time, and calculates commission splits when multiple agents collaborate on a deal. Sophia produces weekly sales-performance reports, forecasts monthly closings using pipeline velocity data, and raises alerts when deals stagnate or approach contractual deadlines.',
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
      "Theodora is the financial backbone of White Caves, managing every dirham that flows in and out of the business. She generates invoices and commission statements, tracks all client payments (cheques, bank transfers, crypto), manages escrow release schedules on off-plan transactions, and reconciles accounts at month-end. She monitors outstanding receivables with automated dunning sequences and escalates overdue balances to the MD. Theodora integrates with VAT filing requirements, produces profit-and-loss statements, and feeds financial KPIs (revenue, GP margin, commission payables) into Zoe's executive dashboard so leadership always has an accurate financial picture.",
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
      'Olivia drives all marketing activity for White Caves — from crafting a single property listing description to orchestrating a multi-channel launch campaign. She auto-generates SEO-optimised listing copy from raw property data, schedules and publishes posts across Instagram, Facebook, LinkedIn, and property portals (Bayut, Property Finder, Dubizzle), and manages paid ad budgets with performance-based reallocation. Olivia tracks lead-source attribution so every marketing dirham is accountable, runs A/B tests on listing photos and headlines, and compiles weekly marketing-ROI reports for Zoe. She also monitors competitor activity and portal ranking performance for White Caves listings.',
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
      "Zoe is the managing director's AI chief of staff, aggregating intelligence from every other assistant to produce the executive layer's single source of truth. She compiles the daily and weekly briefing — highlighting pipeline health, revenue status, compliance flags, team performance, and market movements — in a concise format tailored for strategic decision-making. Zoe manages the executive suggestions inbox where other assistants submit proposals for operational improvements, routing them for approval or rejection. She coordinates cross-department actions (e.g., a compliance hold on a deal triggers a Sophia and Theodora pause), maintains the strategic KPI dashboard, and generates board-ready presentation materials on demand.",
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
    color: '#EF4444',
    avatar: '👩‍⚖️',
    description:
      'Laila is the guardian of regulatory adherence at White Caves, ensuring every transaction, employee, and business process meets UAE real estate law, RERA regulations, and Anti-Money Laundering requirements. She runs Know-Your-Customer checks on new clients — verifying passport, Emirates ID, proof of address, and source-of-funds declarations — and continuously screens the client database against AML watchlists. Laila reviews contracts before signature for non-standard clauses, maintains a complete and tamper-proof audit trail of all compliance actions, and generates the regulatory reports required by DLD, RERA, and the UAE Central Bank. She also manages RERA agent-license renewals and tracks continuing-education requirements for the sales team.',
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
      'Aurora is the technology command centre of White Caves. She monitors the health and performance of every service in the stack — API response times, database query durations, error rates, uptime SLAs — and surfaces anomalies before they become outages. She manages the CI/CD deployment pipeline, coordinates releases across the team, and maintains the internal documentation hub so engineering knowledge stays current. Aurora acts as the AI governance layer: she tracks which AI model is running where, evaluates model performance against KPIs, enforces data-access policies, and ensures all AI outputs comply with White Caves ethical guidelines. Every other assistant reports its operational status to Aurora.',
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
      'Hazel is the craftsperson responsible for every pixel of the White Caves user interface. She maintains the design-token system — colour palette, typography, spacing scales, shadow levels — ensuring the "Dubai Luxury" brand is applied consistently across the CRM, the owner portal, and the public website. Hazel builds and documents reusable React components in a shared library, conducts WCAG 2.1 AA accessibility audits, enforces responsive breakpoints for mobile and tablet, and runs Lighthouse performance checks on every release. She collaborates directly with Aurora on front-end build pipelines and works alongside Iris when new visual features (e.g., 3D tour embeds) need seamless UI integration.',
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
      'Willow architects and optimises the server-side infrastructure that powers White Caves. She designs and builds REST and WebSocket APIs, writes and tunes Prisma/PostgreSQL queries for maximum throughput, and implements caching strategies (Redis, CDN) that keep response times under 200ms even under peak load. Willow manages the data-pipeline architecture — ingestion, transformation, and storage of property, transaction, and client data — and enforces security best-practices: rate limiting, input validation, JWT token rotation, and RBAC middleware. She works with Aurora on infrastructure-as-code and ensures the backend can scale horizontally as the agency and its data grow.',
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
    color: '#C9A84C',
    avatar: '👩‍⚖️',
    description:
      'Evangeline is the proactive legal risk officer who keeps White Caves ahead of contractual and regulatory threats. She monitors every live SPA, MOU, and tenancy contract for risk clauses — penalty provisions, unilateral cancellation rights, incomplete disclosure obligations — and flags them before signing. She tracks changes in UAE property law, RERA circulars, and DLD fee structures, updating an internal best-practices library so agents always work with current, compliant templates. Evangeline logs all identified risks on a severity-graded risk register, liaises with Laila on compliance implications, and drafts recommended contract amendments for legal-manager review.',
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
      'Sentinel is the 24/7 eyes and ears for every physical property in the White Caves portfolio. She connects to building IoT sensors (water, power, HVAC, access control, CCTV motion detectors) and translates raw telemetry into actionable maintenance alerts — distinguishing between minor issues (a light fitting) and urgent emergencies (a water leak or power failure). Sentinel runs predictive-maintenance algorithms on historical fault data to schedule servicing before breakdowns occur, dispatches work orders to approved vendors with SLA tracking, and coordinates emergency-response protocols. She feeds property-condition scores to Mary (for listing accuracy) and Daisy (for tenant communication) and generates the monthly building-health reports reviewed by operations management.',
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
      'Hunter is the automated prospecting engine that constantly expands the White Caves lead funnel beyond inbound enquiries. She scans public property-transaction records (DLD), social-media signals, and third-party investor databases to identify individuals likely to be in a buying, selling, or investment cycle. Hunter enriches these prospect profiles with contact details, estimated net worth signals, and previous transaction history, scores them for outreach priority, and delivers enriched prospect cards to Clara for nurturing. She also runs systematic competitor analysis — tracking which agencies are listing in target communities, their pricing strategies, and market-share movements — to keep the sales team strategically informed.',
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
      'Henry is the institutional memory of White Caves. Every action taken by every assistant — a message sent, a deal stage changed, a document generated, a KYC check run — is ingested by Henry as a timestamped, immutable event. He categorises and links events across entities (client, property, agent, transaction) to build a rich relational timeline, enabling any team member to answer "what happened with this client, this unit, or this agent?" in seconds. Henry runs SLA monitoring (e.g., first-response within 1 hour, document turnaround within 24 hours), detects anomalies such as unusual transaction patterns or repeated KYC failures, and generates compliance-ready audit logs exportable in PDF and CSV for regulatory submissions.',
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
      "Cipher is the intelligence engine that transforms raw market data into confident, forward-looking property insights. She ingests DLD transaction records, Bayut/Property Finder price feeds, UAE economic indicators, interest-rate movements, and global macro signals, then runs statistical and ML models to forecast price trajectories, rental-yield shifts, and demand hotspots at the community and sub-community level. Cipher produces neighbourhood trend reports, investment-score matrices, and risk-adjusted yield projections that feed directly into Maven's portfolio advice and Zoe's executive briefings. She also tracks competitor strategies and identifies market anomalies — sudden volume spikes or price corrections — before they appear in mainstream media.",
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
    color: '#EF4444',
    avatar: '🗺️',
    description:
      'Atlas maps the off-plan development landscape of Dubai so White Caves can position itself and its clients ahead of the market. She analyses DLD master-plan data, zoning classifications, infrastructure-investment corridors, and developer track records to identify projects with the highest potential for capital appreciation. Atlas builds detailed feasibility profiles for each tracked development — cost per sq ft, payment-plan structures, expected handover dates, nearby amenity scores — and maintains a live pipeline of upcoming launches with ETA alerts sent to the sales team. She works closely with Cipher on ROI projections and Nova on launch-event monitoring.',
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
      'Vesta is the dedicated project coordinator for buyers who have purchased off-plan properties and are waiting for handover. She tracks construction milestones published by developers (e.g., "structure complete", "fit-out 70%"), maps them against contractual timelines, and sends automated progress updates to buyers via WhatsApp and email. When a snagging inspection date is set, Vesta generates a digital punch-list form, routes it to the buyer and their agent, and uses image-recognition analysis on uploaded photos to categorise and prioritise defects. She manages the full defect-resolution workflow — submitting items to the developer, tracking responses, and confirming closures — until the buyer receives a clean handover report.',
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
      'Juno transforms the buildings White Caves manages into smart, connected communities. She integrates with IoT infrastructure — smart meters, access-control systems, CCTV, lift sensors, parking barriers — to deliver real-time energy dashboards and automated utility billing. Juno manages community event calendars (resident BBQs, fitness classes, maintenance windows), handles facility-service requests (pool bookings, gym access, parcel collection notifications) routed in from residents via a WhatsApp chatbot powered by Nina. She tracks service-provider SLAs, escalates unresolved requests to Sentinel, and produces monthly community-management summaries for building owners.',
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
      "Kairos is the white-glove concierge for White Caves' high-net-worth and ultra-high-net-worth clients. She curates entirely personalised buying experiences: scheduling private viewings in off-hours, coordinating with interior designers and home-staging studios, arranging airport-to-property chauffeur logistics, and liaising with UAE golden-visa specialists for investor-visa processing. For clients purchasing multiple units, Kairos builds bespoke lifestyle packages — yacht bookings, school placements, healthcare referrals — from a curated partner network. She maintains a discreet preference profile for each VIP client and proactively surfaces new properties that match their lifestyle aspirations before they even ask.",
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
      "Maven is the investment intelligence advisor for White Caves' portfolio clients and investor-segment buyers. She calculates gross and net rental yields for any property in the inventory, models capital-appreciation scenarios over 1-, 3-, and 5-year horizons using Cipher's market data, and runs tax-efficiency analysis for different buyer structures (individual, LLC, offshore holding). For existing portfolio clients, Maven tracks asset performance against benchmarks, identifies underperforming holdings for disposal, and surfaces new acquisition opportunities that improve overall portfolio yield and diversification. Her outputs feed directly into client-facing investment proposals generated by Quill.",
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
      "Linda manages the agent-device layer of White Caves' WhatsApp communications stack using the OpenClaw gateway and WhatsApp-web.js LocalAuth. Each sales agent's personal WhatsApp number runs as a dedicated authenticated session under Linda's control — she handles QR-code device linking, session persistence, recovery from disconnections, and multi-account coordination across up to 30 simultaneous agent channels. Linda enables agents to execute CRM commands directly inside WhatsApp (e.g., \"!lead save Ahmed AED 1.8M DAMAC Hills 2\"), syncs contacts bidirectionally with the CRM, applies AI-powered opportunity scoring to inbound messages, and logs every interaction for Echo's communication timeline.",
    capabilities: [
      'local_auth_management',
      'multi_account_coordination',
      'qr_device_linking',
      'contact_sync_import',
      'ai_opportunity_scoring',
      'command_execution',
      'conversation_routing',
      'session_recovery',
      'openclaw_gateway',
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
      'Archer assigns every lead in the White Caves CRM a conversion-probability score from 0 to 100 using a multi-factor model. Inputs include enquiry channel (WhatsApp direct scores higher than paid portal), budget specificity (a precise AED figure scores higher than "flexible"), community preference match against available inventory, engagement velocity (response time, number of messages exchanged), and historical patterns from thousands of past lead journeys. Archer updates scores in real time as new interactions occur, reorders agent work-queues so the hottest leads receive attention first, and surfaces scoring-rule configurations to sales managers who want to tune the model for seasonal campaigns or new communities.',
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
      'Prism solves the "which property?" problem instantly. When an agent receives a buyer or tenant brief — "3-bedroom villa in DAMAC Hills 2, AED 1.8–2.1M, pool view, ready Q3" — Prism runs a vector-embedding similarity search across the full Mary inventory and returns a ranked shortlist with a percentage suitability score and a plain-language explanation for each match (e.g., "97% match: pool view confirmed, price within range, available immediately, 23 sq ft larger than requested minimum"). Prism learns from agent feedback — accepted and rejected recommendations — to continuously improve matching accuracy, and can handle ambiguous briefs by asking clarifying questions before running the search.',
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
      'Sage is the financial-planning advisor embedded in the White Caves sales journey for any buyer who needs financing. She calculates mortgage eligibility in real time using UAE Central Bank affordability ratios, runs EIBOR + margin calculations for variable-rate products, and builds side-by-side comparisons of offers from ADCB, Emirates NBD, HSBC, Mashreq, and other active UAE lenders. For investors, Sage models interest-coverage ratios and cash-flow projections that factor in rental income. She guides clients through the pre-approval documentation process, flags potential eligibility issues early (e.g., existing liabilities), and generates a financing-pathway summary that agents can share directly in WhatsApp or embed in the client portal.',
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
    color: '#EF4444',
    avatar: '📜',
    description:
      'Echo is the client-memory system that ensures no conversation context is ever lost, regardless of which agent or channel a client uses next. She aggregates every touchpoint — WhatsApp messages, Linda bot sessions, emails, phone call notes, meeting records, document shares, and property viewings — into a unified, searchable timeline per client. When an agent opens a client profile, Echo surfaces the most relevant recent context ("last spoke 3 days ago, viewed Unit 4B, waiting on mortgage pre-approval confirmation") so the conversation can continue seamlessly. Echo also detects silence — clients who haven\'t been contacted in 14+ days — and alerts Clara to trigger a re-engagement sequence.',
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
      'Mira breaks down the language barrier in a market where Arabic-speaking clients expect native-quality service and English-speaking agents may not be bilingual. She provides real-time Arabic ↔ English translation of WhatsApp messages, enabling agents to respond in the client\'s preferred language instantly. Mira handles the subtleties of Dubai real estate terminology — distinguishing "مخطط" (off-plan) from "جاهز" (ready), preserving formal vs. informal register — and translates full documents (SPAs, NOCs, lease agreements) with layout integrity maintained for right-to-left Arabic. She also translates marketing content and property descriptions for Arabic-language portal listings, and detects the language of incoming messages automatically to route them to the correct agent.',
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
    color: '#EF4444',
    avatar: '📋',
    description:
      'Rex is the fraud-prevention and document-authenticity layer for every transaction White Caves processes. Before any SPA is signed or any commission is paid, Rex verifies the key documents: it checks title deeds against the DLD blockchain registry, validates NOC letters against issuing authority records, cross-references Emirates IDs and passports with the ICA database, and runs layout-integrity analysis on uploaded PDFs to detect tampering or forgery. Rex assigns a verification confidence score to each document and flags anomalies — mismatched fonts, altered dates, unrecognised notary seals — for manual legal-team review. He maintains an audit log of every verification outcome, providing an evidentiary trail in case of dispute.',
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
      'Iris elevates the presentation quality of White Caves listings using generative AI and 3D visualisation technology. For any vacant or unfurnished unit, she produces photorealistic virtual-staging images in multiple interior design styles (Contemporary, Arabian Luxury, Minimalist Scandinavian) within minutes — eliminating costly physical staging shoots. Iris converts 2D architectural floor plans into interactive 3D walkthroughs and generates AR-ready property tours viewable on a smartphone without an app. She also enhances existing listing photographs — correcting white balance, removing clutter, improving sky — and recommends the optimal image order and hero shot based on portal CTR data analysed by Olivia.',
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
      "Apex turns performance data into agent development. She pulls every agent's metrics from Sophia (deals closed, pipeline value, conversion rate), Clara (lead response time, follow-up consistency), and Echo (communication-quality scores) and synthesises them into individual performance profiles updated weekly. Apex benchmarks each agent against peers and against White Caves targets, identifies specific areas of underperformance — slow follow-up, low offer-to-viewing conversion, weak closing language — and generates personalised coaching plans with concrete, actionable improvement steps. She also monitors personal-branding activity (LinkedIn posts, portal profile completeness) and tracks progress against quarterly incentive targets.",
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
      "Halo is the voice-of-the-customer engine at White Caves. After every completed transaction — sale, rental, or property management handover — Halo automatically dispatches a contextualised NPS survey and CSAT questionnaire to the client, personalising the questions based on the service type (e.g., off-plan buyers receive questions about agent knowledge and post-sales support; tenants receive questions about maintenance responsiveness). She aggregates scores into trend dashboards, detects drops in satisfaction before they escalate into public complaints, sets threshold alerts that trigger immediate management review, and routes qualitative feedback to the responsible department. Halo's data feeds directly into Apex's agent-coaching model and Olivia's reputation management.",
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
      'Oracle is the market intelligence broadcaster of White Caves. Every week — and immediately whenever a significant event occurs (DLD volume spike, major developer announcement, interest-rate decision) — she synthesises data from Flux, Cipher, and Atlas into a clear, narrative market summary: price movements by community, transaction velocity, new supply coming to market, and forward-looking investment signals. Oracle formats these summaries into three audience layers: a detailed analytical report for the MD and investment team, a concise agent briefing to sharpen sales conversations, and a public-friendly version for White Caves social-media channels managed by Olivia. She also monitors and alerts on competitor market-share data.',
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
      "Flux is the real-time data pipeline that keeps the White Caves intelligence layer perpetually current. She maintains persistent connections to DLD's open-transaction API, Bayut and Property Finder price-feed webhooks, UAE News and Zawya RSS streams, and developer press-release channels. Every ingested record is normalised into a standard schema, deduplicated, timestamped, and routed downstream: transaction records go to Cipher and Crest, price changes go to Oracle and Nova, news items get tagged by relevance (community, developer, regulation) and forwarded to the appropriate intelligence assistants. Flux monitors her own feed health — lag, record volume, schema drift — and raises alerts if any source falls behind its expected update cadence.",
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
      'Nova is the dedicated intelligence feed for new developments and off-plan inventory, ensuring the White Caves sales team is always first to know about launches, payment-plan updates, and handover schedule changes. She monitors DAMAC, Emaar, Meraas, Aldar, and 40+ other active UAE developers via their investor relations pages, press releases, and DLD filings — extracting structured data on every new project: location, unit mix, price-per-sq-ft, payment plan, expected completion, and booking requirements. Nova sends real-time push notifications to relevant agents when a new project matches their client portfolio criteria, and feeds structured launch data to Atlas for feasibility scoring and to Mary for pre-launch inventory seeding.',
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
    color: '#EF4444',
    avatar: '✍️',
    description:
      'Quill is the document factory of White Caves, eliminating the hours that agents used to spend manually drafting, formatting, and proofing transaction documents. She maintains a library of RERA-compliant, legally reviewed templates — Sale and Purchase Agreements, MOUs, Tenancy Contracts, NOC request letters, invoices, commission statements, and investor portfolio reports — and populates them in seconds by pulling live data directly from the CRM: client names, passport numbers, property details, agreed prices, and payment schedules. Quill supports Arabic/English bilingual documents with RTL formatting, generates bulk batches for portfolio transactions, and routes completed documents to Evangeline for risk review before delivery.',
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
      'Lumen is the visual intelligence layer that transforms raw data from across the White Caves CRM into charts, dashboards, and exportable reports that make complex information immediately comprehensible. She renders bar charts, line graphs, funnel diagrams, and heat maps from sales pipeline data, financial summaries, marketing ROI metrics, and property-market trends. Lumen also produces geospatial visualisations — mapping transaction density, average prices, and lead origins by Dubai community — giving management and investors a geographic perspective on the business. Every chart and dashboard auto-refreshes when underlying data changes, can be exported to PDF or PowerPoint for board presentations, and is accessible directly within the CRM without any additional tools.',
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
      "Crest provides the Automated Valuation Model (AVM) that gives White Caves — and its clients — an independent, data-driven property value estimate within seconds. She analyses the most recent comparable DLD transactions within a configurable radius and time window, adjusts for property-specific factors (floor level, view, renovation status, unit condition, community premium), applies community-wide trend corrections from Cipher's market data, and outputs an estimated market value with a confidence score and a comparable-evidence summary. Crest supports bulk valuation runs for entire portfolio reviews, maintains a valuation history per unit so price movements can be tracked over time, and feeds valuations into Maven's yield calculations and Theodora's financial reporting.",
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
