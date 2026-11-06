// FILE: src/components/crm/BrokerManager/BrokerManager.data.ts
/**
 * White Caves Real Estate LLC - Broker Manager Mock Matrices & Seeds
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  BrokerCommissionDeal,
  AssignedLead,
  ReraBrokerProfile,
  BrokerMetrics,
} from './BrokerManager.types';

export const INITIAL_BROKER_DEALS: BrokerCommissionDeal[] = [
  {
    id: 'deal-brk-001',
    dealNumber: 'WC-DEAL-2026-8801',
    propertyTitle: 'One Palm Penthouse Suite',
    community: 'Palm Jumeirah',
    dealType: 'sale',
    dealValueAed: 14500000,
    grossCommissionPercent: 2.0,
    grossCommissionAed: 290000,
    vatRatePercent: 5.0,
    vatAmountAed: 14500,
    netCommissionAed: 290000,
    companySplitPercent: 50.0,
    brokerNetCommissionAed: 145000,
    payoutStatus: 'approved',
    closingDate: '2026-10-15',
    clientName: 'Lord Sterling Investments',
  },
  {
    id: 'deal-brk-002',
    dealNumber: 'WC-DEAL-2026-8802',
    propertyTitle: 'IL Primo Downtown Luxury 4BR',
    community: 'Downtown Dubai',
    dealType: 'sale',
    dealValueAed: 8900000,
    grossCommissionPercent: 2.0,
    grossCommissionAed: 178000,
    vatRatePercent: 5.0,
    vatAmountAed: 8900,
    netCommissionAed: 178000,
    companySplitPercent: 50.0,
    brokerNetCommissionAed: 89000,
    payoutStatus: 'pending_escrow',
    closingDate: '2026-11-02',
    clientName: 'Elena Vanechka Holdings',
  },
  {
    id: 'deal-brk-003',
    dealNumber: 'WC-DEAL-2026-8803',
    propertyTitle: 'Jumeirah Bay Island Sea Mansion',
    community: 'Jumeirah Bay',
    dealType: 'sale',
    dealValueAed: 32000000,
    grossCommissionPercent: 2.0,
    grossCommissionAed: 640000,
    vatRatePercent: 5.0,
    vatAmountAed: 32000,
    netCommissionAed: 640000,
    companySplitPercent: 50.0,
    brokerNetCommissionAed: 320000,
    payoutStatus: 'disbursed',
    closingDate: '2026-08-20',
    clientName: 'Sovereign Gulf Syndicate',
  },
];

export const INITIAL_ASSIGNED_LEADS: AssignedLead[] = [
  {
    id: 'lead-brk-101',
    leadCode: 'LEAD-DXB-9021',
    clientName: 'Maximilian Sterling',
    clientPhone: '+971 50 119 4432',
    clientEmail: 'm.sterling@sterling-cap.co.uk',
    budgetAed: 18000000,
    targetCommunity: 'Palm Jumeirah',
    channel: 'Website Direct',
    assignedDate: '2026-11-06T09:00:00Z',
    slaMinutesRemaining: 12,
    slaStatus: 'within_sla',
    status: 'new',
  },
  {
    id: 'lead-brk-102',
    leadCode: 'LEAD-DXB-9022',
    clientName: 'Nadia Bin Ladin',
    clientPhone: '+966 55 441 0928',
    clientEmail: 'nadia.bl@riyadhinv.sa',
    budgetAed: 12000000,
    targetCommunity: 'Downtown Dubai',
    channel: 'WhatsApp',
    assignedDate: '2026-11-06T10:30:00Z',
    slaMinutesRemaining: 4,
    slaStatus: 'warning',
    status: 'contacted',
  },
  {
    id: 'lead-brk-103',
    leadCode: 'LEAD-DXB-9023',
    clientName: 'Henrik Larsson',
    clientPhone: '+46 70 882 1190',
    clientEmail: 'h.larsson@nordicreal.se',
    budgetAed: 6500000,
    targetCommunity: 'Dubai Creek Harbour',
    channel: 'PropertyFinder',
    assignedDate: '2026-11-05T14:00:00Z',
    slaMinutesRemaining: 0,
    slaStatus: 'within_sla',
    status: 'viewing_scheduled',
  },
];

export const INITIAL_RERA_PROFILE: ReraBrokerProfile = {
  brokerName: 'Rashid Al-Nuaimi',
  brnNumber: '58492',
  reraCardExpiry: '2027-04-30',
  reraStatus: 'active',
  officeOrn: '44483',
  trakheesiPermitsActive: 14,
  cpdHoursCompleted: 24,
  cpdHoursRequired: 20,
};

export const DEFAULT_BROKER_METRICS: BrokerMetrics = {
  totalClosedVolumeAed: 55400000,
  ytdCommissionAed: 554000,
  pendingPayoutsAed: 234000,
  activeLeadsCount: 3,
  conversionRatePercent: 18.5,
  reraDaysToExpiry: 175,
};
