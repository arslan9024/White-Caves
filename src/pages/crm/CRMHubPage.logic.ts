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
  {
    id: 'nadia',
    num: '3.1',
    name: 'Nadia AI',
    role: 'WhatsApp CRM & Campaigns',
    icon: '💬',
    items: [
      { id: 'nadia-broadcast', label: '3.1.1 Broadcast Campaign Dispatcher', icon: '📢', badge: 'Outbound' },
      { id: 'nadia-templates', label: '3.1.2 WhatsApp Template Studio', icon: '📝', badge: 'Meta Verified' },
      { id: 'nadia-sla-routing', label: '3.1.3 SLA Lead Routing & Escalation', icon: '⏱️', badge: '15-Min SLA' },
      { id: 'nadia-telemetry', label: '3.1.4 Delivery & Read Telemetry', icon: '📊', badge: 'Real-Time' },
    ],
  },
  {
    id: 'nina',
    num: '3.2',
    name: 'Nina AI',
    role: 'WhatsApp Bot & Automations',
    icon: '🤖',
    items: [
      { id: 'nina-flow-designer', label: '3.2.1 Conversation Flow Designer', icon: '🤖', badge: 'NLP State' },
      { id: 'nina-intent-sim', label: '3.2.2 Intent Classifier Simulator', icon: '🎯', badge: 'AI Intent' },
      { id: 'nina-lead-qualifier', label: '3.2.3 Automated Lead Qualifier', icon: '🏷️', badge: 'Auto-Tag' },
      { id: 'nina-agent-handoff', label: '3.2.4 Human Agent Handoff Queue', icon: '👥', badge: 'Live Escalation' },
    ],
  },
  {
    id: 'sophia',
    num: '3.3',
    name: 'Sophia AI',
    role: 'Sales CRM & Deals Intelligence',
    icon: '📈',
    items: [
      { id: 'sophia-deals-kanban', label: '3.3.1 Interactive Deals Kanban', icon: '📈', badge: 'Pipeline' },
      { id: 'sophia-commission-calc', label: '3.3.2 Commission Split Calculator', icon: '💵', badge: 'Split Engine' },
      { id: 'sophia-revenue-velocity', label: '3.3.3 Deal Velocity & Forecasting', icon: '⚡', badge: 'Forecast' },
      { id: 'sophia-deal-risk', label: '3.3.4 Deal Risk & Clawback Shield', icon: '🛡️', badge: 'Risk Gating' },
    ],
  },
  {
    id: 'zoe',
    num: '3.4',
    name: 'Zoe AI',
    role: 'Executive CRM & Operations SLA',
    icon: '👑',
    items: [
      { id: 'zoe-vision-deck', label: '3.4.1 MD Corporate Vision Deck', icon: '👑', badge: 'Founder Deck' },
      { id: 'zoe-sla-matrix', label: '3.4.2 12-Department SLA Matrix', icon: '🏛️', badge: 'Operations' },
      { id: 'zoe-wip-monitor', label: '3.4.3 Cross-Team WIP Monitor', icon: '📊', badge: 'Workload' },
      { id: 'zoe-sovereign-override', label: '3.4.4 Sovereign Override Desk', icon: '⚡', badge: 'Level 5 Master' },
      { id: 'zoe-business-docs', label: '3.4.5 Hyper-Linked Business Docs Hub (DET 1388443)', icon: '📜', badge: 'DET & RERA' },
    ],
  },
  {
    id: 'evangeline',
    num: '3.5',
    name: 'Evangeline AI',
    role: 'Legal & Contract Intelligence',
    icon: '⚖️',
    items: [
      { id: 'evangeline-contracts', label: '3.5.1 Form A/B/F Clause Assembler', icon: '⚖️', badge: 'DLD Unified' },
      { id: 'evangeline-poa-validator', label: '3.5.2 POA Document Validator', icon: '📜', badge: 'Notary Validated' },
      { id: 'evangeline-nda-studio', label: '3.5.3 NDA & Confidentiality Studio', icon: '🔒', badge: 'VIP Legal' },
      { id: 'evangeline-disputes', label: '3.5.4 Legal Dispute & Notice Manager', icon: '📑', badge: 'Form 12' },
    ],
  },
  {
    id: 'lead-scoring',
    num: '3.6',
    name: 'Cassie AI',
    role: 'Predictive Lead Scoring Engine',
    icon: '📊',
    items: [
      { id: 'cassie-100pt-scorer', label: '3.6.1 100-Point Algorithmic Scorer', icon: '📊', badge: 'Scoring Model' },
      { id: 'cassie-weight-tuning', label: '3.6.2 Behavioral Weight Tuning', icon: '🎛️', badge: 'Signal Weights' },
      { id: 'cassie-conversion-prob', label: '3.6.3 Lead Conversion Probability', icon: '🎯', badge: 'Predictive AI' },
      { id: 'cassie-cadence-trigger', label: '3.6.4 Cold-to-Hot Cadence Trigger', icon: '🔥', badge: 'Auto-Nurture' },
    ],
  },
  {
    id: 'atlas',
    num: '3.7',
    name: 'Atlas AI',
    role: 'Off-Plan Projects & Construction',
    icon: '🏛️',
    items: [
      { id: 'atlas-construction-delay', label: '3.7.1 Construction Delay Estimator', icon: '🏛️', badge: 'Milestone Risk' },
      { id: 'atlas-payment-plans', label: '3.7.2 Payment Plan Installment Builder', icon: '💳', badge: 'Developer Terms' },
      { id: 'atlas-developer-tracker', label: '3.7.3 Developer Project Tracker', icon: '🏗️', badge: 'Emaar/DAMAC' },
      { id: 'atlas-roi-simulator', label: '3.7.4 Off-Plan Capital Gain Simulator', icon: '📈', badge: 'Yield Model' },
    ],
  },
  {
    id: 'clara',
    num: '3.8',
    name: 'Clara AI',
    role: 'Leads Qualification & Acquisition',
    icon: '🎯',
    items: [
      { id: 'clara-lead-ingestion', label: '3.8.1 Portal Lead Ingestion Webhook', icon: '🎯', badge: 'Instant Webhook' },
      { id: 'clara-data-enricher', label: '3.8.2 Phone & Email Data Enricher', icon: '🔍', badge: 'Verification' },
      { id: 'clara-dedup-engine', label: '3.8.3 Lead Deduplication Engine', icon: '🧹', badge: 'Zero Duplicates' },
      { id: 'clara-auto-responder', label: '3.8.4 First-Touch Auto-Responder', icon: '⚡', badge: '< 60 Sec' },
    ],
  },
  {
    id: 'mary',
    num: '3.9',
    name: 'Mary AI',
    role: 'Master Property Inventory & Area Matrix',
    icon: '🏠',
    items: [
      { id: 'mary-inventory-grid', label: '3.9.1 Master 9,378+ Inventory Grid', icon: '🏠', badge: 'Master Portfolio' },
      { id: 'mary-availability-toggler', label: '3.9.2 Bulk Unit Availability Toggler', icon: '🔄', badge: 'Live Sync' },
      { id: 'mary-area-matrix', label: '3.9.3 Dubai Area & Community Matrix', icon: '🗺️', badge: 'Geo Cluster' },
      { id: 'mary-pricing-optimizer', label: '3.9.4 Unit Pricing Floor Optimizer', icon: '🏷️', badge: 'Floor Control' },
    ],
  },
  {
    id: 'linda',
    num: '3.10',
    name: 'Linda AI',
    role: 'Agent-Local WhatsApp Session Desk',
    icon: '📱',
    items: [
      { id: 'linda-qr-pairing', label: '3.10.1 QR WhatsApp Web Pairing Desk', icon: '📱', badge: 'Device Session' },
      { id: 'linda-session-switcher', label: '3.10.2 Multi-Session Agent Switcher', icon: '🔄', badge: 'Agent Desk' },
      { id: 'linda-media-vault', label: '3.10.3 Voice Note & Media Vault', icon: '🎙️', badge: 'Encrypted' },
      { id: 'linda-local-cache', label: '3.10.4 Local Device Message Cache', icon: '💾', badge: 'PWA Offline' },
    ],
  },
  {
    id: 'olivia',
    num: '3.11',
    name: 'Olivia AI',
    role: 'Growth Marketing & Portals Syndication',
    icon: '📣',
    items: [
      { id: 'olivia-syndication-hub', label: '3.11.1 Multi-Portal Syndication Hub', icon: '📣', badge: 'Bayut / PF' },
      { id: 'olivia-cpl-reallocator', label: '3.11.2 CPL Ad Budget Reallocator', icon: '💸', badge: 'Meta / Google' },
      { id: 'olivia-seo-copy-studio', label: '3.11.3 AI SEO Listing Copy Studio', icon: '✍️', badge: 'Luxury Copy' },
      { id: 'olivia-attribution-analytics', label: '3.11.4 Attribution ROI Analytics', icon: '📊', badge: 'Channel ROAS' },
    ],
  },
  {
    id: 'nancy',
    num: '3.12',
    name: 'Nancy AI',
    role: 'HR & Agent Talent Leaderboards',
    icon: '👥',
    items: [
      { id: 'nancy-sales-podium', label: '3.12.1 Real-Time Broker Sales Podium', icon: '🏆', badge: 'Leaderboard' },
      { id: 'nancy-rera-card-guard', label: '3.12.2 RERA Broker Card Expiry Guard', icon: '🪪', badge: 'Compliance' },
      { id: 'nancy-recruitment-deck', label: '3.12.3 Agent Talent Recruitment Deck', icon: '👥', badge: 'Hiring Pipeline' },
      { id: 'nancy-kpi-gauges', label: '3.12.4 Target KPI vs Actual Gauge', icon: '🎯', badge: 'Target Bounds' },
    ],
  },
  {
    id: 'daisy',
    num: '3.13',
    name: 'Daisy AI',
    role: 'Leasing Contracts & PDC Renewals',
    icon: '📋',
    items: [
      { id: 'daisy-lease-renewals', label: '3.13.1 90/60/30-Day Lease Renewals', icon: '📋', badge: 'Ejari Renewal' },
      { id: 'daisy-pdc-vault', label: '3.13.2 PDC Cheque Vault & Micr Scanner', icon: '🏦', badge: 'PDC Tracking' },
      { id: 'daisy-ejari-expiry', label: '3.13.3 Ejari Expiry & Handover Tracker', icon: '📅', badge: '365 Days' },
      { id: 'daisy-moveout-settlement', label: '3.13.4 Tenant Move-Out Settlement', icon: '🔑', badge: 'Deposit Settle' },
    ],
  },
  {
    id: 'theodora',
    num: '3.14',
    name: 'Theodora AI',
    role: 'Finance & VAT 5% Escrow Accounting',
    icon: '💳',
    items: [
      { id: 'theodora-invoices', label: '3.14.1 Tax Invoices & Pro Forma', icon: '📄', badge: 'Receivable' },
      { id: 'theodora-payments', label: '3.14.2 Payments & Escrow Releases', icon: '💳', badge: 'Income' },
      { id: 'theodora-commissions', label: '3.14.3 Commission Statements', icon: '💵', badge: 'Brokers' },
      { id: 'theodora-receivables', label: '3.14.4 Accounts Receivable & Aging', icon: '⏳', badge: 'AR Aging' },
      { id: 'theodora-expenses', label: '3.14.5 42 Master Expense Register', icon: '💰', badge: 'Payables' },
      { id: 'theodora-directors-loan', label: '3.14.6 Wio vs. Director Loan Advances', icon: '🏦', badge: "Owner's Equity" },
      { id: 'theodora-receipts', label: '3.14.7 Digital Receipts & OCR Vault', icon: '🧾', badge: 'Audit Safe' },
      { id: 'theodora-vat-return', label: '3.14.8 UAE FTA Form 201 (5% VAT)', icon: '🏛️', badge: 'FTA 201' },
      { id: 'theodora-corporate-tax', label: '3.14.9 UAE Corporate Tax (9%)', icon: '⚖️', badge: 'CT Relief' },
      { id: 'theodora-pnl', label: '3.14.10 Profit & Loss Statement (P&L)', icon: '📊', badge: 'P&L' },
      { id: 'theodora-balance-sheet', label: '3.14.11 Balance Sheet & Ledger', icon: '📑', badge: 'GL' },
      { id: 'theodora-cashflow', label: '3.14.12 Cash Flow & Bank Recon', icon: '🌊', badge: 'Wio Bank' },
      { id: 'theodora-audit-report', label: '3.14.13 Regulatory Audit Pack', icon: '🛡️', badge: 'Audit Report' },
      { id: 'theodora-reports-all', label: '3.14.14 All Reports Hub (67 Reports)', icon: '📑', badge: 'Zoho Standard' },
    ],
  },
  {
    id: 'laila',
    num: '3.15',
    name: 'Laila AI',
    role: 'RERA Compliance & AML Audit',
    icon: '🛡️',
    items: [
      { id: 'laila-pep-screening', label: '3.15.1 PEP & Sanctions Screening Filter', icon: '🛡️', badge: 'Watchlist' },
      { id: 'laila-trakheesi-verifier', label: '3.15.2 Trakheesi Permit QR Verifier', icon: '📜', badge: 'RERA Legal' },
      { id: 'laila-aml-risk-scorecard', label: '3.15.3 Statutory AML Risk Scorecard', icon: '⚖️', badge: 'goAML Ready' },
      { id: 'laila-broker-audit-file', label: '3.15.4 Broker Regulatory Audit File', icon: '📁', badge: 'Official Report' },
    ],
  },
  {
    id: 'aurora',
    num: '3.16',
    name: 'Aurora AI',
    role: 'CTO Systems & API Infrastructure',
    icon: '🖥️',
    items: [
      { id: 'aurora-microservices', label: '3.16.1 Microservice Health & Uptime', icon: '🖥️', badge: '99.99%' },
      { id: 'aurora-api-telemetry', label: '3.16.2 API Latency & Rate Limits', icon: '⚡', badge: '< 100ms' },
      { id: 'aurora-db-tracer', label: '3.16.3 Database Query & Replica Tracer', icon: '🗄️', badge: 'Mongo Replica' },
      { id: 'aurora-cloud-cache', label: '3.16.4 Cloud Cache & Memory Profiler', icon: '☁️', badge: 'Redis Cache' },
      { id: 'aurora-software-docs', label: '3.16.5 Hyper-Linked Software Architecture Hub (SRS/SDD)', icon: '📐', badge: 'SRS & SDD' },
    ],
  },
  {
    id: 'hazel',
    num: '3.17',
    name: 'Hazel AI',
    role: 'Frontend & UX Quality Metrics',
    icon: '🧩',
    items: [
      { id: 'hazel-token-guard', label: '3.17.1 Red/White/Slate Token Guard', icon: '🎨', badge: 'Brand Guard' },
      { id: 'hazel-ux-inspector', label: '3.17.2 100-Point UI/UX Audit Inspector', icon: '🧩', badge: '100-Pt Audit' },
      { id: 'hazel-breakpoint-analyzer', label: '3.17.3 Responsive Breakpoint Analyzer', icon: '📱', badge: 'Mobile Ready' },
      { id: 'hazel-animation-monitor', label: '3.17.4 Micro-Animation Easings Monitor', icon: '💫', badge: '60fps UI' },
    ],
  },
  {
    id: 'willow',
    num: '3.18',
    name: 'Willow AI',
    role: 'Backend & Server Microservices',
    icon: '⚙️',
    items: [
      { id: 'willow-route-discovery', label: '3.18.1 REST/GraphQL Route Discovery', icon: '⚙️', badge: '220+ Routes' },
      { id: 'willow-auth-inspector', label: '3.18.2 JWT Auth & Session Inspector', icon: '🔑', badge: 'Token Guard' },
      { id: 'willow-firewall-guard', label: '3.18.3 Rate Limiter & DDoS Firewall', icon: '🛡️', badge: 'IP Throttling' },
      { id: 'willow-queue-desk', label: '3.18.4 Background Worker Queue Desk', icon: '⏱️', badge: 'Job Workers' },
    ],
  },
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
  {
    id: 'sentinel',
    num: '3.20',
    name: 'Sentinel AI',
    role: 'Property State Machine & Quality',
    icon: '🏢',
    items: [
      { id: 'sentinel-lifecycle-machine', label: '3.20.1 Property Lifecycle State Machine', icon: '🏢', badge: 'State Engine' },
      { id: 'sentinel-verification-gate', label: '3.20.2 Listing Verification Quality Gate', icon: '✅', badge: 'Quality Gate' },
      { id: 'sentinel-decommission-flow', label: '3.20.3 Asset Decommissioning Flow', icon: '🔒', badge: 'Archive' },
      { id: 'sentinel-telemetry-hub', label: '3.20.4 IoT Telemetry Ingestion Hub', icon: '📡', badge: 'Live Sensors' },
    ],
  },
  {
    id: 'hunter',
    num: '3.21',
    name: 'Hunter AI',
    role: 'Outbound Prospecting & Lead Matcher',
    icon: '🎯',
    items: [
      { id: 'hunter-offmarket-matcher', label: '3.21.1 Off-Market Luxury Matcher', icon: '🎯', badge: 'VIP Match' },
      { id: 'hunter-hnw-profiler', label: '3.21.2 High-Net-Worth Lead Profiler', icon: '💎', badge: 'Investor DNA' },
      { id: 'hunter-geofenced-outreach', label: '3.21.3 Geo-Fenced Area Outreach', icon: '🗺️', badge: 'Prime Dubai' },
      { id: 'hunter-pitch-dispatcher', label: '3.21.4 Direct WhatsApp Pitch Dispatcher', icon: '💬', badge: 'Instant Pitch' },
    ],
  },
  {
    id: 'cipher',
    num: '3.22',
    name: 'Cipher AI',
    role: 'Market Pricing & CMA Valuations',
    icon: '📊',
    items: [
      { id: 'cipher-dld-regressor', label: '3.22.1 DLD Transaction Cluster Regressor', icon: '📊', badge: 'DLD Data' },
      { id: 'cipher-trend-sparklines', label: '3.22.2 Community SqFt Trend Sparklines', icon: '📈', badge: 'Market Trend' },
      { id: 'cipher-cma-builder', label: '3.22.3 Automated CMA Report Builder', icon: '📑', badge: 'AI Valuation' },
      { id: 'cipher-price-forecaster', label: '3.22.4 Price Projection Forecaster', icon: '🔮', badge: '12-Mo Proj' },
    ],
  },
  {
    id: 'vesta',
    num: '3.23',
    name: 'Vesta AI',
    role: 'Snagging, Move-In & Handover',
    icon: '🔑',
    items: [
      { id: 'vesta-snagging-inspector', label: '3.23.1 Digital Snagging Photo Inspector', icon: '🔑', badge: 'Snagging' },
      { id: 'vesta-handover-checklist', label: '3.23.2 Move-In Handover Checklist', icon: '📋', badge: 'Handover Ready' },
      { id: 'vesta-key-certificate', label: '3.23.3 Key Handover Certificate', icon: '📄', badge: 'DLD Form B' },
      { id: 'vesta-contractor-dispatch', label: '3.23.4 Contractor Rectification Dispatcher', icon: '🛠️', badge: 'Fix SLA' },
    ],
  },
  {
    id: 'juno',
    num: '3.24',
    name: 'Juno AI',
    role: 'Community Operations & Facilities',
    icon: '🏘️',
    items: [
      { id: 'juno-facility-booking', label: '3.24.1 Community Facility Booking Desk', icon: '🏘️', badge: 'Pool / Gym' },
      { id: 'juno-maintenance-sla', label: '3.24.2 Maintenance Ticket SLA Router', icon: '🔧', badge: 'Fast Dispatch' },
      { id: 'juno-service-tracker', label: '3.24.3 Tenant Service Request Tracker', icon: '🛎️', badge: 'Tenant Portal' },
      { id: 'juno-notice-board', label: '3.24.4 Community Broadcast Notice Board', icon: '📌', badge: 'Bulletins' },
    ],
  },
  {
    id: 'kairos',
    num: '3.25',
    name: 'Kairos AI',
    role: 'Luxury HNWI Wealth Advisory',
    icon: '💎',
    items: [
      { id: 'kairos-golden-visa', label: '3.25.1 UAE Golden Visa Eligibility Tool', icon: '💎', badge: 'AED 2M Gate' },
      { id: 'kairos-crypto-fx', label: '3.25.2 Real Estate Crypto FX Simulator', icon: '🪙', badge: 'BTC / USDT' },
      { id: 'kairos-chauffeur-desk', label: '3.25.3 Private Jet & Chauffeur Viewing Desk', icon: '✈️', badge: 'VIP Concierge' },
      { id: 'kairos-family-office', label: '3.25.4 Family Office Asset Allocator', icon: '🏛️', badge: 'Asset Strategy' },
    ],
  },
  {
    id: 'maven',
    num: '3.26',
    name: 'Maven AI',
    role: 'Investment Portfolio & Feasibility',
    icon: '📌',
    items: [
      { id: 'maven-dcf-calculator', label: '3.26.1 10-Year DCF ROI & IRR Calculator', icon: '📌', badge: 'DCF Modeling' },
      { id: 'maven-yield-comparator', label: '3.26.2 Short-Term vs Long-Term Yields', icon: '⚖️', badge: 'Airbnb vs Ejari' },
      { id: 'maven-portfolio-rebalancer', label: '3.26.3 Investment Portfolio Rebalancer', icon: '📊', badge: 'Diversification' },
      { id: 'maven-appreciation-projector', label: '3.26.4 Capital Appreciation Projector', icon: '📈', badge: 'Cap Gain' },
    ],
  },
  {
    id: 'prism',
    num: '3.27',
    name: 'Prism AI',
    role: 'AI Property Vector Matching Engine',
    icon: '🔭',
    items: [
      { id: 'prism-matching-engine', label: '3.27.1 Vector Matching Engine', icon: '🔭', badge: 'AI Match' },
      { id: 'prism-preference-matrix', label: '3.27.2 Client Preference Matrix', icon: '🎯', badge: 'Learning' },
      { id: 'prism-recommendations', label: '3.27.3 Ranked Inventory Picks', icon: '📊', badge: 'Top Picks' },
    ],
  },
  {
    id: 'sage',
    num: '3.28',
    name: 'Sage AI',
    role: 'Mortgage & Central Bank Financing Advisor',
    icon: '💰',
    items: [
      { id: 'sage-affordability', label: '3.28.1 Central Bank Affordability Calculator', icon: '💰', badge: 'CBUAE Bounds' },
      { id: 'sage-eibor-simulator', label: '3.28.2 EIBOR Variable vs Fixed Simulator', icon: '📈', badge: 'Rate Model' },
      { id: 'sage-lender-compare', label: '3.28.3 Multi-Bank Lender Comparison', icon: '🏦', badge: 'ADCB/ENBD' },
    ],
  },
  {
    id: 'echo',
    num: '3.29',
    name: 'Echo AI',
    role: 'Client Communication History & Unified Timeline',
    icon: '📜',
    items: [
      { id: 'echo-client-timeline', label: '3.29.1 Unified Client Timeline', icon: '📜', badge: 'Omnichannel' },
      { id: 'echo-inactivity-alerts', label: '3.29.2 Re-Engagement Inactivity Alerts', icon: '⏱️', badge: '14-Day Alert' },
      { id: 'echo-search-index', label: '3.29.3 Multi-Channel Search Index', icon: '🔍', badge: 'Instant Find' },
    ],
  },
  {
    id: 'mira',
    num: '3.30',
    name: 'Mira AI',
    role: 'Multilingual Arabic/English Translation Engine',
    icon: '🌍',
    items: [
      { id: 'mira-realtime-trans', label: '3.30.1 Real-Time Arabic-English Translation', icon: '🌍', badge: 'AR ↔ EN' },
      { id: 'mira-contract-rtl', label: '3.30.2 Bilingual DLD Contract Formatter', icon: '📑', badge: 'RTL Official' },
      { id: 'mira-dialect-lexicon', label: '3.30.3 Dubai Real Estate Dialect Lexicon', icon: '📖', badge: 'Terminology' },
    ],
  },
  {
    id: 'rex',
    num: '3.31',
    name: 'Rex AI',
    role: 'Regulatory Document Fraud & Blockchain Verifier',
    icon: '📋',
    items: [
      { id: 'rex-title-verify', label: '3.31.1 DLD Blockchain Title Deed Verifier', icon: '📋', badge: 'Blockchain' },
      { id: 'rex-noc-guard', label: '3.31.2 Developer NOC Authenticity Guard', icon: '🛡️', badge: 'Anti-Fraud' },
      { id: 'rex-ica-matcher', label: '3.31.3 ICA Emirates ID Matcher', icon: '🪪', badge: 'ICA Registry' },
    ],
  },
  {
    id: 'iris',
    num: '3.32',
    name: 'Iris AI',
    role: 'Virtual Staging & 3D Panoramic Visualization',
    icon: '🎨',
    items: [
      { id: 'iris-virtual-staging', label: '3.32.1 Generative AI Virtual Staging', icon: '🎨', badge: 'Photorealistic' },
      { id: 'iris-3d-floorplan', label: '3.32.2 2D to 3D Floorplan Extruder', icon: '📐', badge: '3D Render' },
      { id: 'iris-ar-tour', label: '3.32.3 Mobile AR Tour Generator', icon: '📱', badge: 'Appless AR' },
    ],
  },
  {
    id: 'apex',
    num: '3.33',
    name: 'Apex AI',
    role: 'Agent Performance Coach & Strategy',
    icon: '🏆',
    items: [
      { id: 'apex-agent-review', label: '3.33.1 Weekly Agent Performance Review', icon: '🏆', badge: 'Scorecard' },
      { id: 'apex-coaching-builder', label: '3.33.2 Actionable Coaching Plan Builder', icon: '🎯', badge: 'Development' },
      { id: 'apex-incentive-tier', label: '3.33.3 Incentive Tier Accelerator', icon: '💵', badge: 'Target Bounds' },
    ],
  },
  {
    id: 'halo',
    num: '3.34',
    name: 'Halo AI',
    role: 'Client Satisfaction & NPS Feedback Tracker',
    icon: '⭐',
    items: [
      { id: 'halo-nps-trigger', label: '3.34.1 Post-Handover NPS Survey Trigger', icon: '⭐', badge: 'NPS Engine' },
      { id: 'halo-sentiment-monitor', label: '3.34.2 Client Sentiment Risk Monitor', icon: '📊', badge: 'CSAT Trends' },
      { id: 'halo-review-escalation', label: '3.34.3 Service Review Escalation Flow', icon: '🚨', badge: 'Management SLA' },
    ],
  },
  {
    id: 'oracle',
    num: '3.35',
    name: 'Oracle AI',
    role: 'Market Intelligence Analyst & Broadcast Reports',
    icon: '🔮',
    items: [
      { id: 'oracle-executive-report', label: '3.35.1 Weekly Executive Narrative Report', icon: '🔮', badge: 'Briefing' },
      { id: 'oracle-volume-spikes', label: '3.35.2 DLD Volume Spike Detector', icon: '📈', badge: 'Spike Alert' },
      { id: 'oracle-social-bulletins', label: '3.35.3 Social Media Market Bulletins', icon: '📣', badge: 'Public Feed' },
    ],
  },
  {
    id: 'flux',
    num: '3.36',
    name: 'Flux AI',
    role: 'Real-Time DLD & Portals Live Data Feed',
    icon: '⚡',
    items: [
      { id: 'flux-dld-stream', label: '3.36.1 Real-Time DLD Open API Ingestion', icon: '⚡', badge: 'Live API' },
      { id: 'flux-portal-scrapers', label: '3.36.2 Portal Webhook Price Scraper', icon: '🌐', badge: 'Bayut / PF' },
      { id: 'flux-feed-health', label: '3.36.3 Feed Latency & Health Inspector', icon: '📡', badge: 'Telemetry' },
    ],
  },
  {
    id: 'nova',
    num: '3.37',
    name: 'Nova AI',
    role: 'New Development & Off-Plan Launch Radar',
    icon: '🏗️',
    items: [
      { id: 'nova-launch-radar', label: '3.37.1 Developer Launch Intelligence Radar', icon: '🏗️', badge: 'Launches' },
      { id: 'nova-payment-alerts', label: '3.37.2 Payment Plan Milestone Alerts', icon: '💳', badge: 'Payment Terms' },
      { id: 'nova-inventory-ingest', label: '3.37.3 Pre-Launch Inventory Ingestion', icon: '📥', badge: 'Pre-Launch' },
    ],
  },
  {
    id: 'quill',
    num: '3.38',
    name: 'Quill AI',
    role: 'Document Generation Engine & Bilingual Forms',
    icon: '✍️',
    items: [
      { id: 'quill-spa-generator', label: '3.38.1 Automated Bilingual SPA Generator', icon: '✍️', badge: 'Bilingual' },
      { id: 'quill-tenancy-builder', label: '3.38.2 DLD Unified Tenancy Form Builder', icon: '📄', badge: 'DLD Form' },
      { id: 'quill-bulk-documents', label: '3.38.3 Bulk Transaction Document Pack', icon: '📁', badge: 'Portfolio Pack' },
    ],
  },
  {
    id: 'lumen',
    num: '3.39',
    name: 'Lumen AI',
    role: 'Visual Analytics & Geospatial Heatmap Engine',
    icon: '📊',
    items: [
      { id: 'lumen-geo-heatmaps', label: '3.39.1 Geospatial Transaction Heatmaps', icon: '📊', badge: 'Heatmap' },
      { id: 'lumen-funnel-dashboard', label: '3.39.2 Interactive Funnel Dashboard', icon: '📉', badge: 'Visual BI' },
      { id: 'lumen-board-deck', label: '3.39.3 Board Deck PowerPoint Exporter', icon: '📑', badge: 'Presentation' },
    ],
  },
  {
    id: 'crest',
    num: '3.40',
    name: 'Crest AI',
    role: 'Automated Property Valuation Engine (AVM)',
    icon: '🏠',
    items: [
      { id: 'crest-avm-model', label: '3.40.1 Automated Valuation Model (AVM)', icon: '🏠', badge: 'AVM Calc' },
      { id: 'crest-comparables-matcher', label: '3.40.2 Radius Comparable Evidence Matcher', icon: '🗺️', badge: 'DLD Comps' },
      { id: 'crest-bulk-valuation', label: '3.40.3 Bulk Portfolio Valuation Run', icon: '📈', badge: 'Portfolio Run' },
    ],
  },
  {
    id: 'archer',
    num: '3.41',
    name: 'Archer AI',
    role: 'Lead Scoring & Conversion Probability',
    icon: '🎯',
    items: [
      { id: 'archer-lead-scorecard', label: '3.41.1 Lead Scoring Matrix & Weights', icon: '🎯', badge: 'Scoring' },
      { id: 'archer-routing-engine', label: '3.41.2 Agent Auto-Assignment Queue', icon: '⚡', badge: 'Routing' },
      { id: 'archer-churn-predictor', label: '3.41.3 Buyer Churn & Stall Detector', icon: '⚠️', badge: 'Risk Shield' },
    ],
  },
  {
    id: 'margaret',
    num: '3.42',
    name: 'Margaret AI',
    role: 'Strategic Planning & Master Backlog Architect',
    icon: '🗺️',
    items: [
      { id: 'margaret-master-roadmap', label: '3.42.1 Master Roadmap (Waves 01–65)', icon: '🗺️', badge: 'Roadmap' },
      { id: 'margaret-feature-matrix', label: '3.42.2 Feature Coverage & Traceability Matrix', icon: '📋', badge: 'Traceability' },
      { id: 'margaret-backlog-allocator', label: '3.42.3 Sprint Milestone Allocation', icon: '⚡', badge: 'Apollo Sprint' },
      { id: 'margaret-plans-docs', label: '3.42.4 Hyper-Linked Strategic Plans Hub', icon: '📜', badge: 'Plans Hub' },
    ],
  },
  {
    id: 'ada',
    num: '3.43',
    name: 'Ada AI',
    role: 'Chief Architecture & SDLC Governance Gatekeeper',
    icon: '🏛️',
    items: [
      { id: 'ada-topology-matrix', label: '3.43.1 Sovereign Architecture Topology', icon: '🏛️', badge: 'Topology' },
      { id: 'ada-zero-token-gate', label: '3.43.2 Zero-Token Local Gate Verifier', icon: '🛡️', badge: 'Zero Defect' },
      { id: 'ada-dedup-enforcer', label: '3.43.3 Deduplication Law & AST Optimizer', icon: '⚡', badge: 'Dedup Law' },
      { id: 'ada-architecture-docs', label: '3.43.4 Hyper-Linked Architecture Hub', icon: '📜', badge: 'Architecture' },
    ],
  },
  {
    id: 'aegis',
    num: '3.44',
    name: 'AEGIS AI',
    role: 'Autonomous Autopilot & Swarm Orchestrator',
    icon: '🚀',
    items: [
      { id: 'aegis-telemetry-heartbeat', label: '3.44.1 Live Telemetry & Scanner Health (0 Issues)', icon: '🚀', badge: 'Heartbeat' },
      { id: 'aegis-governance-policy', label: '3.44.2 Sovereign Governance Policy (v2026.08.18)', icon: '🛡️', badge: 'Policy' },
      { id: 'aegis-swarm-matrix', label: '3.44.3 170-Agent Swarm Allocation Matrix', icon: '🤖', badge: '170 Swarm' },
      { id: 'aegis-daily-chronology', label: '3.44.4 Daily Execution Chronology & Milestone Log', icon: '📊', badge: 'Chronology' },
      { id: 'aegis-autopilot-hub', label: '3.44.5 Hyper-Linked Autopilot & Telemetry Hub', icon: '📜', badge: 'Autopilot' },
    ],
  },
];

