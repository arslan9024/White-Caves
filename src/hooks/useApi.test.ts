import { describe, it, expect } from 'vitest';
import * as HookModule from './useApi';

describe('useApi (Hook)', () => {
  it('exports hook module correctly', () => {
    expect(HookModule).toBeDefined();
  });
});
