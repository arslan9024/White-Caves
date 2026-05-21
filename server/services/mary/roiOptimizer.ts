/**
 * Portfolio ROI Optimizer
 *
 * Financial analysis tool for investor clients. Calculates:
 *   - Per-property ROI metrics (gross yield, net yield, payback period)
 *   - Portfolio-level aggregation (total invested, total returns, avg yield)
 *   - Mortgage vs cash comparison
 *   - 5-year capital appreciation projection (conservative / base / optimistic)
 *   - Top recommendation: which property to acquire next given budget + target yield
 *
 * All calculations are performed in AED.
 * Market appreciation rates are sourced from 5-year DLD historical data averages.
 *
 * Used by: POST /api/mary/roi-optimize
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PortfolioProperty {
  id:                string;
  address:           string;
  community:         string;
  propertyType:      string;
  purchasePriceAED:  number;
  currentValueAED:   number;
  annualRentAED:     number;
  annualServiceFeeAED: number;
  mortgageBalanceAED?: number;   // 0 = fully paid
  mortgageRatePct?:    number;   // Annual mortgage interest rate
  yearPurchased:     number;     // e.g. 2022
}

export interface PropertyROI {
  id:                  string;
  address:             string;
  grossYieldPct:       number;
  netYieldPct:         number;
  annualCashFlowAED:   number;   // Net rent after all costs
  paybackYears:        number;   // Purchase price / annual net income
  unrealizedGainAED:   number;   // Current value - purchase price
  totalROIPct:         number;   // (net income to date + unrealized gain) / purchase price
  recommendation:      string;
}

export interface MortgageVsCashComparison {
  property:          string;
  purchasePriceAED:  number;
  // Cash scenario
  cashTotalCostAED:  number;    // = purchase price + DLD fees
  cashGrossYieldPct: number;
  cashNetYieldPct:   number;
  // Mortgage scenario
  mortgageDownPaymentAED:  number;   // 20% for expats, 15% for UAE nationals
  mortgageLoanAED:         number;
  mortgageMonthlyPayment:  number;
  mortgageAnnualInterestAED: number;
  mortgageNetYieldPct:     number;   // yield on equity deployed
  mortgageLeverageMultiplier: number;
  verdict:           'cash_better' | 'mortgage_better' | 'similar';
}

export interface AppreciationProjection {
  year:              number;
  conservative:      number;   // AED
  base:              number;
  optimistic:        number;
}

export interface NextBuyRecommendation {
  community:         string;
  propertyType:      string;
  targetBedrooms:    number;
  estimatedPriceAED: number;
  estimatedYieldPct: number;
  reasonCode:        string;
}

export interface ROIOptimizationResult {
  success:             boolean;
  totalPortfolioValueAED:    number;
  totalInvestedAED:          number;
  totalAnnualRentAED:        number;
  totalAnnualCostsAED:       number;
  portfolioGrossYieldPct:    number;
  portfolioNetYieldPct:      number;
  averagePaybackYears:       number;
  perPropertyROI:            PropertyROI[];
  appreciationProjection:    AppreciationProjection[];
  mortgageVsCash?:           MortgageVsCashComparison;
  nextBuyRecommendation?:    NextBuyRecommendation;
  optimizedAt:               string;
}

// ─── Dubai Market Appreciation Rates (5-year DLD average) ────────────────────

const APPRECIATION_RATES: Record<string, number> = {
  'Palm Jumeirah':   0.082,   // 8.2% p.a.
  'Downtown Dubai':  0.071,   // 7.1%
  'Dubai Marina':    0.065,   // 6.5%
  'JBR':             0.068,   // 6.8%
  'Business Bay':    0.058,   // 5.8%
  'Dubai Hills':     0.075,   // 7.5%
  'DIFC':            0.064,   // 6.4%
  'default':         0.055,   // 5.5% fallback
};

function appreciationRate(community: string): number {
  return APPRECIATION_RATES[community] ?? APPRECIATION_RATES['default']!;
}

// ─── DLD Transfer Fees ────────────────────────────────────────────────────────

const DLD_TRANSFER_FEE_PCT  = 0.04;   // 4% of purchase price
const DLD_ADMIN_FEE_AED     = 580;    // Fixed admin fee
const TRUSTEE_FEE_AED       = 4000;   // Approximate trustee fee

function dldTotalFees(priceAED: number): number {
  return priceAED * DLD_TRANSFER_FEE_PCT + DLD_ADMIN_FEE_AED + TRUSTEE_FEE_AED;
}

// ─── Per-Property Calculation ─────────────────────────────────────────────────

function calculatePropertyROI(
  property:     PortfolioProperty,
  yearsHeld:    number,
): PropertyROI {
  const grossYieldPct    = (property.annualRentAED / property.purchasePriceAED) * 100;

  const annualMortgageInterest =
    property.mortgageBalanceAED && property.mortgageRatePct
      ? property.mortgageBalanceAED * (property.mortgageRatePct / 100)
      : 0;

  const annualCosts    = property.annualServiceFeeAED + annualMortgageInterest;
  const annualNetCash  = property.annualRentAED - annualCosts;
  const netYieldPct    = (annualNetCash / property.purchasePriceAED) * 100;
  const paybackYears   = annualNetCash > 0
    ? Math.round((property.purchasePriceAED / annualNetCash) * 10) / 10
    : 999;

  const unrealizedGain  = property.currentValueAED - property.purchasePriceAED;
  const totalReturnAED  = annualNetCash * yearsHeld + unrealizedGain;
  const totalROIPct     = (totalReturnAED / property.purchasePriceAED) * 100;

  let recommendation = 'Hold — stable yield and capital appreciation.';
  if (netYieldPct < 3) recommendation = 'Review — net yield below 3%. Consider refinancing or rent review.';
  if (netYieldPct > 7) recommendation = 'Strong performer — consider adding to this community.';
  if (unrealizedGain > property.purchasePriceAED * 0.5)
    recommendation = 'Significant capital gain — consider realizing profit if yield has compressed.';

  return {
    id:                  property.id,
    address:             property.address,
    grossYieldPct:       parseFloat(grossYieldPct.toFixed(2)),
    netYieldPct:         parseFloat(netYieldPct.toFixed(2)),
    annualCashFlowAED:   Math.round(annualNetCash),
    paybackYears,
    unrealizedGainAED:   Math.round(unrealizedGain),
    totalROIPct:         parseFloat(totalROIPct.toFixed(2)),
    recommendation,
  };
}

// ─── Appreciation Projection ──────────────────────────────────────────────────

function projectAppreciation(
  currentValueAED: number,
  community:       string,
  years = 5,
): AppreciationProjection[] {
  const base         = appreciationRate(community);
  const conservative = base * 0.6;
  const optimistic   = base * 1.4;
  const result: AppreciationProjection[] = [];

  for (let y = 1; y <= years; y++) {
    result.push({
      year:         new Date().getFullYear() + y,
      conservative: Math.round(currentValueAED * Math.pow(1 + conservative, y)),
      base:         Math.round(currentValueAED * Math.pow(1 + base, y)),
      optimistic:   Math.round(currentValueAED * Math.pow(1 + optimistic, y)),
    });
  }
  return result;
}

// ─── Mortgage vs Cash Comparison ─────────────────────────────────────────────

function compareMortgageVsCash(
  property:         PortfolioProperty,
  mortgageRatePct = 4.5,
  isUAENational   = false,
): MortgageVsCashComparison {
  const ltvMax       = isUAENational ? 0.85 : 0.80;
  const downPayment  = property.purchasePriceAED * (1 - ltvMax);
  const loanAmount   = property.purchasePriceAED * ltvMax;
  const monthlyRate  = mortgageRatePct / 100 / 12;
  const tenorMonths  = 25 * 12;   // 25-year mortgage
  const monthlyPmt   =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) /
    (Math.pow(1 + monthlyRate, tenorMonths) - 1);
  const annualInterest = loanAmount * (mortgageRatePct / 100);

  // Cash scenario
  const cashTotalCost   = property.purchasePriceAED + dldTotalFees(property.purchasePriceAED);
  const cashNetAnnual   = property.annualRentAED - property.annualServiceFeeAED;
  const cashGrossYield  = (property.annualRentAED / cashTotalCost) * 100;
  const cashNetYield    = (cashNetAnnual / cashTotalCost) * 100;

  // Mortgage scenario — yield on equity deployed
  const equityDeployed    = downPayment + dldTotalFees(property.purchasePriceAED);
  const mortgageNetAnnual = property.annualRentAED - property.annualServiceFeeAED - annualInterest;
  const mortgageNetYield  = (mortgageNetAnnual / equityDeployed) * 100;
  const leverageMultiplier = parseFloat((mortgageNetYield / cashNetYield).toFixed(2));

  const verdict: MortgageVsCashComparison['verdict'] =
    leverageMultiplier > 1.1 ? 'mortgage_better' :
    leverageMultiplier < 0.9 ? 'cash_better' : 'similar';

  return {
    property:                property.address,
    purchasePriceAED:        property.purchasePriceAED,
    cashTotalCostAED:        Math.round(cashTotalCost),
    cashGrossYieldPct:       parseFloat(cashGrossYield.toFixed(2)),
    cashNetYieldPct:         parseFloat(cashNetYield.toFixed(2)),
    mortgageDownPaymentAED:  Math.round(downPayment),
    mortgageLoanAED:         Math.round(loanAmount),
    mortgageMonthlyPayment:  Math.round(monthlyPmt),
    mortgageAnnualInterestAED: Math.round(annualInterest),
    mortgageNetYieldPct:     parseFloat(mortgageNetYield.toFixed(2)),
    mortgageLeverageMultiplier: leverageMultiplier,
    verdict,
  };
}

// ─── Next Buy Recommendation ──────────────────────────────────────────────────

const COMMUNITY_YIELD_ESTIMATES: Record<string, { type: string; beds: number; price: number; yield: number }> = {
  'Business Bay':  { type: 'apartment', beds: 1, price: 900_000,    yield: 6.5 },
  'JBR':           { type: 'apartment', beds: 2, price: 2_800_000,  yield: 6.1 },
  'Dubai Hills':   { type: 'townhouse', beds: 3, price: 3_400_000,  yield: 5.8 },
  'Dubai Marina':  { type: 'apartment', beds: 1, price: 1_150_000,  yield: 6.3 },
  'Arjan':         { type: 'apartment', beds: 1, price: 620_000,    yield: 7.1 },
  'JVC':           { type: 'apartment', beds: 2, price: 850_000,    yield: 7.4 },
};

function recommendNextBuy(
  budget: number,
  targetYieldPct: number,
): NextBuyRecommendation {
  const candidates = Object.entries(COMMUNITY_YIELD_ESTIMATES)
    .filter(([, e]) => e.price <= budget && e.yield >= targetYieldPct)
    .sort((a, b) => b[1].yield - a[1].yield);

  const best = candidates[0];
  if (!best) {
    return {
      community:         'JVC',
      propertyType:      'apartment',
      targetBedrooms:    1,
      estimatedPriceAED: 620_000,
      estimatedYieldPct: 7.4,
      reasonCode:        'highest_yield_within_budget_closest_match',
    };
  }

  const [community, info] = best;
  return {
    community,
    propertyType:      info.type,
    targetBedrooms:    info.beds,
    estimatedPriceAED: info.price,
    estimatedYieldPct: info.yield,
    reasonCode:        'highest_yield_within_budget',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ROIOptimizationInput {
  portfolio:         PortfolioProperty[];
  compareMortgage?:  boolean;
  mortgageRatePct?:  number;
  isUAENational?:    boolean;
  newBudgetAED?:     number;
  targetYieldPct?:   number;
}

/**
 * Run a full portfolio ROI optimisation.
 */
