/**
 * White Caves Real Estate LLC — Production Compensation & Attribution Engine
 *
 * Handles multi-agent deal reconciliation, onboarding promo split buffers,
 * dynamic performance slab waterfalls, and dual-track leaderboard point distributions.
 *
 * @module compensation_engine
 */

/**
 * Calculates agent percentage split based on tenure and rolling monthly run-rate.
 *
 * @param {number} tenureDays - Agent's verified days since onboarding
 * @param {number} monthlyRunRateAed - Rolling monthly gross commission run-rate in AED
 * @returns {{ agentPct: number, companyPct: number, tierName: string, isOnboardingActive: boolean }}
 */
function getAgentTierSplit(tenureDays, monthlyRunRateAed) {
  const safeTenure = typeof tenureDays === 'number' && tenureDays >= 0 ? tenureDays : 999;
  const safeRunRate =
    typeof monthlyRunRateAed === 'number' && monthlyRunRateAed >= 0 ? monthlyRunRateAed : 0;

  // 180-Day Accelerated Onboarding Support Buffer (70% Agent / 30% Company)
  if (safeTenure <= 180) {
    return {
      agentPct: 0.7,
      companyPct: 0.3,
      tierName: 'Accelerated Onboarding Promo (70/30)',
      isOnboardingActive: true,
    };
  }

  // Standard Dynamic Performance Slab Structure
  if (safeRunRate >= 150000) {
    return {
      agentPct: 0.7,
      companyPct: 0.3,
      tierName: 'Platinum Elite (70/30)',
      isOnboardingActive: false,
    };
  }

  if (safeRunRate >= 100000) {
    return {
      agentPct: 0.6,
      companyPct: 0.4,
      tierName: 'Gold Producer (60/40)',
      isOnboardingActive: false,
    };
  }

  if (safeRunRate >= 50000) {
    return {
      agentPct: 0.55,
      companyPct: 0.45,
      tierName: 'Silver Producer (55/45)',
      isOnboardingActive: false,
    };
  }

  return {
    agentPct: 0.5,
    companyPct: 0.5,
    tierName: 'Executive Consultant (50/50)',
    isOnboardingActive: false,
  };
}

/**
 * Primary transaction payout calculation function.
 *
 * @param {Object} transaction - Transaction object detailing deal type, gross commission, and agents
 * @returns {Object} Calculated payout breakdown and leaderboard attribution metrics
 */
function calculateTransactionPayout(transaction) {
  if (!transaction || typeof transaction !== 'object') {
    throw new Error('Invalid Transaction Error: transaction must be a valid object');
  }

  const { dealType, grossCommissionAed, serviceType = 'sales', agentA, agentB } = transaction;

  if (typeof grossCommissionAed !== 'number' || grossCommissionAed <= 0) {
    throw new Error('Invalid Commission Error: grossCommissionAed must be a positive number');
  }

  if (!agentA || !agentA.id) {
    throw new Error('Invalid Agent Error: agentA with valid id is required');
  }

  const normalizedDealType = (dealType || 'DIRECT').toUpperCase();

  // Static 50/50 splits for leasing and property management
  if (serviceType === 'leasing' || serviceType === 'pm') {
    const halfPayout = grossCommissionAed * 0.5;
    return {
      success: true,
      dealType: normalizedDealType,
      serviceType,
      grossCommissionAed,
      companyRevenueAed: halfPayout,
      agentAPayoutAed: halfPayout,
      agentBPayoutAed: 0,
      agentAPoints: Math.round(grossCommissionAed / 1000),
      agentBPoints: 0,
      tierDetails: { agentA: 'Standard Static Split (50/50)', agentB: null },
    };
  }

  // 1. DIRECT DEAL
  if (normalizedDealType === 'DIRECT') {
    const tierA = getAgentTierSplit(agentA.tenureDays, agentA.monthlyRunRateAed);
    const agentAPayout = grossCommissionAed * tierA.agentPct;
    const companyRevenue = grossCommissionAed - agentAPayout;
    const leaderboardPoints = Math.round(grossCommissionAed / 1000);

    return {
      success: true,
      dealType: 'DIRECT',
      serviceType: 'sales',
      grossCommissionAed,
      companyRevenueAed: companyRevenue,
      agentAPayoutAed: agentAPayout,
      agentBPayoutAed: 0,
      agentAPoints: leaderboardPoints,
      agentBPoints: 0,
      tierDetails: {
        agentA: tierA.tierName,
        agentB: null,
      },
    };
  }

  // 2. INTERNAL SPLIT DEAL
  if (normalizedDealType === 'INTERNAL_SPLIT') {
    if (!agentB || !agentB.id) {
      throw new Error(
        'Internal Split Error: agentB with valid id is required for INTERNAL_SPLIT deals'
      );
    }

    const halfGross = grossCommissionAed / 2;
    const tierA = getAgentTierSplit(agentA.tenureDays, agentA.monthlyRunRateAed);
    const tierB = getAgentTierSplit(agentB.tenureDays, agentB.monthlyRunRateAed);

    const agentAPayout = halfGross * tierA.agentPct;
    const agentBPayout = halfGross * tierB.agentPct;
    const companyRevenue = grossCommissionAed - (agentAPayout + agentBPayout);
    const totalPoints = Math.round(grossCommissionAed / 1000);
    const halfPoints = Math.round(totalPoints / 2);

    return {
      success: true,
      dealType: 'INTERNAL_SPLIT',
      serviceType: 'sales',
      grossCommissionAed,
      companyRevenueAed: companyRevenue,
      agentAPayoutAed: agentAPayout,
      agentBPayoutAed: agentBPayout,
      agentAPoints: halfPoints,
      agentBPoints: halfPoints,
      tierDetails: {
        agentA: tierA.tierName,
        agentB: tierB.tierName,
      },
    };
  }

  // 3. REFERRAL DEAL
  if (normalizedDealType === 'REFERRAL') {
    if (!agentB || !agentB.id) {
      throw new Error(
        'Referral Deal Error: agentB (Closer) with valid id is required for REFERRAL deals'
      );
    }

    // Agent A (Referrer): Flat 10% fee + 10% points
    const referralFeeA = grossCommissionAed * 0.1;
    const remainingGross = grossCommissionAed - referralFeeA;

    // Agent B (Closer): 90% of gross processed through Agent B's tier
    const tierB = getAgentTierSplit(agentB.tenureDays, agentB.monthlyRunRateAed);
    const agentBPayout = remainingGross * tierB.agentPct;
    const companyRevenue = grossCommissionAed - (referralFeeA + agentBPayout);

    const totalPoints = Math.round(grossCommissionAed / 1000);
    const agentAPoints = Math.round(totalPoints * 0.1);
    const agentBPoints = totalPoints - agentAPoints;

    return {
      success: true,
      dealType: 'REFERRAL',
      serviceType: 'sales',
      grossCommissionAed,
      companyRevenueAed: companyRevenue,
      agentAPayoutAed: referralFeeA,
      agentBPayoutAed: agentBPayout,
      agentAPoints: agentAPoints,
      agentBPoints: agentBPoints,
      tierDetails: {
        agentA: 'Referral Fee (10% Flat)',
        agentB: tierB.tierName,
      },
    };
  }

  throw new Error(`Unsupported Deal Type Error: ${dealType} is not supported`);
}

module.exports = {
  getAgentTierSplit,
  calculateTransactionPayout,
};
