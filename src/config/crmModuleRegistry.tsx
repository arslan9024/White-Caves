
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
  Component: LazyExoticComponent<ComponentType<any>>;
  roles?: string[];
  section?: string;
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
const HenryDocumentStudio = lazy(() => import('../components/crm/HenryDocumentStudio'));
const HenryTenancyContractJourneyView = lazy(() => import('../components/crm/HenryDocumentStudio/HenryTenancyContractJourneyView'));
const HenryEmiratesIdScannerView = lazy(() => import('../components/crm/HenryDocumentStudio/HenryEmiratesIdScannerView'));
const HenryTitleDeedScannerView = lazy(() => import('../components/crm/HenryDocumentStudio/HenryTitleDeedScannerView'));
const HenryPassportScannerView = lazy(() => import('../components/crm/HenryDocumentStudio/HenryPassportScannerView'));
const HenryTenancyContractScannerView = lazy(() => import('../components/crm/HenryDocumentStudio/HenryTenancyContractScannerView'));
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
const ZoeBusinessHub = lazy(() => import('../components/crm/ZoeBusinessHub'));
const AuroraSoftwareHub = lazy(() => import('../components/crm/AuroraSoftwareHub'));
const MargaretPlansHub = lazy(() => import('../components/crm/MargaretPlansHub'));
const AdaArchitectureHub = lazy(() => import('../components/crm/AdaArchitectureHub'));

// 40 Assistant Enterprise Suite Components
const ApexCRM = lazy(() => import('../components/crm/ApexCRM'));
const ArcherCRM = lazy(() => import('../components/crm/ArcherCRM'));
const CrestCRM = lazy(() => import('../components/crm/CrestCRM'));
const EchoCRM = lazy(() => import('../components/crm/EchoCRM'));
const FluxCRM = lazy(() => import('../components/crm/FluxCRM'));
const HaloCRM = lazy(() => import('../components/crm/HaloCRM'));
const IrisCRM = lazy(() => import('../components/crm/IrisCRM'));
const LumenCRM = lazy(() => import('../components/crm/LumenCRM'));
const MiraCRM = lazy(() => import('../components/crm/MiraCRM'));
const NovaCRM = lazy(() => import('../components/crm/NovaCRM'));
const OracleCRM = lazy(() => import('../components/crm/OracleCRM'));
const PrismCRM = lazy(() => import('../components/crm/PrismCRM'));
const QuillCRM = lazy(() => import('../components/crm/QuillCRM'));
const RexCRM = lazy(() => import('../components/crm/RexCRM'));
const SageCRM = lazy(() => import('../components/crm/SageCRM'));

// Flagship 20 Life Cycle Journeys Hub
const JourneyHubView = lazy(() => import('../features/journeys/JourneyHubView'));

// Wave 18.1 P0 Batch 2
const AgentTaskCockpit = lazy(() => import('../components/crm/AgentTaskCockpit'));
const FunnelEconomicsDashboard = lazy(() => import('../components/crm/FunnelEconomicsDashboard'));
const KPIBaselineTracker = lazy(() => import('../components/crm/KPIBaselineTracker'));
const LeadTimeline = lazy(() => import('../components/crm/LeadTimeline'));