export function optimizePortfolioROI(input: ROIOptimizationInput): ROIOptimizationResult {
  const now = new Date().getFullYear();

  const perPropertyROI: PropertyROI[] = input.portfolio.map(p =>
    calculatePropertyROI(p, now - p.yearPurchased)
  );

  const totalPortfolioValue  = input.portfolio.reduce((s, p) => s + p.currentValueAED,    0);
  const totalInvested        = input.portfolio.reduce((s, p) => s + p.purchasePriceAED,   0);
  const totalAnnualRent      = input.portfolio.reduce((s, p) => s + p.annualRentAED,       0);
  const totalAnnualCosts     = input.portfolio.reduce((s, p) => s + p.annualServiceFeeAED, 0);
  const totalAnnualNet       = totalAnnualRent - totalAnnualCosts;

  const portfolioGrossYield  = totalInvested > 0 ? (totalAnnualRent / totalInvested) * 100 : 0;
  const portfolioNetYield    = totalInvested > 0 ? (totalAnnualNet  / totalInvested) * 100 : 0;
  const avgPayback = perPropertyROI.length > 0
    ? perPropertyROI.reduce((s, r) => s + (r.paybackYears === 999 ? 0 : r.paybackYears), 0) / perPropertyROI.length
    : 0;

  // Appreciation projection using first property community (or default)
  const primaryCommunity = input.portfolio[0]?.community ?? 'default';
  const appreciationProjection = projectAppreciation(totalPortfolioValue, primaryCommunity);

  // Mortgage comparison (on first property only if requested)
  let mortgageVsCash: MortgageVsCashComparison | undefined;
  if (input.compareMortgage && input.portfolio[0]) {
    mortgageVsCash = compareMortgageVsCash(
      input.portfolio[0],
      input.mortgageRatePct ?? 4.5,
      input.isUAENational ?? false
    );
  }

  // Next buy recommendation
  let nextBuyRecommendation: NextBuyRecommendation | undefined;
  if (input.newBudgetAED && input.targetYieldPct) {
    nextBuyRecommendation = recommendNextBuy(input.newBudgetAED, input.targetYieldPct);
  }

  return {
    success:                    true,
    totalPortfolioValueAED:     Math.round(totalPortfolioValue),
    totalInvestedAED:           Math.round(totalInvested),
    totalAnnualRentAED:         Math.round(totalAnnualRent),
    totalAnnualCostsAED:        Math.round(totalAnnualCosts),
    portfolioGrossYieldPct:     parseFloat(portfolioGrossYield.toFixed(2)),
    portfolioNetYieldPct:       parseFloat(portfolioNetYield.toFixed(2)),
    averagePaybackYears:        parseFloat(avgPayback.toFixed(1)),
    perPropertyROI,
    appreciationProjection,
    mortgageVsCash,
    nextBuyRecommendation,
    optimizedAt:                new Date().toISOString(),
  };
}
