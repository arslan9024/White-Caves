import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../database.js', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
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
  checkPermitAlertsAndLog,
  getPermitAlerts,
  runPermitAlertSchedulerTick,
  startPermitAlertScheduler,
} from '../permitAlertScheduler';

const mockPrisma = prisma as unknown as {
  property: { findMany: ReturnType<typeof vi.fn> };
  user: { findMany: ReturnType<typeof vi.fn> };
  activity: { create: ReturnType<typeof vi.fn> };
};

describe('permitAlertScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
  });

  it('returns empty alert summary when no issues exist', async () => {
    const result = await getPermitAlerts(30);

    expect(result.summary.daysAhead).toBe(30);
    expect(result.summary.listingPermitIssues).toBe(0);
    expect(result.summary.brnExpired).toBe(0);
    expect(result.summary.brnExpiringSoon).toBe(0);
    expect(result.listingPermitIssues).toEqual([]);
    expect(result.brnPermitAlerts).toEqual([]);
  });

  it('logs activity when issues are present', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([
      {
        id: 'prop-1',
        title: 'Marina Apt',
        status: 'available',
        municipalityNumber: null,
        buildingPermitNumber: 'BP-1',
        createdAt: new Date('2026-05-10T00:00:00.000Z'),
      },
    ]);

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    mockPrisma.user.findMany.mockResolvedValueOnce([
      {
        id: 'u-1',
        name: 'Agent One',
        email: 'a1@whitecaves.ae',
        role: 'agent',
        brnNumber: 'BRN-001',
        brnExpiry: tomorrow,
      },
    ]);

    const summary = await checkPermitAlertsAndLog(30);

    expect(summary.listingPermitIssues).toBe(1);
    expect(summary.brnExpiringSoon).toBe(1);
    expect(mockPrisma.activity.create).toHaveBeenCalledTimes(1);
  });

  it('does not log activity when no issues are found', async () => {
    const summary = await checkPermitAlertsAndLog(30);

    expect(summary.listingPermitIssues).toBe(0);
    expect(summary.brnExpired).toBe(0);
    expect(mockPrisma.activity.create).not.toHaveBeenCalled();
  });

  it('skips overlapping tick while previous run is still active', async () => {
    let resolveFindMany: ((value: unknown) => void) | null = null;
    const pendingFindMany = new Promise(resolve => {
      resolveFindMany = resolve;
    });

    mockPrisma.property.findMany.mockImplementationOnce(() => pendingFindMany);

    const firstRunPromise = runPermitAlertSchedulerTick(30);
    const secondRun = await runPermitAlertSchedulerTick(30);

    expect(secondRun.status).toBe('skipped');

    resolveFindMany?.([]);
    const firstRun = await firstRunPromise;

    expect(firstRun.status).toBe('ran');
    expect(firstRun.summary?.listingPermitIssues).toBe(0);
  });

  it('starts scheduler and returns interval handle', () => {
    vi.useFakeTimers();

    const interval = startPermitAlertScheduler(30);

    expect(interval).toBeDefined();
    clearInterval(interval);
  });
});
