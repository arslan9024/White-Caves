import { lazy } from 'react';
import type { CRMModuleDefinition } from './crmModuleRegistry.types.js';

const UnifiedCRM = lazy(() => import('../components/crm/UnifiedCRM'));
const NadiaWhatsAppCRM = lazy(() => import('../components/crm/NadiaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../components/crm/MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('../components/crm/ClaraLeadsCRM_NEW'));
const NinaWhatsAppBotCRM = lazy(() => import('../components/crm/NinaWhatsAppBotCRM'));
const NancyHRCRM = lazy(() => import('../components/crm/NancyHRCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('../components/crm/SophiaSalesCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('../components/crm/DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('../components/crm/TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('../components/crm/OliviaMarketingCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('../components/crm/ZoeExecutiveCRM_NEW'));
const AICommandCenterPage = lazy(
  () => import('../app/(dashboard)/ai-command-center/AICommandCenterPage')
);
const DepartmentsOverviewPage = lazy(
  () => import('../app/(dashboard)/departments/DepartmentsOverviewPage')
);
const DepartmentDetailPage = lazy(
  () => import('../app/(dashboard)/departments/DepartmentDetailPage')
);
const LailaComplianceCRM = lazy(() => import('../components/crm/LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('../components/crm/AuroraCTODashboard_NEW'));
const HazelFrontendCRM = lazy(() => import('../components/crm/HazelFrontendCRM_NEW'));
const WillowBackendCRM = lazy(() => import('../components/crm/WillowBackendCRM_NEW'));
const LindaWhatsAppCRM = lazy(() => import('../components/crm/LindaWhatsAppCRM'));
const ZoeBusinessHub = lazy(() => import('../components/crm/ZoeBusinessHub'));
const AuroraSoftwareHub = lazy(() => import('../components/crm/AuroraSoftwareHub'));
const MargaretPlansHub = lazy(() => import('../components/crm/MargaretPlansHub'));
const AdaArchitectureHub = lazy(() => import('../components/crm/AdaArchitectureHub'));
const AegisAutopilotHub = lazy(() => import('../components/crm/AegisAutopilotHub'));

const FounderExecutiveDashboard = lazy(
  () => import('../components/dashboard/viewport/FounderExecutiveDashboard')
);
const CommandCenter = lazy(() => import('../components/dashboard/command-center/CommandCenter'));
const JourneyHubView = lazy(() => import('../features/journeys/JourneyHubView'));

export const CORE_CRM_MODULES: Record<string, CRMModuleDefinition> = {
  overview: {
    id: 'overview',
    label: '1.1 Executive Overview & Live Audit',
    icon: '👑',
    description:
      'Managing Director Arslan Malik Bashir Ahmad sovereign command podium & 1-12-108 corporate telemetry',
    color: '#EF4444',
    zone: 'executive',
    Component: FounderExecutiveDashboard,
  },
  command_center: {
    id: 'command_center',
    label: '1.1B Executive Command Center (Live BI)',
    icon: '📊',
    description:
      'Real-time operating picture across pipeline, inventory, revenue, and agent execution',
    color: '#EF4444',
    zone: 'executive',
    Component: CommandCenter,
  },
  journeys: {
    id: 'journeys',
    label: '20 Life Cycle Journeys Hub',
    icon: '🗺️',
    description: 'Guided real estate operating missions enforcing RERA compliance & DLD integrity',
    color: '#EF4444',
    zone: 'executive',
    Component: JourneyHubView,
  },
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
  'ai-command': {
    id: 'ai-command',
    label: 'AI Command Center',
    icon: '⚡',
    description: 'White Caves 12 Departments, 108 Supervisors & Virtual Staff Production Hub',
    color: '#8B5CF6',
    zone: 'ai_command',
    Component: AICommandCenterPage,
  },
  'ai-hub': {
    id: 'ai-hub',
    label: 'AI Command Center Hub',
    icon: '⚡',
    description: 'White Caves Corporate Hierarchy & Autonomous AI Workforce Engine',
    color: '#8B5CF6',
    zone: 'ai_command',
    Component: AICommandCenterPage,
  },
  'corporate-departments': {
    id: 'corporate-departments',
    label: '12 Corporate Departments',
    icon: '🏢',
    description: 'Full-screen Corporate Hierarchy with Sub-Desks and Dynamic Squads',
    color: '#1E293B',
    zone: 'executive',
    Component: DepartmentsOverviewPage,
  },
  'corporate-department-detail': {
    id: 'corporate-department-detail',
    label: 'Department Container',
    icon: '🗂️',
    description: 'Sub-departments and Team Squads dynamic workspace',
    color: '#1E293B',
    zone: 'executive',
    Component: DepartmentDetailPage,
  },
  'zoe-business-docs': {
    id: 'zoe-business-docs',
    label: '3.4.5 Hyper-Linked Business Docs Hub',
    icon: '📜',
    description: 'Dubai DET 1388443, RERA ORN 44483, Ejari, and 42 expense catalog documentation',
    color: '#EF4444',
    zone: 'executive',
    Component: ZoeBusinessHub,
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
  'aurora-software-docs': {
    id: 'aurora-software-docs',
    label: '3.16.5 Hyper-Linked Software Architecture Hub',
    icon: '📐',
    description: 'SRS specifications, SDD topologies, RUP lifecycles, and 4-way folder standards',
    color: '#3B82F6',
    zone: 'ai_command',
    Component: AuroraSoftwareHub,
  },
  margaret: {
    id: 'margaret',
    label: '3.42 Margaret Strategic Plans Hub',
    icon: '🗺️',
    description:
      'Master roadmaps, sprint backlogs, feature coverage matrices, and autonomous autopilot queues',
    color: '#F59E0B',
    zone: 'executive',
    Component: MargaretPlansHub,
  },
  'margaret-plans-docs': {
    id: 'margaret-plans-docs',
    label: '3.42.4 Strategic Plans & Backlog Hub',
    icon: '📋',
    description: 'Hyper-linked HTML project roadmaps, wave backlogs, and governance matrices',
    color: '#F59E0B',
    zone: 'ai_command',
    Component: MargaretPlansHub,
  },
  ada: {
    id: 'ada',
    label: '3.43 Ada Chief Architecture Hub',
    icon: '🏛️',
    description:
      'Chief architecture governance, zero-token local gates, deduplication laws, and RBAC security',
    color: '#10B981',
    zone: 'executive',
    Component: AdaArchitectureHub,
  },
  'ada-architecture-docs': {
    id: 'ada-architecture-docs',
    label: '3.43.4 Architecture & SDLC Governance Hub',
    icon: '🛡️',
    description: 'System topologies, SDLC policies, deduplication engines, and security matrices',
    color: '#10B981',
    zone: 'ai_command',
    Component: AdaArchitectureHub,
  },
  aegis: {
    id: 'aegis',
    label: '3.44 AEGIS Autopilot Hub',
    icon: '🚀',
    description:
      'Live orchestrator telemetry, 170-agent swarm mesh, daily sprint progress, and zero-defect gates',
    color: '#EF4444',
    zone: 'executive',
    Component: AegisAutopilotHub,
  },
  'aegis-autopilot-hub': {
    id: 'aegis-autopilot-hub',
    label: '3.44.5 Autonomous Orchestrator Engine',
    icon: '🤖',
    description: 'Autonomous autopilot controls, continuous AST deduplication, and execution logs',
    color: '#EF4444',
    zone: 'ai_command',
    Component: AegisAutopilotHub,
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
};
