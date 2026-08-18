/**
 * CRMHubPage.logic.ts
 *
 * Dedicated Business Logic & State Controller for the White Caves ERP Dashboard.
 * Controls URL synchronization, Department & AI registry state, and Sidebar interactions.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHaptics } from '../../hooks/useHaptics';
import { useCRMHubData } from '../../hooks/crm/useCRMHubData';
import type { SearchableOption } from '../../components/dashboard/common/SearchableSelect';

export interface SubGroup {
  name: string;
  items: { id: string; label: string; icon: string }[];
}

export interface BuildingTier {
  id: string;
  num: string; // e.g. "Dept 12", "Dept 07", "MD Suite"
  name: string;
  locationTag: string;
  accessLevel: string;
  badgeColor: string;
  icon: string;
  summary: string;
  scope: string[];
  subGroups?: { name?: string; id?: string; label?: string; icon?: string; items?: { id: string; label: string; icon: string }[] }[];
  items?: { id: string; label: string; icon: string }[];
}

export interface AIAssistantOption {
  id: string;
  num: string;
  name: string;
  role: string;
  icon: string;
  items?: { id: string; label: string; icon: string; badge?: string }[];
}

// ─── Master Registry of All 26 AI Assistants ───
export const ALL_AI_ASSISTANTS: AIAssistantOption[] = [
  { id: 'nadia', num: '3.1', name: 'Nadia AI', role: 'WhatsApp CRM & Campaigns', icon: '💬' },
  { id: 'nina', num: '3.2', name: 'Nina AI', role: 'WhatsApp Bot & Automations', icon: '🤖' },
  { id: 'sophia', num: '3.3', name: 'Sophia AI', role: 'Sales CRM & Deals Intelligence', icon: '📈' },
  { id: 'zoe', num: '3.4', name: 'Zoe AI', role: 'Executive CRM & Operations SLA', icon: '👑' },
  { id: 'evangeline', num: '3.5', name: 'Evangeline AI', role: 'Legal & Contract Intelligence', icon: '⚖️' },
  { id: 'lead-scoring', num: '3.6', name: 'Cassie AI', role: 'Predictive Lead Scoring Engine', icon: '📊' },
  { id: 'atlas', num: '3.7', name: 'Atlas AI', role: 'Off-Plan Projects & Construction', icon: '🏛️' },
  { id: 'clara', num: '3.8', name: 'Clara AI', role: 'Leads Qualification & Acquisition', icon: '🎯' },
  { id: 'mary', num: '3.9', name: 'Mary AI', role: 'Master Property Inventory & Area Matrix', icon: '🏠' },
  { id: 'linda', num: '3.10', name: 'Linda AI', role: 'Agent-Local WhatsApp Session Desk', icon: '📱' },
  { id: 'olivia', num: '3.11', name: 'Olivia AI', role: 'Growth Marketing & Portals Syndication', icon: '📣' },
  { id: 'nancy', num: '3.12', name: 'Nancy AI', role: 'HR & Agent Talent Leaderboards', icon: '👥' },
  { id: 'daisy', num: '3.13', name: 'Daisy AI', role: 'Leasing Contracts & PDC Renewals', icon: '📋' },
  { id: 'theodora', num: '3.14', name: 'Theodora AI', role: 'Finance & VAT 5% Escrow Accounting', icon: '💳' },
  { id: 'laila', num: '3.15', name: 'Laila AI', role: 'RERA Compliance & AML Audit', icon: '🛡️' },
  { id: 'aurora', num: '3.16', name: 'Aurora AI', role: 'CTO Systems & API Infrastructure', icon: '🖥️' },
  { id: 'hazel', num: '3.17', name: 'Hazel AI', role: 'Frontend & UX Quality Metrics', icon: '🧩' },
  { id: 'willow', num: '3.18', name: 'Willow AI', role: 'Backend & Server Microservices', icon: '⚙️' },
  {
    id: 'henry',
    num: '3.19',
    name: 'Henry AI',
    role: 'Records, Title Deeds & Audit Logs',
    icon: '🗂️',
    items: [
      { id: 'henry-tenancy-journey', label: '3.19.1 Prepare Tenancy Contract', icon: '📄', badge: 'DLD Official' },
      { id: 'henry-scan-eid', label: '3.19.2 Scan Emirates ID', icon: '🪪', badge: 'OCR Engine' },
      { id: 'henry-scan-title-deed', label: '3.19.3 Scan Title Deed', icon: '📜', badge: 'DLD Oqood' },
      { id: 'henry-scan-passport', label: '3.19.4 Scan Passport', icon: '🛂', badge: 'ICAO MRZ' },
      { id: 'henry-scan-contract', label: '3.19.5 Scan Tenancy Contract', icon: '📑', badge: 'DLD Ejari' },
    ],
  },
  { id: 'sentinel', num: '3.20', name: 'Sentinel AI', role: 'Property State Machine & Quality', icon: '🏢' },
  { id: 'hunter', num: '3.21', name: 'Hunter AI', role: 'Outbound Prospecting & Lead Matcher', icon: '🎯' },
  { id: 'cipher', num: '3.22', name: 'Cipher AI', role: 'Market Pricing & CMA Valuations', icon: '📊' },
  { id: 'vesta', num: '3.23', name: 'Vesta AI', role: 'Snagging, Move-In & Handover', icon: '🔑' },
  { id: 'juno', num: '3.24', name: 'Juno AI', role: 'Community Operations & Facilities', icon: '🏘️' },
  { id: 'kairos', num: '3.25', name: 'Kairos AI', role: 'Luxury HNWI Wealth Advisory', icon: '💎' },
  { id: 'maven', num: '3.26', name: 'Maven AI', role: 'Investment Portfolio & Feasibility', icon: '📌' },
];

// ─── MD Suite (Tile 1) Data Object ───
export const MD_SUITE_DEPT: BuildingTier = {
  id: 'dept-md',
  num: 'MD Suite',
  name: 'Office of the Managing Director (MD Suite)',
  locationTag: 'Floor 13: MD Sovereign Suite',
  accessLevel: 'Level 7 (Ultimate Sovereign Access)',
  badgeColor: '#EF4444',
  icon: '👑',
  summary: 'Reserved exclusively for Arslan Malik. Controls global corporate strategy, high-stakes joint ventures, investment allocations, and unilateral override permissions across all lower operational tiers.',
  scope: ['Global Corporate Strategy & Joint Ventures', 'Executive Overview & Management Dashboards', 'Executive Department Deck Control'],
  items: [
    { id: 'overview', label: '1.1 Executive Overview & Live Audit', icon: '📊' },
    { id: 'zoe', label: '1.2 Global Strategy & Department Deck', icon: '📈' },
  ],
};

// ─── Official 12 Corporate Departments Registry ───
export const TWELVE_CORPORATE_DEPARTMENTS: BuildingTier[] = [
  {
    id: 'dept-12',
    num: 'Dept 12',
    name: 'Executive & Operations Control Department',
    locationTag: 'Floor 12: Executive Control',
    accessLevel: 'Level 6 (Strategic Command Access)',
    badgeColor: '#EF4444',
    icon: '🏛️',
    summary: 'The elite administrative layer connecting directly to the Level 7 MD Suite to translate executive vision into corporate directives and inter-departmental workflow alignment.',
    scope: ['Cross-Departmental Performance Management', 'Corporate Governance & Policy Creation', 'Inter-Department Workflow Optimization', 'Executive Board Room Operations'],
    items: [
      { id: 'zoe', label: '12.1 Cross-Department Performance', icon: '⚡' },
      { id: 'governance', label: '12.2 Corporate Governance & Policy', icon: '📜' },
    ],
  },
  {
    id: 'dept-11',
    num: 'Dept 11',
    name: 'Market Intelligence & Data Analytics Department',
    locationTag: 'Floor 11: Analytics Tower',
    accessLevel: 'Level 6 (Strategic Command Access)',
    badgeColor: '#8B5CF6',
    icon: '📈',
    summary: 'Feeds high-level analytical forecasting directly to Floor 12 and 13 to guide macro investment timing, off-plan capital appreciation modeling, and predictive asset pricing.',
    scope: ['Off-Plan Project ROI & Capital Appreciation', 'Predictive Market Analytics & Pricing Trends', 'Macroeconomic Asset Forecasting'],
    items: [
      { id: 'atlas', label: '11.1 Off-Plan Project ROI & Appreciation', icon: '🏛️' },
      { id: 'lead-scoring', label: '11.2 Predictive Analytics & Pricing Trends', icon: '📊' },
    ],
  },
  {
    id: 'dept-10',
    num: 'Dept 10',
    name: 'Global Investor Relations Department',
    locationTag: 'Floor 10: Investor Relations',
    accessLevel: 'Level 5 (Vetted Oversight Access)',
    badgeColor: '#3B82F6',
    icon: '🌐',
    summary: 'Manages international cross-border movements, institutional accounts, overseas wealth portfolios, and remote buyer verification channels.',
    scope: ['Overseas Wealth Advisory & Cross-Border Transactions', 'Remote Buyer Portal Management & Verification', 'Institutional & Bulk-Unit Investment Portfolios'],
    items: [
      { id: 'investor-advisory', label: '10.1 Overseas Wealth & Cross-Border', icon: '🌍' },
      { id: 'remote-buyer', label: '10.2 Remote Buyer Portal', icon: '💻' },
    ],
  },
  {
    id: 'dept-09',
    num: 'Dept 09',
    name: 'Legal, Title & Regulatory Compliance Department',
    locationTag: 'Floor 09: Legal & Regulatory Chambers',
    accessLevel: 'Level 5 (Vetted Oversight Access)',
    badgeColor: '#10B981',
    icon: '⚖️',
    summary: 'Ensures strict alignment with Dubai Land Department (DLD), Real Estate Regulatory Agency (RERA), Form A/B/F brokerage laws, and UAE Anti-Money Laundering (AML) directives.',
    scope: ['DLD Integration & Ejari Direct Compliance', 'RERA Brokerage Licensing & Unified Contracts', 'AML/CFT Audits & Customer Due Diligence (CDD)'],
    items: [
      { id: 'laila', label: '9.1 RERA Brokerage Licensing & AML', icon: '🛡️' },
      { id: 'dld-ejari', label: '9.2 DLD Integration & Unified Contracts', icon: '📜' },
      { id: 'evangeline', label: '9.3 Evangeline Legal Review Desk', icon: '⚖️' },
    ],
  },
  {
    id: 'dept-08',
    num: 'Dept 08',
    name: 'Finance, Escrow & VAT Accounting Department',
    locationTag: 'Floor 08: Finance & Treasury Vault',
    accessLevel: 'Level 5 (Vetted Oversight Access)',
    badgeColor: '#F59E0B',
    icon: '💳',
    summary: 'Oversees off-plan project escrow disbursements, trust account management, UAE Federal Tax Authority (FTA) 5% VAT filings, and agent commission settlement waterfalls.',
    scope: ['Escrow Account Monitoring (Law No. 8)', 'FTA 5% VAT Tax Invoicing & Compliance', 'Agent Commission Waterfalls & Approvals'],
    items: [
      { id: 'theodora', label: '8.1 Treasury, Escrow & VAT 5% Desk', icon: '💳' },
      { id: 'agent-commission', label: '8.2 Agent Commission & Payout Desk', icon: '💰' },
    ],
  },
  {
    id: 'dept-07',
    num: 'Dept 07',
    name: 'Property Portfolio, Listings & Asset Management Department',
    locationTag: 'Floor 07: Property Asset Tower',
    accessLevel: 'Level 4 (Operational Access)',
    badgeColor: '#06B6D4',
    icon: '🏡',
    summary: 'Curates and oversees the entire master inventory across Dubai, managing off-plan developer allocations, secondary resales, and luxury leasing portfolios.',
    scope: ['Exclusive Resale & Secondary Listings', 'Off-Plan Developer Allocations & Launch Desk', 'Property Management & Asset Maintenance Portfolios'],
    subGroups: [
      {
        name: '🏡 Inventory Control Center',
        items: [
          { id: 'mary', label: '7.1 Mary Master Inventory & Area Matrix', icon: '🏠' },
          { id: 'sentinel', label: '7.2 Sentinel Property Quality & Verification', icon: '🏢' },
        ],
      },
      {
        name: '🗂️ Records & Document Studio',
        items: [
          { id: 'henry', label: '7.3 Henry Document Studio (DLD & Ejari Hub)', icon: '🗂️' },
          { id: 'henry-audit', label: '7.4 Henry Audit Logs & Governance Vault', icon: '📋' },
        ],
      },
    ],
  },
  {
    id: 'dept-06',
    num: 'Dept 06',
    name: 'Sales, Acquisitions & Secondary Brokerage Department',
    locationTag: 'Floor 06: Secondary Trading Floor',
    accessLevel: 'Level 4 (Operational Access)',
    badgeColor: '#EC4899',
    icon: '💼',
    summary: 'The high-velocity revenue engine handling secondary buyer-seller transactions, price negotiations, Form F sales agreements, and transfer handovers.',
    scope: ['Buyer Lead Qualification & Acquisition', 'High-Stakes Price Negotiation & Offer Matching', 'Unified Form F Drafting & Escrow Closing'],
    items: [
      { id: 'clara', label: '6.1 Clara Leads Qualification Desk', icon: '🎯' },
      { id: 'sophia', label: '6.2 Sophia Sales CRM & Deals Pipeline', icon: '📈' },
    ],
  },
  {
    id: 'dept-05',
    num: 'Dept 05',
    name: 'Leasing, Tenant Relations & Property Management Department',
    locationTag: 'Floor 05: Leasing Operations Hub',
    accessLevel: 'Level 4 (Operational Access)',
    badgeColor: '#6366F1',
    icon: '📋',
    summary: 'Manages the end-to-end residential and commercial tenancy lifecycle across Dubai, handling Ejari registration, PDC post-dated cheque vaults, and renewals.',
    scope: ['Ejari Registration & Tenancy Agreements', 'PDC Post-Dated Cheque Vault & Collection', 'Move-in / Move-out Snagging & Security Deposits'],
    items: [
      { id: 'daisy', label: '5.1 Daisy Tenancy Contracts & PDC Hub', icon: '📋' },
      { id: 'vesta', label: '5.2 Vesta Snagging & Key Handover Desk', icon: '🔑' },
    ],
  },
  {
    id: 'dept-04',
    num: 'Dept 04',
    name: 'Omnichannel Communications & Growth Marketing Department',
    locationTag: 'Floor 04: Media & Campaign Suite',
    accessLevel: 'Level 3 (Marketing Access)',
    badgeColor: '#14B8A6',
    icon: '💬',
    summary: 'Drives high-converting multi-channel client engagement across WhatsApp Meta Business API, luxury social campaigns, and property portal syndications.',
    scope: ['WhatsApp Official Cloud API Messaging', 'Property Finder / Bayut Portal Syndication', 'High-Net-Worth Lead Generation Campaigns'],
    items: [
      { id: 'nadia', label: '4.1 Nadia WhatsApp Marketing Desk', icon: '💬' },
      { id: 'nina', label: '4.2 Nina WhatsApp Bot & Automation Core', icon: '🤖' },
      { id: 'olivia', label: '4.3 Olivia Growth Marketing & Portals Hub', icon: '📣' },
      { id: 'linda', label: '4.4 Linda Agent WhatsApp Session Desk', icon: '📱' },
    ],
  },
  {
    id: 'dept-03',
    num: 'Dept 03',
    name: 'Client Experience, Concierge & Property Handover Department',
    locationTag: 'Floor 03: VIP Concierge Lounge',
    accessLevel: 'Level 3 (Client Services Access)',
    badgeColor: '#F97316',
    icon: '🔑',
    summary: 'Delivers white-glove onboarding for property investors and tenants, coordinating DEWA utility connections, title deed handovers, and community concierge.',
    scope: ['VIP Investor Concierge & Chauffeur Services', 'DEWA / Empower Utility Connection Support', 'Key Handover Ceremonies & Snagging Audits'],
    items: [
      { id: 'vesta', label: '3.1 Vesta Snagging & Inspection Hub', icon: '🔑' },
      { id: 'juno', label: '3.2 Juno Community & Resident Portal', icon: '🏘️' },
    ],
  },
  {
    id: 'dept-02',
    num: 'Dept 02',
    name: 'Human Capital, Broker Academy & Talent Department',
    locationTag: 'Floor 02: Academy & Talent Hall',
    accessLevel: 'Level 2 (HR & Admin Access)',
    badgeColor: '#84CC16',
    icon: '👥',
    summary: 'Maintains elite broker performance standards, administering RERA training certifications, broker commission tiering, and agent recruitment.',
    scope: ['RERA Broker Exam & Licensing Onboarding', 'Agent Sales Quota & Commission Tracking', 'Broker Talent Acquisition & Culture'],
    items: [
      { id: 'nancy', label: '2.1 Nancy HR & Broker Talent Matrix', icon: '👥' },
    ],
  },
  {
    id: 'dept-01',
    num: 'Dept 01',
    name: 'Technology, Enterprise Cloud & Security Department',
    locationTag: 'Floor 01: Core Systems & Server Vault',
    accessLevel: 'Level 6 (Systems Admin Access)',
    badgeColor: '#64748B',
    icon: '🖥️',
    summary: 'Maintains 99.99% uptime for the White Caves ERP core, managing end-to-end encryption, microservices, cloud servers, and data privacy.',
    scope: ['Core ERP Architecture & Database Scaling', 'AI Assistant Model Orchestration & LLM RAG', 'Role-Based Access Control & Security Auditing'],
    items: [
      { id: 'aurora', label: '1.1 Aurora CTO Systems & Infrastructure', icon: '🖥️' },
      { id: 'hazel', label: '1.2 Hazel Frontend & UX Quality Metrics', icon: '🧩' },
      { id: 'willow', label: '1.3 Willow Backend Microservices Desk', icon: '⚙️' },
    ],
  },
];

export function useCRMHubPageLogic() {
  const { user } = useCRMHubData();
  const [searchParams, setSearchParams] = useSearchParams();
  const haptics = useHaptics();

  // Top-Level 3 Accordion Tiles State: 'md_office' | 'corporate' | 'ai_command'
  const [openTopTile, setOpenTopTile] = useState<'md_office' | 'corporate' | 'ai_command' | null>('corporate');

  // Active module tab
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('tab') || 'dept_summary'
  );

  // Selected Department ID in Tile 2
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-07');

  // Selected AI ID in Tile 3
  const [selectedAiId, setSelectedAiId] = useState<string>('nadia');

  // Sidebar & Top Header Collapse States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [isHenryTenancyModalOpen, setIsHenryTenancyModalOpen] = useState<boolean>(false);

  // Subgroup accordion states
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({
    'dept-07-🏡 Inventory Control Center': true,
  });

  // Selected Department & AI Objects
  const selectedDept = useMemo(() => {
    return TWELVE_CORPORATE_DEPARTMENTS.find(d => d.id === selectedDeptId) || TWELVE_CORPORATE_DEPARTMENTS[5];
  }, [selectedDeptId]);

  const selectedAi = useMemo(() => {
    return ALL_AI_ASSISTANTS.find(a => a.id === selectedAiId) || ALL_AI_ASSISTANTS[0];
  }, [selectedAiId]);

  // Synchronize Tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = useCallback((newTab: string) => {
    haptics.medium();
    const resolvedTab = newTab === 'henry-prepare-tenancy' ? 'henry-tenancy-journey' : newTab;
    setActiveTab(resolvedTab);
    setSearchParams({ tab: resolvedTab });
  }, [haptics, setSearchParams]);

  // Tile 1 click
  const handleMdTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'md_office' ? null : 'md_office'));
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange]);

  // Tile 2 click
  const handleCorporateTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'corporate' ? null : 'corporate'));
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange]);

  // Tile 3 click
  const handleAiTileClick = useCallback(() => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'ai_command' ? null : 'ai_command'));
    handleTabChange(selectedAiId);
  }, [haptics, handleTabChange, selectedAiId]);

  // Select Department from dropdown
  const handleSelectDepartment = useCallback((option: SearchableOption) => {
    haptics.light();
    setSelectedDeptId(option.id);
    handleTabChange('dept_summary');
  }, [haptics, handleTabChange]);

  // Select AI from dropdown
  const handleSelectAiAssistant = useCallback((option: SearchableOption) => {
    haptics.light();
    setSelectedAiId(option.id);
    handleTabChange(option.id);
  }, [haptics, handleTabChange]);

  // Toggle Subgroups
  const toggleSubGroup = useCallback((subGroupName: string) => {
    haptics.light();
    setOpenSubGroups(prev => ({
      ...prev,
      [subGroupName]: !prev[subGroupName],
    }));
  }, [haptics]);

  // Active Location Tag
  const activeLocationTag = useMemo(() => {
    if (openTopTile === 'md_office') return MD_SUITE_DEPT.locationTag;
    if (openTopTile === 'corporate') return selectedDept.locationTag;
    return `Floor 3 // AI Command Core (${selectedAi.name})`;
  }, [openTopTile, selectedDept, selectedAi]);

  return {
    user,
    activeTab,
    openTopTile,
    selectedDept,
    selectedDeptId,
    selectedAi,
    selectedAiId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isHeaderCollapsed,
    setIsHeaderCollapsed,
    isHenryTenancyModalOpen,
    setIsHenryTenancyModalOpen,
    openSubGroups,
    activeLocationTag,
    handleTabChange,
    handleMdTileClick,
    handleCorporateTileClick,
    handleAiTileClick,
    handleSelectDepartment,
    handleSelectAiAssistant,
    toggleSubGroup,
  };
}
