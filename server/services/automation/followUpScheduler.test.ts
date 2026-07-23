/**
 * Follow-Up Scheduler Integration Tests — W18.1-P0-018
 *
 * Covers:
 *   - startFollowUpScheduler: starts interval, idempotent
 *   - stopFollowUpScheduler: clears interval
 *   - runFollowUpBatch: calls processScheduledSteps, logs result
 *   - Overlap guard: skips when previous batch still running
 *   - Dev mode: disabled unless ENABLE_DEV_FOLLOWUP=true
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mock processScheduledSteps ────────────────────────────────────────────────

const mockProcessScheduledSteps = vi.fn();

vi.mock('./followUpEngine.js', () => ({
  processScheduledSteps: mockProcessScheduledSteps,
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('followUpScheduler (W18.1-P0-018)', () => {
  let startFollowUpScheduler: () => void;
  let stopFollowUpScheduler: () => void;

  // Re-import the module fresh for each test so module-level state resets
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset module to clear schedulerInterval and isRunning
    vi.resetModules();

    // Re-mock after resetModules
    vi.doMock('./followUpEngine.js', () => ({
      processScheduledSteps: mockProcessScheduledSteps,
    }));
    vi.doMock('../../utils/logger.js', () => ({
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    }));

    const mod = await import('./followUpScheduler.js') as {
      startFollowUpScheduler: () => void;
      stopFollowUpScheduler: () => void;
    };
    startFollowUpScheduler = mod.startFollowUpScheduler;
    stopFollowUpScheduler = mod.stopFollowUpScheduler;
  });

  afterEach(() => {
    stopFollowUpScheduler();
    vi.useRealTimers();
    vi.resetModules();
  });

  // ── Start / stop ────────────────────────────────────────────────────────────

  it('starts scheduler in production mode and fires batch on interval', async () => {
    process.env.NODE_ENV = 'production';
    mockProcessScheduledSteps.mockResolvedValue({
      processed: 2, sent: 2, failed: 0, skipped: 0, errors: [],
    });

    startFollowUpScheduler();

    // Advance 5 minutes (production interval)
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = 'test';
  });

  it('startFollowUpScheduler is idempotent — second call is a no-op', async () => {
    process.env.NODE_ENV = 'production';
    mockProcessScheduledSteps.mockResolvedValue({
      processed: 0, sent: 0, failed: 0, skipped: 0, errors: [],
    });

    startFollowUpScheduler();
    startFollowUpScheduler(); // second call

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    // Only one interval should have been registered → one batch call
    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = 'test';
  });

  it('stopFollowUpScheduler clears the interval', async () => {
    process.env.NODE_ENV = 'production';
    mockProcessScheduledSteps.mockResolvedValue({
      processed: 0, sent: 0, failed: 0, skipped: 0, errors: [],
    });

    startFollowUpScheduler();
    stopFollowUpScheduler();

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);

    // No batches should fire after stop
    expect(mockProcessScheduledSteps).not.toHaveBeenCalled();

    process.env.NODE_ENV = 'test';
  });

  // ── Dev mode ────────────────────────────────────────────────────────────────

  it('does not start in dev mode without ENABLE_DEV_FOLLOWUP=true', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.ENABLE_DEV_FOLLOWUP;

    startFollowUpScheduler();

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
    expect(mockProcessScheduledSteps).not.toHaveBeenCalled();

    process.env.NODE_ENV = 'test';
  });

  it('starts in dev mode when ENABLE_DEV_FOLLOWUP=true (2-min interval)', async () => {
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_FOLLOWUP = 'true';
    mockProcessScheduledSteps.mockResolvedValue({
      processed: 1, sent: 1, failed: 0, skipped: 0, errors: [],
    });

    startFollowUpScheduler();

    // Advance 2 minutes (dev interval)
    await vi.advanceTimersByTimeAsync(2 * 60 * 1000);

    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = 'test';
    delete process.env.ENABLE_DEV_FOLLOWUP;
  });

  // ── Overlap guard ───────────────────────────────────────────────────────────

  it('skips batch when previous batch is still running (overlap guard)', async () => {
    process.env.NODE_ENV = 'production';

    // First batch never resolves (simulates a slow batch)
    let resolveFirst!: () => void;
    const firstBatch = new Promise<{ processed: number; sent: number; failed: number; skipped: number; errors: string[] }>(
      resolve => { resolveFirst = () => resolve({ processed: 1, sent: 1, failed: 0, skipped: 0, errors: [] }); },
    );
    mockProcessScheduledSteps
      .mockReturnValueOnce(firstBatch)
      .mockResolvedValue({ processed: 0, sent: 0, failed: 0, skipped: 0, errors: [] });

    startFollowUpScheduler();

    // Fire first interval — batch is running, not resolved yet
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    // Fire second interval — overlap guard should skip
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    // processScheduledSteps should only have been called once (second was skipped)
    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(1);

    // Now resolve the first batch and fire a third interval — it should run
    resolveFirst();
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(2);

    process.env.NODE_ENV = 'test';
  });

  // ── processScheduledSteps result logging ────────────────────────────────────

  it('logs batch result when processed > 0', async () => {
    process.env.NODE_ENV = 'production';
    const { logger } = await import('../../utils/logger.js') as { logger: { info: ReturnType<typeof vi.fn> } };

    mockProcessScheduledSteps.mockResolvedValue({
      processed: 3, sent: 2, failed: 1, skipped: 0, errors: [],
    });

    startFollowUpScheduler();

    // Advance one interval tick and flush the async batch promise
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    // Flush microtasks so the async runFollowUpBatch callback resolves
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringMatching(/3 processed.*2 sent.*1 failed/),
    );

    process.env.NODE_ENV = 'test';
  });

  // ── Error resilience ────────────────────────────────────────────────────────

  it('logs error and continues when processScheduledSteps throws', async () => {
    process.env.NODE_ENV = 'production';
    const { logger } = await import('../../utils/logger.js') as { logger: { error: ReturnType<typeof vi.fn> } };

    mockProcessScheduledSteps.mockRejectedValueOnce(new Error('DB connection lost'));
    mockProcessScheduledSteps.mockResolvedValue({
      processed: 0, sent: 0, failed: 0, skipped: 0, errors: [],
    });

    startFollowUpScheduler();

    // First interval — throws
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Batch error/),
      expect.any(Error),
    );

    // Second interval — should still fire (scheduler survived the error)
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    await Promise.resolve();
    await Promise.resolve();

    expect(mockProcessScheduledSteps).toHaveBeenCalledTimes(2);

    process.env.NODE_ENV = 'test';
  });
});
