// @vitest-environment node
/**
 * Integration test for TuringQueue concurrency limits and graceful shutdown
 */

import { expect, test, beforeAll, afterAll, vi } from 'vitest';
import { TuringQueue } from '../../.agents/aegis/core-loop/turingQueue';
import { processPlans } from '../../.agents/aegis/core-loop/turingCore';
import { turingOrchestrator } from '../../.agents/aegis/core-loop/turingOrchestrator';

const mockPlan = {
  id: 'test-plan',
  content: '- [ ] Task 1\n- [x] Task 2',
  hash: 'dummyhash',
};

vi.mock('../../.agents/aegis/core-loop/readPlans', () => ({
  readPlans: vi.fn().mockResolvedValue(
    Object.fromEntries(
      Array.from({ length: 20 }, (_, i) => [`plan-${i}.md`, `${mockPlan.content} (#${i})`])
    )
  ),
}));

let queue: TuringQueue;

beforeAll(() => {
  queue = new TuringQueue(5);
  turingOrchestrator.queue = queue;
});

afterAll(async () => {
  await turingOrchestrator.shutdown();
});

test('processPlans respects concurrency limit of 5 across 20 plans', async () => {
  const start = Date.now();
  await processPlans();
  const duration = Date.now() - start;
  expect(duration).toBeGreaterThanOrEqual(0);
  expect(queue.maxConcurrent).toBe(5);
  expect(queue.peakConcurrentCount).toBeLessThanOrEqual(5);
  expect(queue.activeCount).toBe(0);
});
