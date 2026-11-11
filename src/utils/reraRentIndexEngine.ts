/**
 * RERA Rent Index & Decree No. 43 of 2013 Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements Dubai Decree No. 43 of 2013 and Dubai Law No. 33 of 2008
 * governing statutory rent increase caps, 90-day notice schedules, and RERA index compliance.
 * Reference: .agents/docs/business-rules.md (BR-013)
 */

export interface RentIncreaseParams {
  currentAnnualRentAED: number;
  reraBenchmarkAnnualRentAED: number;
  leaseExpiryDate: string | Date;
}

export interface RentIncreaseResult {
  currentRentAED: number;
  reraBenchmarkRentAED: number;
  percentBelowBenchmark: number;
  maxPermissibleIncreasePct: number;
  maxPermissibleIncreaseAED: number;
  maxPermissibleNewRentAED: number;
  isIncreaseAllowed: boolean;
  isOverBenchmarkFlag: boolean; // Current rent is > 10% above benchmark (tenant reduction right)
  statutory90DayNoticeCutoffDate: string; // ISO date string (YYYY-MM-DD)
  legalBasis: string;
}

/**
 * Calculates the maximum permissible rent increase under Dubai Decree No. 43 of 2013.
 */
export function calculateReraPermissibleIncrease(params: RentIncreaseParams): RentIncreaseResult {
  const { currentAnnualRentAED, reraBenchmarkAnnualRentAED, leaseExpiryDate } = params;

  // Compute 90-day statutory notice cutoff
  const expiry = typeof leaseExpiryDate === 'string' ? new Date(leaseExpiryDate) : new Date(leaseExpiryDate);
  const cutoff = new Date(expiry);
  cutoff.setDate(cutoff.getDate() - 90);
  const statutory90DayNoticeCutoffDate = cutoff.toISOString().split('T')[0];

  if (currentAnnualRentAED <= 0 || reraBenchmarkAnnualRentAED <= 0) {
    return {
      currentRentAED: currentAnnualRentAED,
      reraBenchmarkRentAED: reraBenchmarkAnnualRentAED,
      percentBelowBenchmark: 0,
      maxPermissibleIncreasePct: 0,
      maxPermissibleIncreaseAED: 0,
      maxPermissibleNewRentAED: currentAnnualRentAED,
      isIncreaseAllowed: false,
      isOverBenchmarkFlag: false,
      statutory90DayNoticeCutoffDate,
      legalBasis: 'Dubai Decree No. 43 of 2013',
    };
  }

  // Percentage difference below benchmark
  const diff = reraBenchmarkAnnualRentAED - currentAnnualRentAED;
  const percentBelowBenchmark = Math.round((diff / reraBenchmarkAnnualRentAED) * 10000) / 100;

  // Current rent as percentage of benchmark
  const ratioOfBenchmark = (currentAnnualRentAED / reraBenchmarkAnnualRentAED) * 100;

  let maxPermissibleIncreasePct = 0;

  if (ratioOfBenchmark >= 90) {
    // Current rent is up to 10% below market average -> No increase
    maxPermissibleIncreasePct = 0;
  } else if (ratioOfBenchmark >= 80) {
    // Current rent is 11% to 20% below market average -> Max 5%
    maxPermissibleIncreasePct = 5;
  } else if (ratioOfBenchmark >= 70) {
    // Current rent is 21% to 30% below market average -> Max 10%
    maxPermissibleIncreasePct = 10;
  } else if (ratioOfBenchmark >= 60) {
    // Current rent is 31% to 40% below market average -> Max 15%
    maxPermissibleIncreasePct = 15;
  } else {
    // Current rent is more than 40% below market average -> Max 20%
    maxPermissibleIncreasePct = 20;
  }

  const maxPermissibleIncreaseAED = Math.round(currentAnnualRentAED * (maxPermissibleIncreasePct / 100));
  const maxPermissibleNewRentAED = currentAnnualRentAED + maxPermissibleIncreaseAED;
  const isOverBenchmarkFlag = currentAnnualRentAED > reraBenchmarkAnnualRentAED * 1.1;

  return {
    currentRentAED: currentAnnualRentAED,
    reraBenchmarkRentAED: reraBenchmarkAnnualRentAED,
    percentBelowBenchmark: Math.max(0, percentBelowBenchmark),
    maxPermissibleIncreasePct,
    maxPermissibleIncreaseAED,
    maxPermissibleNewRentAED,
    isIncreaseAllowed: maxPermissibleIncreasePct > 0,
    isOverBenchmarkFlag,
    statutory90DayNoticeCutoffDate,
    legalBasis: 'Dubai Decree No. 43 of 2013 (Rental Increase Regulation)',
  };
}
