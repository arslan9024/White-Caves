/**
 * White Caves Real Estate LLC — ERP Core Corporate Schema & Executive Dashboard
 * 
 * Features Searchable Department Dropdown (Tile 2) & Searchable AI Assistant Dropdown (Tile 3):
 * 1. Tile 1: Managing Director Office (MD Sovereign Suite)
 * 2. Tile 2: 12 Corporate Departments (Searchable Dropdown — renders ONLY selected department's sub-items)
 * 3. Tile 3: AI Command Center (Searchable Dropdown for all 26 AI Assistants — renders ONLY selected AI assistant's content)
 */

import React, { FC, memo, useState, useEffect, Suspense, useCallback, useMemo, useDeferredValue } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Badge } from '../../components/ui';
import SuspenseLoader from '../../components/common/SuspenseLoader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useHaptics } from '../../hooks/useHaptics';
import { useCRMHubData } from '../../hooks/crm/useCRMHubData';
import { CRM_MODULE_REGISTRY, resolveCRMModules, CRM_HUB_MODULE_ORDER } from '../../config/crmModuleRegistry';
import PublicLayout from '../../components/layout/PublicLayout';

// --- Framer Motion Animation Variants ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const slideUpItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ─── Building Layout Types ──────────────────────────────────────────────

interface SubGroup {
  name: string;
  items: { id: string; label: string; icon: string }[] | any;
}

interface BuildingTier {
  id: string;
  num: string; // e.g. "Dept 12", "Dept 07"
  name: string;
  locationTag: string; // Transferred to Content Area Viewport Header
  accessLevel: string;
  badgeColor: string;
  icon: string;
  summary: string;
  scope: string[];
  subGroups?: { name?: string; id?: string; label?: string; icon?: string; items?: { id: string; label: string; icon: string }[] }[];
  items?: { id: string; label: string; icon: string }[];
}

// ─── Complete Master Registry of All 26 AI Assistants ───

const ALL_AI_ASSISTANTS = [
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
  { id: 'henry', num: '3.19', name: 'Henry AI', role: 'Records, Title Deeds & Audit Logs', icon: '🗂️' },
  { id: 'sentinel', num: '3.20', name: 'Sentinel AI', role: 'Property State Machine & Quality', icon: '🏢' },
  { id: 'hunter', num: '3.21', name: 'Hunter AI', role: 'Outbound Prospecting & Lead Matcher', icon: '🎯' },
  { id: 'cipher', num: '3.22', name: 'Cipher AI', role: 'Market Pricing & CMA Valuations', icon: '📊' },
  { id: 'vesta', num: '3.23', name: 'Vesta AI', role: 'Snagging, Move-In & Handover', icon: '🔑' },
  { id: 'juno', num: '3.24', name: 'Juno AI', role: 'Community Operations & Facilities', icon: '🏘️' },
  { id: 'kairos', num: '3.25', name: 'Kairos AI', role: 'Luxury HNWI Wealth Advisory', icon: '💎' },
  { id: 'maven', num: '3.26', name: 'Maven AI', role: 'Investment Portfolio & Feasibility', icon: '📌' },
];

