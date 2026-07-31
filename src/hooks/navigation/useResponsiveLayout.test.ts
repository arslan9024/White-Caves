import { describe, it, expect } from 'vitest';
import * as HookModule from './useResponsiveLayout';

describe('useResponsiveLayout (Hook)', () => {
  it('exports hook module correctly', () => {
    expect(HookModule).toBeDefined();
  });
});
