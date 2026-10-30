/**
 * FounderExecutiveDashboard.data.ts
 * Static data, departmental telemetry configurations, and escrow datasets for the Founder Executive Suite.
 */

export interface DepartmentStatus {
  id: string;
  name: string;
  manager: string;
  aiLead: string;
  supervisors: number;
  health: 'Optimal' | 'Active' | 'Synchronized';
  icon: string;
  metric: string;
  moduleId: string;
}

export const CORPORATE_DEPARTMENTS_DATA: DepartmentStatus[] = [
  { id: 'dept-01', name: 'Executive & Strategy (MD Suite)', manager: 'Arslan Malik (MD)', aiLead: 'AI Zoe (COO)', supervisors: 9, health: 'Optimal', icon: '👑', metric: '100% SLA', moduleId: 'zoe' },
  { id: 'dept-02', name: 'Off-Plan & Primary Sales', manager: 'Tariq Al-Mansoor', aiLead: 'AI Clara', supervisors: 9, health: 'Optimal', icon: '🏗️', metric: 'AED 1.8B Pipeline', moduleId: 'off-plan-tracker' },
  { id: 'dept-03', name: 'Secondary Market & Resales', manager: 'Fatima Al-Sayed', aiLead: 'AI Zayed', supervisors: 9, health: 'Active', icon: '🏙️', metric: '48 Deals Active', moduleId: 'leads' },
  { id: 'dept-04', name: 'Tenancy, Leasing & Ejari', manager: 'Kareem Mostafa', aiLead: 'AI Victoria', supervisors: 9, health: 'Optimal', icon: '📜', metric: '9,378 Units Live', moduleId: 'tenancy-contracts' },
  { id: 'dept-05', name: 'Property Management & Handover', manager: 'Laila Benali', aiLead: 'AI Maktoum', supervisors: 9, health: 'Synchronized', icon: '🔑', metric: '100% Snagging', moduleId: 'property-management' },
  { id: 'dept-06', name: 'Corporate Finance & VAT Accounting', manager: 'Omar Farooq', aiLead: 'AI Theodora', supervisors: 9, health: 'Optimal', icon: '💰', metric: 'FTA Form 201 Ready', moduleId: 'finance' },
  { id: 'dept-07', name: 'Marketing & Luxury PR', manager: 'Nour El-Din', aiLead: 'AI Olivia', supervisors: 9, health: 'Active', icon: '✨', metric: '4.8M Impressions', moduleId: 'marketing' },
  { id: 'dept-08', name: 'Customer Experience & VIP Concierge', manager: 'Yasmin Qureshi', aiLead: 'AI Corinne', supervisors: 9, health: 'Optimal', icon: '🛎️', metric: '99.4% CSAT', moduleId: 'crm-hub' },
  { id: 'dept-09', name: 'Technology & AI Engineering (AEGIS)', manager: 'Hassan Raza', aiLead: 'AI Aurora (CTO)', supervisors: 9, health: 'Optimal', icon: '💻', metric: '121 AI Mesh Live', moduleId: 'ai-command' },
  { id: 'dept-10', name: 'Legal, Compliance & goAML RegTech', manager: 'Rashid Al-Nuaimi', aiLead: 'AI Sofia', supervisors: 9, health: 'Optimal', icon: '⚖️', metric: '0 Flags (AED 55k+)', moduleId: 'compliance' },
  { id: 'dept-11', name: 'HR & Talent Acquisition', manager: 'Salma Haddad', aiLead: 'AI Evangeline', supervisors: 9, health: 'Synchronized', icon: '👥', metric: '108 Supervisors', moduleId: 'hr' },
  { id: 'dept-12', name: 'Investments & Sovereign Family Office', manager: 'Zainab Al-Hashimi', aiLead: 'AI Nadia', supervisors: 9, health: 'Optimal', icon: '🌐', metric: 'AED 45.4B AUM', moduleId: 'investor-portfolio' },
];

export interface EscrowAccountItem {
  id: string;
  project: string;
  accountDetails: string;
  amountFormatted: string;
}

export const ESCROW_ACCOUNTS_DATA: EscrowAccountItem[] = [
  {
    id: 'escrow-dh2',
    project: 'DAMAC Hills 2 Master Inventory',
    accountDetails: 'Account: Emirates NBD Escrow • 9,378 Live Units',
    amountFormatted: 'AED 412.5M',
  },
  {
    id: 'escrow-palm',
    project: 'Palm Jumeirah Ultra-Prime Penthouses',
    accountDetails: 'Account: First Abu Dhabi Bank Escrow',
    amountFormatted: 'AED 430.0M',
  },
];