// ─── MD Suite (Tile 1) Data Object ───
const MD_SUITE_DEPT: BuildingTier = {
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

// ─── Official 12 Corporate Departments Registry (Strictly Dept 12 Down to Dept 01) ───

const TWELVE_CORPORATE_DEPARTMENTS: BuildingTier[] = [
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
      { id: 'buyer-portal', label: '10.2 Remote Buyer Verification', icon: '📱' },
    ],
  },
  {
    id: 'dept-09',
    num: 'Dept 09',
    name: 'Security & Risk Audit Department',
    locationTag: 'Floor 9: Security Command',
    accessLevel: 'Level 5 (Vetted Oversight Access)',
    badgeColor: '#64748B',
    icon: '🛡️',
    summary: 'Protects physical and digital company assets through 5-year tamper-evident audit logging, risk auditing, and corporate professional indemnity claims protection.',
    scope: ['Internal Tower Security & CCTV Control', 'Comprehensive Security Audit Trail Monitoring', 'Risk Management & Claims Protection'],
    items: [
      { id: 'cipher', label: '9.1 Security Audit Trail Log', icon: '🧾' },
      { id: 'cctv-risk', label: '9.2 Tower Risk & Claims Protection', icon: '⚖️' },
    ],
  },
  {
    id: 'dept-08',
    num: 'Dept 08',
    name: 'Corporate Finance & Escrow Accounting Department',
    locationTag: 'Floor 8: Finance & Escrow',
    accessLevel: 'Level 4 (Protected Operational Access)',
    badgeColor: '#10B981',
    icon: '💰',
    summary: 'Secures all corporate financial metrics, UAE VAT 5% FTA compliance, broker commission ledgers, and escrow trust account tracking.',
    scope: ['Broker Commission Ledger Tracking & Payouts', 'UAE VAT 5% Compliance & Corporate Cash Flow', 'Escrow & Trust Account Tracking', 'Company Profitability & Budget Forecasting'],
    items: [
      { id: 'theodora', label: '8.1 UAE VAT 5% & Cash Flow Forecast', icon: '💵' },
      { id: 'henry', label: '8.2 Broker Commission Ledger', icon: '📊' },
    ],
  },
  {
    id: 'dept-07',
    num: 'Dept 07',
    name: 'Property Inventory & Asset Valuation Department',
    locationTag: 'Floor 7 // Central Operations Core',
    accessLevel: 'Level 4 (Protected Operational Access)',
    badgeColor: '#F59E0B',
    icon: '🏠',
    summary: 'The master technical registry controlling all physical properties listed under White Caves Real Estate LLC. Serves as the central repository for asset tracking, pricing verification, and portfolio audits.',
    scope: ['Bridging frontline transactional brokers on Floor 6 with background legal compliance units on Floor 4.', 'Unified Search Desk & Geographic Matrix Control Panel (DAMAC Hills 2 Default)', 'Progressive 3-Stage Asset Profile & Protected Owner Metadata Retrieval'],
    subGroups: [
      {
        name: '🏡 Inventory Control Center',
        items: [
          { id: 'mary', label: '7.1 Master Inventory Control Center', icon: '🏡' },
        ],
      },
      {
        name: '📐 Lifecycle & Quality Control',
        items: [
          { id: 'evangeline', label: '7.2 Inventory Lifecycle & Quality Control', icon: '📜' },
        ],
      },
      {
        name: '📊 Status Synchronization Systems',
        items: [
          { id: 'sophia', label: '7.3 Status Synchronization Systems', icon: '🟡' },
        ],
      },
    ],
  },
  {
    id: 'dept-06',
    num: 'Dept 06',
    name: 'Sales & Revenue Department',
    locationTag: 'Floor 6: Sales & Revenue',
    accessLevel: 'Level 3 (Core Transactional Access)',
    badgeColor: '#EF4444',
    icon: '🤝',
    summary: 'The primary transaction and revenue-generating engine handling the company’s dual DED trade license activities (Leasing Properties & Capital Market Property Trading).',
    scope: ['Tenants & Ejari Handover Processing', 'Landlords & Property Management Services', 'Leasing Agents & Commission Closing Metrics', 'Buying & Selling Capital Markets Divisions'],
    subGroups: [
      {
        name: '👤 Tenants (Leasing Division)',
        items: [
          { id: 'clara', label: '6.1 Tenant Placement & Viewings', icon: '👤' },
          { id: 'vesta', label: '6.2 Tenant Onboarding & Ejari Handover', icon: '🏢' },
          { id: 'juno', label: '6.3 Tenant Relations & Support', icon: '💬' },
        ],
      },
      {
        name: '🏰 Landlords (Leasing Division)',
        items: [
          { id: 'mary', label: '6.4 Landlord Acquisition & Mandates', icon: '🏰' },
          { id: 'mary', label: '6.5 Property Management Services', icon: '🏠' },
          { id: 'daisy', label: '6.6 Lease Contracts & PDC Tracking', icon: '📜' },
        ],
      },
      {
        name: '👔 Leasing Agents (Leasing Division)',
        items: [
          { id: 'nancy', label: '6.7 Agent Workflow & Closing Metrics', icon: '👔' },
          { id: 'henry', label: '6.8 Commission Tracking & Deal Logs', icon: '📊' },
          { id: 'laila', label: '6.9 RERA Compliance & Broker Cards', icon: '⚖️' },
        ],
      },
      {
        name: '🏠 Properties (Leasing Division)',
        items: [
          { id: 'sentinel', label: '6.10 Available for Leasing Catalog', icon: '🔎' },
          { id: 'mary', label: '6.11 Leased by Us Portfolio Ledger', icon: '📋' },
          { id: 'juno', label: '6.12 Value-Add Ancillary & Move-Out', icon: '✨' },
        ],
      },
      {
        name: '🛒 Buying Properties (Capital Markets)',
        items: [
          { id: 'clara', label: '6.13 Buyer Advisory Services & Matching', icon: '🎯' },
          { id: 'operations', label: '6.14 Property Sourcing & Viewings Desk', icon: '📅' },
          { id: 'sophia', label: '6.15 Offer Drafting & Negotiation', icon: '📈' },
          { id: 'atlas', label: '6.16 Investor Portfolio Acquisition Desk', icon: '🏛️' },
        ],
      },
      {
        name: '🏷️ Selling Properties (Resale Division)',
        items: [
          { id: 'mary', label: '6.17 Owner Listing Onboarding (Form A)', icon: '📝' },
          { id: 'sentinel', label: '6.18 Market Price Appraisals & CMA Analysis', icon: '🔎' },
          { id: 'olivia', label: '6.19 Resale Marketing Execution & Portals', icon: '📣' },
        ],
      },
    ],
  },
  {
    id: 'dept-05',
    num: 'Dept 05',
    name: 'Technology & API Systems Department',
    locationTag: 'Floor 5: Tech Infrastructure',
    accessLevel: 'Level 3 (Core Transactional Access)',
    badgeColor: '#06B6D4',
    icon: '⚙️',
    summary: 'Maintains secure data servers, firewalls, API integrations, and continuous cloud pipeline connectivity.',
    scope: ['CTO Systems & API Monitoring Dashboard', 'Backend Server Logs & Webhooks', 'Corporate CRM Administration'],
    items: [
      { id: 'aurora', label: '5.1 CTO Systems & API Monitor', icon: '⚙️' },
      { id: 'willow', label: '5.2 Backend Server Status & Webhooks', icon: '💻' },
    ],
  },
  {
    id: 'dept-04',
    num: 'Dept 04',
    name: 'Contracts, Conveyancing & DLD Legal Department',
    locationTag: 'Floor 4: Legal & Conveyancing',
    accessLevel: 'Level 2 (Inbound Support Access)',
    badgeColor: '#8B5CF6',
    icon: '⚖️',
    summary: 'Processes RERA compliance documentation, title deed verifications, and Dubai Land Department transfer contracts (Forms A, B, F).',
    scope: ['RERA 2024 Legal Audit Protocols', 'Title Deed & Legal Compliance Checks', 'RERA Unified Contracts (Forms A, B, F)', 'Trakheesi Permits & DLD Transfers'],
    items: [
      { id: 'laila', label: '4.1 RERA 2024 Legal Audit Protocols', icon: '📜' },
      { id: 'evangeline', label: '4.2 Title Deed & DLD Forms A/B/F', icon: '🛡️' },
    ],
  },
  {
    id: 'dept-03',
    num: 'Dept 03',
    name: 'Growth Marketing & Communications Department',
    locationTag: 'Floor 3: Marketing & Media',
    accessLevel: 'Level 2 (Inbound Support Access)',
    badgeColor: '#EC4899',
    icon: '📣',
    summary: 'Drives digital consumer outreach, portal dominance (Property Finder, Bayut), and media production.',
    scope: ['Performance Marketing & Ad Operations', 'Portal Dominance & Listing Syndication', 'In-House Media Production & Reels'],
    items: [
      { id: 'olivia', label: '3.1 Portal Dominance & Ad Operations', icon: '📣' },
    ],
  },
  {
    id: 'dept-02',
    num: 'Dept 02',
    name: 'Human Resources & Agent Performance Department',
    locationTag: 'Floor 2: HR & Academy',
    accessLevel: 'Level 1 (Public Intake & Screening Access)',
    badgeColor: '#F59E0B',
    icon: '👥',
    summary: 'Manages talent sourcing, applicant screening, RERA licensing training, and agent leaderboard tracking.',
    scope: ['Talent Acquisition & Headhunting Interviews', 'RERA Training Academy & Onboarding', 'Agent Leaderboard & HR Staffing Analytics'],
    items: [
      { id: 'nancy', label: '2.1 Talent Acquisition & Leaderboards', icon: '👥' },
    ],
  },
  {
    id: 'dept-01',
    num: 'Dept 01',
    name: 'Operations, Communications & Maintenance Department',
    locationTag: 'Floor 1: Operations Control',
    accessLevel: 'Level 1 (Public Intake & Screening Access)',
    badgeColor: '#64748B',
    icon: '🔧',
    summary: 'Manages logistical ticketing, physical office facility requests, WhatsApp CRM routing, and maintenance work orders.',
    scope: ['Lead Intake Processing & Pipeline Automation', 'WhatsApp CRM Messaging Control Room', 'Tower Facilities & Maintenance Tickets'],
    items: [
      { id: 'nadia', label: '1.1 WhatsApp CRM Messaging Control', icon: '💬' },
      { id: 'juno', label: '1.2 Tower Facilities & Maintenance Tickets', icon: '🔧' },
    ],
  },
  {
    id: 'dept-ground',
    num: 'Ground',
    name: 'Customer Happiness & Experience Center',
    locationTag: 'Ground Floor: Reception Center',
    accessLevel: 'Level 1 (Public Intake & Screening Access)',
    badgeColor: '#10B981',
    icon: '🛋️',
    summary: 'Completely open public intake tier capturing consumer walk-ins, visitor arrivals, and VR project displays.',
    scope: ['Grand Reception & Client Hospitality', 'Reputation Management & Trustpilot', 'Touch-Screen Interactive Project Displays'],
    items: [
      { id: 'reception', label: 'G.1 Grand Reception & Visitor Intake', icon: '☕' },
      { id: 'reviews', label: 'G.2 Reputation Management & Trustpilot', icon: '⭐' },
    ],
  },
];

