import { describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  schedule: vi.fn((_expression: string, _handler: () => Promise<void>, _options: { timezone: string }) => ({ stop: vi.fn(), destroy: vi.fn() })),
  run: vi.fn().mockResolvedValue({ sent: 0 }), activity: vi.fn().mockResolvedValue({}),
}));
vi.mock('node-cron', () => ({ default: { schedule: mocks.schedule } }));
vi.mock('../../database.js', () => ({ prisma: { activity: { create: mocks.activity } } }));
vi.mock('../ai/leadScoringEngine.js', () => ({ batchRescoreLeads: vi.fn() }));
vi.mock('../compliance/permitAlertScheduler.js', () => ({ runPermitAlertSchedulerTick: vi.fn() }));
vi.mock('../compliance/propertyPermitEnforcementScheduler.js', () => ({ runPropertyPermitEnforcementTick: vi.fn() }));
vi.mock('../leadWorkflowService.js', () => ({ runLeadSlaEscalationTick: vi.fn() }));
vi.mock('./expiryReminders.js', () => ({ runHenryExpiryReminders: mocks.run }));
import { SchedulerService } from '../SchedulerService';

describe('Henry configured daily scheduler', () => {
  it('registers 09:15 Dubai daily once, executes and cancels on shutdown', async () => {
    const scheduler = new SchedulerService();
    scheduler.start();
    const job = scheduler.getJob('henry-expiry-reminders-daily');
    expect(job).toMatchObject({ cronExpression: '15 9 * * *', timezone: 'Asia/Dubai' });
    const call = mocks.schedule.mock.calls.find(args => args[0] === '15 9 * * *');
    expect(call).toBeDefined();
    const count = mocks.schedule.mock.calls.length;
    scheduler.start();
    expect(mocks.schedule).toHaveBeenCalledTimes(count);
    await (call![1] as () => Promise<void>)();
    expect(mocks.run).toHaveBeenCalledTimes(1);
    expect(job?.lastStatus).toBe('success');
    mocks.run.mockRejectedValueOnce(new Error('delivery unavailable'));
    await (call![1] as () => Promise<void>)();
    expect(job?.lastStatus).toBe('failed');
    scheduler.stop();
    expect(job?.task?.stop).toHaveBeenCalled();
  });
});
