import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { calculateRevenueForecast } from './forecastService.js';

describe('Pipeline Forecast Service — Wave 44 (W44-005)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateRevenueForecast', () => {
    it('calculates weighted revenue forecast across pipeline stages', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([
        { status: 'new', score: 10 },
        { status: 'offer_made', score: 80 },
        { status: 'closed', score: 100 },
      ]);

      const res = await calculateRevenueForecast();

      expect(res.totalPipelineDeals).toBe(3);
      expect(res.weightedForecastRevenueAED).toBeGreaterThan(0);
      expect(res.stageBreakdown).toHaveLength(6);
    });
  });
});
