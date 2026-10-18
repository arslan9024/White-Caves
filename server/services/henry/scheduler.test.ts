import { afterEach, expect, it, vi } from 'vitest';

vi.mock('node-cron', () => ({ default: { schedule: vi.fn(() => ({ stop: vi.fn(), destroy: vi.fn() })) } }));
vi.mock('../../database.js', () => ({ prisma: { activity: { create: vi.fn().mockResolvedValue({}) } } }));
vi.mock('../../utils/logger.js', () => ({ default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));
vi.mock('../ai/leadScoringEngine.js', () => ({ batchRescoreLeads: vi.fn() }));
vi.mock('../compliance/permitAlertScheduler.js', () => ({ runPermitAlertSchedulerTick: vi.fn() }));
vi.mock('../compliance/propertyPermitEnforcementScheduler.js', () => ({ runPropertyPermitEnforcementTick: vi.fn() }));
vi.mock('../leadWorkflowService.js', () => ({ runLeadSlaEscalationTick: vi.fn() }));
vi.mock('./expiryReminders.js', () => ({ runHenryExpiryReminders: vi.fn().mockResolvedValue({ sent: 1 }) }));

import cron from 'node-cron';
import { SchedulerService } from '../SchedulerService.js';
import { runHenryExpiryReminders } from './expiryReminders.js';

afterEach(() => { vi.clearAllMocks(); });

it('registers complete job status metadata and runs the Henry daily reminder at Dubai 09:15', async () => {
  const scheduler = new SchedulerService();
  try {
    scheduler.start();
    expect(scheduler.getStatus()).toHaveLength(8);
    for (const status of scheduler.getStatus()) {
      expect(status).toMatchObject({
        lastRunAt: null, lastStatus: null, lastError: null, lastDurationMs: null, runsCount: 0,
      });
    }
    const registration = vi.mocked(cron.schedule).mock.calls.find(([expression]) => expression === '15 9 * * *');
    expect(registration?.[2]).toEqual({ timezone: 'Asia/Dubai' });
    const tick = registration?.[1];
    if (typeof tick !== 'function') throw new Error('Henry reminder callback not registered');
    await tick({} as Parameters<typeof tick>[0]);
    expect(runHenryExpiryReminders).toHaveBeenCalledOnce();
    expect(scheduler.getJob('henry-expiry-reminders-daily')?.lastStatus).toBe('success');
  } finally {
    scheduler.stop();
  }
});
