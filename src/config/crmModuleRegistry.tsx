import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type CRMZone =
  | 'executive'
  | 'sales_leads'
  | 'inventory_listings'
  | 'leasing_contracts'
  | 'finance_compliance'
  | 'ai_command';

export interface CRMModuleDefinition {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  zone: CRMZone;
  Component: LazyExoticComponent<ComponentType<Record<string, unknown>>>;
}

const UnifiedCRM = lazy(() => import('../components/crm/UnifiedCRM'));
const NadiaWhatsAppCRM = lazy(() => import('../components/crm/NadiaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../components/crm/MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('../components/crm/ClaraLeadsCRM_NEW'));
const NinaWhatsAppBotCRM = lazy(() => import('../components/crm/NinaWhatsAppBotCRM_NEW'));
const NancyHRCRM = lazy(() => import('../components/crm/NancyHRCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('../components/crm/SophiaSalesCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('../components/crm/DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('../components/crm/TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('../components/crm/OliviaMarketingCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('../components/crm/ZoeExecutiveCRM_NEW'));
const LailaComplianceCRM = lazy(() => import('../components/crm/LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('../components/crm/AuroraCTODashboard_NEW'));
const HazelFrontendCRM = lazy(() => import('../components/crm/HazelFrontendCRM_NEW'));
const WillowBackendCRM = lazy(() => import('../components/crm/WillowBackendCRM_NEW'));
const LindaWhatsAppCRM = lazy(() => import('../components/crm/LindaWhatsAppCRM'));
const HenryRecordsCRM = lazy(() => import('../components/crm/HenryRecordsCRM'));
const EvangelineLegalCRM = lazy(() => import('../components/crm/EvangelineLegalCRM'));
const SentinelPropertyCRM = lazy(() => import('../components/crm/SentinelPropertyCRM'));
const HunterProspectingCRM = lazy(() => import('../components/crm/HunterProspectingCRM'));
const HenryAuditCRM = lazy(() => import('../components/crm/HenryAuditCRM'));
const CipherMarketCRM = lazy(() => import('../components/crm/CipherMarketCRM'));
const AtlasProjectsCRM = lazy(() => import('../components/crm/AtlasProjectsCRM'));
const VestaHandoverCRM = lazy(() => import('../components/crm/VestaHandoverCRM'));
const JunoCommunity = lazy(() => import('../components/crm/JunoCommunity'));
const KairosLuxuryCRM = lazy(() => import('../components/crm/KairosLuxuryCRM'));
const MavenInvestmentCRM = lazy(() => import('../components/crm/MavenInvestmentCRM'));
const RERAComplianceModule = lazy(() => import('../components/crm/RERAComplianceModule'));
const DLDIntegrationModule = lazy(() => import('../components/crm/DLDIntegrationModule'));
const LeadScoringModule = lazy(() => import('../components/crm/LeadScoringModule'));
const PropertyValuationModule = lazy(() => import('../components/crm/PropertyValuationModule'));
const MarketAnalyticsModule = lazy(() => import('../components/crm/MarketAnalyticsModule'));

export const CRM_MODULE_REGISTRY: Record<string, CRMModuleDefinition> = {
  unified: {
    id: 'unified',
    label: 'Unified CRM Dashboard',
    icon: '🧭',
    description: 'Single command surface for superuser operations',
    color: '#E31E24',
    zone: 'executive',
    Component: UnifiedCRM,
  },
  nadia: {
    id: 'nadia',
    label: 'WhatsApp CRM',
    icon: '💬',
    description: 'Conversations, campaigns, templates, routing',
    color: '#25D366',
    zone: 'ai_command',
    Component: NadiaWhatsAppCRM,
  },
  mary: {
    id: 'mary',
    label: 'Inventory CRM',
    icon: '🏠',
    description: 'Portfolio, owners, inventory data quality',
    color: '#3B82F6',
    zone: 'inventory_listings',
    Component: MaryInventoryCRM,
  },
  clara: {
    id: 'clara',
    label: 'Leads CRM',
    icon: '🎯',
    description: 'Lead qualification and pipeline management',
    color: '#10B981',
    zone: 'sales_leads',
    Component: ClaraLeadsCRM,
  },
  nina: {
    id: 'nina',
    label: 'WhatsApp Bot CRM',
    icon: '🤖',
    description: 'Bot flows, automation and escalation controls',
    color: '#06B6D4',
    zone: 'ai_command',
    Component: NinaWhatsAppBotCRM,
  },
  nancy: {
    id: 'nancy',
    label: 'HR CRM',
    icon: '👥',
    description: 'Team availability, hiring, and staffing status',
    color: '#8B5CF6',
    zone: 'executive',
    Component: NancyHRCRM,
  },
  sophia: {
    id: 'sophia',
    label: 'Sales CRM',
    icon: '📈',
    description: 'Deals, sales velocity and conversions',
    color: '#F59E0B',
    zone: 'sales_leads',
    Component: SophiaSalesCRM,
  },
  daisy: {
    id: 'daisy',
    label: 'Leasing CRM',
    icon: '📋',
    description: 'Leases, renewals, and tenant workflows',
    color: '#EC4899',
    zone: 'leasing_contracts',
    Component: DaisyLeasingCRM,
  },
  theodora: {
    id: 'theodora',
    label: 'Finance CRM',
    icon: '💳',
    description: 'Collections, invoicing, commissions, reconciliation',
    color: '#8B5CF6',
    zone: 'finance_compliance',
    Component: TheodoraFinanceCRM,
  },
  olivia: {
    id: 'olivia',
    label: 'Marketing CRM',
    icon: '📣',
    description: 'Campaigns, channels, listings distribution',
    color: '#EC4899',
    zone: 'sales_leads',
    Component: OliviaMarketingCRM,
  },
  zoe: {
    id: 'zoe',
    label: 'Executive CRM',
    icon: '👑',
    description: 'Executive KPIs, strategy, and risk signals',
    color: '#E31E24',
    zone: 'executive',
    Component: ZoeExecutiveCRM,
  },
  laila: {
    id: 'laila',
    label: 'Compliance CRM',
    icon: '🛡️',
    description: 'KYC, compliance checks, legal risks',
    color: '#6366F1',
    zone: 'finance_compliance',
    Component: LailaComplianceCRM,
  },
  aurora: {
    id: 'aurora',
    label: 'CTO Dashboard',
    icon: '🖥️',
    description: 'System health, incidents, architecture status',
    color: '#0EA5E9',
    zone: 'executive',
    Component: AuroraCTODashboard,
  },
  hazel: {
    id: 'hazel',
    label: 'Frontend CRM',
    icon: '🧩',
    description: 'Frontend quality and UX operational metrics',
    color: '#14B8A6',
    zone: 'executive',
    Component: HazelFrontendCRM,
  },
  willow: {
    id: 'willow',
    label: 'Backend CRM',
    icon: '⚙️',
    description: 'Backend services and API health controls',
    color: '#06B6D4',
    zone: 'executive',
    Component: WillowBackendCRM,
  },
  linda: {
    id: 'linda',
    label: 'Linda WhatsApp CRM',
    icon: '📱',
    description: 'Agent-local WhatsApp device sessions and tooling',
    color: '#8B5CF6',
    zone: 'ai_command',
    Component: LindaWhatsAppCRM,
  },
  henry: {
    id: 'henry',
    label: 'Henry Records CRM',
    icon: '🗂️',
    description: 'Records and compliance operational views',
    color: '#64748B',
    zone: 'finance_compliance',
    Component: HenryRecordsCRM,
  },
  evangeline: {
    id: 'evangeline',
    label: 'Legal CRM',
    icon: '⚖️',
    description: 'Legal workflows and contract intelligence',
    color: '#7C3AED',
    zone: 'finance_compliance',
    Component: EvangelineLegalCRM,
  },
  sentinel: {
    id: 'sentinel',
    label: 'Sentinel Property CRM',
    icon: '🏢',
    description: 'Property state machine and quality checks',
    color: '#3B82F6',
    zone: 'inventory_listings',
    Component: SentinelPropertyCRM,
  },
  hunter: {
    id: 'hunter',
    label: 'Prospecting CRM',
    icon: '🎯',
    description: 'Outbound prospecting and assignment workflows',
    color: '#10B981',
    zone: 'sales_leads',
    Component: HunterProspectingCRM,
  },
  henryAudit: {
    id: 'henryAudit',
    label: 'Audit CRM',
    icon: '🧾',
    description: 'Audit trails and activity governance',
    color: '#6366F1',
    zone: 'finance_compliance',
    Component: HenryAuditCRM,
  },
  cipher: {
    id: 'cipher',
    label: 'Market Intelligence CRM',
    icon: '📊',
    description: 'Valuation and market intelligence models',
    color: '#0D9488',
    zone: 'inventory_listings',
    Component: CipherMarketCRM,
  },
  atlas: {
    id: 'atlas',
    label: 'Projects CRM',
    icon: '🧱',
    description: 'Off-plan project and milestone tracking',
    color: '#F97316',
    zone: 'leasing_contracts',
    Component: AtlasProjectsCRM,
  },
  vesta: {
    id: 'vesta',
    label: 'Handover CRM',
    icon: '🔑',
    description: 'Snagging, handover, and closeout controls',
    color: '#F59E0B',
    zone: 'leasing_contracts',
    Component: VestaHandoverCRM,
  },
  juno: {
    id: 'juno',
    label: 'Community CRM',
    icon: '🏘️',
    description: 'Community operations and resident workflows',
    color: '#8B5CF6',
    zone: 'leasing_contracts',
    Component: JunoCommunity,
  },
  kairos: {
    id: 'kairos',
    label: 'Luxury CRM',
    icon: '💎',
    description: 'HNWI workflows and premium listing intelligence',
    color: '#E31E24',
    zone: 'sales_leads',
    Component: KairosLuxuryCRM,
  },
  maven: {
    id: 'maven',
    label: 'Investment CRM',
    icon: '📌',
    description: 'Investment portfolio and decision support',
    color: '#22C55E',
    zone: 'finance_compliance',
    Component: MavenInvestmentCRM,
  },
  rera: {
    id: 'rera',
    label: 'RERA Compliance',
    icon: '📜',
    description: 'RERA policy and compliance checks',
    color: '#6366F1',
    zone: 'finance_compliance',
    Component: RERAComplianceModule,
  },
  dld: {
    id: 'dld',
    label: 'DLD Integration',
    icon: '🏛️',
    description: 'DLD workflow and integration operations',
    color: '#0EA5E9',
    zone: 'finance_compliance',
    Component: DLDIntegrationModule,
  },
  leads: {
    id: 'leads',
    label: 'Lead Scoring',
    icon: '📍',
    description: 'AI lead scoring and qualification signals',
    color: '#10B981',
    zone: 'sales_leads',
    Component: LeadScoringModule,
  },
  valuation: {
    id: 'valuation',
    label: 'Property Valuation',
    icon: '🏷️',
    description: 'Automated and assisted valuation tools',
    color: '#3B82F6',
    zone: 'inventory_listings',
    Component: PropertyValuationModule,
  },
  analytics: {
    id: 'analytics',
    label: 'Market Analytics',
    icon: '📉',
    description: 'Market-level analytics and trend breakdowns',
    color: '#14B8A6',
    zone: 'executive',
    Component: MarketAnalyticsModule,
  },
};

export const SUPERUSER_CRM_MODULE_ORDER: string[] = [
  'unified',
  'nadia',
  'mary',
  'clara',
  'nina',
  'nancy',
  'sophia',
  'daisy',
  'theodora',
  'olivia',
  'zoe',
  'laila',
  'aurora',
  'hazel',
  'willow',
  'rera',
  'dld',
  'leads',
  'valuation',
  'analytics',
];

export const CRM_HUB_MODULE_ORDER: string[] = [
  'clara',
  'mary',
  'sophia',
  'theodora',
  'daisy',
  'nadia',
  'zoe',
];

export const MODERN_DASHBOARD_ASSISTANT_ORDER: string[] = [
  'clara',
  'mary',
  'linda',
  'nancy',
  'theodora',
  'olivia',
  'zoe',
  'aurora',
];

export const getCRMModule = (id: string | undefined | null): CRMModuleDefinition | null => {
  if (!id) return null;
  return CRM_MODULE_REGISTRY[id] ?? null;
};

export const resolveCRMModules = (ids: string[]): CRMModuleDefinition[] =>
  ids
    .map(id => getCRMModule(id))
    .filter((module): module is CRMModuleDefinition => Boolean(module));
