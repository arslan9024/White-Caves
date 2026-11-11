/**
 * Tenancy & Ejari Compliance Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements statutory validation rules, financial thresholds, and security deposit bounds:
 *   - Dubai Decree No. 26 of 2013 (Ejari Registration Mandate)
 *   - RERA Rental Deposit Caps: 5% unfurnished / 10% furnished
 *   - Legal Notice Requirements (Form 7: 90 days, Form 12: 12 months)
 *   - Late Rent Penalties & Escalations (Day 5, 10, 15 late fees)
 * Reference:
 *   - .agents/docs/business-rules.md (BR-006)
 *   - .agents/docs/tenancy-ejari.md
 *   - .agents/docs/leasing-intake-forms.md
 */

export interface SecurityDepositLimits {
  annualRentAED: number;
  furnishingStatus: 'UNFURNISHED' | 'FURNISHED';
  statutoryDepositRatePct: number;
  standardDepositAED: number;
}

export interface LeaseEjariComplianceCheck {
  ejariContractNumber?: string;
  ejariRegistrationDate?: string | Date;
  ejariExpiryDate?: string | Date;
  isEjariMandatorySatisfied: boolean;
  daysUntilEjariExpiry?: number;
  isEjariExpiringSoon: boolean; // <= 30 days before expiry
}

export interface OverdueRentLateFeeResult {
  monthlyRentAED: number;
  daysOverdue: number;
  lateFeePct: number;
  lateFeeAED: number;
  escalationLevel: 'REMINDER_1' | 'REMINDER_2' | 'LATE_FEE_ASSESSED' | 'LEGAL_ESCALATION';
  actionRequired: string;
}

/**
 * Calculates standard legal security deposit based on RERA furnishing guidelines.
 * 5% for unfurnished, 10% for furnished properties.
 */
export function calculateSecurityDeposit(
  annualRentAED: number,
  furnishingStatus: 'UNFURNISHED' | 'FURNISHED'
): SecurityDepositLimits {
  const statutoryDepositRatePct = furnishingStatus === 'FURNISHED' ? 10 : 5;
  const standardDepositAED = Math.round(annualRentAED * (statutoryDepositRatePct / 100));

  return {
    annualRentAED,
    furnishingStatus,
    statutoryDepositRatePct,
    standardDepositAED,
  };
}

/**
 * Validates Ejari activation compliance and calculates expiry countdown.
 * Per BR-006-A & Dubai Decree No. 26 of 2013.
 */
export function validateEjariCompliance(
  ejariContractNumber?: string,
  ejariExpiryDate?: string | Date,
  currentDate: string | Date = new Date()
): LeaseEjariComplianceCheck {
  const hasValidContractNumber = Boolean(ejariContractNumber && ejariContractNumber.trim().length >= 6);
  const now = typeof currentDate === 'string' ? new Date(currentDate) : new Date(currentDate);

  let daysUntilEjariExpiry: number | undefined = undefined;
  let isEjariExpiringSoon = false;

  if (ejariExpiryDate) {
    const expiry = typeof ejariExpiryDate === 'string' ? new Date(ejariExpiryDate) : new Date(ejariExpiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    daysUntilEjariExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    isEjariExpiringSoon = daysUntilEjariExpiry <= 30 && daysUntilEjariExpiry >= 0;
  }

  return {
    ejariContractNumber,
    ejariRegistrationDate: undefined,
    ejariExpiryDate,
    isEjariMandatorySatisfied: hasValidContractNumber,
    daysUntilEjariExpiry,
    isEjariExpiringSoon,
  };
}

/**
 * Calculates late fee and escalation trigger for overdue rent payments per BR-006-C.
 */
export function calculateOverdueRentFee(
  monthlyRentAED: number,
  daysOverdue: number,
  customLateFeePct: number = 0.05
): OverdueRentLateFeeResult {
  if (daysOverdue < 5) {
    return {
      monthlyRentAED,
      daysOverdue,
      lateFeePct: 0,
      lateFeeAED: 0,
      escalationLevel: 'REMINDER_1',
      actionRequired: 'Payment pending normal window',
    };
  }

  if (daysOverdue < 10) {
    return {
      monthlyRentAED,
      daysOverdue,
      lateFeePct: 0,
      lateFeeAED: 0,
      escalationLevel: 'REMINDER_1',
      actionRequired: 'Send WhatsApp first reminder to tenant',
    };
  }

  if (daysOverdue < 15) {
    return {
      monthlyRentAED,
      daysOverdue,
      lateFeePct: 0,
      lateFeeAED: 0,
      escalationLevel: 'REMINDER_2',
      actionRequired: 'Send WhatsApp second reminder & flag on leasing dashboard',
    };
  }

  if (daysOverdue < 25) {
    const lateFeeAED = Math.round(monthlyRentAED * customLateFeePct);
    return {
      monthlyRentAED,
      daysOverdue,
      lateFeePct: customLateFeePct * 100,
      lateFeeAED,
      escalationLevel: 'LATE_FEE_ASSESSED',
      actionRequired: `Apply 5% late fee (AED ${lateFeeAED.toLocaleString()}) to invoice`,
    };
  }

  // Day 25+: Escalated to Legal / Compliance (Laila)
  const lateFeeAED = Math.round(monthlyRentAED * customLateFeePct);
  return {
    monthlyRentAED,
    daysOverdue,
    lateFeePct: customLateFeePct * 100,
    lateFeeAED,
    escalationLevel: 'LEGAL_ESCALATION',
    actionRequired: 'Escalate to Compliance (Laila) for 30-day eviction notice under Law 33/2008',
  };
}
