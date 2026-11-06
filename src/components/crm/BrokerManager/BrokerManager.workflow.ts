// FILE: src/components/crm/BrokerManager/BrokerManager.workflow.ts
/**
 * White Caves Real Estate LLC - Broker Manager Stateless Operational Chains
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  BrokerCommissionDeal,
  AssignedLead,
  ReraBrokerProfile,
  BrokerMetrics,
} from './BrokerManager.types';

export function calculateBrokerCommission(
  dealValueAed: number,
  commissionPercent: number = 2.0,
  splitPercent: number = 50.0,
  vatRatePercent: number = 5.0
): {
  grossCommissionAed: number;
  vatAmountAed: number;
  companyNetCommissionAed: number;
  brokerNetCommissionAed: number;
} {
  const grossCommissionAed = (dealValueAed * commissionPercent) / 100;
  const vatAmountAed = (grossCommissionAed * vatRatePercent) / 100;
  const brokerNetCommissionAed = (grossCommissionAed * splitPercent) / 100;
  const companyNetCommissionAed = grossCommissionAed - brokerNetCommissionAed;

  return {
    grossCommissionAed,
    vatAmountAed,
    companyNetCommissionAed,
    brokerNetCommissionAed,
  };
}

export function calculateBrokerMetrics(
  deals: BrokerCommissionDeal[],
  leads: AssignedLead[],
  reraProfile: ReraBrokerProfile
): BrokerMetrics {
  const totalClosedVolumeAed = deals.reduce((sum, d) => sum + d.dealValueAed, 0);
  const ytdCommissionAed = deals.reduce((sum, d) => sum + d.brokerNetCommissionAed, 0);

  const pendingPayoutsAed = deals
    .filter(d => d.payoutStatus === 'pending_escrow' || d.payoutStatus === 'approved')
    .reduce((sum, d) => sum + d.brokerNetCommissionAed, 0);

  const activeLeadsCount = leads.filter(l => l.status !== 'closed').length;
  const closedLeadsCount = leads.filter(l => l.status === 'closed').length;
  const conversionRatePercent = leads.length > 0 ? (closedLeadsCount / leads.length) * 100 : 20.0;

  const expiryTime = new Date(reraProfile.reraCardExpiry).getTime();
  const now = Date.now();
  const reraDaysToExpiry = Math.max(0, Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)));

  return {
    totalClosedVolumeAed,
    ytdCommissionAed,
    pendingPayoutsAed,
    activeLeadsCount,
    conversionRatePercent: Math.round(conversionRatePercent * 10) / 10,
    reraDaysToExpiry,
  };
}

export function updateLeadStatus(
  leads: AssignedLead[],
  leadId: string,
  newStatus: AssignedLead['status']
): AssignedLead[] {
  return leads.map(l => (l.id === leadId ? { ...l, status: newStatus } : l));
}