export const CRM_MODULE_REGISTRY: Record<string, CRMModuleDefinition> = {
  journeys: {
    id: 'journeys', label: '20 Life Cycle Journeys Hub', icon: '🗺️',
    description: 'Guided real estate operating missions enforcing RERA compliance & DLD integrity',
    color: '#EF4444', zone: 'executive', Component: JourneyHubView,
  },
  unified: {
    id: 'unified', label: 'Unified CRM Dashboard', icon: '🧭',
    description: 'Single command surface for superuser operations',
    color: '#E31E24', zone: 'executive', Component: UnifiedCRM,
  },
  nadia: {
    id: 'nadia', label: 'WhatsApp CRM', icon: '💬',
    description: 'Conversations, campaigns, templates, routing',
    color: '#25D366', zone: 'ai_command', Component: NadiaWhatsAppCRM,
  },
  mary: {
    id: 'mary', label: 'Inventory CRM', icon: '🏠',
    description: 'Portfolio, owners, inventory data quality',
    color: '#3B82F6', zone: 'inventory_listings', Component: MaryInventoryCRM,
  },
  clara: {
    id: 'clara', label: 'Leads CRM', icon: '🎯',
    description: 'Lead qualification and pipeline management',
    color: '#10B981', zone: 'sales_leads', Component: ClaraLeadsCRM,
  },
  nina: {
    id: 'nina', label: 'WhatsApp Bot CRM', icon: '🤖',
    description: 'Bot flows, automation and escalation controls',
    color: '#06B6D4', zone: 'ai_command', Component: NinaWhatsAppBotCRM,
  },
  nancy: {
    id: 'nancy', label: 'HR CRM', icon: '👥',
    description: 'Team availability, hiring, and staffing status',
    color: '#8B5CF6', zone: 'executive', Component: NancyHRCRM,
  },
  sophia: {
    id: 'sophia', label: 'Sales CRM', icon: '📈',
    description: 'Deals, sales velocity and conversions',
    color: '#F59E0B', zone: 'sales_leads', Component: SophiaSalesCRM,
  },
  daisy: {
    id: 'daisy', label: 'Leasing CRM', icon: '📋',
    description: 'Leases, renewals, and tenant workflows',
    color: '#EC4899', zone: 'leasing_contracts', Component: DaisyLeasingCRM,
  },
  theodora: {
    id: 'theodora', label: 'Finance CRM', icon: '💳',
    description: 'Collections, invoicing, commissions, reconciliation',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-invoices': {
    id: 'theodora-invoices', label: '3.14.1 Tax Invoices & Pro Forma', icon: '📄',
    description: 'UAE Tax Invoicing, Pro Forma issuance, and client billing lifecycle',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-payments': {
    id: 'theodora-payments', label: '3.14.2 Payments & Escrow Releases', icon: '💳',
    description: 'Payment receipts, bank transfers, and developer escrow milestone releases',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-commissions': {
    id: 'theodora-commissions', label: '3.14.3 Commission Statements', icon: '💵',
    description: 'Broker commission split calculations, approvals, and payout batches',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-receivables': {
    id: 'theodora-receivables', label: '3.14.4 Accounts Receivable & Aging', icon: '⏳',
    description: 'AR aging buckets, collection dunning, and outstanding ledger tracking',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-expenses': {
    id: 'theodora-expenses', label: '3.14.5 42 Master Expense Register', icon: '💰',
    description: 'Master 42-item real estate expenditures, portal fees, and VAT/CT classification',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-directors-loan': {
    id: 'theodora-directors-loan', label: '3.14.6 Wio vs. Director Loan Advances', icon: '🏦',
    description: "Owner's equity advances, personal card outlays, and Wio corporate reimbursements",
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-receipts': {
    id: 'theodora-receipts', label: '3.14.7 Digital Receipts & OCR Vault', icon: '🧾',
    description: 'Cloud document vault, 15-digit TRN extraction, and receipt audit verification',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-vat-return': {
    id: 'theodora-vat-return', label: '3.14.8 UAE FTA Form 201 (5% VAT)', icon: '🏛️',
    description: 'Automated 5% VAT Return Box 1-12 calculation and EmaraTax export',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-corporate-tax': {
    id: 'theodora-corporate-tax', label: '3.14.9 UAE Corporate Tax (9%)', icon: '⚖️',
    description: 'Taxable net profit engine, AED 375k Small Business Relief, and 9% CT calculation',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-pnl': {
    id: 'theodora-pnl', label: '3.14.10 Profit & Loss Statement (P&L)', icon: '📊',
    description: 'Income statement, operating expense breakdown, and EBITDA profitability',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-balance-sheet': {
    id: 'theodora-balance-sheet', label: '3.14.11 Balance Sheet & Ledger', icon: '📑',
    description: 'General ledger, assets, liabilities, and owner equity snapshot',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-cashflow': {
    id: 'theodora-cashflow', label: '3.14.12 Cash Flow & Bank Recon', icon: '🌊',
    description: 'Operating cash flow, bank statement reconciliation, and liquidity',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  'theodora-audit-report': {
    id: 'theodora-audit-report', label: '3.14.13 Regulatory Audit Pack', icon: '🛡️',
    description: 'One-click compiled audit binder for RERA and statutory regulatory compliance',
    color: '#8B5CF6', zone: 'finance_compliance', Component: TheodoraFinanceCRM,
  },
  olivia: {
    id: 'olivia', label: 'Marketing CRM', icon: '📣',
    description: 'Campaigns, channels, listings distribution',
    color: '#EC4899', zone: 'sales_leads', Component: OliviaMarketingCRM,
  },
  zoe: {
    id: 'zoe', label: 'Executive CRM', icon: '👑',
    description: 'Executive KPIs, strategy, and risk signals',
    color: '#E31E24', zone: 'executive', Component: ZoeExecutiveCRM,
  },
  'zoe-business-docs': {
    id: 'zoe-business-docs', label: '3.4.5 Hyper-Linked Business Docs Hub', icon: '📜',
    description: 'Dubai DET 1388443, RERA ORN 44483, Ejari, and 42 expense catalog documentation',
    color: '#EF4444', zone: 'executive', Component: ZoeBusinessHub,
  },
  laila: {
    id: 'laila', label: 'Compliance CRM', icon: '🛡️',
    description: 'KYC, compliance checks, legal risks',
    color: '#6366F1', zone: 'finance_compliance', Component: LailaComplianceCRM,
  },
  aurora: {
    id: 'aurora', label: 'CTO Dashboard', icon: '🖥️',
    description: 'System health, incidents, architecture status',
    color: '#0EA5E9', zone: 'executive', Component: AuroraCTODashboard,
  },
  'aurora-software-docs': {
    id: 'aurora-software-docs', label: '3.16.5 Hyper-Linked Software Architecture Hub', icon: '📐',
    description: 'SRS specifications, SDD topologies, RUP lifecycles, and 4-way folder standards',
    color: '#3B82F6', zone: 'ai_command', Component: AuroraSoftwareHub,
  },
  margaret: {
    id: 'margaret', label: '3.12 Margaret Strategic Plans Hub', icon: '🗺️',
    description: 'Master roadmaps, sprint backlogs, feature coverage matrices, and autonomous autopilot queues',
    color: '#F59E0B', zone: 'executive', Component: MargaretPlansHub,
  },
  'margaret-plans-docs': {
    id: 'margaret-plans-docs', label: '3.12.1 Strategic Plans & Backlog Hub', icon: '📋',
    description: 'Hyper-linked HTML project roadmaps, wave backlogs, and governance matrices',
    color: '#F59E0B', zone: 'ai_command', Component: MargaretPlansHub,
  },
  ada: {
    id: 'ada', label: '3.13 Ada Chief Architecture Hub', icon: '🏛️',
    description: 'Chief architecture governance, zero-token local gates, deduplication laws, and RBAC security',
    color: '#10B981', zone: 'executive', Component: AdaArchitectureHub,
  },
  'ada-architecture-docs': {
    id: 'ada-architecture-docs', label: '3.13.1 Architecture & SDLC Governance Hub', icon: '🛡️',
    description: 'System topologies, SDLC policies, deduplication engines, and security matrices',
    color: '#10B981', zone: 'ai_command', Component: AdaArchitectureHub,
  },
  hazel: {
    id: 'hazel', label: 'Frontend CRM', icon: '🧩',
    description: 'Frontend quality and UX operational metrics',
    color: '#14B8A6', zone: 'executive', Component: HazelFrontendCRM,
  },
  willow: {
    id: 'willow', label: 'Backend CRM', icon: '⚙️',
    description: 'Backend services and API health controls',
    color: '#06B6D4', zone: 'executive', Component: WillowBackendCRM,
  },
  linda: {
    id: 'linda', label: 'Linda WhatsApp CRM', icon: '📱',
    description: 'Agent-local WhatsApp device sessions and tooling',
    color: '#8B5CF6', zone: 'ai_command', Component: LindaWhatsAppCRM,
  },
  henry: {
    id: 'henry',
    label: 'Henry AI — Sovereign Record Keeper & Document Studio',
    icon: '🗂️',
    description: 'AI Optical Scanners (Passport, Title Deed, Emirates ID), Tenancy E-Sign, Ejari Vault & VAT Invoices',
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
    id: 'evangeline', label: 'Legal CRM', icon: '⚖️',
    description: 'Legal workflows and contract intelligence',
    color: '#7C3AED', zone: 'finance_compliance', Component: EvangelineLegalCRM,
  },
  sentinel: {
    id: 'sentinel', label: 'Sentinel Property CRM', icon: '🏢',
    description: 'Property state machine and quality checks',
    color: '#3B82F6', zone: 'inventory_listings', Component: SentinelPropertyCRM,
  },
  hunter: {
    id: 'hunter', label: 'Prospecting CRM', icon: '🎯',
    description: 'Outbound prospecting and assignment workflows',
    color: '#10B981', zone: 'sales_leads', Component: HunterProspectingCRM,
  },
  henryAudit: {
    id: 'henryAudit', label: 'Audit CRM', icon: '🧾',
    description: 'Audit trails and activity governance',
    color: '#6366F1', zone: 'finance_compliance', Component: HenryAuditCRM,
  },
  cipher: {
    id: 'cipher', label: 'Market Intelligence CRM', icon: '📊',
    description: 'Valuation and market intelligence models',
    color: '#0D9488', zone: 'inventory_listings', Component: CipherMarketCRM,
  },
  atlas: {
    id: 'atlas', label: 'Projects CRM', icon: '🧱',
    description: 'Off-plan project and milestone tracking',
    color: '#F97316', zone: 'leasing_contracts', Component: AtlasProjectsCRM,
  },
  vesta: {
    id: 'vesta', label: 'Handover CRM', icon: '🔑',
    description: 'Snagging, handover, and closeout controls',
    color: '#F59E0B', zone: 'leasing_contracts', Component: VestaHandoverCRM,
  },
  juno: {
    id: 'juno', label: 'Community CRM', icon: '🏘️',
    description: 'Community operations and resident workflows',
    color: '#8B5CF6', zone: 'leasing_contracts', Component: JunoCommunity,
  },
  kairos: {
    id: 'kairos', label: 'Luxury CRM', icon: '💎',
    description: 'HNWI workflows and premium listing intelligence',
    color: '#E31E24', zone: 'sales_leads', Component: KairosLuxuryCRM,
  },
  maven: {
    id: 'maven', label: 'Investment CRM', icon: '📌',
    description: 'Investment portfolio and decision support',
    color: '#22C55E', zone: 'finance_compliance', Component: MavenInvestmentCRM,
  },
  apex: {
    id: 'apex', label: 'Apex AI — Performance Coach', icon: '🏆',
    description: 'Agent performance metrics, KPI coaching, and leaderboard strategy',
    color: '#F59E0B', zone: 'sales_leads', Component: ApexCRM,
  },
  archer: {
    id: 'archer', label: 'Archer AI — Lead Scoring Engine', icon: '🎯',
    description: '100-point multi-factor conversion probability scorer and work queue prioritization',
    color: '#EF4444', zone: 'sales_leads', Component: ArcherCRM,
  },
  crest: {
    id: 'crest', label: 'Crest AI — Property Valuation AVM', icon: '🏠',
    description: 'Automated Valuation Model (AVM) with DLD comparative radius analysis',
    color: '#10B981', zone: 'inventory_listings', Component: CrestCRM,
  },
  echo: {
    id: 'echo', label: 'Echo AI — Communication Timeline', icon: '📜',
    description: 'Unified cross-channel communication timeline, touchpoint search, and engagement alerts',
    color: '#EF4444', zone: 'sales_leads', Component: EchoCRM,
  },
  flux: {
    id: 'flux', label: 'Flux AI — Real-Time Market Feeds', icon: '⚡',
    description: 'Real-time DLD API transaction streamer, portal price scrapers, and news pipeline',
    color: '#3B82F6', zone: 'inventory_listings', Component: FluxCRM,
  },
  halo: {
    id: 'halo', label: 'Halo AI — Client NPS Tracker', icon: '⭐',
    description: 'Post-transaction NPS surveys, CSAT measurement, and client satisfaction trends',
    color: '#F472B6', zone: 'sales_leads', Component: HaloCRM,
  },
  iris: {
    id: 'iris', label: 'Iris AI — 3D Virtual Staging', icon: '🎨',
    description: 'Generative AI virtual staging, 3D floor plan extrusions, and AR mobile walkthroughs',
    color: '#A855F7', zone: 'inventory_listings', Component: IrisCRM,
  },
  lumen: {
    id: 'lumen', label: 'Lumen AI — Visual Analytics', icon: '📊',
    description: 'Geospatial heatmaps, interactive charts, and PDF board reporting',
    color: '#EC4899', zone: 'executive', Component: LumenCRM,
  },
  mira: {
    id: 'mira', label: 'Mira AI — Multilingual Translation', icon: '🌍',
    description: 'Real-time Arabic ↔ English WhatsApp translation, RTL document formatting, and dialect tuning',
    color: '#10B981', zone: 'sales_leads', Component: MiraCRM,
  },
  nova: {
    id: 'nova', label: 'Nova AI — Off-Plan Launch Radar', icon: '🏗️',
    description: 'Developer launch intelligence feed, payment plan alerts, and handover milestone tracking',
    color: '#8B5CF6', zone: 'leasing_contracts', Component: NovaCRM,
  },
  oracle: {
    id: 'oracle', label: 'Oracle AI — Market Analyst Bot', icon: '🔮',
    description: 'Market synthesis reports, DLD volume spike detection, and narrative intelligence briefings',
    color: '#0D9488', zone: 'inventory_listings', Component: OracleCRM,
  },
  prism: {
    id: 'prism', label: 'Prism AI — Property Matching Engine', icon: '🔭',
    description: 'Vector-embedding similarity matching between buyer preferences and live inventory',
    color: '#0EA5E9', zone: 'sales_leads', Component: PrismCRM,
  },
  quill: {
    id: 'quill', label: 'Quill AI — Document Factory', icon: '✍️',
    description: 'Automated bilingual SPA, tenancy contract, and NOC document generation with DLD compliance',
    color: '#EF4444', zone: 'finance_compliance', Component: QuillCRM,
  },
  rex: {
    id: 'rex', label: 'Rex AI — Regulatory Document Verifier', icon: '📋',
    description: 'Fraud prevention, DLD blockchain title deed verification, and Emirates ID validation',
    color: '#EF4444', zone: 'finance_compliance', Component: RexCRM,
  },
  sage: {
    id: 'sage', label: 'Sage AI — Mortgage & Financing Advisor', icon: '💰',
    description: 'UAE Central Bank mortgage eligibility, EIBOR affordability calculator, and bank rate comparison',
    color: '#14B8A6', zone: 'finance_compliance', Component: SageCRM,
  },
  rera: {
    id: 'rera', label: 'RERA Compliance', icon: '📜',
    description: 'RERA policy and compliance checks',
    color: '#6366F1', zone: 'finance_compliance', Component: RERAComplianceModule,
  },
  dld: {
    id: 'dld', label: 'DLD Integration', icon: '🏛️',
    description: 'DLD workflow and integration operations',
    color: '#0EA5E9', zone: 'finance_compliance', Component: DLDIntegrationModule,
  },
  leads: {
    id: 'leads', label: 'Lead Scoring', icon: '📍',
    description: 'AI lead scoring and qualification signals',
    color: '#10B981', zone: 'sales_leads', Component: LeadScoringModule,
  },
  valuation: {
    id: 'valuation', label: 'Property Valuation', icon: '🏷️',
    description: 'Automated and assisted valuation tools',
    color: '#3B82F6', zone: 'inventory_listings', Component: PropertyValuationModule,
  },
  analytics: {
    id: 'analytics', label: 'Market Analytics', icon: '📉',
    description: 'Market-level analytics and trend breakdowns',
    color: '#14B8A6', zone: 'executive', Component: MarketAnalyticsModule,
  },
  'agent-task-cockpit': {
    id: 'agent-task-cockpit',
    label: 'Agent Task Cockpit',
    icon: '🗂️',
    description: 'SLA-prioritised task management for sales agents',
    color: '#C9A84C',
    zone: 'sales_leads',
    roles: ['agent', 'manager', 'admin'],
    section: 'Wave 18.1',
    Component: AgentTaskCockpit,
  },
  'funnel-economics': {
    id: 'funnel-economics',
    label: 'Funnel Economics',
    icon: '📊',
    description: 'Conversion funnel analytics and pipeline KPIs',
    color: '#C9A84C',
    zone: 'sales_leads',
    roles: ['manager', 'admin', 'ceo', 'coo'],
    section: 'Wave 18.1',
    Component: FunnelEconomicsDashboard,
  },
  'kpi-tracker': {
    id: 'kpi-tracker',
    label: 'KPI Baseline Tracker',
    icon: '🎯',
    description: 'Wave 18.1 90-day KPI baseline vs target cards',
    color: '#C9A84C',
    zone: 'executive',
    roles: ['admin', 'ceo', 'coo', 'manager'],
    section: 'Wave 18.1',
    Component: KPIBaselineTracker,
  },
  'lead-timeline': {
    id: 'lead-timeline',
    label: 'Lead Timeline',
    icon: '🕐',
    description: 'Per-lead activity timeline with note capture',
    color: '#C9A84C',
    zone: 'sales_leads',
    roles: ['agent', 'manager', 'admin'],
    section: 'Wave 18.1',
    Component: LeadTimeline,
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
  'agent-task-cockpit',
  'funnel-economics',
  'kpi-tracker',
  'lead-timeline',
];

export const CRM_HUB_MODULE_ORDER: string[] = [
  'clara', 'mary', 'sophia', 'theodora', 'daisy', 'nadia', 'zoe',
];

export const MODERN_DASHBOARD_ASSISTANT_ORDER: string[] = [
  'clara', 'mary', 'linda', 'nancy', 'theodora', 'olivia', 'zoe', 'aurora',
];

export const getCRMModule = (id: string | undefined | null): CRMModuleDefinition | null => {
  if (!id) return null;
  if (CRM_MODULE_REGISTRY[id]) return CRM_MODULE_REGISTRY[id];

  // Specific alias mappings
  if (id.startsWith('cassie-') || id === 'cassie') {
    return CRM_MODULE_REGISTRY['lead-scoring'] ?? CRM_MODULE_REGISTRY['leads'] ?? null;
  }
  if (id.startsWith('lead-scoring-') || id === 'lead-scoring') {
    return CRM_MODULE_REGISTRY['lead-scoring'] ?? CRM_MODULE_REGISTRY['leads'] ?? null;
  }

  // 20 Flagship Journey mappings
  const journeyKeys = [
    'prepare-tenancy-contract', 'property-onboarding', 'landlord-onboarding', 'tenant-onboarding',
    'leasing-deal-creation', 'contract-signing', 'payment-collection', 'create-ejari',
    'property-handover', 'tenancy-renewal', 'secondary-sales-deal', 'mortgage-preapproval',
    'golden-visa-application', 'offplan-reservation', 'property-snagging-inspection',
    'vat-quarterly-filing', 'tenant-moveout-settlement', 'aml-pep-sanctions-screening',
    'lead-acquisition-qualification', 'community-service-ticket'
  ];
  if (journeyKeys.includes(id) || id.startsWith('journey-') || id === 'journeys') {
    return CRM_MODULE_REGISTRY['journeys'] ?? null;
  }

  // Intelligent prefix resolution: e.g. "nadia-broadcast" -> "nadia"
  const prefix = id.split('-')[0];
  if (prefix && CRM_MODULE_REGISTRY[prefix]) {
    return CRM_MODULE_REGISTRY[prefix];
  }

  return null;
};

export const resolveCRMModules = (ids: string[]): CRMModuleDefinition[] =>
  ids.map(id => getCRMModule(id)).filter((m): m is CRMModuleDefinition => Boolean(m));


