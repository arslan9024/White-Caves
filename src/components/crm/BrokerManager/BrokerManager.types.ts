// FILE: src/components/crm/BrokerManager/BrokerManager.types.ts
/**
 * White Caves Real Estate LLC - Broker Manager TypeScript Contracts
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type BrokerTab = 'overview' | 'commissions' | 'leads' | 'compliance' | 'deals';

export type CommissionPayoutStatus = 'pending_escrow' | 'approved' | 'disbursed' | 'on_hold';

export type LeadSlaStatus = 'within_sla' | 'warning' | 'breached';

export interface BrokerCommissionDeal {
  id: string;
  dealNumber: string;
  propertyTitle: string;
  community: string;
  dealType: 'sale' | 'lease';
  dealValueAed: number;
  grossCommissionPercent: number;
  grossCommissionAed: number;
  vatRatePercent: number;
  vatAmountAed: number;
  netCommissionAed: number;
  companySplitPercent: number;
  brokerNetCommissionAed: number;
  payoutStatus: CommissionPayoutStatus;
  closingDate: string;
  clientName: string;
}

export interface AssignedLead {
  id: string;
  leadCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  budgetAed: number;
  targetCommunity: string;
  channel: 'WhatsApp' | 'PropertyFinder' | 'Bayut' | 'Website Direct' | 'Referral';
  assignedDate: string;
  slaMinutesRemaining: number;
  slaStatus: LeadSlaStatus;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'offer_submitted' | 'closed';
}

export interface ReraBrokerProfile {
  brokerName: string;
  brnNumber: string;
  reraCardExpiry: string;
  reraStatus: 'active' | 'renewal_due' | 'suspended';
  officeOrn: string;
  trakheesiPermitsActive: number;
  cpdHoursCompleted: number;
  cpdHoursRequired: number;
}

export interface BrokerMetrics {
  totalClosedVolumeAed: number;
  ytdCommissionAed: number;
  pendingPayoutsAed: number;
  activeLeadsCount: number;
  conversionRatePercent: number;
  reraDaysToExpiry: number;
}
