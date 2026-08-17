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

export interface WorkspaceViewItem {
  id: string;
  code: string;
  title: string;
  category: string;
  path: string;
  isLocked?: boolean;
  minLevel?: number;
  badge?: string;
}

export const WORKSPACE_CATEGORIES: WorkspaceCategory[] = [
  { id: 'md_hub', label: '👑 Managing Director Hub (Level 5)', icon: 'Crown', isMdHub: true, badge: 'Sovereign' },
  { id: 'luxury_sales', label: '1. Luxury Sales & Brokerage', icon: 'TrendingUp' },
  { id: 'off_plan', label: '2. Strategic Off-Plan Developments', icon: 'Building' },
  { id: 'commercial', label: '3. Commercial & Investment', icon: 'Briefcase' },
  { id: 'leasing', label: '4. Residential Leasing & Ejari', icon: 'Key' },
  { id: 'asset_dh2', label: '5. Asset Management & DH2 Hub', icon: 'Wrench' },
  { id: 'revenue', label: '6. Revenue, Finance & Treasury', icon: 'DollarSign' },
  { id: 'marketing', label: '7. Performance Marketing', icon: 'Megaphone' },
  { id: 'comms', label: '8. Communications & WhatsApp', icon: 'MessageSquare' },
  { id: 'executive', label: '9. Corporate Governance', icon: 'Shield' },
  { id: 'compliance', label: '10. Regulatory & RERA Compliance', icon: 'FileCheck' },
  { id: 'conveyancing', label: '11. Conveyancing & Transfers', icon: 'Stamp' },
  { id: 'intelligence', label: '12. Market Intelligence & IoT', icon: 'BarChart3' },
];

export const WORKSPACE_VIEWS: WorkspaceViewItem[] = [
  // ─── MD HUB (Level 5 Sovereign) ──────────────────────────────────────────
  { id: 'VIEW-MD-01', code: 'MD-BRIEF', title: 'Executive Morning Briefing (08:00 AM)', category: 'md_hub', path: '/crm', minLevel: 5, badge: 'Daily' },
  { id: 'VIEW-MD-02', code: 'MD-DH2', title: 'DAMAC Hills 2 Cluster Matrix (9,378 Units)', category: 'md_hub', path: '/crm', minLevel: 5, badge: '9,378' },
  { id: 'VIEW-MD-03', code: 'MD-CRED', title: 'DET & RERA License Expiry Monitor', category: 'md_hub', path: '/profile', minLevel: 5, badge: 'Audit' },
  { id: 'VIEW-MD-04', code: 'MD-COMM', title: 'Commission & Revenue Ledger (AED)', category: 'md_hub', path: '/crm', minLevel: 5 },

  // ─── 12 Professional Departments ──────────────────────────────────────────
  { id: 'VIEW-01', code: 'SALES-01', title: 'Luxury Deals Pipeline', category: 'luxury_sales', path: '/crm' },
  { id: 'VIEW-02', code: 'SALES-02', title: 'VIP Matchmaker Desk (AI Hamdan)', category: 'luxury_sales', path: '/crm' },
  { id: 'VIEW-03', code: 'OFFPLAN-01', title: 'Developer Launch Predictor (AI Zayed)', category: 'off_plan', path: '/off-plan' },
  { id: 'VIEW-04', code: 'COMM-01', title: 'Commercial Portfolio Valuation (AI Maktoum)', category: 'commercial', path: '/crm' },
  { id: 'VIEW-05', code: 'LEASE-01', title: 'Ejari Unified Contracts (AI Nadia)', category: 'leasing', path: '/tenant-portal' },
  { id: 'VIEW-06', code: 'DH2-01', title: 'IoT Telemetry & Work Orders (AI Sentinel)', category: 'asset_dh2', path: '/crm' },
  { id: 'VIEW-07', code: 'REV-01', title: 'Multi-Currency Settlement (AI Theodora)', category: 'revenue', path: '/crm' },
  { id: 'VIEW-08', code: 'MKT-01', title: 'Portal Syndication Feeds (AI Olivia)', category: 'marketing', path: '/crm' },
  { id: 'VIEW-09', code: 'COMMS-01', title: 'WhatsApp 15-Min SLA Tracker (AI Chats)', category: 'comms', path: '/whatsapp-settings' },
  { id: 'VIEW-10', code: 'EXEC-01', title: 'Corporate Audit Log (AI Lion Heart)', category: 'executive', path: '/crm' },
  { id: 'VIEW-11', code: 'COMP-01', title: 'Trakheesi Permit Validator (AI Laila)', category: 'compliance', path: '/crm' },
  { id: 'VIEW-12', code: 'TRANS-01', title: 'DLD Trustee Appointments (AI Trustee)', category: 'conveyancing', path: '/crm' },
  { id: 'VIEW-13', code: 'INTEL-01', title: 'Dubai Price Forecaster (AI Predict)', category: 'intelligence', path: '/market-intelligence' },
];

export const WORKSPACE_LAYOUT_TEXT = {
  sidebarTitle: 'White Caves ERP',
  sidebarSubtitle: 'AEGIS 2.0 Command Grid',
  mdHubHeading: 'Executive MD Cockpit',
  searchPlaceholder: 'Quick filter department views...',
  founderBadge: 'Managing Director Level 5',
  liveStatus: 'Neural Grid Active (35 Agents)',
};
