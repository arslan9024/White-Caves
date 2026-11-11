/**
 * Commission Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements deterministic commission calculation, multi-tier progression,
 * and deal attribution logic from:
 *   - .agents/docs/white-caves-commission-engine-spec.md
 *   - .agents/docs/business-rules.md (BR-011)
 */

export interface CommissionCalculationResult {
  agentPayout: number;
  companyRevenue: number;
  currentTierPct: number;
  tierName: string;
}

export interface MultiAgentSplitParams {
  grossCommission: number;
  dealType: 'DIRECT' | 'INTERNAL_CO_BROKE' | 'REFERRAL';
  agentAPercentage?: number; // For co-broke (default 50%)
  referralPercentage?: number; // For referral (capped at 25% per BR-011-B)
  agentAIsOnboarding?: boolean;
  agentARunRate?: number;
}

export interface MultiAgentSplitResult {
  grossCommission: number;
  dealType: 'DIRECT' | 'INTERNAL_CO_BROKE' | 'REFERRAL';
  referralFee: number;
  netCommissionPool: number;
  agentAPayout: number;
  agentBPayout: number;
  companyRevenue: number;
}

/**
 * Calculates individual agent payout and company revenue based on
 * onboarding buffer, monthly revenue run-rate, or chairman's circle lock.
 */
export function calculateAgentPayout(
  grossCommission: number,
  isOnboarding: boolean = false,
  monthlyRunRate: number = 0,
  isChairmanCircle: boolean = false
): CommissionCalculationResult {
  if (grossCommission <= 0) {
    return {
      agentPayout: 0,
      companyRevenue: 0,
      currentTierPct: 0.5,
      tierName: 'Executive Consultant',
    };
  }

  let agentPercentage = 0.5;
  let tierName = 'Executive Consultant';

  if (isChairmanCircle) {
    agentPercentage = 0.75;
    tierName = "Chairman's Circle Club (75% Lock-in)";
  } else if (isOnboarding) {
    agentPercentage = 0.7; // 180-day accelerated onboarding buffer
    tierName = 'Accelerated Onboarding (70/30)';
  } else {
    if (monthlyRunRate >= 150000) {
      agentPercentage = 0.7;
      tierName = 'Platinum Elite';
    } else if (monthlyRunRate >= 100000) {
      agentPercentage = 0.6;
      tierName = 'Gold Producer';
    } else if (monthlyRunRate >= 50000) {
      agentPercentage = 0.55;
      tierName = 'Silver Producer';
    } else {
      agentPercentage = 0.5;
      tierName = 'Executive Consultant';
    }
  }

  const agentPayoutAmount = Math.round(grossCommission * agentPercentage);
  const companyRetainedAmount = Math.round(grossCommission - agentPayoutAmount);

  return {
    agentPayout: agentPayoutAmount,
    companyRevenue: companyRetainedAmount,
    currentTierPct: agentPercentage,
    tierName,
  };
}

/**
 * Calculates multi-agent attribution and external referral deduction per BR-011.
 */
export function calculateMultiAgentSplit(params: MultiAgentSplitParams): MultiAgentSplitResult {
  const {
    grossCommission,
    dealType,
    agentAPercentage = 0.5,
    referralPercentage = 0.1,
    agentAIsOnboarding = false,
    agentARunRate = 0,
  } = params;

  if (grossCommission <= 0) {
    return {
      grossCommission: 0,
      dealType,
      referralFee: 0,
      netCommissionPool: 0,
      agentAPayout: 0,
      agentBPayout: 0,
      companyRevenue: 0,
    };
  }

  if (dealType === 'DIRECT') {
    const single = calculateAgentPayout(grossCommission, agentAIsOnboarding, agentARunRate);
    return {
      grossCommission,
      dealType,
      referralFee: 0,
      netCommissionPool: grossCommission,
      agentAPayout: single.agentPayout,
      agentBPayout: 0,
      companyRevenue: single.companyRevenue,
    };
  }

  if (dealType === 'REFERRAL') {
    // Max referral is 25% per BR-011-B
    const safeRefPct = Math.min(0.25, Math.max(0, referralPercentage));
    const referralFee = Math.round(grossCommission * safeRefPct);
    const remainingPool = grossCommission - referralFee;

    const single = calculateAgentPayout(remainingPool, agentAIsOnboarding, agentARunRate);
    return {
      grossCommission,
      dealType,
      referralFee,
      netCommissionPool: remainingPool,
      agentAPayout: single.agentPayout,
      agentBPayout: 0,
      companyRevenue: single.companyRevenue,
    };
  }

  // INTERNAL_CO_BROKE
  const safeAgentAPct = Math.min(1, Math.max(0, agentAPercentage));
  const safeAgentBPct = 1 - safeAgentAPct;

  const agentAPool = grossCommission * safeAgentAPct;
  const agentBPool = grossCommission * safeAgentBPct;

  const agentA = calculateAgentPayout(agentAPool, agentAIsOnboarding, agentARunRate);
  const agentB = calculateAgentPayout(agentBPool, false, 0); // Standard baseline for Agent B

  return {
    grossCommission,
    dealType,
    referralFee: 0,
    netCommissionPool: grossCommission,
    agentAPayout: agentA.agentPayout,
    agentBPayout: agentB.agentPayout,
    companyRevenue: agentA.companyRevenue + agentB.companyRevenue,
  };
}
