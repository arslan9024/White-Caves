import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(), create: vi.fn(), marker: vi.fn(), preference: vi.fn(), emit: vi.fn(), external: vi.fn(),
  checkpoint: vi.fn(), progress: vi.fn(),
}));
vi.mock('../../database.js', () => ({
  prisma: {
    henryScannedDocument: { findMany: mocks.findMany },
    henryExpiryReminder: { upsert: mocks.checkpoint, updateMany: mocks.progress },
    notification: { create: mocks.create },
    $transaction: async (work: (tx: unknown) => Promise<unknown>) => work({
      henryExpiryReminder: { create: mocks.marker }, notification: { create: mocks.create },
    }),
    notificationPreference: { findUnique: mocks.preference },
  },
}));
vi.mock('../socketServer.js', () => ({ getSocketServer: () => ({ emitNotification: mocks.emit }) }));
vi.mock('../PushNotificationService.js', () => ({ PushNotificationService: { sendToUser: mocks.external } }));
import { runHenryExpiryReminders } from './expiryReminders';
import { notificationService } from '../NotificationService';

const now = new Date('2030-01-01T05:15:00Z');
const row = { id: '123456789012345678901234', ownerUserId: '223456789012345678901234', expiryAt: new Date('2030-01-20') };
describe('durable owner-only in-app expiry reminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findMany.mockResolvedValue([row]);
    mocks.checkpoint.mockResolvedValue({ scanCursor: null, scanExpiryAt: null, scanRevision: 0 });
    mocks.progress.mockResolvedValue({ count: 1 });
    mocks.preference.mockResolvedValue({ inApp: true, push: true });
    mocks.marker.mockResolvedValue({});
    mocks.create.mockImplementation(async ({ data }) => ({ ...data, id: 'notification-id' }));
  });
  it('bounds active, non-dismissed expiry scan and sends only a generic owner notification', async () => {
    expect(await runHenryExpiryReminders(now)).toEqual({ scanned: 1, sent: 1, failed: 0 });
    expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [{ replacedById: null }, { replacedById: { isSet: false } }],
        AND: [
          { OR: [{ reminderDismissedAt: null }, { reminderDismissedAt: { isSet: false } }] },
          { expiryAt: { gte: now, lt: new Date('2030-01-31T05:15:00Z') } },
        ],
      }, take: 500, select: { id: true, ownerUserId: true, expiryAt: true },
    }));
    const data = mocks.create.mock.calls[0]![0].data;
    expect(data.userId).toBe(row.ownerUserId);
    expect(mocks.marker.mock.calls[0]![0].data.id).toMatch(/^[a-f0-9]{24}$/);
    expect(data.message).not.toContain(row.id);
    expect(data.channel).toBe('in_app');
    expect(data.metadata).toBeUndefined();
    expect(mocks.external).not.toHaveBeenCalled();
  });
  it('deduplicates retries/restarts with the same durable notification ObjectId', async () => {
    const ids = new Set<string>();
    mocks.marker.mockImplementation(async ({ data }) => {
      if (ids.has(data.id)) throw new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: 'test' });
      ids.add(data.id);
      return data;
    });
    const results = await Promise.all([runHenryExpiryReminders(now), runHenryExpiryReminders(now)]);
    expect(results.reduce((sum, result) => sum + result.sent, 0)).toBe(1);
    expect(mocks.emit).toHaveBeenCalledTimes(1);
    // User-visible inbox deletion/recreation does not remove the independent marker.
    mocks.create.mockClear();
    expect((await runHenryExpiryReminders(now)).sent).toBe(0);
    expect(mocks.create).not.toHaveBeenCalled();
    mocks.findMany.mockResolvedValue([{ ...row, expiryAt: new Date('2030-01-21') }]);
    expect((await runHenryExpiryReminders(now)).sent).toBe(1);
  });
  it('retries persistence failure next tick and does not consume a delivery marker', async () => {
    const committed = new Set<string>();
    let pending = '';
    mocks.marker.mockImplementation(async ({ data }) => {
      if (committed.has(data.id)) throw new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: 'test' });
      pending = data.id;
      return data;
    });
    mocks.create.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(runHenryExpiryReminders(now)).rejects.toThrow(/deliveries failed/);
    // Transaction rollback leaves the marker uncommitted; subsequent delivery may retry.
    expect(committed.has(pending)).toBe(false);
    expect((await runHenryExpiryReminders(now)).sent).toBe(1);
    committed.add(pending);
    expect(mocks.marker.mock.calls[0]![0].data.id).toBe(mocks.marker.mock.calls[1]![0].data.id);
  });
  it('honors in-app preferences and leaves disabled delivery retryable', async () => {
    mocks.preference.mockResolvedValue({ inApp: false });
    expect((await runHenryExpiryReminders(now)).sent).toBe(0);
    expect(mocks.create).not.toHaveBeenCalled();
    mocks.preference.mockResolvedValue({ inApp: true });
    expect((await runHenryExpiryReminders(now)).sent).toBe(1);
  });
  it('does not retry already persisted delivery if realtime fails', async () => {
    mocks.emit.mockImplementationOnce(() => { throw new Error('socket unavailable'); });
    expect((await runHenryExpiryReminders(now)).sent).toBe(1);
    expect(mocks.external).not.toHaveBeenCalled();
  });
  it('propagates scan failures without pretending success', async () => {
    mocks.findMany.mockRejectedValueOnce(new Error('scan failed'));
    await expect(runHenryExpiryReminders(now)).rejects.toThrow('scan failed');
  });
  it('scopes a marker to the authenticated owner, not an external channel', async () => {
    await notificationService.pushOnceInApp({ id: row.id, userId: row.ownerUserId, title: 'Review', message: 'Generic' });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: row.ownerUserId, channel: 'in_app' }) });
  });

  it('eventually scans beyond 10000 across ticks, wraps for new earlier documents and skipped failures', async () => {
    const rows = Array.from({ length: 10001 }, (_, index) => ({
      ...row, id: (index + 1).toString(16).padStart(24, '0'),
    }));
    let checkpoint = { scanCursor: null as string | null, scanExpiryAt: null as Date | null, scanRevision: 0 };
    mocks.checkpoint.mockImplementation(async () => ({ ...checkpoint }));
    mocks.progress.mockImplementation(async ({ where, data }) => {
      if (where.scanRevision !== checkpoint.scanRevision) return { count: 0 };
      checkpoint = { scanCursor: data.scanCursor, scanExpiryAt: data.scanExpiryAt, scanRevision: checkpoint.scanRevision + 1 };
      return { count: 1 };
    });
    mocks.findMany.mockImplementation(async ({ where, take }) => {
      const continuation = where.AND[2]?.OR[1];
      return rows.filter(item => !continuation || item.id > continuation.id.gt).slice(0, take);
    });
    const delivered = new Set<string>();
    const delivery = { pushOnceInApp: vi.fn(async ({ id }: { id: string }) => {
      if (delivered.has(id)) return false;
      delivered.add(id);
      return true;
    }) };
    delivery.pushOnceInApp.mockRejectedValueOnce(new Error('transaction failed'));
    delivery.pushOnceInApp.mockResolvedValueOnce(false); // Disabled preference remains retryable.
    await expect(runHenryExpiryReminders(now, undefined, delivery)).rejects.toThrow(/deliveries failed/);
    expect(checkpoint.scanCursor).toBe(rows[9999]!.id);
    expect((await runHenryExpiryReminders(now, undefined, delivery)).scanned).toBe(1);
    expect(checkpoint.scanCursor).toBeNull();
    rows.unshift({ ...row, id: '000000000000000000000000' });
    expect((await runHenryExpiryReminders(now, undefined, delivery)).sent).toBe(3);
    expect((await runHenryExpiryReminders(now, undefined, delivery)).sent).toBe(0);
    expect(delivered.size).toBe(10002);
  });

  it('orders by deadline and uses revision-guarded durable progress without a deleted-row cursor', async () => {
    mocks.checkpoint.mockResolvedValue({ scanCursor: row.id, scanExpiryAt: row.expiryAt, scanRevision: 7 });
    await runHenryExpiryReminders(now);
    expect(mocks.findMany).toHaveBeenCalledWith(expect.objectContaining({
      orderBy: [{ expiryAt: 'asc' }, { id: 'asc' }],
      where: expect.objectContaining({ AND: expect.arrayContaining([{ OR: [
        { expiryAt: { gt: row.expiryAt } }, { expiryAt: row.expiryAt, id: { gt: row.id } },
      ] }]) }),
    }));
    expect(mocks.progress).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: expect.any(String), scanRevision: 7 },
      data: { scanCursor: null, scanExpiryAt: null, scanRevision: { increment: 1 } },
    }));
  });

  it('preserves the checkpoint on scan failure and resumes the same range next tick', async () => {
    mocks.checkpoint.mockResolvedValue({ scanCursor: row.id, scanExpiryAt: row.expiryAt, scanRevision: 4 });
    mocks.findMany.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(runHenryExpiryReminders(now)).rejects.toThrow('database unavailable');
    expect(mocks.progress).not.toHaveBeenCalled();
    await runHenryExpiryReminders(now);
    expect(mocks.findMany.mock.calls[0]![0].where).toEqual(mocks.findMany.mock.calls[1]![0].where);
  });
});
