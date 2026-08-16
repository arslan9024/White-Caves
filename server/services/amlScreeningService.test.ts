import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-sar-1' }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { screenClientForAml, createSarRecord } from './amlScreeningService.js';

describe('AML Screening Service — Wave 42 (W42-001, W42-002, W42-003)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('screenClientForAml', () => {
    it('returns low risk score for normal client screening', async () => {
      const res = await screenClientForAml({
        clientName: 'Fatima Al Mansoori',
        nationality: 'United Arab Emirates',
        amountAED: 20000,
      });

      expect(res.riskLevel).toBe('low');
      expect(res.pepMatched).toBe(false);
      expect(res.sanctionsMatched).toBe(false);
    });

    it('returns high risk score when PEP and high value transaction triggered', async () => {
      const res = await screenClientForAml({
        clientName: 'Minister Sheikh Al Nahyan',
        nationality: 'United Arab Emirates',
        amountAED: 600000,
      });

      expect(res.riskLevel).toBe('high');
      expect(res.pepMatched).toBe(true);
      expect(res.flags).toContain('pep_matched');
      expect(res.flags).toContain('high_value_transaction_threshold');
    });
  });

  describe('createSarRecord', () => {
    it('creates SAR activity record for goAML tracking', async () => {
      const res = await createSarRecord({
        clientName: 'John Doe',
        suspicionReason: 'Unexplained cash deposit over threshold',
        reportedById: 'usr-officer-1',
      });

      expect(res.id).toBe('act-sar-1');
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'compliance',
            action: 'sar_created',
          }),
        })
      );
    });
  });
});
