import { describe, it, expect } from 'vitest';
import * as HookModule from './useAgentPerformance';

describe('useAgentPerformance (Hook)', () => {
  it('exports hook module correctly', () => {
    expect(HookModule).toBeDefined();
  });
});
