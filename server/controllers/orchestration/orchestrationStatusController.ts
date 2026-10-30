import { Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import {
  ASSISTANT_EXECUTION_PROFILES,
  COLLABORATION_GRAPH,
  RouteRequest,
  calculateDailyPremiumCap,
  computeMetrics,
  orchestrationTasks,
  persistState,
  quotaState,
} from './orchestrationCommon.js';

export const getStatus = asyncHandler(async (_req: RouteRequest, res: Response) => {
  const dailyCap = calculateDailyPremiumCap();

  res.json({
    success: true,
    data: {
      profiles: ASSISTANT_EXECUTION_PROFILES,
      collaborationGraph: COLLABORATION_GRAPH,
      quota: {
        weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
        businessDaysRemaining: quotaState.businessDaysRemaining,
        dailyCap,
        premiumConsumedToday: quotaState.premiumConsumedToday,
        premiumRemainingToday: Math.max(0, dailyCap - quotaState.premiumConsumedToday),
      },
      metrics: computeMetrics(orchestrationTasks),
      tasks: orchestrationTasks.slice(0, 50),
    },
  });
});

export const getMetrics = asyncHandler(async (_req: RouteRequest, res: Response) => {
  const dailyCap = calculateDailyPremiumCap();
  res.json({
    success: true,
    data: {
      quota: {
        weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
        businessDaysRemaining: quotaState.businessDaysRemaining,
        dailyCap,
        premiumConsumedToday: quotaState.premiumConsumedToday,
        premiumRemainingToday: Math.max(0, dailyCap - quotaState.premiumConsumedToday),
      },
      metrics: computeMetrics(orchestrationTasks),
    },
  });
});

export const updateQuota = asyncHandler(async (req: RouteRequest, res: Response) => {
  const {
    weeklyPremiumRemaining: weeklyInput,
    businessDaysRemaining: daysInput,
    premiumConsumedToday: consumedInput,
  } = req.body as {
    weeklyPremiumRemaining?: number;
    businessDaysRemaining?: number;
    premiumConsumedToday?: number;
  };

  if (typeof weeklyInput === 'number' && weeklyInput >= 0) {
    quotaState.weeklyPremiumRemaining = Math.floor(weeklyInput);
  }
  if (typeof daysInput === 'number' && daysInput >= 0) {
    quotaState.businessDaysRemaining = Math.floor(daysInput);
  }
  if (typeof consumedInput === 'number' && consumedInput >= 0) {
    quotaState.premiumConsumedToday = Math.floor(consumedInput);
  }

  persistState();

  res.json({
    success: true,
    data: {
      weeklyPremiumRemaining: quotaState.weeklyPremiumRemaining,
      businessDaysRemaining: quotaState.businessDaysRemaining,
      premiumConsumedToday: quotaState.premiumConsumedToday,
      dailyCap: calculateDailyPremiumCap(),
    },
  });
});

