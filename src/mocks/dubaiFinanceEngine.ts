/**
 * Dubai Real Estate Finance Engine — White Caves Real Estate LLC
 * ─────────────────────────────────────────────────────────────
 * Financial calculators, RERA commission matrices, cash flow forecasting,
 * and AR aging algorithms.
 */

export interface Deal {
  id: string;
  propertyTitle: string;
  dealType: 'sale' | 'lease';
  dealValueAED: number;
  brokerName: string;
  brokerId: string;
  closedDate: string;
}

export interface CommissionResult {
  dealId: string;
  dealValueAED: number;
  agencyCommissionAED: number;
  brokerSplitRatio: number; // e.g. 0.50 or 0.70
  brokerCommissionAED: number;
  agencyNetAED: number;
  tierApplied: string;
}

export type CommissionApprovalState =
  | 'AGENT_SUBMITTED'
  | 'MANAGER_APPROVED'
  | 'FINANCE_LOCKED'
  | 'PAYMENT_RELEASED';

export interface CommissionRecord {
  id: string;
  dealId: string;
  brokerName: string;
  amountAED: number;
  status: CommissionApprovalState;
  submittedAt: string;
  approvedAt?: string;
  lockedAt?: string;
  paidAt?: string;
}

/**
 * Calculates RERA-compliant commission splits.
 * RERA Rules:
 * - Lease Deals: 5% of annual rent.
 * - Sale Deals: 2% of total transaction value.
 *
 * Volume Accelerator:
 * - Deals over 5,000,000 AED trigger a 70/30 dynamic split boost for the broker.
 * - Deals under 5,000,000 AED use standard 50/50 split.
 */
export function calculateDealCommission(deal: Deal): CommissionResult {
  const agencyCommissionRate = deal.dealType === 'lease' ? 0.05 : 0.02;
  const agencyCommissionAED = Math.round(deal.dealValueAED * agencyCommissionRate);

  const isAccelerated = deal.dealValueAED >= 5_000_000;
  const brokerSplitRatio = isAccelerated ? 0.70 : 0.50;
  const tierApplied = isAccelerated ? "Chairman's Club Dynamic Boost (70/30)" : "Standard Agent Tier (50/50)";

  const brokerCommissionAED = Math.round(agencyCommissionAED * brokerSplitRatio);
  const agencyNetAED = agencyCommissionAED - brokerCommissionAED;

  return {
    dealId: deal.id,
    dealValueAED: deal.dealValueAED,
    agencyCommissionAED,
    brokerSplitRatio,
    brokerCommissionAED,
    agencyNetAED,
    tierApplied,
  };
}

/**
 * State Transition Reducer for Commission Approval Pipeline
 */
export function transitionCommissionStatus(
  currentStatus: CommissionApprovalState,
  action: 'approve' | 'lock' | 'release'
): CommissionApprovalState {
  switch (currentStatus) {
    case 'AGENT_SUBMITTED':
      return action === 'approve' ? 'MANAGER_APPROVED' : currentStatus;
    case 'MANAGER_APPROVED':
      return action === 'lock' ? 'FINANCE_LOCKED' : currentStatus;
    case 'FINANCE_LOCKED':
      return action === 'release' ? 'PAYMENT_RELEASED' : currentStatus;
    default:
      return currentStatus;
  }
}

/**
 * 4-Hour TTL Local Memory Currency Exchange Rate Cache
 */
interface ExchangeCache {
  timestamp: number;
  rates: Record<string, number>;
}

const TTL_MS = 4 * 60 * 60 * 1000; // 4 Hours

let localCurrencyCache: ExchangeCache = {
  timestamp: Date.now(),
  rates: {
    AED: 1.0,
    USD: 0.2723,
    EUR: 0.2514,
    GBP: 0.2148,
    INR: 22.75,
  },
};

export function getCachedExchangeRates(): Record<string, number> {
  const now = Date.now();
  if (now - localCurrencyCache.timestamp > TTL_MS) {
    localCurrencyCache = {
      timestamp: now,
      rates: {
        AED: 1.0,
        USD: 0.2723,
        EUR: 0.2514,
        GBP: 0.2148,
        INR: 22.75,
      },
    };
  }
  return localCurrencyCache.rates;
}

