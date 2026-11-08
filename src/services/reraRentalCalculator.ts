/**
 * DLD RERA Official Rental Increase Calculator & Statutory Timeout Fallback
 * Domain: DLD, RERA, Ejari & Legal Compliance Engine (Domain 4)
 * Standard: Decree No. (43) of 2013 regarding Rent Increases in Dubai
 */

export interface ReraRentalCalcInput {
  currentRentAed: number;
  benchmarkAverageRentAed: number;
  propertyType: 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
  contractRenewalDate: string; // ISO date
}

export interface ReraRentalCalcResult {
  currentRentAed: number;
  benchmarkAverageRentAed: number;
  gapPercentage: number;
  maxPermissibleIncreasePercentage: number;
  maxPermissibleNewRentAed: number;
  annualRentIncreaseAmountAed: number;
  legalNoticeRequirementDays: number;
  statutoryReference: string;
  isEligibleForIncrease: boolean;
}

/**
 * Calculates permissible rent increase per official Dubai Decree No. 43 of 2013:
 * - Difference < 11%: 0% increase
 * - Difference 11% to 20%: max 5% increase
 * - Difference 21% to 30%: max 10% increase
 * - Difference 31% to 40%: max 15% increase
 * - Difference > 40%: max 20% increase
 */
export function calculateReraPermissibleRent(input: ReraRentalCalcInput): ReraRentalCalcResult {
  const { currentRentAed, benchmarkAverageRentAed } = input;

  if (currentRentAed <= 0 || benchmarkAverageRentAed <= 0) {
    throw new Error('Rent amounts must be positive numbers');
  }

  const gapPercentage = ((benchmarkAverageRentAed - currentRentAed) / currentRentAed) * 100;

  let maxIncreasePct = 0;
  if (gapPercentage >= 11 && gapPercentage <= 20) {
    maxIncreasePct = 5;
  } else if (gapPercentage > 20 && gapPercentage <= 30) {
    maxIncreasePct = 10;
  } else if (gapPercentage > 30 && gapPercentage <= 40) {
    maxIncreasePct = 15;
  } else if (gapPercentage > 40) {
    maxIncreasePct = 20;
  }

  const annualRentIncreaseAmountAed = (currentRentAed * maxIncreasePct) / 100;
  const maxPermissibleNewRentAed = currentRentAed + annualRentIncreaseAmountAed;

  return {
    currentRentAed,
    benchmarkAverageRentAed,
    gapPercentage: Math.round(gapPercentage * 100) / 100,
    maxPermissibleIncreasePercentage: maxIncreasePct,
    maxPermissibleNewRentAed: Math.round(maxPermissibleNewRentAed),
    annualRentIncreaseAmountAed: Math.round(annualRentIncreaseAmountAed),
    legalNoticeRequirementDays: 90, // Statutory 90 days prior to contract expiry
    statutoryReference: 'Dubai Decree No. (43) of 2013 / Official RERA Rental Index',
    isEligibleForIncrease: maxIncreasePct > 0
  };
}

/**
 * 1500ms Fallback Timeout wrapper for DLD Government REST API calls
 */
export async function fetchWithDldFallback<T>(
  networkFetchPromise: Promise<T>,
  cachedFallbackData: T,
  timeoutMs = 1500
): Promise<{ data: T; source: 'LIVE_DLD_GATEWAY' | 'LOCAL_INDEX_FALLBACK'; latencyMs: number }> {
  const start = performance.now();
  try {
    const data = await Promise.race([
      networkFetchPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('DLD_TIMEOUT_EXCEEDED')), timeoutMs))
    ]);
    return {
      data,
      source: 'LIVE_DLD_GATEWAY',
      latencyMs: performance.now() - start
    };
  } catch {
    return {
      data: cachedFallbackData,
      source: 'LOCAL_INDEX_FALLBACK',
      latencyMs: performance.now() - start
    };
  }
}
