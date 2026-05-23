import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../database.js', () => ({
  prisma: {
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

vi.mock('../../emailService.js', () => ({
  EMAIL_TEMPLATES: {
    reraExpiry: vi.fn(() => ({
      subject: 'RERA Expiry Alert',
      html: '<p>alert</p>',
      text: 'alert',
    })),
  },
  sendEmailTracked: vi.fn(async () => ({ id: 'email-1' })),
}));

vi.mock('../../whatsapp/metaAPI.js', () => ({
  createMetaAPIClient: vi.fn(() => ({
    sendTemplate: vi.fn(async () => ({ success: true })),
  })),
}));

vi.mock('../../whatsapp/whatsappUtils.js', () => ({
  normalizePhone: vi.fn((phone: string) => phone),
  WHATSAPP_TEMPLATES: {
    rera_expiry_alert: { name: 'rera_expiry_alert' },
  },
  getTemplateParams: vi.fn(() => []),
}));

import { prisma } from '../../../database.js';
import {
  checkBRNExpirations,
  getBRNExpiryReport,
  runRERAExpirySchedulerTick,
  startRERAExpiryScheduler,
} from '../reraExpiryScheduler';

const mockPrisma = prisma as unknown as {
  user: { findMany: ReturnType<typeof vi.fn> };
  activity: { create: ReturnType<typeof vi.fn> };
};

describe('reraExpiryScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
    process.env.META_ACCESS_TOKEN = '';
    process.env.META_PHONE_NUMBER_ID = '';
  });

  it('returns empty expiry result when no agents are expiring', async () => {
    const result = await checkBRNExpirations();

    expect(result.notified).toBe(0);
    expect(result.errors).toBe(0);
    expect(result.agents).toEqual([]);
    expect(mockPrisma.activity.create).not.toHaveBeenCalled();
  });

  it('creates alert activity for threshold-day expiry', async () => {
    const days30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    mockPrisma.user.findMany.mockResolvedValueOnce([
      {
        id: 'agent-1',
        name: 'Agent One',
        email: 'agent1@whitecaves.ae',
        phone: '+971500000001',
        brnNumber: 'BRN-001',
        brnExpiry: days30,
      },
    ]);

    const result = await checkBRNExpirations();

    expect(result.notified).toBe(1);
    expect(result.errors).toBe(0);
    expect(mockPrisma.activity.create).toHaveBeenCalledTimes(1);
  });

  it('returns BRN expiry report with status classifications', async () => {
    const valid = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const expiring = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const expired = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    mockPrisma.user.findMany.mockResolvedValueOnce([
      { id: 'u1', name: 'Valid', email: 'v@wc.ae', brnNumber: 'BRN-V', brnExpiry: valid },
      { id: 'u2', name: 'Soon', email: 's@wc.ae', brnNumber: 'BRN-S', brnExpiry: expiring },
      { id: 'u3', name: 'Old', email: 'o@wc.ae', brnNumber: 'BRN-O', brnExpiry: expired },
      { id: 'u4', name: 'Unset', email: 'n@wc.ae', brnNumber: null, brnExpiry: null },
    ]);

    const report = await getBRNExpiryReport();

    expect(report).toHaveLength(4);
    expect(report.find(a => a.id === 'u1')?.status).toBe('valid');
    expect(report.find(a => a.id === 'u2')?.status).toBe('expiring_soon');
    expect(report.find(a => a.id === 'u3')?.status).toBe('expired');
    expect(report.find(a => a.id === 'u4')?.status).toBe('not_set');
  });

  it('skips overlapping tick while previous run is still active', async () => {
    let resolveFindMany: ((value: unknown) => void) | null = null;
    const pendingFindMany = new Promise(resolve => {
      resolveFindMany = resolve;
    });

    mockPrisma.user.findMany.mockImplementationOnce(() => pendingFindMany);

    const firstRunPromise = runRERAExpirySchedulerTick();
    const secondRun = await runRERAExpirySchedulerTick();

    expect(secondRun.status).toBe('skipped');

    resolveFindMany?.([]);
    const firstRun = await firstRunPromise;

    expect(firstRun.status).toBe('ran');
    expect(firstRun.result?.notified).toBe(0);
  });

  it('starts scheduler and returns interval handle', () => {
    vi.useFakeTimers();

    const interval = startRERAExpiryScheduler();

    expect(interval).toBeDefined();
    clearInterval(interval);
  });
});
