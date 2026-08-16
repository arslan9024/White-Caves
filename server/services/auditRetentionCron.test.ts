import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    activity: {
      deleteMany: vi.fn().mockResolvedValue({ count: 14 }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { purgeExpiredAuditLogs, startAuditRetentionCron } from './auditRetentionCron.js';

describe('Audit Retention Cron — Wave 43 (W43-004)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('purgeExpiredAuditLogs', () => {
    it('deletes activity records older than 5 years cutoff date', async () => {
      const res = await purgeExpiredAuditLogs();

      expect(res.purgedCount).toBe(14);
      expect(mockPrisma.activity.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            lt: expect.any(Date),
          },
        },
      });
    });
  });

  describe('startAuditRetentionCron', () => {
    it('initializes cron and triggers purge', () => {
      startAuditRetentionCron();
      expect(mockPrisma.activity.deleteMany).toHaveBeenCalled();
    });
  });
});
