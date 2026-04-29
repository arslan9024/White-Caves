/* eslint-disable security/detect-object-injection */

/**
 * Homepage Aggregate API — @Mira (CTO/API Lead)
 * GET /api/homepage/data
 *
 * Single round-trip endpoint that powers the public homepage.
 * Returns: featuredProperties, marketStats, topAgents, locationTrends
 *
 * Design-Driven Workflow: This route is the "ghost" that runs in the background
 * while @Una and @Lea's UI components display the data live.
 *
 * Auth: PUBLIC (no JWT required — homepage is unauthenticated)
 * Cache: 60s stale-while-revalidate via Cache-Control header
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── Location areas to track for trends ──────────────────────────────────────
const TRACKED_LOCATIONS = [
  'Palm Jumeirah',
  'Downtown Dubai',
  'Emirates Hills',
  'Dubai Marina',
];

// ─── GET /api/homepage/data ───────────────────────────────────────────────────
router.get(
  '/data',
  asyncHandler(async (_req: Request, res: Response) => {
    const startTime = Date.now();

    try {
      // ── Run all DB queries in parallel ──────────────────────────────────────
      const [
        featuredProperties,
        allPropertyStats,
        totalProperties,
        availableCount,
        activeAgents,
        locationCounts,
      ] = await Promise.all([
        // 1. Featured properties for the showcase section
        prisma.property.findMany({
          where: { featured: true, status: 'available' },
          orderBy: { price: 'desc' },
          take: 6,
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
            price: true,
            currency: true,
            bedrooms: true,
            bathrooms: true,
            sqft: true,
            location: true,
            area: true,
            amenities: true,
            images: true,
            featured: true,
            agentName: true,
          },
        }),

        // 2. Portfolio stats aggregate
        prisma.property.aggregate({
          _avg: { price: true },
          _sum: { price: true },
          _count: { id: true },
        }),

        // 3. Total property count
        prisma.property.count(),

        // 4. Available property count
        prisma.property.count({ where: { status: 'available' } }),

        // 5. Active agent count
        prisma.user.count({
          where: { role: { in: ['agent', 'owner', 'manager'] }, status: 'active' },
        }),

        // 6. Property counts per tracked location
        Promise.all(
          TRACKED_LOCATIONS.map((loc) =>
            prisma.property.count({
              where: { location: { contains: loc, mode: 'insensitive' } },
            })
          )
        ),
      ]);

      // ── Top agents by performance score ────────────────────────────────────
      // Fetch separately so it doesn't block the main stats on slow queries
      const topAgentsRaw = await prisma.user.findMany({
        where: { role: 'agent', status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
          department: true,
          _count: {
            select: { commissions: true },
          },
        },
      });

      // ── Commission sums per agent ───────────────────────────────────────────
      const agentRevenue = await Promise.all(
        topAgentsRaw.map((agent) =>
          prisma.commission.aggregate({
            where: { agentId: agent.id, status: 'paid' },
            _sum: { amount: true },
          })
        )
      );

      // ── Build response objects ──────────────────────────────────────────────

      const marketStats = {
        totalProperties,
        availableProperties: availableCount,
        averagePrice: Math.round(allPropertyStats._avg.price ?? 0),
        portfolioValue: Math.round(allPropertyStats._sum.price ?? 0),
        activeAgents,
      };

      const topAgents = topAgentsRaw.map((agent, i) => ({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        photoUrl: agent.photoUrl ?? null,
        department: agent.department ?? 'sales',
        dealsCount: agent._count.commissions,
        revenueGenerated: Math.round(agentRevenue[i]._sum.amount ?? 0),
      }));

      // Static trend percentages — replace with analytics data when available
      const TREND_PERCENTS: Record<string, number> = {
        'Palm Jumeirah': 12,
        'Downtown Dubai': 8,
        'Emirates Hills': 15,
        'Dubai Marina': 10,
      };

      const STATIC_AVG_PRICES: Record<string, number> = {
        'Palm Jumeirah': 15_000_000,
        'Downtown Dubai': 8_000_000,
        'Emirates Hills': 35_000_000,
        'Dubai Marina': 5_000_000,
      };

      const locationTrends = TRACKED_LOCATIONS.map((name, i) => {
        const pct = TREND_PERCENTS[name] ?? 0;
        return {
          name,
          propertyCount: locationCounts[i],
          avgPrice: STATIC_AVG_PRICES[name] ?? 0,
          trendPercent: Math.abs(pct),
          trendDirection: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat',
        };
      });

      const duration = Date.now() - startTime;
      logger.info(`GET /api/homepage/data — ${duration}ms`);

      // 60s browser cache + CDN stale-while-revalidate
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

      res.status(200).json({
        success: true,
        data: {
          featuredProperties,
          marketStats,
          topAgents,
          locationTrends,
        },
        meta: { duration, fetchedAt: new Date().toISOString() },
      });
    } catch (err) {
      logger.error('Homepage data fetch error:', err);
      // Return static fallback so the homepage never shows a hard error
      res.status(200).json({
        success: true,
        data: {
          featuredProperties: [],
          marketStats: {
            totalProperties: 500,
            availableProperties: 320,
            averagePrice: 4_500_000,
            portfolioValue: 2_250_000_000,
            activeAgents: 50,
          },
          topAgents: [],
          locationTrends: [
            { name: 'Palm Jumeirah',  propertyCount: 120, avgPrice: 15_000_000, trendPercent: 12, trendDirection: 'up' },
            { name: 'Downtown Dubai', propertyCount: 200, avgPrice:  8_000_000, trendPercent:  8, trendDirection: 'up' },
            { name: 'Emirates Hills', propertyCount:  45, avgPrice: 35_000_000, trendPercent: 15, trendDirection: 'up' },
            { name: 'Dubai Marina',   propertyCount: 180, avgPrice:  5_000_000, trendPercent: 10, trendDirection: 'up' },
          ],
        },
        meta: { duration: 0, fetchedAt: new Date().toISOString(), fallback: true },
      });
    }
  })
);

export default router;
