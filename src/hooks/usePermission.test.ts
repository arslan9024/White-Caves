import { describe, it, expect } from 'vitest';
import * as HookModule from './usePermission';

describe('usePermission (Hook)', () => {
  it('exports hook module correctly', () => {
    expect(HookModule).toBeDefined();
  });
});
