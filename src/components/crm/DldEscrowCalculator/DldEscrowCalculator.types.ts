// FILE: src/components/crm/DldEscrowCalculator/DldEscrowCalculator.types.ts
/**
 * White Caves Real Estate LLC - DLD & Sovereign Escrow Underwriting Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type PropertyCategory = 'READY_RESIDENTIAL' | 'OFF_PLAN' | 'COMMERCIAL' | 'LAND';

export type BuyerType = 'INDIVIDUAL_RESIDENT' | 'INDIVIDUAL_NON_RESIDENT' | 'CORPORATE_LOCAL' | 'CORPORATE_OFFSHORE';

export interface EscrowCalculationInput {
  propertyPrice: number;
  category: PropertyCategory;
  buyerType: BuyerType;
  hasMortgage: boolean;
  mortgageAmount: number;
  commissionPercentage: number;
  developerEscrowAcc: string;
}

export interface EscrowBreakdownItem {
  key: string;
  label: string;
  amount: number;
  recipient: string;
  isMandatory: boolean;
  percentage?: number;
  description: string;
}

export interface EscrowCalculationResult {
  propertyPrice: number;
  dldTransferFee: number;
  dldAdminFee: number;
  trusteeFee: number;
  mortgageRegistrationFee: number;
  mortgageAdminFee: number;
  agencyCommission: number;
  vatOnCommission: number;
  corporateTaxReserve: number;
  totalGovFees: number;
  totalClosingCosts: number;
  totalFundRequired: number;
  escrowAccountNumber: string;
  breakdown: EscrowBreakdownItem[];
}
