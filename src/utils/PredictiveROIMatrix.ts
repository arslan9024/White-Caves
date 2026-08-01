export interface PredictiveROIParams {
  purchasePriceAED: number;
  expectedAnnualRentAED: number;
  community: string;
  holdingPeriodYears?: number; // default 3 years
}

export interface PredictiveROIMetrics {
  grossRentalYield: number; // Percentage
  netRentalYield: number; // Percentage (after DLD 4%, Trustee AED 4,200, VAT 5%, service charge)
  projectedAppreciation3Yr: number; // Percentage
  totalProjectedROI: number; // Percentage total return
  estimatedTotalProfitAED: number;
}

const COMMUNITY_APPRECIATION_BENCHMARKS: Record<string, number> = {
  'DAMAC Hills 2': 18.5, // 3-year historical appreciation rate %
  'Palm Jumeirah': 24.0,
  'Dubai Marina': 15.2,
  'Downtown Dubai': 16.8,
  'Dubai Creek Harbour': 21.0,
};

/**
 * Calculates predictive rental yield, net yield, and 3-year capital appreciation for Dubai investor portfolios.
 */
export function calculatePredictiveROI({
  purchasePriceAED,
  expectedAnnualRentAED,
  community,
  holdingPeriodYears = 3,
}: PredictiveROIParams): PredictiveROIMetrics {
  if (purchasePriceAED <= 0) {
    return {
      grossRentalYield: 0,
      netRentalYield: 0,
      projectedAppreciation3Yr: 0,
      totalProjectedROI: 0,
      estimatedTotalProfitAED: 0,
    };
  }

  // 1. Gross Rental Yield
  const grossRentalYield = (expectedAnnualRentAED / purchasePriceAED) * 100;

  // 2. Acquisition Friction (DLD 4% + Trustee AED 4,200 + Admin AED 580)
  const dldFeeAED = purchasePriceAED * 0.04;
  const trusteeFeeAED = 4200;
  const totalUpfrontCostAED = purchasePriceAED + dldFeeAED + trusteeFeeAED;

  // 3. Estimated Maintenance / Service Charge (5% of rent)
  const annualServiceChargeAED = expectedAnnualRentAED * 0.05;
  const netAnnualRentAED = expectedAnnualRentAED - annualServiceChargeAED;
  const netRentalYield = (netAnnualRentAED / totalUpfrontCostAED) * 100;

  // 4. Capital Appreciation Forecast
  const baseAppreciation3Yr = COMMUNITY_APPRECIATION_BENCHMARKS[community] || 15.0;
  const annualAppreciationRate = baseAppreciation3Yr / 3 / 100;
  const futurePropertyValueAED = purchasePriceAED * Math.pow(1 + annualAppreciationRate, holdingPeriodYears);
  const capitalGainAED = futurePropertyValueAED - purchasePriceAED;

  // 5. Total Investor ROI
  const totalRentalIncomeAED = netAnnualRentAED * holdingPeriodYears;
  const estimatedTotalProfitAED = totalRentalIncomeAED + capitalGainAED;
  const totalProjectedROI = (estimatedTotalProfitAED / totalUpfrontCostAED) * 100;

  return {
    grossRentalYield: Number(grossRentalYield.toFixed(2)),
    netRentalYield: Number(netRentalYield.toFixed(2)),
    projectedAppreciation3Yr: Number(baseAppreciation3Yr.toFixed(2)),
    totalProjectedROI: Number(totalProjectedROI.toFixed(2)),
    estimatedTotalProfitAED: Math.round(estimatedTotalProfitAED),
  };
}
