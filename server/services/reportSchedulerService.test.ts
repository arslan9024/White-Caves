import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lead: { count: vi.fn().mockResolvedValue(45) },
    lease: { findMany: vi.fn().mockResolvedValue([{ monthlyRent: 12000 }]) },
    maintenance: { count: vi.fn().mockResolvedValue(10) },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import {
  generateExecutiveReportDigest,
  sendScheduledReportDigest,
} from './reportSchedulerService.js';

describe('Report Scheduler Service — Wave 44 (W44-006)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateExecutiveReportDigest', () => {
    it('compiles monthly executive report metrics', async () => {
      const digest = await generateExecutiveReportDigest();

      expect(digest.totalLeadsCount).toBe(45);
      expect(digest.activeLeasesCount).toBe(1);
      expect(digest.monthlyRevenueAED).toBe(12000);
    });
  });

  describe('sendScheduledReportDigest', () => {
    it('dispatches report digest to recipient email', async () => {
      const res = await sendScheduledReportDigest('executive@whitecaves.ae');

      expect(res.recipientEmail).toBe('executive@whitecaves.ae');
      expect(res.status).toBe('delivered');
    });
  });
});
