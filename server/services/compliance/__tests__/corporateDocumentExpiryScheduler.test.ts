import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../database.js', () => ({
  prisma: {
    corporateDocument: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    corporateDocumentAlert: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    corporateDocumentAuditLog: {
      create: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const mockPushToUser = vi.fn();
vi.mock('../../NotificationService.js', () => ({
  notificationService: {
    pushToUser: (...args: unknown[]) => mockPushToUser(...args),
  },
}));

const mockSendEmailTracked = vi.fn();
vi.mock('../../emailService.js', () => ({
  sendEmailTracked: (...args: unknown[]) => mockSendEmailTracked(...args),
}));

const mockSendText = vi.fn();
const mockCreateMetaAPIClient = vi.fn(() => ({
  sendText: (...args: unknown[]) => mockSendText(...args),
}));
const mockNormalizePhone = vi.fn((value: string) => value);
vi.mock('../../whatsapp/metaAPI.js', () => ({
  createMetaAPIClient: (...args: unknown[]) => mockCreateMetaAPIClient(...args),
}));
vi.mock('../../whatsapp/whatsappUtils.js', () => ({
  normalizePhone: (...args: unknown[]) => mockNormalizePhone(...args),
}));

import { prisma } from '../../../database.js';
import {
  runCorporateDocumentExpiryCheck,
  runCorporateDocumentExpirySchedulerTick,
  startCorporateDocumentExpiryScheduler,
} from '../corporateDocumentExpiryScheduler.js';

const mockPrisma = prisma as unknown as {
  corporateDocument: { findMany: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  corporateDocumentAlert: { findFirst: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  corporateDocumentAuditLog: { create: ReturnType<typeof vi.fn> };
  activity: { create: ReturnType<typeof vi.fn> };
  user: { findMany: ReturnType<typeof vi.fn> };
};

describe('corporateDocumentExpiryScheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    delete process.env.CORPORATE_DOCUMENT_ALERT_EMAIL_ENABLED;
    delete process.env.CORPORATE_DOCUMENT_ALERT_WHATSAPP_ENABLED;
    delete process.env.META_ACCESS_TOKEN;
    delete process.env.META_PHONE_NUMBER_ID;
    delete process.env.META_BUSINESS_ACCOUNT_ID;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

    mockPrisma.corporateDocument.findMany.mockResolvedValue([]);
    mockPrisma.corporateDocument.update.mockResolvedValue({ id: 'doc-1' });
    mockPrisma.corporateDocumentAlert.findFirst.mockResolvedValue(null);
    mockPrisma.corporateDocumentAlert.create.mockResolvedValue({ id: 'alert-1' });
    mockPrisma.corporateDocumentAuditLog.create.mockResolvedValue({ id: 'audit-1' });
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'user-1' }, { id: 'user-2' }]);
    mockPushToUser.mockResolvedValue(undefined);
  });

  it('returns empty summary when no corporate documents are tracked', async () => {
    const summary = await runCorporateDocumentExpiryCheck();

    expect(summary.scanned).toBe(0);
    expect(summary.alertsCreated).toBe(0);
    expect(summary.notificationsQueued).toBe(0);
  });

  it('updates document status and creates threshold alert when document is 30 days from expiry', async () => {
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    mockPrisma.corporateDocument.findMany.mockResolvedValueOnce([
      {
        id: 'doc-30',
        title: 'DET Commercial License',
        authority: 'DET',
        expiryDate: thirtyDays,
        status: 'active',
      },
    ]);

    const summary = await runCorporateDocumentExpiryCheck();

    expect(summary.statusUpdated).toBe(1);
    expect(summary.alertsCreated).toBe(1);
    expect(mockPrisma.corporateDocument.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'doc-30' }, data: { status: 'expiring_soon' } }),
    );
    expect(mockPrisma.corporateDocumentAlert.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          alertType: 'expiry_threshold_30',
          documentId: 'doc-30',
        }),
      }),
    );
    expect(mockPushToUser).toHaveBeenCalledTimes(2);
  });

  it('creates day-zero alert for expired documents without duplicating existing alerts', async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    mockPrisma.corporateDocument.findMany.mockResolvedValueOnce([
      {
        id: 'doc-expired',
        title: 'RERA Certificate',
        authority: 'RERA',
        expiryDate: yesterday,
        status: 'expiring_soon',
      },
    ]);

    const summary = await runCorporateDocumentExpiryCheck();

    expect(summary.expired).toBe(1);
    expect(mockPrisma.corporateDocumentAlert.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          alertType: 'expiry_threshold_0',
        }),
      }),
    );
  });

  it('emits email and WhatsApp delivery events when optional fanout channels are enabled', async () => {
    process.env.CORPORATE_DOCUMENT_ALERT_EMAIL_ENABLED = 'true';
    process.env.CORPORATE_DOCUMENT_ALERT_WHATSAPP_ENABLED = 'true';
    process.env.META_ACCESS_TOKEN = 'meta-token';
    process.env.META_PHONE_NUMBER_ID = 'meta-phone-id';

    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    mockPrisma.corporateDocument.findMany.mockResolvedValueOnce([
      {
        id: 'doc-fanout',
        title: 'Corporate Trade License',
        authority: 'DET',
        expiryDate: thirtyDays,
        status: 'active',
      },
    ]);

    mockPrisma.user.findMany.mockResolvedValueOnce([
      {
        id: 'user-email-wa',
        email: 'manager@whitecaves.com',
        phone: '+971501112233',
        name: 'Manager',
      },
    ]);

    const summary = await runCorporateDocumentExpiryCheck();

    expect(mockSendEmailTracked).toHaveBeenCalledTimes(1);
    expect(mockCreateMetaAPIClient).toHaveBeenCalledTimes(1);
    expect(mockSendText).toHaveBeenCalledTimes(1);
    expect(summary.notificationsQueued).toBe(3);
  });

  it('skips alert creation when the threshold alert already exists', async () => {
    const fourteenDays = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    mockPrisma.corporateDocument.findMany.mockResolvedValueOnce([
      {
        id: 'doc-existing',
        title: 'GDRFA Card',
        authority: 'GDRFA',
        expiryDate: fourteenDays,
        status: 'expiring_soon',
      },
    ]);
    mockPrisma.corporateDocumentAlert.findFirst.mockResolvedValueOnce({ id: 'existing-alert' });

    const summary = await runCorporateDocumentExpiryCheck();

    expect(summary.alertsCreated).toBe(0);
    expect(mockPrisma.corporateDocumentAlert.create).not.toHaveBeenCalled();
  });

  it('skips overlapping scheduler ticks while a previous run is active', async () => {
    let resolveFindMany: ((value: unknown) => void) | null = null;
    const pendingFindMany = new Promise(resolve => {
      resolveFindMany = resolve;
    });
    mockPrisma.corporateDocument.findMany.mockImplementationOnce(() => pendingFindMany);

    const firstRunPromise = runCorporateDocumentExpirySchedulerTick();
    const secondRun = await runCorporateDocumentExpirySchedulerTick();

    expect(secondRun.status).toBe('skipped');

    resolveFindMany?.([]);
    const firstRun = await firstRunPromise;
    expect(firstRun.status).toBe('ran');
  });

  it('starts scheduler and returns interval handle', () => {
    vi.useFakeTimers();

    const interval = startCorporateDocumentExpiryScheduler();

    expect(interval).toBeDefined();
    clearInterval(interval);
  });
});