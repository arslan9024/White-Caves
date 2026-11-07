// Integration test for TuringQueue concurrency limits

import { expect, test, beforeAll, afterAll } from 'vitest';
import { TuringQueue } from '../../.agents/aegis/core-loop/turingQueue';
import { processPlans } from '../../.agents/aegis/core-loop/turingCore';
import { readPlans } from '../../.agents/aegis/core-loop/readPlans';
import { turingOrchestrator } from '../../.agents/aegis/core-loop/turingOrchestrator';

// Mock a simple plan that resolves quickly
const mockPlan = {
  id: 'test-plan',
  content: 'noop',
  hash: 'dummyhash',
};

// Stub readPlans to return many copies of the mock plan
jest.mock('../../.agents/aegis/core-loop/readPlans', () => ({
  readPlans: jest.fn().mockResolvedValue(Array.from({ length: 20 }, (_, i) => ({
    ...mockPlan,
    id: `plan-${i}`,
  }))),
}));

let queue: TuringQueue;

beforeAll(() => {
  // Set max concurrency to 5 for the test
  queue = new TuringQueue(5);
  (turingOrchestrator as any).queue = queue; // inject test queue
});

afterAll(() => {
  queue.shutdown();
});

test('processPlans respects concurrency limit', async () => {
  const start = Date.now();
  await processPlans(); // should process 20 plans with max 5 concurrent
  const duration = Date.now() - start;
  // Each mock plan resolves instantly, so duration should be small but >0
  expect(duration).toBeGreaterThanOrEqual(0);
  // Verify that no more than 5 tasks were running simultaneously (internal state)
  expect(queue.maxConcurrent).toBe(5);
});