// ─── AI Teams & Squads Structure ───
export interface AITeamSquad {
  id: string;
  name: string;
  seniorLead: string;
  icon: string;
  color: string;
  assistantIds: string[];
}

export const AI_TEAMS_STRUCTURE: AITeamSquad[] = [
  {
    id: 'team-executive',
    name: 'Executive & Governance Squad',
    seniorLead: 'Zoe AI',
    icon: '👑',
    color: '#E31E24',
    assistantIds: ['zoe', 'apex'],
  },
  {
    id: 'team-software-tech',
    name: 'Software Engineering & Technology Team',
    seniorLead: 'Aurora AI',
    icon: '🖥️',
    color: '#0EA5E9',
    assistantIds: ['aurora', 'hazel', 'willow'],
  },
  {
    id: 'team-comms',
    name: 'Omnichannel Communications & WhatsApp Team',
    seniorLead: 'Nadia AI',
    icon: '💬',
    color: '#25D366',
    assistantIds: ['nadia', 'nina', 'linda', 'echo', 'mira', 'halo'],
  },
  {
    id: 'team-sales',
    name: 'Sales, Leads & Acquisition Squad',
    seniorLead: 'Sophia AI',
    icon: '📈',
    color: '#8B5CF6',
    assistantIds: ['sophia', 'clara', 'hunter', 'lead-scoring', 'prism'],
  },
  {
    id: 'team-finance',
    name: 'Finance, Treasury & Accounts Squad',
    seniorLead: 'Theodora AI',
    icon: '💳',
    color: '#F59E0B',
    assistantIds: ['theodora', 'kairos', 'maven', 'sage'],
  },
  {
    id: 'team-legal',
    name: 'Legal, Compliance & Document Studio',
    seniorLead: 'Laila AI',
    icon: '⚖️',
    color: '#6366F1',
    assistantIds: ['evangeline', 'laila', 'henry', 'rex', 'quill'],
  },
  {
    id: 'team-inventory',
    name: 'Master Inventory & Asset Management',
    seniorLead: 'Mary AI',
    icon: '🏠',
    color: '#3B82F6',
    assistantIds: ['mary', 'sentinel', 'crest'],
  },
  {
    id: 'team-leasing',
    name: 'Leasing, Tenancy & Handover Squad',
    seniorLead: 'Daisy AI',
    icon: '📋',
    color: '#14B8A6',
    assistantIds: ['daisy', 'vesta', 'juno'],
  },
  {
    id: 'team-marketing',
    name: 'Growth Marketing & Virtual Staging',
    seniorLead: 'Olivia AI',
    icon: '📣',
    color: '#EC4899',
    assistantIds: ['olivia', 'iris'],
  },
  {
    id: 'team-intelligence',
    name: 'Market Intelligence & Big Data Squad',
    seniorLead: 'Cipher AI',
    icon: '📊',
    color: '#0D9488',
    assistantIds: ['atlas', 'cipher', 'oracle', 'flux', 'nova', 'lumen'],
  },
  {
    id: 'team-hr',
    name: 'Human Resources & Talent Squad',
    seniorLead: 'Nancy AI',
    icon: '👥',
    color: '#F97316',
    assistantIds: ['nancy'],
  },
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
  items: [
    { id: 'overview', label: '1.1 Executive Overview & Live Audit', icon: '👑' },
    { id: 'ai-command', label: '1.2 1-12-108 AI Command Center', icon: '🤖' },
    { id: 'off-plan-tracker', label: '1.3 DH2 & Off-Plan Escrow Matrix', icon: '🏰' },
    { id: 'theodora', label: '1.4 Treasury & VAT Accounting', icon: '💰' },
    { id: 'compliance', label: '1.5 goAML & Statutory Shield', icon: '⚖️' },
    { id: 'journeys', label: '1.6 20 Life Cycle Journeys Hub', icon: '🗺️' },
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
