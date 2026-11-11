/**
 * Post-Dated Cheque (PDC) Compliance & Penalties Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements UAE Federal Decree Law No. 14 of 2020 (Commercial Transactions Law)
 * and RERA payment rules governing cheque validity, bounce fees, and replacement timelines.
 * Reference: .agents/docs/business-rules.md (BR-012)
 */

export interface BouncedChequePenaltyResult {
  chequeAmountAED: number;
  lateFeeAED: number; // 5% of cheque amount (min AED 200)
  bankReturnFeeAED: number;
  totalRecoveryDemandAED: number;
  replacementDeadlineBusinessDays: number;
}

export interface ChequeValidityResult {
  chequeDate: string;
  ageInDays: number;
  isStale: boolean; // Over 180 days (6 months)
  isNearExpiryWarning: boolean; // Between 150 and 180 days
  daysRemainingBeforeStale: number;
  legalStatus: 'VALID' | 'NEAR_EXPIRY_WARNING' | 'EXPIRED_STALE';
}

/**
 * Calculates late fee and recovery demand for a bounced cheque per BR-012-C.
 */
export function calculateBouncedChequePenalties(
  chequeAmountAED: number,
  bankReturnFeeAED: number = 150
): BouncedChequePenaltyResult {
  if (chequeAmountAED <= 0) {
    return {
      chequeAmountAED: 0,
      lateFeeAED: 0,
      bankReturnFeeAED: 0,
      totalRecoveryDemandAED: 0,
      replacementDeadlineBusinessDays: 5,
    };
  }

  // 5% of cheque amount, minimum AED 200
  const lateFee = Math.max(200, Math.round(chequeAmountAED * 0.05));
  const totalRecoveryDemand = chequeAmountAED + lateFee + bankReturnFeeAED;

  return {
    chequeAmountAED,
    lateFeeAED: lateFee,
    bankReturnFeeAED,
    totalRecoveryDemandAED: totalRecoveryDemand,
    replacementDeadlineBusinessDays: 5,
  };
}

/**
 * Evaluates whether a post-dated cheque is within its statutory 6-month (180 days) validity limit
 * under UAE Cheque Law.
 */
export function checkChequeValidity(
  chequeDate: string | Date,
  currentDate: string | Date = new Date()
): ChequeValidityResult {
  const cDate = typeof chequeDate === 'string' ? new Date(chequeDate) : new Date(chequeDate);
  const now = typeof currentDate === 'string' ? new Date(currentDate) : new Date(currentDate);

  const diffMs = now.getTime() - cDate.getTime();
  const ageInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 180 - ageInDays);

  const isStale = ageInDays > 180;
  const isNearExpiryWarning = ageInDays >= 150 && ageInDays <= 180;

  let legalStatus: 'VALID' | 'NEAR_EXPIRY_WARNING' | 'EXPIRED_STALE' = 'VALID';
  if (isStale) {
    legalStatus = 'EXPIRED_STALE';
  } else if (isNearExpiryWarning) {
    legalStatus = 'NEAR_EXPIRY_WARNING';
  }

  return {
    chequeDate: cDate.toISOString().split('T')[0],
    ageInDays: Math.max(0, ageInDays),
    isStale,
    isNearExpiryWarning,
    daysRemainingBeforeStale: daysRemaining,
    legalStatus,
  };
}
