// FILE: src/components/crm/LandlordManager/LandlordManager.workflow.ts
/**
 * White Caves Real Estate LLC - Landlord Manager Stateless Operational Chains
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  LandlordProperty,
  PdcCheque,
  MaintenanceTicket,
  LandlordMetrics,
  ChequeStatus,
} from './LandlordManager.types';

export interface WorkflowResult<T> {
  success: boolean;
  data: T;
  executedAt: string;
}

/**
 * Calculates real-time financial metrics across landlord assets.
 */
export function calculateLandlordMetrics(
  properties: LandlordProperty[],
  cheques: PdcCheque[],
  tickets: MaintenanceTicket[]
): LandlordMetrics {
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.occupancyStatus === 'occupied').length;
  const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

  const totalAnnualRentAed = properties.reduce((acc, p) => acc + p.annualRentAed, 0);

  const clearedPdcAed = cheques
    .filter(c => c.status === 'cleared')
    .reduce((acc, c) => acc + c.amountAed, 0);

  const pendingPdcAed = cheques
    .filter(c => c.status === 'pending' || c.status === 'in_escrow')
    .reduce((acc, c) => acc + c.amountAed, 0);

  const bouncedPdcAed = cheques
    .filter(c => c.status === 'bounced')
    .reduce((acc, c) => acc + c.amountAed, 0);

  const activeMaintenanceTickets = tickets.filter(
    t => t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  // Typical Dubai asset service charge & reserve deduction estimate (14%)
  const estimatedServiceCharges = totalAnnualRentAed * 0.14;
  const estimatedNetRent = totalAnnualRentAed - estimatedServiceCharges;
  // Estimated portfolio market value at 12x gross rent
  const estimatedPortfolioValue = totalAnnualRentAed * 12;
  const netRentalYieldPercent =
    estimatedPortfolioValue > 0 ? (estimatedNetRent / estimatedPortfolioValue) * 100 : 7.5;

  return {
    totalProperties,
    occupancyRate: Math.round(occupancyRate * 10) / 10,
    totalAnnualRentAed,
    clearedPdcAed,
    pendingPdcAed,
    bouncedPdcAed,
    activeMaintenanceTickets,
    netRentalYieldPercent: Math.round(netRentalYieldPercent * 100) / 100,
  };
}

/**
 * Pure transition function to shift PDC Cheque status.
 */
export function transitionChequeStatus(
  cheques: PdcCheque[],
  chequeId: string,
  newStatus: ChequeStatus
): WorkflowResult<PdcCheque[]> {
  const updated = cheques.map(c => (c.id === chequeId ? { ...c, status: newStatus } : c));
  return {
    success: true,
    data: updated,
    executedAt: new Date().toISOString(),
  };
}
