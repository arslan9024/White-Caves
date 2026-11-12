import { lazy } from 'react';
import type { CRMModuleDefinition } from './crmModuleRegistry.types.js';

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

const AgentTaskCockpit = lazy(() => import('../components/crm/AgentTaskCockpit'));
const FunnelEconomicsDashboard = lazy(() => import('../components/crm/FunnelEconomicsDashboard'));
const KPIBaselineTracker = lazy(() => import('../components/crm/KPIBaselineTracker'));
const LeadTimeline = lazy(() => import('../components/crm/LeadTimeline'));
const HeroSectionCRM = lazy(() => import('../components/crm/HeroSectionCRM'));

export const ASSISTANTS_CRM_MODULES: Record<string, CRMModuleDefinition> = {
  apex: {
    id: 'apex',
    label: 'Apex AI — Performance Coach',
    icon: '🏆',
    description: 'Agent performance metrics, KPI coaching, and leaderboard strategy',
    color: '#F59E0B',
    zone: 'sales_leads',
    Component: ApexCRM,
  },
  archer: {
    id: 'archer',
    label: 'Archer AI — Lead Scoring Engine',
    icon: '🎯',
    description:
      '100-point multi-factor conversion probability scorer and work queue prioritization',
    color: '#EF4444',
    zone: 'sales_leads',
    Component: ArcherCRM,
  },
  crest: {
    id: 'crest',
    label: 'Crest AI — Property Valuation AVM',
    icon: '🏠',
    description: 'Automated Valuation Model (AVM) with DLD comparative radius analysis',
    color: '#10B981',
    zone: 'inventory_listings',
    Component: CrestCRM,
  },
  echo: {
    id: 'echo',
    label: 'Echo AI — Communication Timeline',
    icon: '📜',
    description:
      'Unified cross-channel communication timeline, touchpoint search, and engagement alerts',
    color: '#EF4444',
    zone: 'sales_leads',
    Component: EchoCRM,
  },
  flux: {
    id: 'flux',
    label: 'Flux AI — Real-Time Market Feeds',
    icon: '⚡',
    description: 'Real-time DLD API transaction streamer, portal price scrapers, and news pipeline',
    color: '#3B82F6',
    zone: 'inventory_listings',
    Component: FluxCRM,
  },
  halo: {
    id: 'halo',
    label: 'Halo AI — Client NPS Tracker',
    icon: '⭐',
    description: 'Post-transaction NPS surveys, CSAT measurement, and client satisfaction trends',
    color: '#F472B6',
    zone: 'sales_leads',
    Component: HaloCRM,
  },
  iris: {
    id: 'iris',
    label: 'Iris AI — 3D Virtual Staging',
    icon: '🎨',
    description:
      'Generative AI virtual staging, 3D floor plan extrusions, and AR mobile walkthroughs',
    color: '#A855F7',
    zone: 'inventory_listings',
    Component: IrisCRM,
  },
  lumen: {
    id: 'lumen',
    label: 'Lumen AI — Visual Analytics',
    icon: '📊',
    description: 'Geospatial heatmaps, interactive charts, and PDF board reporting',
    color: '#EC4899',
    zone: 'executive',
    Component: LumenCRM,
  },
  mira: {
    id: 'mira',
    label: 'Mira AI — Multilingual Translation',
    icon: '🌍',
    description:
      'Real-time Arabic ↔ English WhatsApp translation, RTL document formatting, and dialect tuning',
    color: '#10B981',
    zone: 'sales_leads',
    Component: MiraCRM,
  },
  nova: {
    id: 'nova',
    label: 'Nova AI — Off-Plan Launch Radar',
    icon: '🏗️',
    description:
      'Developer launch intelligence feed, payment plan alerts, and handover milestone tracking',
    color: '#8B5CF6',
    zone: 'leasing_contracts',
    Component: NovaCRM,
  },
  oracle: {
    id: 'oracle',
    label: 'Oracle AI — Market Analyst Bot',
    icon: '🔮',
    description:
      'Market synthesis reports, DLD volume spike detection, and narrative intelligence briefings',
    color: '#0D9488',
    zone: 'inventory_listings',
    Component: OracleCRM,
  },
  prism: {
    id: 'prism',
    label: 'Prism AI — Property Matching Engine',
    icon: '🔭',
    description:
      'Vector-embedding similarity matching between buyer preferences and live inventory',
    color: '#0EA5E9',
    zone: 'sales_leads',
    Component: PrismCRM,
  },
  quill: {
    id: 'quill',
    label: 'Quill AI — Document Factory',
    icon: '✍️',
    description:
      'Automated bilingual SPA, tenancy contract, and NOC document generation with DLD compliance',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: QuillCRM,
  },
  rex: {
    id: 'rex',
    label: 'Rex AI — Regulatory Document Verifier',
    icon: '📋',
    description:
      'Fraud prevention, DLD blockchain title deed verification, and Emirates ID validation',
    color: '#EF4444',
    zone: 'finance_compliance',
    Component: RexCRM,
  },
  sage: {
    id: 'sage',
    label: 'Sage AI — Mortgage & Financing Advisor',
    icon: '💰',
    description:
      'UAE Central Bank mortgage eligibility, EIBOR affordability calculator, and bank rate comparison',
    color: '#14B8A6',
    zone: 'finance_compliance',
    Component: SageCRM,
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
  'hero-section': {
    id: 'hero-section',
    label: 'Hero Section — WAVE 50',
    icon: '✨',
    description:
      'Hero Section feature widgets: Preloader, PWA, Countdown, Schema, Counters, Awards, and more',
    color: '#D4AF37',
    zone: 'executive',
    roles: ['admin', 'ceo', 'coo', 'manager'],
    section: 'Wave 50',
    Component: HeroSectionCRM,
  },
};
