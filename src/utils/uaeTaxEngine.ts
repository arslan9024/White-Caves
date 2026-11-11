/**
 * UAE Tax & DLD Compliance Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements statutory UAE tax calculations & DLD transaction fees:
 *   - UAE Federal Tax Authority (FTA) 5% VAT (Federal Decree-Law No. 8 of 2017)
 *   - UAE 9% Corporate Tax Reserve & Relief Slabs (Federal Decree-Law No. 47 of 2022)
 *   - Dubai Land Department (DLD) 4% Transfer Fees & Registration Trustee Fees
 *   - Reference: AEGIS Laws AEG-030, AEG-031
 */

export interface UaeVatResult {
  baseAmountAED: number;
  vatRatePct: number;
  vatAmountAED: number;
  totalWithVatAED: number;
}

export interface CorporateTaxResult {
  netProfitAED: number;
  statutoryReliefThresholdAED: number;
  taxableProfitAED: number;
  corporateTaxRatePct: number;
  taxReserveAmountAED: number;
  effectiveTaxRatePct: number;
}

export interface DldAcquisitionResult {
  purchasePriceAED: number;
  dldTransferFeeAED: number; // 4%
  trusteeFeeAED: number; // AED 4,200 for >= 500k, AED 2,100 for < 500k
  adminFeeAED: number; // AED 580
  trusteeVatAED: number; // 5% VAT on trustee fee
  totalFrictionAED: number;
  totalAcquisitionCostAED: number;
}

/**
 * Calculates UAE 5% VAT on taxable supplies, commissions, and service fees.
 */
export function calculateUaeVat(amountAED: number, vatRate: number = 0.05): UaeVatResult {
  if (amountAED <= 0) {
    return {
      baseAmountAED: 0,
      vatRatePct: vatRate * 100,
      vatAmountAED: 0,
      totalWithVatAED: 0,
    };
  }

  const vatAmount = Math.round(amountAED * vatRate * 100) / 100;
  return {
    baseAmountAED: amountAED,
    vatRatePct: vatRate * 100,
    vatAmountAED: vatAmount,
    totalWithVatAED: Math.round((amountAED + vatAmount) * 100) / 100,
  };
}

/**
 * Calculates UAE Corporate Tax reserve (9%) on annual net profit
 * above the statutory AED 375,000 threshold (Small Business Relief).
 */
export function calculateCorporateTaxReserve(
  netProfitAED: number,
  corporateTaxRate: number = 0.09,
  reliefThresholdAED: number = 375000
): CorporateTaxResult {
  if (netProfitAED <= reliefThresholdAED) {
    return {
      netProfitAED,
      statutoryReliefThresholdAED: reliefThresholdAED,
      taxableProfitAED: 0,
      corporateTaxRatePct: corporateTaxRate * 100,
      taxReserveAmountAED: 0,
      effectiveTaxRatePct: 0,
    };
  }

  const taxableProfit = netProfitAED - reliefThresholdAED;
  const taxReserve = Math.round(taxableProfit * corporateTaxRate);
  const effectiveRate = Math.round((taxReserve / netProfitAED) * 10000) / 100;

  return {
    netProfitAED,
    statutoryReliefThresholdAED: reliefThresholdAED,
    taxableProfitAED: taxableProfit,
    corporateTaxRatePct: corporateTaxRate * 100,
    taxReserveAmountAED: taxReserve,
    effectiveTaxRatePct: effectiveRate,
  };
}

/**
 * Calculates Dubai Land Department (DLD) transfer, registration trustee,
 * and administrative friction costs for property acquisitions.
 */
export function calculateDldAcquisitionCosts(purchasePriceAED: number): DldAcquisitionResult {
  if (purchasePriceAED <= 0) {
    return {
      purchasePriceAED: 0,
      dldTransferFeeAED: 0,
      trusteeFeeAED: 0,
      adminFeeAED: 0,
      trusteeVatAED: 0,
      totalFrictionAED: 0,
      totalAcquisitionCostAED: 0,
    };
  }

  const dldTransferFeeAED = Math.round(purchasePriceAED * 0.04);
  const trusteeFeeAED = purchasePriceAED >= 500000 ? 4200 : 2100;
  const adminFeeAED = 580;
  const trusteeVatAED = Math.round(trusteeFeeAED * 0.05);

  const totalFrictionAED = dldTransferFeeAED + trusteeFeeAED + adminFeeAED + trusteeVatAED;

  return {
    purchasePriceAED,
    dldTransferFeeAED,
    trusteeFeeAED,
    adminFeeAED,
    trusteeVatAED,
    totalFrictionAED,
    totalAcquisitionCostAED: purchasePriceAED + totalFrictionAED,
  };
}
