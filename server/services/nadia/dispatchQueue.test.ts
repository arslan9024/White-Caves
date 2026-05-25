import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createDispatchQueue,
  DispatchQueue,
  type DispatchJob,
  type AsyncSendFn,
} from './dispatchQueue.js';

describe('DispatchQueue', () => {
  let queue: DispatchQueue;

  beforeEach(() => {
    queue = createDispatchQueue({ rateLimit: 1000, maxRetries: 2, backoffBase: 1, backoffMax: 5 });
  });

  it('enqueues a job and returns a unique ID', () => {
    const id = queue.enqueue('971501234567', { type: 'text', body: 'hello' });
    expect(id).toMatch(/^dq-/);
    const job = queue.getJob(id);
    expect(job).toBeDefined();
    expect(job?.to).toBe('971501234567');
    expect(job?.status).toBe('pending');
  });

  it('assigns unique IDs to each job', () => {
    const id1 = queue.enqueue('111', {});
    const id2 = queue.enqueue('222', {});
    expect(id1).not.toBe(id2);
  });

  it('drain calls sender for each pending job', async () => {
    queue.enqueue('a', {});
    queue.enqueue('b', {});
    const sender: AsyncSendFn = vi.fn(async () => undefined);
    const result = await queue.drain(sender);
    expect(sender).toHaveBeenCalledTimes(2);
    expect(result.processed).toBe(2);
    expect(result.succeeded).toBe(2);
    expect(result.failed).toBe(0);
  });

  it('marks jobs as succeeded after drain', async () => {
    const id = queue.enqueue('c', {});
    await queue.drain(vi.fn(async () => undefined));
    expect(queue.getJob(id)?.status).toBe('succeeded');
  });

  it('retries failed jobs up to maxRetries and then dead-letters', async () => {
    queue.enqueue('d', {});
    let callCount = 0;
    const failingSender: AsyncSendFn = vi.fn(async () => {
      callCount++;
      throw new Error('send failed');
    });

    const result = await queue.drain(failingSender);
    // 1 initial attempt + 2 retries = 3 total calls for maxRetries:2
    expect(callCount).toBe(3);
    expect(result.deadLettered).toBe(1);
    expect(result.succeeded).toBe(0);
  });

  it('does not re-process already-succeeded jobs', async () => {
    queue.enqueue('e', {});
    const sender: AsyncSendFn = vi.fn(async () => undefined);
    await queue.drain(sender);
    // Second drain should find no pending jobs
    const result2 = await queue.drain(sender);
    expect(result2.processed).toBe(0);
    expect(sender).toHaveBeenCalledTimes(1);
  });

  it('getStats returns correct counts', async () => {
    queue.enqueue('f', {});
    queue.enqueue('g', {});
    const statsBefore = queue.getStats();
    expect(statsBefore.pending).toBe(2);
    expect(statsBefore.succeeded).toBe(0);

    await queue.drain(vi.fn(async () => undefined));
    const statsAfter = queue.getStats();
    expect(statsAfter.pending).toBe(0);
    expect(statsAfter.succeeded).toBe(2);
    expect(statsAfter.lastDrainAt).toBeInstanceOf(Date);
  });

  it('clear resets the queue completely', async () => {
    queue.enqueue('h', {});
    await queue.drain(vi.fn(async () => undefined));
    queue.clear();
    const stats = queue.getStats();
    expect(stats.pending).toBe(0);
    expect(stats.succeeded).toBe(0);
    expect(stats.lastDrainAt).toBeNull();
  });

  it('DrainResult includes durationMs', async () => {
    queue.enqueue('i', {});
    const result = await queue.drain(vi.fn(async () => undefined));
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('partially succeeds when some jobs fail within retry budget', async () => {
    queue.enqueue('ok', {});
    queue.enqueue('fail', {});

    let calls = 0;
    const mixedSender: AsyncSendFn = vi.fn(async (job: DispatchJob) => {
      calls++;
      if (job.to === 'fail') throw new Error('fail');
    });

    const result = await queue.drain(mixedSender);
    expect(result.succeeded).toBe(1);
    // 'fail' job: 1 initial + 2 retries = 3 calls for that job
    expect(result.deadLettered).toBe(1);
  });
});
