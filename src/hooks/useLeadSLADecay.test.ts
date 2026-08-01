import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLeadSLADecay } from './useLeadSLADecay';

describe('useLeadSLADecay Hook', () => {
  it('returns SLA decay metrics cleanly', () => {
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const { result } = renderHook(() => useLeadSLADecay(tenMinsAgo));

    expect(result.current.status).toBe('EXCELLENT');
    expect(result.current.elapsedMinutes).toBeGreaterThanOrEqual(9);
  });
});
