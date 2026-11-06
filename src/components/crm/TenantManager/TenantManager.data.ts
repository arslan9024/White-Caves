// FILE: src/components/crm/TenantManager/TenantManager.data.ts
/**
 * White Caves Real Estate LLC - Tenant Manager Mock Matrices & Seeds
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  TenantLease,
  TenantPaymentRecord,
  MoveInInspectionItem,
  TenantTicket,
  TenantMetrics,
} from './TenantManager.types';

export const INITIAL_TENANT_LEASE: TenantLease = {
  id: 'lease-ten-001',
  leaseContractNumber: 'WC-DLD-LEASE-2026-9901',
  ejariNumber: '0120250912004419',
  propertyTitle: 'Marina Gate Tower 1 Luxury 2BR',
  community: 'Dubai Marina',
  unitNumber: 'Unit 1204',
  landlordName: 'H.E. Dr. Akram Al-Sayed',
  landlordPhone: '+971 4 332 9900',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  annualRentAed: 165000,
  securityDepositAed: 8250,
  paymentFrequency: '4 cheques',
  isSignedDigitally: true,
  signedAt: '2025-12-28T10:15:00Z',
  contractPdfUrl: '/documents/tenancy_contract_0120250912004419.pdf',
};

export const INITIAL_TENANT_PAYMENTS: TenantPaymentRecord[] = [
  {
    id: 'pay-001',
    chequeOrRefNumber: 'CHQ-882910',
    installmentLabel: '1st Installment (Move-in Q1)',
    amountAed: 41250,
    dueDate: '2026-01-01',
    paidDate: '2026-01-02',
    status: 'paid',
    paymentMethod: 'PDC Cheque',
    receiptNumber: 'RCP-2026-00192',
  },
  {
    id: 'pay-002',
    chequeOrRefNumber: 'CHQ-882911',
    installmentLabel: '2nd Installment (Q2)',
    amountAed: 41250,
    dueDate: '2026-04-01',
    paidDate: '2026-04-02',
    status: 'paid',
    paymentMethod: 'PDC Cheque',
    receiptNumber: 'RCP-2026-00481',
  },
  {
    id: 'pay-003',
    chequeOrRefNumber: 'CHQ-882912',
    installmentLabel: '3rd Installment (Q3)',
    amountAed: 41250,
    dueDate: '2026-07-01',
    status: 'upcoming',
    paymentMethod: 'PDC Cheque',
  },
  {
    id: 'pay-004',
    chequeOrRefNumber: 'CHQ-882913',
    installmentLabel: '4th Installment (Q4)',
    amountAed: 41250,
    dueDate: '2026-10-01',
    status: 'upcoming',
    paymentMethod: 'PDC Cheque',
  },
];

export const INITIAL_INSPECTION_ITEMS: MoveInInspectionItem[] = [
  {
    id: 'snag-001',
    room: 'Master Bedroom',
    element: 'Balcony Sliding Door Seal',
    condition: 'Minor dust on track, slides smoothly',
    status: 'passed',
  },
  {
    id: 'snag-002',
    room: 'Kitchen',
    element: 'Siemens Induction Hob',
    condition: 'Tested all 4 zones, fully operational',
    status: 'passed',
  },
  {
    id: 'snag-003',
    room: 'Guest Bathroom',
    element: 'Vanity Mirror Backlight',
    condition: 'Flickering LED strip connector identified during handover',
    status: 'flagged',
    notes: 'Contractor requested to replace driver module before move-in week',
  },
  {
    id: 'snag-004',
    room: 'Living Room',
    element: 'Main Thermostat Unit',
    condition: 'Calibrated to 22C, airflow confirmed',
    status: 'passed',
  },
];

export const INITIAL_TENANT_TICKETS: TenantTicket[] = [
  {
    id: 'tkt-ten-001',
    ticketNumber: 'TKT-AC-302',
    category: 'ac_cooling',
    title: 'AC secondary bedroom filter maintenance',
    description: 'Quarterly clean-air duct cleaning requested per tenancy contract clause 8',
    priority: 'standard',
    status: 'scheduled',
    scheduledDate: '2026-11-12',
    submittedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'tkt-ten-002',
    ticketNumber: 'TKT-PLUMB-109',
    category: 'plumbing',
    title: 'Kitchen faucet aerator replacement',
    description: 'Low water flow detected after municipal pipe maintenance',
    priority: 'urgent',
    status: 'submitted',
    submittedAt: '2026-11-05T14:30:00Z',
  },
];

export const DEFAULT_TENANT_METRICS: TenantMetrics = {
  annualRentAed: 165000,
  leaseDaysRemaining: 214,
  upcomingPaymentAmountAed: 41250,
  nextPaymentDueDate: '2026-07-01',
  totalPaidAed: 82500,
  openTicketsCount: 2,
  snagItemsCount: 1,
};
