/**
 * Dashboard Service — Tests
 * Tests all 6 service methods for correct return structure.
 * Service currently returns stub data — tests validate contract shapes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database (prisma) before importing service
vi.mock('../database', () => ({
  prisma: {},
}));

import DashboardService from './dashboardService.js';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
  });

  // ─── getDashboardData ─────────────────────────────────────────────
  describe('getDashboardData', () => {
    it('returns a summary object', async () => {
      const result = await service.getDashboardData();
      expect(result).toHaveProperty('summary');
    });

    it('summary contains expected fields', async () => {
      const { summary } = await service.getDashboardData();
      expect(summary).toHaveProperty('totalLeads');
      expect(summary).toHaveProperty('activeLeads');
      expect(summary).toHaveProperty('totalProperties');
      expect(summary).toHaveProperty('totalTransactions');
      expect(summary).toHaveProperty('monthlyRevenue');
    });

    it('summary fields are numbers', async () => {
      const { summary } = await service.getDashboardData();
      expect(typeof summary.totalLeads).toBe('number');
      expect(typeof summary.activeLeads).toBe('number');
      expect(typeof summary.totalProperties).toBe('number');
      expect(typeof summary.totalTransactions).toBe('number');
      expect(typeof summary.monthlyRevenue).toBe('number');
    });
  });

  // ─── getMarketAnalytics ───────────────────────────────────────────
  describe('getMarketAnalytics', () => {
    it('returns market analytics object', async () => {
      const result = await service.getMarketAnalytics();
      expect(result).toHaveProperty('priceIndex');
      expect(result).toHaveProperty('demandTrend');
      expect(result).toHaveProperty('topLocations');
      expect(result).toHaveProperty('marketInsights');
    });

    it('demandTrend is a string', async () => {
      const { demandTrend } = await service.getMarketAnalytics();
      expect(typeof demandTrend).toBe('string');
    });

    it('topLocations is an array', async () => {
      const { topLocations } = await service.getMarketAnalytics();
      expect(Array.isArray(topLocations)).toBe(true);
    });
  });

  // ─── getAgentPerformance ──────────────────────────────────────────
  describe('getAgentPerformance', () => {
    it('returns agent performance data', async () => {
      const result = await service.getAgentPerformance();
      expect(result).toHaveProperty('topAgents');
      expect(result).toHaveProperty('performance');
    });

    it('topAgents is an array', async () => {
      const { topAgents } = await service.getAgentPerformance();
      expect(Array.isArray(topAgents)).toBe(true);
    });

    it('accepts an optional limit parameter', async () => {
      const result = await service.getAgentPerformance(5);
      expect(result).toHaveProperty('topAgents');
    });
  });

  // ─── getRecentProperties ──────────────────────────────────────────
  describe('getRecentProperties', () => {
    it('returns properties data', async () => {
      const result = await service.getRecentProperties();
      expect(result).toHaveProperty('properties');
    });

    it('properties is an array', async () => {
      const { properties } = await service.getRecentProperties();
      expect(Array.isArray(properties)).toBe(true);
    });

    it('accepts an optional limit parameter', async () => {
      const result = await service.getRecentProperties(3);
      expect(result).toHaveProperty('properties');
    });
  });

  // ─── getConversionMetrics ─────────────────────────────────────────
  describe('getConversionMetrics', () => {
    it('returns conversion metrics', async () => {
      const result = await service.getConversionMetrics();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('byAgent');
      expect(result).toHaveProperty('bySource');
    });

    it('total is a number', async () => {
      const { total } = await service.getConversionMetrics();
      expect(typeof total).toBe('number');
    });
  });

  // ─── getRevenueAnalytics ──────────────────────────────────────────
  describe('getRevenueAnalytics', () => {
    it('returns revenue analytics', async () => {
      const result = await service.getRevenueAnalytics();
      expect(result).toHaveProperty('monthlyRevenue');
      expect(result).toHaveProperty('commissionDistribution');
      expect(result).toHaveProperty('topEarners');
    });

    it('monthlyRevenue is an array', async () => {
      const { monthlyRevenue } = await service.getRevenueAnalytics();
      expect(Array.isArray(monthlyRevenue)).toBe(true);
    });

    it('topEarners is an array', async () => {
      const { topEarners } = await service.getRevenueAnalytics();
      expect(Array.isArray(topEarners)).toBe(true);
    });
  });

  // ─── Service instantiation ────────────────────────────────────────
  describe('instantiation', () => {
    it('creates a new instance', () => {
      const svc = new DashboardService();
      expect(svc).toBeInstanceOf(DashboardService);
    });

    it('all methods are available', () => {
      expect(typeof service.getDashboardData).toBe('function');
      expect(typeof service.getMarketAnalytics).toBe('function');
      expect(typeof service.getAgentPerformance).toBe('function');
      expect(typeof service.getRecentProperties).toBe('function');
      expect(typeof service.getConversionMetrics).toBe('function');
      expect(typeof service.getRevenueAnalytics).toBe('function');
    });
  });
});
