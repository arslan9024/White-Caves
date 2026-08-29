/**
 * UnifiedWorkspaceLayout.data.ts — Content & Data Variables
 * Separates navigation hierarchy, department metadata, and MD Hub configuration.
 */

export interface WorkspaceCategory {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  isMdHub?: boolean;
}

export interface WorkspaceSubItem {
  id: string;
  label: string;
  code: string;
  path?: string;
  status?: string;
}

export interface WorkspaceKPI {
  label: string;
  value: string;
  trend?: string;
}

export interface WorkspaceViewItem {
  id: string;
  code: string;
  title: string;
  category: string;
  path: string;
  departmentFloor?: string;
  assistantCode?: string;
  description?: string;
  isLocked?: boolean;
  minLevel?: number;
  badge?: string;
  subItems?: WorkspaceSubItem[];
  kpis?: WorkspaceKPI[];
}

export const WORKSPACE_CATEGORIES: WorkspaceCategory[] = [
  { id: 'md_hub', label: '👑 Managing Director Hub (Level 5)', icon: 'Crown', isMdHub: true, badge: 'Sovereign' },
  { id: 'progress', label: '🌟 Project Progress & Telemetry', icon: 'Sparkles', badge: 'Live 100%' },
  { id: 'luxury_sales', label: '1. Luxury Sales & Brokerage', icon: 'TrendingUp', badge: 'Floor 05' },
  { id: 'off_plan', label: '2. Strategic Off-Plan Developments', icon: 'Building', badge: 'Floor 05' },
  { id: 'commercial', label: '3. Commercial & Investment', icon: 'Briefcase', badge: 'Floor 05' },
  { id: 'leasing', label: '4. Residential Leasing & Ejari', icon: 'Key', badge: 'Floor 04' },
  { id: 'asset_dh2', label: '5. Asset Management & DH2 Hub', icon: 'Wrench', badge: 'Floor 04' },
  { id: 'revenue', label: '6. Revenue, Finance & Treasury', icon: 'DollarSign', badge: 'Floor 08' },
  { id: 'marketing', label: '7. Performance Marketing', icon: 'Megaphone', badge: 'Floor 07' },
  { id: 'comms', label: '8. Communications & WhatsApp', icon: 'MessageSquare', badge: 'Floor 06' },
  { id: 'executive', label: '9. Corporate Governance', icon: 'Shield', badge: 'Floor 13' },
  { id: 'compliance', label: '10. Regulatory & RERA Compliance', icon: 'FileCheck', badge: 'Floor 09' },
  { id: 'conveyancing', label: '11. Conveyancing & Transfers', icon: 'Stamp', badge: 'Floor 02' },
  { id: 'intelligence', label: '12. Market Intelligence & IoT', icon: 'BarChart3', badge: 'Floor 03' },
  { id: 'software_docs', label: '13. Software Docs (SRS & SDD)', icon: 'Code', badge: 'Floor 10' },
];

