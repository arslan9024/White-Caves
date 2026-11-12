import { lazy } from 'react';
import type { CRMModuleDefinition } from './crmModuleRegistry.types.js';

const HenryRecordsCRM = lazy(() => import('../components/crm/HenryRecordsCRM'));
const HenryDocumentStudio = lazy(() => import('../components/crm/HenryDocumentStudio'));
const HenryTenancyContractJourneyView = lazy(
  () => import('../components/crm/HenryDocumentStudio/HenryTenancyContractJourneyView')
);
const HenryEmiratesIdScannerView = lazy(
  () => import('../components/crm/HenryDocumentStudio/HenryEmiratesIdScannerView')
);
const HenryTitleDeedScannerView = lazy(
  () => import('../components/crm/HenryDocumentStudio/HenryTitleDeedScannerView')
);
const HenryPassportScannerView = lazy(
  () => import('../components/crm/HenryDocumentStudio/HenryPassportScannerView')
);
const HenryTenancyContractScannerView = lazy(
  () => import('../components/crm/HenryDocumentStudio/HenryTenancyContractScannerView')
);
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
const DldEscrowCalculator = lazy(() => import('../components/crm/DldEscrowCalculator'));
const LeadScoringModule = lazy(() => import('../components/crm/LeadScoringModule'));
const PropertyValuationModule = lazy(() => import('../components/crm/PropertyValuationModule'));
const MarketAnalyticsModule = lazy(() => import('../components/crm/MarketAnalyticsModule'));

export const OPERATIONS_CRM_MODULES: Record<string, CRMModuleDefinition> = {
  henry: {
    id: 'henry',
    label: 'Henry AI — Sovereign Record Keeper & Document Studio',
    icon: '🗂️',
    description:
      'AI Optical Scanners (Passport, Title Deed, Emirates ID), Tenancy E-Sign, Ejari Vault & VAT Invoices',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: HenryDocumentStudio,
  },
  'henry-tenancy-journey': {
    id: 'henry-tenancy-journey',
    label: '3.19.1 Prepare Tenancy Contract',
    icon: '📄',
    description: 'Multi-stage Guided Tenancy Journey with Live DLD Official Form Preview',
    color: '#EF4444',
    zone: 'leasing_contracts',
    Component: HenryTenancyContractJourneyView,
  },
  'henry-prepare-tenancy': {
    id: 'henry-prepare-tenancy',
    label: '3.19.1 Prepare Tenancy Contract',
    icon: '📄',
    description: 'Multi-stage Guided Tenancy Journey with Live DLD Official Form Preview',
    color: '#EF4444',
    zone: 'leasing_contracts',
    Component: HenryTenancyContractJourneyView,
  },
  'henry-scan-eid': {
    id: 'henry-scan-eid',
    label: '3.19.2 Scan Emirates ID',
    icon: '🪪',
    description: 'ICAO TD1 Bio-Data & MRZ Optical Recognition Engine',
    color: '#10B981',
    zone: 'finance_compliance',
    Component: HenryEmiratesIdScannerView,
  },
  'henry-scan-title-deed': {
    id: 'henry-scan-title-deed',
    label: '3.19.3 Scan Title Deed',
    icon: '📜',
    description: 'DLD Title Deed & Oqood Ownership Extraction',
    color: '#EF4444',
    zone: 'inventory_listings',
    Component: HenryTitleDeedScannerView,
  },
  'henry-title-deeds': {
    id: 'henry-title-deeds',
    label: '3.19.3 Scan Title Deed',
    icon: '📜',
    description: 'DLD Title Deed & Oqood Ownership Extraction',
    color: '#EF4444',
    zone: 'inventory_listings',
    Component: HenryTitleDeedScannerView,
  },
  'henry-scan-passport': {
    id: 'henry-scan-passport',
    label: '3.19.4 Scan Passport',
    icon: '🛂',
    description: 'ICAO TD3 International Passport MRZ Parser',
    color: '#3B82F6',
    zone: 'finance_compliance',
    Component: HenryPassportScannerView,
  },
  'henry-scan-contract': {
    id: 'henry-scan-contract',
    label: '3.19.5 Scan Tenancy Contract',
    icon: '📑',
    description: 'DLD Tenancy Contract Optical Ingestion & Agreement Parser',
    color: '#DC2626',
    zone: 'leasing_contracts',
    Component: HenryTenancyContractScannerView,
  },
  'henry-records': {
    id: 'henry-records',
    label: 'Henry Document Studio & Record Keeper',
    icon: '🗂️',
    description: 'AI Optical Scanners, Tenancy E-Sign, Ejari Vault & VAT Invoices',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: HenryDocumentStudio,
  },
  documents: {
    id: 'documents',
    label: 'Henry Document Studio & Vault',
    icon: '📄',
    description: 'AI Optical Scanners, Tenancy E-Sign, Ejari Vault & VAT Invoices',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: HenryDocumentStudio,
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
  'dld-escrow': {
    id: 'dld-escrow',
    label: 'DLD Escrow Underwriting',
    icon: '⚖️',
    description: 'Law 50/2022 statutory 4% DLD, trustee split, and escrow closing calculator',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: DldEscrowCalculator,
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