export function convertCurrency(amountAED: number, targetCurrency: string): number {
  const rates = getCachedExchangeRates();
  const rate = rates[targetCurrency] || 1.0;
  return Math.round(amountAED * rate);
}

/**
 * 30-Day Commission Clawback Risk Monitor
 * Checks closed deals for potential default risk within 30 days of closing.
 */
export function filterClawbackRiskDeals(deals: Deal[]): Deal[] {
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return deals.filter((d) => {
    const dealDate = new Date(d.closedDate).getTime();
    return now - dealDate <= thirtyDaysMs && d.dealValueAED > 1_000_000;
  });
}

/**
 * Accounts Receivable (AR) Chronological Aging Sorter
 * Separates outstanding invoices into 30/60/90/120+ days aging buckets.
 */
export interface ARAgingBucket {
  current30: number;
  days60: number;
  days90: number;
  over120: number;
  totalOutstanding: number;
}

export function calculateARAging(invoices: { amount: number; dueDate: string }[]): ARAgingBucket {
  const now = Date.now();
  const bucket: ARAgingBucket = { current30: 0, days60: 0, days90: 0, over120: 0, totalOutstanding: 0 };

  invoices.forEach((inv) => {
    const dueTime = new Date(inv.dueDate).getTime();
    const daysOverdue = Math.max(0, Math.floor((now - dueTime) / (1000 * 60 * 60 * 24)));

    bucket.totalOutstanding += inv.amount;

    if (daysOverdue <= 30) {
      bucket.current30 += inv.amount;
    } else if (daysOverdue <= 60) {
      bucket.days60 += inv.amount;
    } else if (daysOverdue <= 90) {
      bucket.days90 += inv.amount;
    } else {
      bucket.over120 += inv.amount;
    }
  });

  return bucket;
}

/**
 * Rolling 12-Month Cash-Flow Forecast Aggregator
 */
export interface MonthlyCashFlow {
  month: string;
  projectedInflowAED: number;
  projectedOutflowAED: number;
  netCashFlowAED: number;
}

export function generate12MonthCashFlow(baseMonthlyRevenueAED: number): MonthlyCashFlow[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    // Seasonal multiplier simulation for Dubai real estate
    const seasonalFactor = 1 + Math.sin(index / 2) * 0.15;
    const projectedInflowAED = Math.round(baseMonthlyRevenueAED * seasonalFactor);
    const projectedOutflowAED = Math.round(projectedInflowAED * 0.45);
    return {
      month,
      projectedInflowAED,
      projectedOutflowAED,
      netCashFlowAED: projectedInflowAED - projectedOutflowAED,
    };
  });
}

export const dubaiFinanceEngine = {
  getDualTrackLeaderboard: () => {
    return {
      trackASales: [
        { id: 'a1', name: 'Zahir Ahmad', unitsTransacted: 12, gwcRevenue: 1500000, tier: 'Diamond', milestoneBadge: 'Apex', voucherRewardAed: 10000, uncappedRateLock: 0.70 },
        { id: 'a2', name: 'Sara Khalil', unitsTransacted: 8, gwcRevenue: 950000, tier: 'Platinum', milestoneBadge: 'Elite', voucherRewardAed: 5000 },
        { id: 'a3', name: 'Omar Malik', unitsTransacted: 6, gwcRevenue: 800000, tier: 'Platinum', milestoneBadge: 'Elite', voucherRewardAed: 2000 }
      ],
      trackBLeasing: [
        { id: 'b1', name: 'Layla Noor', unitsTransacted: 25, gwcRevenue: 250000, tier: 'Gold', milestoneBadge: 'Volume King' },
        { id: 'b2', name: 'Tariq Hassan', unitsTransacted: 22, gwcRevenue: 220000, tier: 'Gold', milestoneBadge: 'Top Closer' },
        { id: 'b3', name: 'Huda Amin', unitsTransacted: 18, gwcRevenue: 180000, tier: 'Silver', milestoneBadge: 'Rising Star' }
      ]
    };
  }
};
