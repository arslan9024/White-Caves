/**
 * Phase 6 Analytics Controller
 * Endpoints for event tracking, dashboard metrics, behavioral patterns, and CSV exports.
 */

import { Request, Response } from 'express';
import { analyticsService } from './phase6Common.js';

export const trackEvent = (req: Request, res: Response): void => {
  const { eventType, metadata } = req.body;

  if (!eventType) {
    res.status(400).json({ error: 'Event type is required' });
    return;
  }

  analyticsService.trackEvent((req as any).userId, eventType, metadata);
  res.json({ message: 'Event tracked' });
};

export const getDashboardMetrics = (_req: Request, res: Response): void => {
  const metrics = analyticsService.getDashboardMetrics();
  res.json(metrics);
};

export const getUserAnalytics = (req: Request, res: Response): void => {
  const { userId } = req.params as Record<string, string>;
  const analytics = analyticsService.getUserAnalytics(userId);

  if (!analytics) {
    res.status(404).json({ error: 'No analytics found for user' });
    return;
  }

  res.json(analytics);
};

export const getUserBehaviorPatterns = (req: Request, res: Response): void => {
  const { userId } = req.params as Record<string, string>;
  const patterns = analyticsService.getUserBehaviorPatterns(userId);
  res.json(patterns);
};

export const getAnalyticsRange = (req: Request, res: Response): void => {
  const { startDate, endDate } = req.query as Record<string, string | undefined>;

  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Start and end dates are required' });
    return;
  }

  const analytics = analyticsService.getAnalyticsByTimeRange(
    new Date(startDate as string),
    new Date(endDate as string)
  );

  res.json(analytics);
};

export const exportAnalyticsCsv = (_req: Request, res: Response): void => {
  const csv = analyticsService.exportAnalyticsToCSV();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
  res.send(csv);
};

