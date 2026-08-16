/**
 * Pipeline Revenue Forecast Service — Wave 44 (REQ-RPT-002)
 *
 * Forecasts revenue based on pipeline stage probabilities:
 * - new: 10%
 * - contacted: 20%
 * - viewing_scheduled: 40%
 * - offer_made: 75%
 * - under_contract: 90%
 * - closed: 100%
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export const STAGE_PROBABILITIES: Record<string, number> = {
  new: 0.1,
  contacted: 0.2,
  viewing_scheduled: 0.4,
  offer_made: 0.75,
  under_contract: 0.9,
  closed: 1.0,
};

export interface ForecastSummary {
  totalPipelineDeals: number;
  totalUnweightedVolumeAED: number;
  weightedForecastRevenueAED: number;
  stageBreakdown: Array<{
    stage: string;
    dealCount: number;
    probabilityPercent: number;
    unweightedVolumeAED: number;
    weightedRevenueAED: number;
  }>;
}

/**
 * Calculate probability-weighted revenue forecast
 */
export async function calculateRevenueForecast(): Promise<ForecastSummary> {
  const leads = await prisma.lead.findMany({
    select: {
      status: true,
      score: true,
    },
  });

  const ESTIMATED_DEAL_VALUE_AED = 150000; // Average transaction commission / revenue
  const stageCounts: Record<string, number> = {};

  leads.forEach(l => {
    const status = l.status || 'new';
    stageCounts[status] = (stageCounts[status] || 0) + 1;
  });

  let totalUnweightedVolumeAED = 0;
  let weightedForecastRevenueAED = 0;

  const stageBreakdown = Object.entries(STAGE_PROBABILITIES).map(([stage, probability]) => {
    const dealCount = stageCounts[stage] || 0;
    const unweightedVolumeAED = dealCount * ESTIMATED_DEAL_VALUE_AED;
    const weightedRevenueAED = unweightedVolumeAED * probability;

    totalUnweightedVolumeAED += unweightedVolumeAED;
    weightedForecastRevenueAED += weightedRevenueAED;

    return {
      stage,
      dealCount,
      probabilityPercent: Math.round(probability * 100),
      unweightedVolumeAED,
      weightedRevenueAED: Math.round(weightedRevenueAED),
    };
  });

  logger.info('[ForecastService] Calculated revenue forecast', {
    totalPipelineDeals: leads.length,
    weightedForecastRevenueAED: Math.round(weightedForecastRevenueAED),
  });

  return {
    totalPipelineDeals: leads.length,
    totalUnweightedVolumeAED,
    weightedForecastRevenueAED: Math.round(weightedForecastRevenueAED),
    stageBreakdown,
  };
}
