import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../database.js', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { prisma } from '../../../database.js';
import {
  enforcePropertyPermitCompliance,
  startPropertyPermitEnforcementScheduler,
} from '../propertyPermitEnforcementScheduler';

const mockPrisma = prisma as unknown as {
  property: {
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  activity: {
    create: ReturnType<typeof vi.fn>;
  };
};

describe('propertyPermitEnforcementScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('returns zero summary when no non-compliant available listings exist', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([]);

    const result = await enforcePropertyPermitCompliance();

    expect(result.scanned).toBe(0);
    expect(result.autoUnpublished).toBe(0);
    expect(result.errors).toBe(0);
    expect(result.affectedPropertyIds).toEqual([]);
    expect(mockPrisma.property.update).not.toHaveBeenCalled();
    expect(mockPrisma.activity.create).not.toHaveBeenCalled();
  });

  it('supports dry-run mode without mutating data', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([
      {
        id: 'prop-1',
        title: 'Bad Listing',
        status: 'available',
        municipalityNumber: null,
        buildingPermitNumber: '',
        userId: 'u-1',
      },
    ]);

    const result = await enforcePropertyPermitCompliance({ dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.scanned).toBe(1);
    expect(result.autoUnpublished).toBe(0);
    expect(result.affectedPropertyIds).toEqual(['prop-1']);
    expect(mockPrisma.property.update).not.toHaveBeenCalled();
    expect(mockPrisma.activity.create).not.toHaveBeenCalled();
  });

  it('auto-unpublishes non-compliant listings and writes audit activity', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([
      {
        id: 'prop-1',
        title: 'Bad Listing 1',
        status: 'available',
        municipalityNumber: null,
        buildingPermitNumber: 'BP-1',
        userId: 'u-1',
      },
      {
        id: 'prop-2',
        title: 'Bad Listing 2',
        status: 'available',
        municipalityNumber: 'MN-2',
        buildingPermitNumber: '',
        userId: 'u-2',
      },
    ]);

    mockPrisma.property.update.mockResolvedValue({});
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });

    const result = await enforcePropertyPermitCompliance();

    expect(result.scanned).toBe(2);
    expect(result.autoUnpublished).toBe(2);
    expect(result.errors).toBe(0);
    expect(result.affectedPropertyIds).toEqual(['prop-1', 'prop-2']);
    expect(mockPrisma.property.update).toHaveBeenCalledTimes(2);
    expect(mockPrisma.activity.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.property.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'prop-1' },
        data: { status: 'off_market' },
      })
    );
  });

  it('captures per-property update failures and continues processing', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([
      {
        id: 'prop-ok',
        title: 'Good Process',
        status: 'available',
        municipalityNumber: null,
        buildingPermitNumber: 'BP-OK',
        userId: 'u-1',
      },
      {
        id: 'prop-fail',
        title: 'Fails Update',
        status: 'available',
        municipalityNumber: '',
        buildingPermitNumber: 'BP-FAIL',
        userId: 'u-2',
      },
    ]);

    mockPrisma.property.update
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('db down'));
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });

    const result = await enforcePropertyPermitCompliance();

    expect(result.scanned).toBe(2);
    expect(result.autoUnpublished).toBe(1);
    expect(result.errors).toBe(1);
    expect(result.affectedPropertyIds).toEqual(['prop-ok']);
    expect(mockPrisma.activity.create).toHaveBeenCalledTimes(1);
  });

  it('starts scheduler and schedules interval + startup run', () => {
    vi.useFakeTimers();

    const interval = startPropertyPermitEnforcementScheduler();

    expect(interval).toBeDefined();
    // Cleanup interval to avoid leaking in test process
    clearInterval(interval);
  });
});
