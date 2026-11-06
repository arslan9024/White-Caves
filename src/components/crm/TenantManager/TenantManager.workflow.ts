// FILE: src/components/crm/TenantManager/TenantManager.workflow.ts
/**
 * White Caves Real Estate LLC - Tenant Manager Stateless Operational Chains
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

export function calculateTenantMetrics(
  lease: TenantLease,
  payments: TenantPaymentRecord[],
  tickets: TenantTicket[],
  inspections: MoveInInspectionItem[]
): TenantMetrics {
  const endDate = new Date(lease.endDate).getTime();
  const now = Date.now();
  const diffDays = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amountAed, 0);

  const upcomingPayments = payments.filter(p => p.status === 'upcoming');
  const nextPayment = upcomingPayments[0] || null;

  const openTickets = tickets.filter(t => t.status !== 'completed').length;
  const snagItems = inspections.filter(i => i.status === 'flagged').length;

  return {
    annualRentAed: lease.annualRentAed,
    leaseDaysRemaining: diffDays,
    upcomingPaymentAmountAed: nextPayment ? nextPayment.amountAed : 0,
    nextPaymentDueDate: nextPayment ? nextPayment.dueDate : '—',
    totalPaidAed: totalPaid,
    openTicketsCount: openTickets,
    snagItemsCount: snagItems,
  };
}

export function executeDigitalSignature(lease: TenantLease): TenantLease {
  return {
    ...lease,
    isSignedDigitally: true,
    signedAt: new Date().toISOString(),
  };
}

export function updateSnagItemStatus(
  items: MoveInInspectionItem[],
  itemId: string,
  newStatus: MoveInInspectionItem['status']
): MoveInInspectionItem[] {
  return items.map(item => (item.id === itemId ? { ...item, status: newStatus } : item));
}
