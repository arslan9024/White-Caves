/**
 * UAE FTA 5% VAT & 9% Corporate Tax Reserve Treasury Engine
 * Domain: Theodora Finance, Treasury & UAE Tax Engine (Domain 3)
 * Standard: UAE Federal Decree-Law No. (8) of 2017 & Corporate Tax Law No. (47) of 2022
 * Protocol: AEG-028, AEG-029, AEG-030, AEG-037, AEG-038
 */

export interface DealTaxInput {
  dealId: string;
  grossTransactionValueAed: number;
  agencyGrossCommissionAed: number;
  agentMeritXp: number; // Used for 60% -> 70% dynamic split
  quarterCumulativeProfitAed: number; // Tracks AED 375,000 threshold
  isCommercial: boolean;
}

export interface VatAndTaxBreakdown {
  dealId: string;
  vatRatePercent: 5;
  vatAmountAed: number; // 5% VAT on Agency Commission
  totalCommissionWithVatAed: number;
  corporateTaxApplicable: boolean;
  corporateTaxRatePercent: number; // 0% under AED 375k, 9% above
  corporateTaxReserveAmountAed: number;
  agentCommissionTierPercent: number; // 60% baseline -> 70% top-performer
  agentNetPayoutAed: number;
  companyNetRetainedAed: number;
  ftaBox1aVatReport: {
    standardRatedSuppliesAed: number;
    outputVatAed: number;
  };
}

export const CORPORATE_TAX_STATUTORY_THRESHOLD_AED = 375_000;
export const UAE_STANDARD_VAT_RATE_PERCENT = 5;

/**
 * Computes statutory UAE 5% VAT, 9% Corporate Tax reserves, and dynamic 60%-70% agent commission splits.
 */
export function calculateDealVatAndCorporateTax(input: DealTaxInput): VatAndTaxBreakdown {
  const {
    dealId,
    agencyGrossCommissionAed,
    agentMeritXp,
    quarterCumulativeProfitAed
  } = input;

  if (agencyGrossCommissionAed < 0) {
    throw new Error('Commission must be non-negative');
  }

  // 1. UAE 5% VAT on agency commission
  const vatAmountAed = Math.round((agencyGrossCommissionAed * (UAE_STANDARD_VAT_RATE_PERCENT / 100)) * 100) / 100;
  const totalCommissionWithVatAed = agencyGrossCommissionAed + vatAmountAed;

  // 2. Dynamic 60% -> 70% split based on agent merit XP (AEG-037/038)
  // Base split is 60%. If agent XP >= 2000, split elevates up to 70%.
  let agentCommissionTierPercent = 60;
  if (agentMeritXp >= 5000) {
    agentCommissionTierPercent = 70;
  } else if (agentMeritXp >= 2500) {
    agentCommissionTierPercent = 65;
  }

  const agentNetPayoutAed = Math.round((agencyGrossCommissionAed * (agentCommissionTierPercent / 100)) * 100) / 100;
  const companyGrossShare = agencyGrossCommissionAed - agentNetPayoutAed;

  // 3. UAE Corporate Tax (9% on profit above AED 375,000 threshold)
  const isAboveThreshold = quarterCumulativeProfitAed + companyGrossShare > CORPORATE_TAX_STATUTORY_THRESHOLD_AED;
  let corporateTaxReserveAmountAed = 0;
  let corporateTaxRatePercent = 0;

  if (isAboveThreshold) {
    corporateTaxRatePercent = 9;
    const taxableAmount = Math.max(
      0,
      (quarterCumulativeProfitAed + companyGrossShare) - Math.max(quarterCumulativeProfitAed, CORPORATE_TAX_STATUTORY_THRESHOLD_AED)
    );
    corporateTaxReserveAmountAed = Math.round((taxableAmount * 0.09) * 100) / 100;
  }

  const companyNetRetainedAed = companyGrossShare - corporateTaxReserveAmountAed;

  return {
    dealId,
    vatRatePercent: 5,
    vatAmountAed,
    totalCommissionWithVatAed,
    corporateTaxApplicable: isAboveThreshold,
    corporateTaxRatePercent,
    corporateTaxReserveAmountAed,
    agentCommissionTierPercent,
    agentNetPayoutAed,
    companyNetRetainedAed: Math.round(companyNetRetainedAed * 100) / 100,
    ftaBox1aVatReport: {
      standardRatedSuppliesAed: agencyGrossCommissionAed,
      outputVatAed: vatAmountAed
    }
  };
}
