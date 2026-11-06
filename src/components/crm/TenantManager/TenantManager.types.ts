// FILE: src/components/crm/TenantManager/TenantManager.types.ts
/**
 * White Caves Real Estate LLC - Tenant Manager TypeScript Contracts
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type TenantTab = 'overview' | 'lease' | 'payments' | 'maintenance' | 'inspection';

export type PaymentStatus = 'paid' | 'upcoming' | 'overdue' | 'in_clearing';

export type InspectionItemStatus = 'passed' | 'pending' | 'flagged' | 'resolved';

export interface TenantLease {
  id: string;
  leaseContractNumber: string;
  ejariNumber: string;
  propertyTitle: string;
  community: string;
  unitNumber: string;
  landlordName: string;
  landlordPhone: string;
  startDate: string;
  endDate: string;
  annualRentAed: number;
  securityDepositAed: number;
  paymentFrequency: '1 cheque' | '2 cheques' | '4 cheques' | '6 cheques';
  isSignedDigitally: boolean;
  signedAt?: string;
  contractPdfUrl?: string;
}

export interface TenantPaymentRecord {
  id: string;
  chequeOrRefNumber: string;
  installmentLabel: string;
  amountAed: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod: 'PDC Cheque' | 'Credit Card' | 'Wire Transfer';
  receiptNumber?: string;
}

export interface MoveInInspectionItem {
  id: string;
  room: string;
  element: string;
  condition: string;
  status: InspectionItemStatus;
  notes?: string;
  photoUrl?: string;
}

export interface TenantTicket {
  id: string;
  ticketNumber: string;
  category: 'plumbing' | 'ac_cooling' | 'electrical' | 'locks_access' | 'appliance';
  title: string;
  description: string;
  priority: 'urgent' | 'standard' | 'low';
  status: 'submitted' | 'scheduled' | 'in_progress' | 'completed';
  scheduledDate?: string;
  submittedAt: string;
}

export interface TenantMetrics {
  annualRentAed: number;
  leaseDaysRemaining: number;
  upcomingPaymentAmountAed: number;
  nextPaymentDueDate: string;
  totalPaidAed: number;
  openTicketsCount: number;
  snagItemsCount: number;
}