// ─── Styled Components ──────────────────────────────────────────────────

const HubContainer = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const LiveCorporateTicker = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 14px;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  color: #F8FAFC;
  font-size: 0.85rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  strong {
    color: #D4AF37;
    font-weight: 800;
  }

  span {
    color: #38BDF8;
    font-weight: 700;
  }
`;

const DashboardLayout = styled.div<{ $collapsed?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $collapsed }) => ($collapsed ? '85px 1fr' : '340px 1fr')};
  gap: 1.5rem;
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SidebarContainer = styled.aside<{ $collapsed?: boolean }>`
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 16px;
  padding: ${({ $collapsed }) => ($collapsed ? '1rem 0.5rem' : '1.25rem')};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  height: fit-content;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  transition: all 0.3s ease;
`;

const SidebarHeader = styled.div<{ $collapsed?: boolean }>`
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: #F8FAFC;
  }

  p {
    margin: 2px 0 0;
    font-size: 0.78rem;
    color: #94A3B8;
  }
`;

const CollapseToggleButton = styled.button`
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #38BDF8;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.82rem;
  transition: all 0.2s ease;

  &:hover {
    background: #06B6D4;
    color: #FFFFFF;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

// Top-Level Accordion Tile Button
const TopLevelTileButton = styled.button<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  background: ${({ $open }) => ($open ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'rgba(30, 41, 59, 0.6)')};
  border: 1.5px solid ${({ $open }) => ($open ? '#06B6D4' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  color: ${({ $open }) => ($open ? '#38BDF8' : '#F8FAFC')};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $open }) => ($open ? '0 4px 16px rgba(6, 182, 212, 0.2)' : 'none')};

  &:hover {
    border-color: #06B6D4;
    color: #38BDF8;
  }

  span.arrow {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
    font-size: 0.8rem;
    color: #EF4444;
  }
