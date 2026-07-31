import { describe, it, expect } from 'vitest';
import * as HookModule from './useOfflineDrafts';

describe('useOfflineDrafts (Hook)', () => {
  it('exports hook module correctly', () => {
    expect(HookModule).toBeDefined();
  });
});