export const WORKSPACE_VIEWS: WorkspaceViewItem[] = [
  // ─── MD HUB (Level 5 Sovereign) ──────────────────────────────────────────
  {
    id: 'VIEW-MD-01',
    code: 'MD-BRIEF',
    title: 'Executive Morning Briefing (08:00 AM)',
    category: 'md_hub',
    path: '/crm',
    minLevel: 5,
    badge: 'Daily',
    departmentFloor: 'Floor 13 — Executive Suite',
    assistantCode: '3.4 Zoe AI & 3.43 Ada',
    description: 'Real-time sovereign dashboard aggregating 12-department KPIs, cash balances, escrow releases, and active RERA license monitors.',
    kpis: [
      { label: 'Active Pipeline', value: 'AED 184.2M', trend: '+14.2%' },
      { label: 'Escrow Reserves', value: 'AED 42.8M', trend: '100% Locked' },
      { label: 'Compliance Score', value: '99.8%', trend: 'RERA Green' },
    ],
    subItems: [
      { id: 'sub-md-1', label: 'Daily Deal Intake & Approvals', code: 'MD-01.1' },
      { id: 'sub-md-2', label: 'Escrow Account Payout Requests', code: 'MD-01.2' },
      { id: 'sub-md-3', label: 'Government Expiry Alert Desk', code: 'MD-01.3' },
    ],
  },
  {
    id: 'VIEW-MD-02',
    code: 'MD-DH2',
    title: 'DAMAC Hills 2 Cluster Matrix (9,378 Units)',
    category: 'md_hub',
    path: '/crm',
    minLevel: 5,
    badge: '9,378',
    departmentFloor: 'Floor 04 — Asset Operations',
    assistantCode: '3.19 Henry AI',
    description: 'High-density spatial monitoring grid for all 32 residential clusters in DAMAC Hills 2 (Akoya Oxygen).',
    kpis: [
      { label: 'Cluster Units', value: '9,378', trend: 'Active' },
      { label: 'Occupancy Rate', value: '94.6%', trend: '+3.1%' },
      { label: 'Open Work Orders', value: '14', trend: 'SLA < 24h' },
    ],
    subItems: [
      { id: 'sub-dh2-1', label: 'Cluster Rental Index Analysis', code: 'DH2-01.1' },
      { id: 'sub-dh2-2', label: 'Ejari Renewal Automated Queue', code: 'DH2-01.2' },
      { id: 'sub-dh2-3', label: 'Facilities Maintenance Tracker', code: 'DH2-01.3' },
    ],
  },
  {
    id: 'VIEW-MD-03',
    code: 'MD-CRED',
    title: 'DET & RERA License Expiry Monitor',
    category: 'md_hub',
    path: '/profile',
    minLevel: 5,
    badge: 'Audit',
    departmentFloor: 'Floor 09 — Legal & Compliance',
    assistantCode: '3.15 Laila Compliance',
    description: 'Automated legal governance tracking Commercial License 1388443, Broker ORN 44483, and Ejari 0120250814005322.',
    kpis: [
      { label: 'DET Commercial Lic.', value: '1388443', trend: 'Valid' },
      { label: 'RERA Brokerage ORN', value: '44483', trend: 'Active' },
      { label: 'Office Ejari ID', value: 'D-72 El Shaye', trend: 'Verified' },
    ],
    subItems: [
      { id: 'sub-cred-1', label: 'DET Commercial Registry Audit', code: 'CRED-01.1' },
      { id: 'sub-cred-2', label: 'Broker ORN & Agent Cards', code: 'CRED-01.2' },
      { id: 'sub-cred-3', label: 'Ejari Lease Compliance Verification', code: 'CRED-01.3' },
    ],
  },
  {
    id: 'VIEW-MD-04',
    code: 'MD-COMM',
    title: 'Commission & Revenue Ledger (AED)',
    category: 'md_hub',
    path: '/crm',
    minLevel: 5,
    badge: 'Finance',
    departmentFloor: 'Floor 08 — Finance & CFO Treasury',
    assistantCode: '3.14 Theodora CFO',
    description: 'Real-time corporate revenue tracking, 5% UAE VAT FTA filings, director withdrawals, and agent commission disbursements.',
    kpis: [
      { label: 'YTD Gross Revenue', value: 'AED 12.84M', trend: '+28.4%' },
      { label: 'VAT 5% Payable', value: 'AED 642.0K', trend: 'Q3 Ready' },
      { label: 'Corporate Tax Reserve', value: '9.0%', trend: 'Compliant' },
    ],
    subItems: [
      { id: 'sub-comm-1', label: 'VAT 5% FTA Filing Sheet', code: 'COMM-01.1' },
      { id: 'sub-comm-2', label: 'Agent Split Payout Engine', code: 'COMM-01.2' },
      { id: 'sub-comm-3', label: '37+ Expense Sub-Items Ledger', code: 'COMM-01.3' },
    ],
  },

  // ─── PROJECT PROGRESS & TELEMETRY ──────────────────────────────────────────
  {
    id: 'VIEW-PROG-01',
    code: 'PROG-01',
    title: 'Executive Project Progress & Autopilot Telemetry',
    category: 'progress',
    path: '/crm',
    badge: '100% Green',
    departmentFloor: 'Floor 13 — Architecture Deck',
    assistantCode: '3.4 Zoe AI & 3.44 AEGIS',
    description: 'Interactive real-time execution dashboard tracking Waves 1–68, test suites, scanner issues (0), and Turn 89 achievements.',
    kpis: [
      { label: 'Wave Completion', value: '68 / 68', trend: '100%' },
      { label: 'Unit Tests Passing', value: '81 / 81', trend: '100% Green' },
      { label: 'Scanner Issues', value: '0', trend: 'Clean Gate' },
    ],
    subItems: [
      { id: 'sub-prog-1', label: 'Executive KPI Radar', code: 'PROG-01.1' },
      { id: 'sub-prog-2', label: '12-Department Floor Operating Matrix', code: 'PROG-01.2' },
      { id: 'sub-prog-3', label: 'Turn-by-Turn Autopilot Milestones', code: 'PROG-01.3' },
    ],
  },

  // ─── 12 Professional Departments ──────────────────────────────────────────
  {
    id: 'VIEW-01',
    code: 'SALES-01',
    title: 'Luxury Deals Pipeline',
    category: 'luxury_sales',
    path: '/crm',
    badge: 'Deals',
    departmentFloor: 'Floor 05 — Sales Division',
    assistantCode: '3.3 Sophia Sales',
    description: 'High-ticket luxury property sales tracker with interactive stages (Lead, Viewing, Offer, MOU Form F, Transfer).',
    kpis: [
      { label: 'Active Deals', value: '38', trend: 'AED 94M' },
      { label: 'Avg Deal Size', value: 'AED 4.2M', trend: '+8%' },
      { label: 'Closing Velocity', value: '18 Days', trend: '-3 Days' },
    ],
    subItems: [
      { id: 'sub-sales-1', label: 'Direct Buyer Inquiries', code: 'SALES-01.1' },
      { id: 'sub-sales-2', label: 'Form F Contract Generator', code: 'SALES-01.2' },
      { id: 'sub-sales-3', label: 'Escrow Security Deposit Vault', code: 'SALES-01.3' },
    ],
  },
  {
    id: 'VIEW-02',
    code: 'SALES-02',
    title: 'VIP Matchmaker Desk (AI Hamdan)',
    category: 'luxury_sales',
    path: '/crm',
    badge: 'UHNW',
    departmentFloor: 'Floor 05 — VIP Division',
    assistantCode: '3.6 Hamdan Matchmaker',
    description: 'AI-driven matchmaker pairing high-net-worth investors with off-market Dubai penthouses and villas.',
    kpis: [
      { label: 'UHNW Investors', value: '142', trend: 'Active' },
      { label: 'Match Confidence', value: '96.4%', trend: 'Top Tier' },
      { label: 'Off-Market Listings', value: '29', trend: 'Exclusive' },
    ],
    subItems: [
      { id: 'sub-vip-1', label: 'Investor Investment Criteria', code: 'SALES-02.1' },
      { id: 'sub-vip-2', label: 'Private Off-Market Dossiers', code: 'SALES-02.2' },
      { id: 'sub-vip-3', label: 'Digital NDA Verification', code: 'SALES-02.3' },
    ],
  },
  {
    id: 'VIEW-03',
    code: 'OFFPLAN-01',
    title: 'Developer Launch Predictor (AI Zayed)',
    category: 'off_plan',
    path: '/off-plan',
    badge: 'Launches',
    departmentFloor: 'Floor 05 — Off-Plan Division',
    assistantCode: '3.7 Zayed Off-Plan',
    description: 'Predictive analytics on major developer launches across Emaar, DAMAC, Sobha, Nakheel, and Ellington.',
    kpis: [
      { label: 'Tracked Launches', value: '46 Projects', trend: 'Q3/Q4' },
      { label: 'Projected ROI', value: '8.4%', trend: 'Dubai Average' },
      { label: 'EOI Registrations', value: '112', trend: '+19%' },
    ],
    subItems: [
      { id: 'sub-off-1', label: 'Developer Master Payment Plans', code: 'OFFPLAN-01.1' },
      { id: 'sub-off-2', label: 'EOI Allocation Dashboard', code: 'OFFPLAN-01.2' },
      { id: 'sub-off-3', label: 'Capital Appreciation Forecast', code: 'OFFPLAN-01.3' },
    ],
  },
  {
    id: 'VIEW-04',
    code: 'COMM-01',
    title: 'Commercial Portfolio Valuation (AI Maktoum)',
    category: 'commercial',
    path: '/crm',
    badge: 'Commercial',
    departmentFloor: 'Floor 05 — Commercial Division',
    assistantCode: '3.8 Maktoum Commercial',
    description: 'Institutional asset valuation for prime commercial towers, retail strips, and logistics warehouses across Dubai.',
    kpis: [
      { label: 'Gross Assets Valued', value: 'AED 340M', trend: '+12%' },
      { label: 'Net Yield Rate', value: '7.8%', trend: 'Prime' },
      { label: 'Corporate Leases', value: '54', trend: 'Active' },
    ],
    subItems: [
      { id: 'sub-com-1', label: 'Commercial Lease Yield Analyzer', code: 'COMM-01.1' },
      { id: 'sub-com-2', label: 'Office Space Vacancy Matrix', code: 'COMM-01.2' },
      { id: 'sub-com-3', label: 'Tenant Financial Stability Score', code: 'COMM-01.3' },
    ],
  },
  {
    id: 'VIEW-05',
    code: 'LEASE-01',
    title: 'Ejari Unified Contracts (AI Nadia)',
    category: 'leasing',
    path: '/tenant-portal',
    badge: 'Ejari',
    departmentFloor: 'Floor 04 — Leasing Division',
    assistantCode: '3.1 Nadia & 3.19 Henry',
    description: 'Standardized Dubai Tenancy Contract generator with direct Ejari integration and PDC post-dated cheque schedules.',
    kpis: [
      { label: 'Active Leases', value: '412', trend: 'Managed' },
      { label: 'PDCs in Custody', value: '1,280', trend: 'Vault' },
      { label: 'Bounced Cheque Rate', value: '0.2%', trend: 'Ultra-low' },
    ],
    subItems: [
      { id: 'sub-lease-1', label: 'Ejari Digital Contract Generator', code: 'LEASE-01.1' },
      { id: 'sub-lease-2', label: 'PDC Vault & Bank Deposit Dates', code: 'LEASE-01.2' },
      { id: 'sub-lease-3', label: 'Notice of Renewal (90-Day SLA)', code: 'LEASE-01.3' },
    ],
  },
  {
    id: 'VIEW-06',
    code: 'DH2-01',
    title: 'IoT Telemetry & Work Orders (AI Sentinel)',
    category: 'asset_dh2',
    path: '/crm',
    badge: 'IoT',
    departmentFloor: 'Floor 04 — Asset Management',
    assistantCode: '3.20 Sentinel IoT',
    description: 'Smart meter water/power telemetry, proactive maintenance ticketing, and vendor dispatching for residential villas.',
    kpis: [
      { label: 'Connected Meters', value: '1,840', trend: 'Online' },
      { label: 'Leak Alerts (24h)', value: '0', trend: 'Normal' },
      { label: 'Avg Dispatch Time', value: '14 Mins', trend: 'Fast' },
    ],
    subItems: [
      { id: 'sub-dh-1', label: 'Smart Meter Water Telemetry', code: 'DH2-01.1' },
      { id: 'sub-dh-2', label: 'Vendor SLA Dispatch Engine', code: 'DH2-01.2' },
      { id: 'sub-dh-3', label: 'Move-In / Move-Out Snagging', code: 'DH2-01.3' },
    ],
  },
  {
    id: 'VIEW-07',
    code: 'REV-01',
    title: 'Multi-Currency Settlement (AI Theodora)',
    category: 'revenue',
    path: '/crm',
    badge: 'Finance',
    departmentFloor: 'Floor 08 — Finance & Accounts',
    assistantCode: '3.14 Theodora CFO',
    description: 'In-house accounting, chart of accounts (COGS, OPEX, Liabilities, Assets), UAE VAT, and corporate tax reserves.',
    kpis: [
      { label: 'Chart of Accounts', value: '37+ Items', trend: 'Standardized' },
      { label: 'Bank Reconciliation', value: '100%', trend: 'Wio Bank' },
      { label: 'VAT 5% Reserve', value: 'AED 240K', trend: 'Segregated' },
    ],
    subItems: [
      { id: 'sub-rev-1', label: '5-Category Master Expense Schema', code: 'REV-01.1' },
      { id: 'sub-rev-2', label: 'P&L Variance & Cashflow Forecast', code: 'REV-01.2' },
      { id: 'sub-rev-3', label: 'Corporate Tax Deductibility Matrix', code: 'REV-01.3' },
    ],
  },
  {
    id: 'VIEW-08',
    code: 'MKT-01',
    title: 'Portal Syndication Feeds (AI Olivia)',
    category: 'marketing',
    path: '/crm',
    badge: 'Marketing',
    departmentFloor: 'Floor 07 — Marketing Division',
    assistantCode: '3.2 Olivia Marketing',
    description: 'Automated XML/JSON property feeds syncing to Property Finder, Bayut, Dubizzle, and international luxury aggregators.',
    kpis: [
      { label: 'Syndicated Listings', value: '286', trend: 'Active' },
      { label: 'Portal Lead Velocity', value: '+34%', trend: 'Monthly' },
      { label: 'Photo Quality Score', value: '98.2%', trend: 'HD 4K' },
    ],
    subItems: [
      { id: 'sub-mkt-1', label: 'Property Finder XML Stream', code: 'MKT-01.1' },
      { id: 'sub-mkt-2', label: 'Bayut TruCheck Status Desk', code: 'MKT-01.2' },
      { id: 'sub-mkt-3', label: 'Social Media Video Automation', code: 'MKT-01.3' },
    ],
  },
  {
    id: 'VIEW-09',
    code: 'COMMS-01',
    title: 'WhatsApp 15-Min SLA Tracker (AI Chats)',
    category: 'comms',
    path: '/whatsapp-settings',
    badge: 'WhatsApp',
    departmentFloor: 'Floor 06 — Communications',
    assistantCode: '3.1 Nadia & 3.5 Nina',
    description: 'Centralized WhatsApp omnichannel hub ensuring < 15 minute first-response time across all Dubai buyers and landlords.',
    kpis: [
      { label: 'Active Conversations', value: '64', trend: 'Live' },
      { label: 'Avg First Response', value: '42 Secs', trend: 'SLA < 15m' },
      { label: 'AI Auto-Resolutions', value: '72%', trend: 'Automated' },
    ],
    subItems: [
      { id: 'sub-comms-1', label: 'Omnichannel Chat Inbox', code: 'COMMS-01.1' },
      { id: 'sub-comms-2', label: 'Automated Viewing Scheduler', code: 'COMMS-01.2' },
      { id: 'sub-comms-3', label: 'Lead Escalation Trigger Rules', code: 'COMMS-01.3' },
    ],
  },
  {
    id: 'VIEW-10',
    code: 'EXEC-01',
    title: 'Corporate Audit Log (AI Lion Heart)',
    category: 'executive',
    path: '/crm',
    badge: 'Audit',
    departmentFloor: 'Floor 13 — Executive Suite',
    assistantCode: '3.21 Lion Heart AI',
    description: 'Immutable, tamper-proof audit trail capturing all user actions, document exports, financial transfers, and role escalations.',
    kpis: [
      { label: 'Logged Events (24h)', value: '1,420', trend: 'Encrypted' },
      { label: 'Security Breaches', value: '0', trend: 'Zero-Trust' },
      { label: 'RBAC Active Roles', value: '22 Roles', trend: 'Enforced' },
    ],
    subItems: [
      { id: 'sub-exec-1', label: 'Real-Time User Action Stream', code: 'EXEC-01.1' },
      { id: 'sub-exec-2', label: 'Financial Export Tamper Guard', code: 'EXEC-01.2' },
      { id: 'sub-exec-3', label: 'Role Privilege Escalation Alert', code: 'EXEC-01.3' },
    ],
  },
  {
    id: 'VIEW-11',
    code: 'COMP-01',
    title: 'Trakheesi Permit Validator (AI Laila)',
    category: 'compliance',
    path: '/crm',
    badge: 'RERA',
    departmentFloor: 'Floor 09 — Legal & Compliance',
    assistantCode: '3.15 Laila Compliance',
    description: 'Real-time integration with Dubai Land Department Trakheesi system to validate all advertising permits and broker cards.',
    kpis: [
      { label: 'Permit Verification', value: '100%', trend: 'Trakheesi' },
      { label: 'Active RERA Permits', value: '286', trend: 'Verified' },
      { label: 'Penalty Violations', value: '0', trend: 'Clean' },
    ],
    subItems: [
      { id: 'sub-comp-1', label: 'Trakheesi QR Code Generator', code: 'COMP-01.1' },
      { id: 'sub-comp-2', label: 'Broker Card Verification Scan', code: 'COMP-01.2' },
      { id: 'sub-comp-3', label: 'UAE PDPL Privacy Compliance', code: 'COMP-01.3' },
    ],
  },
  {
    id: 'VIEW-12',
    code: 'TRANS-01',
    title: 'DLD Trustee Appointments (AI Trustee)',
    category: 'conveyancing',
    path: '/crm',
    badge: 'Trustee',
    departmentFloor: 'Floor 02 — Conveyancing',
    assistantCode: '3.17 Evangeline Legal',
    description: 'Trustee office appointment coordinator for DLD property transfers, title deed issuances, and manager cheque clearance.',
    kpis: [
      { label: 'Transfers This Month', value: '19', trend: 'Completed' },
      { label: 'Avg Transfer Time', value: '45 Mins', trend: 'Trustee SLA' },
      { label: 'Manager Cheques Clear', value: '100%', trend: 'Verified' },
    ],
    subItems: [
      { id: 'sub-trans-1', label: 'Trustee Office Schedule Matrix', code: 'TRANS-01.1' },
      { id: 'sub-trans-2', label: 'Manager Cheque Balance Guard', code: 'TRANS-01.2' },
      { id: 'sub-trans-3', label: 'New Title Deed Digital Dispatch', code: 'TRANS-01.3' },
    ],
  },
  {
    id: 'VIEW-13',
    code: 'INTEL-01',
    title: 'Dubai Price Forecaster (AI Predict)',
    category: 'intelligence',
    path: '/market-intelligence',
    badge: 'AI ML',
    departmentFloor: 'Floor 03 — Market Intelligence',
    assistantCode: '3.16 Cipher Market',
    description: 'Deep learning real estate price forecasting algorithm trained on historical DLD transaction data (2008–2026).',
    kpis: [
      { label: 'Forecast Accuracy', value: '94.8%', trend: 'Backtested' },
      { label: 'Analyzed Transactions', value: '1.2M+', trend: 'DLD Open Data' },
      { label: 'Price Trend Alert', value: '+6.2% YoY', trend: 'Prime Dubai' },
    ],
    subItems: [
      { id: 'sub-intel-1', label: 'DLD Transaction Data Feed', code: 'INTEL-01.1' },
      { id: 'sub-intel-2', label: 'Sub-Market Appreciation Heatmap', code: 'INTEL-01.2' },
      { id: 'sub-intel-3', label: 'Rental Yield Compression Model', code: 'INTEL-01.3' },
    ],
  },
  {
    id: 'VIEW-14',
    code: 'SWE-01',
    title: 'Software Docs (SRS & SDD Specifications)',
    category: 'software_docs',
    path: '/crm',
    badge: 'SWE Matrix',
    departmentFloor: 'Floor 10 — Architecture & Software Engineering',
    assistantCode: '3.11 Aurora AI & 3.43 Ada',
    description: 'Comprehensive software requirements (SRS ISO 29148) and system design documentation (SDD IEEE 1016) for all 44 AI assistants.',
    kpis: [
      { label: 'SRS Modules', value: '10 Modules', trend: 'Complete' },
      { label: 'Folder Standard', value: '4-Way Atomic', trend: 'Enforced' },
      { label: 'Codebase Tests', value: '81 Suites', trend: '100% Passed' },
    ],
    subItems: [
      { id: 'sub-swe-1', label: 'SRS: AI Command Center (44 Personas)', code: 'SWE-01.1' },
      { id: 'sub-swe-2', label: 'SDD: Feature-First 4-Way Architecture', code: 'SWE-01.2' },
      { id: 'sub-swe-3', label: 'RBAC 1-12-108 Permission Matrix', code: 'SWE-01.3' },
    ],
  },
];

export const WORKSPACE_LAYOUT_TEXT = {
  sidebarTitle: 'White Caves ERP',
  sidebarSubtitle: 'AEGIS 3.0 Command Grid',
  mdHubHeading: 'Executive MD Cockpit',
  searchPlaceholder: 'Quick filter department views...',
  founderBadge: 'Managing Director Level 5',
  liveStatus: 'Neural Grid Active (44 Assistants · 68 Waves)',
};