`;

const DeptAccordion = styled.div`
  margin-bottom: 0.35rem;
`;

const DeptHeader = styled.button<{ $active?: boolean; $open?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
  width: 100%;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0' : '9px 12px')};
  background: ${({ $active, $open }) =>
    $active
      ? 'rgba(239, 68, 68, 0.12)'
      : $open
      ? 'rgba(239, 68, 68, 0.05)'
      : 'transparent'};
  border: 1px solid ${({ $active, $open }) => ($active || $open ? 'rgba(239, 68, 68, 0.3)' : 'transparent')};
  font-size: 0.84rem;
  font-weight: 800;
  color: ${({ $active }) => ($active ? '#EF4444' : '#1E293B')};
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #F1F5F9;
    color: #EF4444;
  }

  div.left {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }

  span.num-tag {
    color: #EF4444;
    font-weight: 800;
    font-size: 0.78rem;
    min-width: 46px;
  }

  span.arrow {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
    font-size: 0.75rem;
    color: #64748B;
  }
`;

const SubGroupHeader = styled.button<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 10px;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 6px;
  margin-top: 2px;
  transition: background 0.15s;

  &:hover {
    background: #F1F5F9;
    color: #EF4444;
  }

  span.arrow {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
    font-size: 0.7rem;
    color: #64748B;
  }
`;

const SubItemList = styled.div<{ $open?: boolean }>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 3px;
  padding-left: 0.75rem;
  margin-top: 2px;
`;

const NestedItemList = styled.div<{ $open?: boolean }>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 2px;
  padding-left: 1rem;
  margin-top: 2px;
`;

const SidebarSubItem = styled.button<{ $active?: boolean; $isAi?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 0.65rem;
  width: 100%;
  padding: ${({ $collapsed }) => ($collapsed ? '8px 0' : '7px 9px')};
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  background: ${({ $active, $isAi }) =>
    $active
      ? $isAi
        ? 'rgba(139, 92, 246, 0.12)'
        : 'rgba(239, 68, 68, 0.1)'
      : 'transparent'};
  color: ${({ $active, $isAi }) =>
    $active
      ? $isAi
        ? '#8B5CF6'
        : '#EF4444'
      : '#475569'};
  border-left: ${({ $collapsed }) => ($collapsed ? 'none' : '3px solid')};
  border-left-color: ${({ $active, $isAi }) =>
    $active ? ($isAi ? '#8B5CF6' : '#EF4444') : 'transparent'};

  &:hover {
    background: ${({ $isAi }) =>
      $isAi ? 'rgba(139, 92, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
    color: ${({ $isAi }) => ($isAi ? '#8B5CF6' : '#EF4444')};
  }
`;

const HubHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
  padding-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const HubTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #EF4444;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
`;

const HubSubtitle = styled.p`
  color: #64748B;
  font-size: 0.95rem;
  margin: 0;
`;

const ContentArea = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.08);
  min-height: 550px;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
  background: #F8FAFC;
`;

// ─── Executive Dashboard Component ──────────────────────────────────────

export const CRMHubPage: FC = () => {
  const { user } = useCRMHubData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Top-Level 3 Accordion Tiles State: 'md_office' | 'corporate' | 'ai_command'
  const [openTopTile, setOpenTopTile] = useState<'md_office' | 'corporate' | 'ai_command' | null>('corporate');

  // Active module state (default 'dept_summary')
  const [activeTab, setActiveTab] = useState<string>(
    searchParams.get('tab') || 'dept_summary'
  );

  // Searchable Department Dropdown State inside Tile 2
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-07');
  const [deptSearchQuery, setDeptSearchQuery] = useState<string>('');
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState<boolean>(false);

  // Searchable AI Assistant Dropdown State inside Tile 3
  const [selectedAiId, setSelectedAiId] = useState<string>('nadia');
  const [aiSearchQuery, setAiSearchQuery] = useState<string>('');
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState<boolean>(false);

  // Selected Corporate Department Node state
  const selectedDept = useMemo(() => {
    return TWELVE_CORPORATE_DEPARTMENTS.find(d => d.id === selectedDeptId) || TWELVE_CORPORATE_DEPARTMENTS[5];
  }, [selectedDeptId]);

  // Selected AI Assistant Object
  const selectedAi = useMemo(() => {
    return ALL_AI_ASSISTANTS.find(a => a.id === selectedAiId) || ALL_AI_ASSISTANTS[0];
  }, [selectedAiId]);

  // Filtered Departments based on search query
  const deferredDeptQuery = useDeferredValue(deptSearchQuery);
  const filteredDepartments = useMemo(() => {
    return TWELVE_CORPORATE_DEPARTMENTS.filter(d =>
      `${d.num} ${d.name}`.toLowerCase().includes(deferredDeptQuery.toLowerCase())
    );
  }, [deferredDeptQuery]);

  // Filtered AI Assistants based on search query
  const deferredAiQuery = useDeferredValue(aiSearchQuery);
  const filteredAiAssistants = useMemo(() => {
    return ALL_AI_ASSISTANTS.filter(a =>
      `${a.num} ${a.name} ${a.role}`.toLowerCase().includes(deferredAiQuery.toLowerCase())
    );
  }, [deferredAiQuery]);

  // Sidebar Collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const haptics = useHaptics();

  // Sub-Activity Groups Accordion State
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({
    'dept-07-🏡 Inventory Control Center': true,
  });

  // TILE 1 CLICK: Managing Director Office
  const handleMdTileClick = () => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'md_office' ? null : 'md_office'));
    setActiveTab('dept_summary');
  };

  // TILE 2 CLICK: 12 Corporate Departments
  const handleCorporateTileClick = () => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'corporate' ? null : 'corporate'));
    setActiveTab('dept_summary');
  };

  // TILE 3 CLICK: AI Command Center
  const handleAiTileClick = () => {
    haptics.light();
    setOpenTopTile(prev => (prev === 'ai_command' ? null : 'ai_command'));
    setActiveTab(selectedAiId);
  };

  // Sub-item click handler
  const handleSubItemClick = (itemId: string) => {
    haptics.medium();
    setActiveTab(itemId);
  };

  const toggleSubGroup = (key: string) => {
    haptics.light();
    setOpenSubGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Bidirectional sync between URL search param and activeTab
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
      if (urlTab === 'henry') {
        setSelectedAiId('henry');
        setOpenTopTile('ai_command');
      }
    }
  }, [searchParams, activeTab]);

  // Sync state to URL params when activeTab changes
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab !== activeTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, searchParams, setSearchParams]);

  const renderActiveContent = () => {
    if (activeTab === 'dept_summary') {
      const activeDeptObj = openTopTile === 'md_office' ? MD_SUITE_DEPT : selectedDept;
      return (
        <ContentArea
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {/* Content Viewport Header with Decoupled Location Badge & Department Number */}
          <motion.div variants={slideUpItem}>
          <ContentHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.6rem' }}>{activeDeptObj.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>
                  <span style={{ color: '#EF4444', marginRight: '6px' }}>{activeDeptObj.num}</span>
                  {activeDeptObj.name}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                  White Caves Corporate ERP Architecture Protocol
                </span>
              </div>
            </div>
            {/* LOCATION INDICATOR GRAPHIC (DECOUPLED FROM SIDEBAR) */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                📍 {activeDeptObj.locationTag}
              </span>
              <Badge variant="info" size="small">
                {activeDeptObj.accessLevel}
              </Badge>
            </div>
          </ContentHeader>
          </motion.div>

          {/* Department Executive Hydration Body */}
          <div style={{ padding: '1.75rem' }}>
            {/* Executive Summary Card */}
            <motion.div variants={slideUpItem}>
            <div
              style={{
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '14px',
                padding: '1.5rem',
                marginBottom: '1.75rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#EF4444' }}>
                📋 {activeDeptObj.num} Executive Summary
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                {activeDeptObj.summary}
              </p>
            </div>
            </motion.div>

            {/* Mission Operational Scope */}
            <motion.div variants={slideUpItem} style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                🎯 Mission Operational Scope
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {activeDeptObj.scope.map((item, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    key={index}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569', lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Operational Sub-Nodes Launcher */}
            <motion.div variants={slideUpItem}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                ⚡ Operational Sub-Nodes Launchpad
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {activeDeptObj.subGroups
                  ? activeDeptObj.subGroups
                      .flatMap(sg => sg.items)
                      .filter((item): item is { id: string; label: string; icon: string } => Boolean(item))
                      .map((item) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={item.id + item.label}
                        onClick={() => handleSubItemClick(item.id)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '10px',
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)',
                        }}
                      >
                        <span>{item.icon}</span> Launch {item.label} ➔
                      </motion.button>
                    ))
                  : activeDeptObj.items?.map(item => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={item.id + item.label}
                        onClick={() => handleSubItemClick(item.id)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '10px',
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)',
                        }}
                      >
                        <span>{item.icon}</span> Launch {item.label} ➔
                      </motion.button>
                    ))}
              </div>
            </motion.div>
          </div>
        </ContentArea>
      );
    }

    const moduleDef = CRM_MODULE_REGISTRY[activeTab];
    if (moduleDef) {
      const ModuleComponent = moduleDef.Component;
      return (
        <ContentArea>
          <ContentHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{moduleDef.icon}</span>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1E293B', display: 'block' }}>{moduleDef.label}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{moduleDef.description}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setActiveTab('dept_summary')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                📋 Executive Summary
              </button>
              <Badge variant={moduleDef.zone === 'ai_command' ? 'info' : 'success'} size="small">
                {moduleDef.zone === 'ai_command' ? 'AI Assistant Active' : 'Production Data View'}
              </Badge>
            </div>
          </ContentHeader>
          <div style={{ padding: '1rem' }}>
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader width="100%" height="400px" borderRadius="16px" />}>
                <ModuleComponent role="owner" user={user} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </ContentArea>
      );
    }

    return null;
  };

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);

  const activeLocationTag = useMemo(() => {
    if (openTopTile === 'md_office') return MD_SUITE_DEPT.locationTag;
    if (openTopTile === 'corporate') return selectedDept.locationTag;
    return `Floor 3 // AI Command Core (${selectedAi.name})`;
  }, [openTopTile, selectedDept, selectedAi]);

  return (
    <PublicLayout hideFooter>
      <HubContainer>
        {/* COLLAPSIBLE TOP GLOBAL SYSTEM HEADER BANNER */}
        {!isHeaderCollapsed ? (
          <div
            className="unified-global-system-header"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              padding: '0.85rem 1.25rem',
              borderRadius: '14px',
              marginBottom: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src="/company-logo.jpg"
                alt="White Caves"
                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    White Caves Real Estate LLC — ERP Command Core
                  </h1>
                  <span
                    style={{
                      background: 'rgba(6, 182, 212, 0.2)',
                      color: '#38BDF8',
                      border: '1px solid #06B6D4',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {openTopTile === 'md_office'
                      ? '👑 MD Sovereign Suite'
                      : openTopTile === 'corporate'
                      ? `🏛️ ${selectedDept.num}: ${selectedDept.name}`
                      : `🤖 ${selectedAi.num}: ${selectedAi.name}`}
                  </span>
                </div>

                <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                  Active Meta-Tag: <strong style={{ color: '#F59E0B' }}>{activeLocationTag}</strong> · MD: Arslan Malik
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                👤 Executive Profile
              </button>
              <button
                onClick={() => setIsHeaderCollapsed(true)}
                title="Collapse Top Header Bar"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ▲ Hide Header
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button
              onClick={() => setIsHeaderCollapsed(false)}
              title="Expand Top Header Bar"
              style={{
                background: '#0F172A',
                color: '#38BDF8',
                border: '1px solid #06B6D4',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ▼ Show Header
            </button>
          </div>
        )}

        {/* Live Executive Ticker & Market Indicators */}
        <LiveCorporateTicker>
          <TickerItem>
            💵 <strong>USD / AED:</strong> <span>3.6725 (Fixed)</span>
          </TickerItem>
          <TickerItem>
            🏙️ <strong>DLD Daily Volume:</strong> <span>AED 1.48 Billion</span>
          </TickerItem>
          <TickerItem>
            🎯 <strong>Active Pipeline Deals:</strong> <span>142 Active</span>
          </TickerItem>
          <TickerItem>
            ⚡ <strong>SLA Compliance Score:</strong> <span>99.6% (Grade A+)</span>
          </TickerItem>
          <TickerItem>
            🤖 <strong>AI Agents Active:</strong> <span>26 / 26 Operational</span>
          </TickerItem>
        </LiveCorporateTicker>

        {/* Workspace Layout */}
        <DashboardLayout $collapsed={isSidebarCollapsed}>
          <SidebarContainer $collapsed={isSidebarCollapsed}>
            {/* RESTORED SIDEBAR HEADER WITH COLLAPSE TOGGLE */}
            <SidebarHeader $collapsed={isSidebarCollapsed}>
              {!isSidebarCollapsed && (
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>Executive Directory</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>3 Main Structural Tiles</p>
                </div>
              )}
              <CollapseToggleButton
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? '▶' : '◀ Collapse'}
              </CollapseToggleButton>
            </SidebarHeader>

            <SidebarNav>
              {/* TOP TILE 1: MANAGING DIRECTOR OFFICE (MD SOVEREIGN SUITE) */}
              <TopLevelTileButton
                $open={openTopTile === 'md_office'}
                onClick={handleMdTileClick}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👑</span>
                  {!isSidebarCollapsed && <span>1. Managing Director Office</span>}
                </div>
                {!isSidebarCollapsed && <span className="arrow">▶</span>}
              </TopLevelTileButton>

              {/* MD SUITE SUB-ITEMS */}
              {openTopTile === 'md_office' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: isSidebarCollapsed ? '0' : '0.5rem' }}>
                  {MD_SUITE_DEPT.items?.map(item => (
                    <SidebarSubItem
                      key={item.id + item.label}
                      $active={activeTab === item.id}
                      onClick={() => handleSubItemClick(item.id)}
                    >
                      <span>{item.icon}</span> {item.label}
                    </SidebarSubItem>
                  ))}
                </div>
              )}

              {/* TOP TILE 2: 12 CORPORATE DEPARTMENTS (WITH SEARCHABLE DROPDOWN SELECTOR) */}
              <TopLevelTileButton
                $open={openTopTile === 'corporate'}
                onClick={handleCorporateTileClick}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏛️</span>
                  {!isSidebarCollapsed && <span>2. 12 Corporate Departments</span>}
                </div>
                {!isSidebarCollapsed && <span className="arrow">▶</span>}
              </TopLevelTileButton>

              {/* SEARCHABLE DEPARTMENT DROPDOWN SELECTOR & SUB-ITEMS */}
              {openTopTile === 'corporate' && !isSidebarCollapsed && (
                <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Searchable Dropdown Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setIsDeptDropdownOpen(prev => !prev)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #EF4444',
                        background: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: '#1E293B',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        <strong style={{ color: '#EF4444', marginRight: '6px' }}>{selectedDept.num}</strong>
                        {selectedDept.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#EF4444', marginLeft: '4px' }}>
                        {isDeptDropdownOpen ? '▲' : '▼ Select'}
                      </span>
                    </button>

                    {/* Dropdown Search Menu */}
                    {isDeptDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '10px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                          zIndex: 100,
                          padding: '8px',
                          maxHeight: '260px',
                          overflowY: 'auto',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="🔍 Search Dept (e.g., Sales, Inventory)..."
                          value={deptSearchQuery}
                          onChange={e => setDeptSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.8rem',
                            marginBottom: '6px',
                            outline: 'none',
                          }}
                        />

                        {filteredDepartments.map(dept => (
                          <div
                            key={dept.id}
                            onClick={() => {
                              setSelectedDeptId(dept.id);
                              setActiveTab('dept_summary');
                              setIsDeptDropdownOpen(false);
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: selectedDeptId === dept.id ? 800 : 600,
                              background: selectedDeptId === dept.id ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                              color: selectedDeptId === dept.id ? '#EF4444' : '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '2px',
                            }}
                          >
                            <span style={{ fontWeight: 800, color: '#EF4444', minWidth: '46px' }}>{dept.num}</span>
                            <span>{dept.icon} {dept.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* UNCOLLAPSE ONLY THE SUB-ITEMS OF THE CURRENTLY SELECTED DEPARTMENT */}
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <DeptHeader
                      $active={activeTab === 'dept_summary'}
                      onClick={() => setActiveTab('dept_summary')}
                    >
                      <div className="left">
                        <span className="num-tag">{selectedDept.num}</span>
                        <span>{selectedDept.icon}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Executive Overview</span>
                      </div>
                    </DeptHeader>

                    {selectedDept.subGroups ? (
                      selectedDept.subGroups.map((sg) => {
                        const sgName = sg.name || sg.label || 'Section';
                        const sgKey = `${selectedDept.id}-${sgName}`;
                        const isSgOpen = !!openSubGroups[sgKey];
                        return (
                          <div key={sgKey}>
                            <SubGroupHeader
                              $open={isSgOpen}
                              onClick={() => toggleSubGroup(sgKey)}
                            >
                              <span>{sgName}</span>
                              <span className="arrow">▶</span>
                            </SubGroupHeader>
                            <NestedItemList $open={isSgOpen}>
                              {(sg.items || []).map((item) => (
                                <SidebarSubItem
                                  key={item.id + item.label}
                                  $active={activeTab === item.id}
                                  onClick={() => handleSubItemClick(item.id)}
                                >
                                  <span>{item.icon}</span> {item.label}
                                </SidebarSubItem>
                              ))}
                            </NestedItemList>
                          </div>
                        );
                      })
                    ) : (
                      selectedDept.items?.map(item => (
                        <SidebarSubItem
                          key={item.id + item.label}
                          $active={activeTab === item.id}
                          onClick={() => handleSubItemClick(item.id)}
                        >
                          <span>{item.icon}</span> {item.label}
                        </SidebarSubItem>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TOP TILE 3: AI COMMAND CENTER (26 EXECUTIVE AI ASSISTANTS WITH SEARCHABLE DROPDOWN) */}
              <TopLevelTileButton
                $open={openTopTile === 'ai_command'}
                onClick={handleAiTileClick}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🤖</span>
                  {!isSidebarCollapsed && <span>3. AI Command Center (26 AI)</span>}
                </div>
                {!isSidebarCollapsed && <span className="arrow">▶</span>}
              </TopLevelTileButton>

              {/* SEARCHABLE AI ASSISTANT DROPDOWN SELECTOR & UNCOLLAPSED ITEM */}
              {openTopTile === 'ai_command' && !isSidebarCollapsed && (
                <div style={{ paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Searchable AI Dropdown Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setIsAiDropdownOpen(prev => !prev)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #8B5CF6',
                        background: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: '#1E293B',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(139, 92, 246, 0.08)',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        <strong style={{ color: '#8B5CF6', marginRight: '6px' }}>{selectedAi.num}</strong>
                        {selectedAi.icon} {selectedAi.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#8B5CF6', marginLeft: '4px' }}>
                        {isAiDropdownOpen ? '▲' : '▼ Select AI'}
                      </span>
                    </button>

                    {/* AI Assistant Search Dropdown Menu */}
                    {isAiDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '10px',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                          zIndex: 100,
                          padding: '8px',
                          maxHeight: '260px',
                          overflowY: 'auto',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="🔍 Search AI (e.g. Nadia, Sophia, Zoe, Cassie)..."
                          value={aiSearchQuery}
                          onChange={e => setAiSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.8rem',
                            marginBottom: '6px',
                            outline: 'none',
                          }}
                        />

                        {filteredAiAssistants.map(ai => (
                          <div
                            key={ai.id}
                            onClick={() => {
                              setSelectedAiId(ai.id);
                              setActiveTab(ai.id);
                              setIsAiDropdownOpen(false);
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: selectedAiId === ai.id ? 800 : 600,
                              background: selectedAiId === ai.id ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                              color: selectedAiId === ai.id ? '#8B5CF6' : '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              marginBottom: '2px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 800, color: '#8B5CF6', minWidth: '32px' }}>{ai.num}</span>
                              <span>{ai.icon} <strong>{ai.name}</strong></span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', paddingLeft: '38px' }}>{ai.role}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* UNCOLLAPSE ONLY THE CURRENTLY SELECTED AI ASSISTANT */}
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <SidebarSubItem
                      $isAi
                      $collapsed={isSidebarCollapsed}
                      $active={activeTab === selectedAi.id}
                      onClick={() => handleSubItemClick(selectedAi.id)}
                      title={`${selectedAi.num} ${selectedAi.name} (${selectedAi.role})`}
                    >
                      <span>{selectedAi.icon}</span>
                      {!isSidebarCollapsed && (
                        <span>
                          <strong>{selectedAi.num} {selectedAi.name}</strong> — {selectedAi.role}
                        </span>
                      )}
                    </SidebarSubItem>
                  </div>
                </div>
              )}
            </SidebarNav>
          </SidebarContainer>

          {/* Main View Panel */}
          <div>{renderActiveContent()}</div>
        </DashboardLayout>
      </HubContainer>
    </PublicLayout>
  );
};

export default CRMHubPage;
