/**
 * viewsRegistry.ts — Master 100-View Integration Registry
 *
 * Maps all 100 enterprise views across 10 strategic domains.
 * Each view tracks an end-to-end task cycle starting from a click in the Top Navbar or Left Sidebar.
 */

export interface ViewDefinition {
  id: string;
  code: string; // e.g. VIEW-01
  title: string;
  category: string;
  group: string;
  entryPoint: string;
  flowchartRef: string;
  status: 'active' | 'in_progress' | 'planned';
}

export const VIEWS_REGISTRY: ViewDefinition[] = [
  // ── GROUP 1: EXECUTIVE FLIGHT DECK (01 - 10) ───────────────────────────
  { id: 'md-profile-crud', code: 'VIEW-01', title: 'Managing Director Profile CRUD', category: 'Executive', group: 'Executive Flight Deck', entryPoint: 'Top Navbar → Profile Icon', flowchartRef: 'FC-01', status: 'active' },
  { id: 'cross-dept-aggregator', code: 'VIEW-02', title: 'Global Cross-Department Aggregator', category: 'Executive', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → Executive → Overview', flowchartRef: 'FC-02', status: 'active' },
  { id: 'multi-currency-treasury', code: 'VIEW-03', title: 'Multi-Currency Treasury Panel', category: 'Finance', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → Finance → Treasury', flowchartRef: 'FC-03', status: 'active' },
  { id: 'live-activity-stream', code: 'VIEW-04', title: 'Live Interaction Activity Stream', category: 'Executive', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → Executive → Activity', flowchartRef: 'FC-04', status: 'active' },
  { id: 'cache-size-indicator', code: 'VIEW-05', title: 'Local Cache Size Indicator', category: 'System', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → System → Cache', flowchartRef: 'FC-05', status: 'active' },
  { id: 'multi-agent-telemetry', code: 'VIEW-06', title: 'Multi-Agent Telemetry Cockpit', category: 'AI Center', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → AI Center → Telemetry', flowchartRef: 'FC-06', status: 'active' },
  { id: 'cicd-pipeline-tracking', code: 'VIEW-07', title: 'CI/CD Pipeline Tracking Dashboard', category: 'System', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → System → CI/CD', flowchartRef: 'FC-07', status: 'active' },
  { id: 'zero-token-debug-trace', code: 'VIEW-08', title: '0-Token Debugging Central Trace', category: 'System', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → System → Debug', flowchartRef: 'FC-08', status: 'active' },
  { id: 'restricted-corp-library', code: 'VIEW-09', title: 'Restricted Corporate Library', category: 'Executive', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → Executive → Library', flowchartRef: 'FC-09', status: 'active' },
  { id: 'realtime-system-anomalies', code: 'VIEW-10', title: 'Real-time System Anomaly Warnings', category: 'System', group: 'Executive Flight Deck', entryPoint: 'Left Sidebar → System → Anomalies', flowchartRef: 'FC-10', status: 'active' },

  // ── GROUP 2: RESIDENTIAL BROKERAGE SALES HUB (11 - 25) ─────────────────
  { id: 'drag-drop-lead-grid', code: 'VIEW-11', title: '4-Column Drag-and-Drop Lead Grid', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Leads', flowchartRef: 'FC-11', status: 'active' },
  { id: 'high-density-client-registry', code: 'VIEW-12', title: 'High-Density Client Registry', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Clients', flowchartRef: 'FC-12', status: 'active' },
  { id: 'conversion-flow-analytics', code: 'VIEW-13', title: 'Conversion Flow Analytics Chart', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Analytics', flowchartRef: 'FC-13', status: 'active' },
  { id: 'broker-portfolio-view', code: 'VIEW-14', title: 'Individual Broker Portfolio View', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → My Portfolio', flowchartRef: 'FC-14', status: 'active' },
  { id: 'secondary-market-matching', code: 'VIEW-15', title: 'Secondary Market Inventory Matching', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Secondary', flowchartRef: 'FC-15', status: 'active' },
  { id: 'vip-investor-screening', code: 'VIEW-16', title: 'VIP International Investor Screening', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → VIP Investors', flowchartRef: 'FC-16', status: 'active' },
  { id: 'viewing-agenda-matrix', code: 'VIEW-17', title: 'Viewing Schedule Agenda Matrix', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Viewings', flowchartRef: 'FC-17', status: 'active' },
  { id: 'broker-target-allocator', code: 'VIEW-18', title: 'Broker Target Allocation Inputs', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Targets', flowchartRef: 'FC-18', status: 'active' },
  { id: 'deal-negotiation-tracker', code: 'VIEW-19', title: 'Deal Negotiation & Offer Tracker', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Deals', flowchartRef: 'FC-19', status: 'active' },
  { id: 'sales-agent-leaderboard', code: 'VIEW-20', title: 'Sales Agent Leaderboard', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Leaderboard', flowchartRef: 'FC-20', status: 'active' },
  { id: 'agent-commission-statement', code: 'VIEW-21', title: 'Agent Commission Statement View', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Commissions', flowchartRef: 'FC-21', status: 'active' },
  { id: 'property-showcase-gallery', code: 'VIEW-22', title: 'Interactive Property Showcase', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Showcase', flowchartRef: 'FC-22', status: 'active' },
  { id: 'mortgage-affordability-calc', code: 'VIEW-23', title: 'Mortgage Affordability Calculator', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Calculator', flowchartRef: 'FC-23', status: 'active' },
  { id: 'referral-agent-network', code: 'VIEW-24', title: 'Referral Agent Network View', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Referrals', flowchartRef: 'FC-24', status: 'active' },
  { id: 'sales-performance-report', code: 'VIEW-25', title: 'Sales Performance Report Generator', category: 'Sales', group: 'Residential Brokerage', entryPoint: 'Left Sidebar → Sales → Reports', flowchartRef: 'FC-25', status: 'active' },

  // ── GROUP 3: STRATEGIC OFF-PLAN & DEVELOPMENT (26 - 40) ───────────────
  { id: 'developer-relations-tracker', code: 'VIEW-26', title: 'Primary Market Developer Relations', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Developers', flowchartRef: 'FC-26', status: 'active' },
  { id: 'project-launch-carousel', code: 'VIEW-27', title: 'Project Launch Scheduling Carousel', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Launches', flowchartRef: 'FC-27', status: 'active' },
  { id: 'offplan-tier-matrix', code: 'VIEW-28', title: 'Off-Plan Property Tier Matrix', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Tier Matrix', flowchartRef: 'FC-28', status: 'active' },
  { id: 'unit-allocation-grid', code: 'VIEW-29', title: 'Developer Unit Allocation Grid', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Allocations', flowchartRef: 'FC-29', status: 'active' },
  { id: 'commission-accelerator', code: 'VIEW-30', title: 'Commission Accelerator Counter', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Accelerator', flowchartRef: 'FC-30', status: 'active' },
  { id: 'payment-plan-builder', code: 'VIEW-31', title: 'Custom Payment Plan Builder', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Payment Plans', flowchartRef: 'FC-31', status: 'active' },
  { id: 'construction-milestone-tracker', code: 'VIEW-32', title: 'Construction Milestone Tracker', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Progress', flowchartRef: 'FC-32', status: 'active' },
  { id: 'buyer-reservation-flow', code: 'VIEW-33', title: 'Buyer Unit Reservation Flow', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Reserve', flowchartRef: 'FC-33', status: 'active' },
  { id: 'spa-contract-generator', code: 'VIEW-34', title: 'SPA Contract Generator & Preview', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → SPA Drafts', flowchartRef: 'FC-34', status: 'active' },
  { id: 'offplan-handover-schedule', code: 'VIEW-35', title: 'Off-Plan Handover Schedule', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Handovers', flowchartRef: 'FC-35', status: 'active' },
  { id: 'snagging-inspection-list', code: 'VIEW-36', title: 'Snagging Inspection Checklist', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Snagging', flowchartRef: 'FC-36', status: 'active' },
  { id: 'escrow-account-monitor', code: 'VIEW-37', title: 'DLD Escrow Account Monitor', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Escrow', flowchartRef: 'FC-37', status: 'active' },
  { id: 'oqood-registration-tracker', code: 'VIEW-38', title: 'Oqood Pre-Title Registration', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Oqood', flowchartRef: 'FC-38', status: 'active' },
  { id: 'project-roi-comparator', code: 'VIEW-39', title: 'Off-Plan ROI Comparison Engine', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Compare ROI', flowchartRef: 'FC-39', status: 'active' },
  { id: 'offplan-analytics-report', code: 'VIEW-40', title: 'Off-Plan Analytics Report Builder', category: 'Off-Plan', group: 'Strategic Off-Plan', entryPoint: 'Left Sidebar → Off-Plan → Reports', flowchartRef: 'FC-40', status: 'active' },

  // ── GROUP 4: PORTFOLIO MANAGEMENT & LEASING (41 - 55) ──────────────────
  { id: 'rental-portfolio-dashboard', code: 'VIEW-41', title: 'High-Volume Rental Dashboard', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Overview', flowchartRef: 'FC-41', status: 'active' },
  { id: 'ejari-contract-lifecycle', code: 'VIEW-42', title: 'Automated Ejari Contract Lifecycle', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Ejari', flowchartRef: 'FC-42', status: 'active' },
  { id: 'lease-renewal-tracking-grid', code: 'VIEW-43', title: 'Lease Renewal Tracking Grid', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Renewals', flowchartRef: 'FC-43', status: 'active' },
  { id: 'tenant-comms-dashboard', code: 'VIEW-44', title: 'Tenant Relations Communication', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Tenants', flowchartRef: 'FC-44', status: 'active' },
  { id: 'landlord-listing-drawer', code: 'VIEW-45', title: 'Landlord Listing Drawer', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Landlords', flowchartRef: 'FC-45', status: 'active' },
  { id: 'move-in-out-slots', code: 'VIEW-46', title: 'Move-in / Move-out Workspace', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Move In/Out', flowchartRef: 'FC-46', status: 'active' },
  { id: 'pdc-cheque-tracker', code: 'VIEW-47', title: 'Post-Dated Cheque (PDC) Schedule', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → PDC Cheques', flowchartRef: 'FC-47', status: 'active' },
  { id: 'tenancy-agreement-wizard', code: 'VIEW-48', title: 'Tenancy Agreement Creator Wizard', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → New Agreement', flowchartRef: 'FC-48', status: 'active' },
  { id: 'security-deposit-ledger', code: 'VIEW-49', title: 'Tenant Security Deposit Ledger', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Deposits', flowchartRef: 'FC-49', status: 'active' },
  { id: 'rent-collection-matrix', code: 'VIEW-50', title: 'Rent Collection Matrix', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Collections', flowchartRef: 'FC-50', status: 'active' },
  { id: 'eviction-notice-workflow', code: 'VIEW-51', title: 'Legal Eviction Notice Workflow', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Evictions', flowchartRef: 'FC-51', status: 'active' },
  { id: 'tenant-onboarding-portal', code: 'VIEW-52', title: 'Tenant Onboarding Portal', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Onboarding', flowchartRef: 'FC-52', status: 'active' },
  { id: 'property-condition-report', code: 'VIEW-53', title: 'Property Condition Inspection', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Condition', flowchartRef: 'FC-53', status: 'active' },
  { id: 'lease-early-termination', code: 'VIEW-54', title: 'Early Lease Termination Calculator', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Terminations', flowchartRef: 'FC-54', status: 'active' },
  { id: 'leasing-portfolio-reports', code: 'VIEW-55', title: 'Leasing Portfolio Reports', category: 'Leasing', group: 'Portfolio & Leasing', entryPoint: 'Left Sidebar → Leasing → Reports', flowchartRef: 'FC-55', status: 'active' },

  // ── GROUP 5: ASSET MANAGEMENT & FACILITIES (56 - 70) ───────────────────
  { id: 'dh2-property-matrix-table', code: 'VIEW-56', title: 'High-Density 9,378-Unit Property Matrix', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Master Units', flowchartRef: 'FC-56', status: 'active' },
  { id: 'neighborhood-cluster-tiles', code: 'VIEW-57', title: 'Filterable Neighborhood Cluster Tiles', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Clusters', flowchartRef: 'FC-57', status: 'active' },
  { id: 'occupancy-badge-view', code: 'VIEW-58', title: 'Occupancy Color-Badge View', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Occupancy', flowchartRef: 'FC-58', status: 'active' },
  { id: 'maintenance-request-list', code: 'VIEW-59', title: 'Property Maintenance Request List', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Requests', flowchartRef: 'FC-59', status: 'active' },
  { id: 'contractor-allocation-board', code: 'VIEW-60', title: 'Third-Party Contractor Allocation', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Contractors', flowchartRef: 'FC-60', status: 'active' },
  { id: 'building-system-health', code: 'VIEW-61', title: 'Building Systems Health Monitor', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Health', flowchartRef: 'FC-61', status: 'active' },
  { id: 'utility-consumption-tracker', code: 'VIEW-62', title: 'Dewa/Utility Consumption Tracker', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Utilities', flowchartRef: 'FC-62', status: 'active' },
  { id: 'parking-slot-manager', code: 'VIEW-63', title: 'Parking Slot Manager View', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Parking', flowchartRef: 'FC-63', status: 'active' },
  { id: 'amenity-reservation-system', code: 'VIEW-64', title: 'Amenity Reservation System', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Amenities', flowchartRef: 'FC-64', status: 'active' },
  { id: 'property-insurance-vault', code: 'VIEW-65', title: 'Property Insurance Policy Vault', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Insurance', flowchartRef: 'FC-65', status: 'active' },
  { id: 'equipment-warranty-log', code: 'VIEW-66', title: 'Equipment Warranty & Service Log', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Warranties', flowchartRef: 'FC-66', status: 'active' },
  { id: 'vendor-sla-scorecard', code: 'VIEW-67', title: 'Vendor Performance SLA Scorecard', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Vendors', flowchartRef: 'FC-67', status: 'active' },
  { id: 'work-order-kanban', code: 'VIEW-68', title: 'Facility Work Order Kanban Board', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Work Orders', flowchartRef: 'FC-68', status: 'active' },
  { id: 'asset-depreciation-schedule', code: 'VIEW-69', title: 'Asset Depreciation Schedule', category: 'Assets', group: 'Asset Management', entryPoint: 'Left Sidebar → Assets → Depreciation', flowchartRef: 'FC-69', status: 'active' },
  { id: 'facilities-audit-report', code: 'VIEW-70', title: 'Facilities Audit Report Generator', category: 'Facilities', group: 'Asset Management', entryPoint: 'Left Sidebar → Facilities → Reports', flowchartRef: 'FC-70', status: 'active' },

  // ── GROUP 6: REVENUE, FINANCE & TREASURY (71 - 85) ────────────────────
  { id: 'commission-split-calculator', code: 'VIEW-71', title: 'Automated Commission Split Calculator', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Splits', flowchartRef: 'FC-71', status: 'active' },
  { id: 'financial-approval-workflow', code: 'VIEW-72', title: '4-Step Financial Approval Workflow', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Approvals', flowchartRef: 'FC-72', status: 'active' },
  { id: 'ar-aging-columns', code: 'VIEW-73', title: 'Accounts Receivable (AR) Aging Columns', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Receivables', flowchartRef: 'FC-73', status: 'active' },
  { id: 'budget-vs-actual-variance', code: 'VIEW-74', title: 'Budget vs Actual Variance Graphs', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Budget', flowchartRef: 'FC-74', status: 'active' },
  { id: 'vat-return-export-sheets', code: 'VIEW-75', title: 'UAE FTA-Compliant VAT Export', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → VAT Export', flowchartRef: 'FC-75', status: 'active' },
  { id: 'rolling-cashflow-forecast', code: 'VIEW-76', title: 'Rolling 12-Month Cashflow Forecast', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Cashflow', flowchartRef: 'FC-76', status: 'active' },
  { id: 'agent-payout-schedule', code: 'VIEW-77', title: 'Agent Payout Schedule Rules', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Payouts', flowchartRef: 'FC-77', status: 'active' },
  { id: 'trn-invoice-generator', code: 'VIEW-78', title: 'Tax Invoice (TRN) Generator', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Tax Invoices', flowchartRef: 'FC-78', status: 'active' },
  { id: 'corporate-expense-claims', code: 'VIEW-79', title: 'Corporate Expense Claim Flow', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Expenses', flowchartRef: 'FC-79', status: 'active' },
  { id: 'proforma-pl-statement', code: 'VIEW-80', title: 'Pro-Forma P&L Statement Engine', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → P&L', flowchartRef: 'FC-80', status: 'active' },
  { id: 'bank-statement-reconciler', code: 'VIEW-81', title: 'Bank Statement Auto-Reconciler', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Reconciliation', flowchartRef: 'FC-81', status: 'active' },
  { id: 'corporate-tax-calendar', code: 'VIEW-82', title: 'UAE Corporate Tax Calendar', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Corporate Tax', flowchartRef: 'FC-82', status: 'active' },
  { id: 'executive-financial-summary', code: 'VIEW-83', title: 'Executive Financial Summary', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Overview', flowchartRef: 'FC-83', status: 'active' },
  { id: 'auditor-data-export-pack', code: 'VIEW-84', title: 'External Auditor Export Pack', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Audit Pack', flowchartRef: 'FC-84', status: 'active' },
  { id: 'financial-analytics-reports', code: 'VIEW-85', title: 'Financial Analytics Reports', category: 'Finance', group: 'Revenue & Finance', entryPoint: 'Left Sidebar → Finance → Reports', flowchartRef: 'FC-85', status: 'active' },

  // ── GROUP 7: MARKETING, COMMS, COMPLIANCE, LEGAL & INTEL (86 - 100) ───
  { id: 'performance-marketing-roi', code: 'VIEW-86', title: 'Performance Marketing ROI Scoreboard', category: 'Marketing', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Marketing → ROI', flowchartRef: 'FC-86', status: 'active' },
  { id: 'nadia-whatsapp-pool-monitor', code: 'VIEW-87', title: 'Nadia WhatsApp Routing Pool', category: 'Comms', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Comms → WhatsApp Pool', flowchartRef: 'FC-87', status: 'active' },
  { id: 'response-sla-ticker', code: 'VIEW-88', title: 'Real-time Response SLA Ticker', category: 'Comms', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Comms → Response SLA', flowchartRef: 'FC-88', status: 'active' },
  { id: 'ai-assistant-avatar-hub', code: 'VIEW-89', title: 'AI Assistant Avatar Hub', category: 'AI Center', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → AI Center → Avatar Hub', flowchartRef: 'FC-89', status: 'active' },
  { id: 'rera-dld-checklist-tracker', code: 'VIEW-90', title: 'RERA/DLD Compliance Checklist', category: 'Compliance', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Compliance → RERA/DLD', flowchartRef: 'FC-90', status: 'active' },
  { id: 'form7-rent-increase-notice', code: 'VIEW-91', title: 'Form 7 Rent Increase Notice', category: 'Legal', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Legal → Form 7', flowchartRef: 'FC-91', status: 'active' },
  { id: 'form12-eviction-timeline', code: 'VIEW-92', title: 'Form 12 Eviction Notice Timeline', category: 'Legal', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Legal → Form 12', flowchartRef: 'FC-92', status: 'active' },
  { id: 'form6-lease-contract-log', code: 'VIEW-93', title: 'Form 6 Lease Broker Contract Log', category: 'Legal', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Legal → Form 6', flowchartRef: 'FC-93', status: 'active' },
  { id: 'sentinel-predictive-pricing', code: 'VIEW-94', title: 'Sentinel Predictive Pricing Map', category: 'Intel', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Intel → Pricing Map', flowchartRef: 'FC-94', status: 'active' },
  { id: 'iot-sensor-anomaly-heatmap', code: 'VIEW-95', title: 'IoT Property Sensor Heatmap', category: 'Intel', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Intel → Sensor Heatmap', flowchartRef: 'FC-95', status: 'active' },
  { id: 'social-campaign-publisher', code: 'VIEW-96', title: 'Social Media Campaign Publisher', category: 'Marketing', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Marketing → Social', flowchartRef: 'FC-96', status: 'active' },
  { id: 'email-nurture-builder', code: 'VIEW-97', title: 'Email Nurture Sequence Builder', category: 'Marketing', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Marketing → Email Sequences', flowchartRef: 'FC-97', status: 'active' },
  { id: 'marketing-content-calendar', code: 'VIEW-98', title: 'Marketing Content Calendar', category: 'Marketing', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Marketing → Calendar', flowchartRef: 'FC-98', status: 'active' },
  { id: 'competitor-market-share', code: 'VIEW-99', title: 'Competitor Market Share Monitor', category: 'Intel', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Intel → Competitors', flowchartRef: 'FC-99', status: 'active' },
  { id: 'uae-pdpl-privacy-audit', code: 'VIEW-100', title: 'UAE PDPL Data Privacy Audit', category: 'Compliance', group: 'Marketing & Compliance', entryPoint: 'Left Sidebar → Compliance → Data Privacy', flowchartRef: 'FC-100', status: 'active' }
];

export function getViewByCode(code: string): ViewDefinition | undefined {
  return VIEWS_REGISTRY.find(v => v.code === code || v.id === code);
}

export function getViewsByCategory(category: string): ViewDefinition[] {
  return VIEWS_REGISTRY.filter(v => v.category.toLowerCase() === category.toLowerCase());
}
