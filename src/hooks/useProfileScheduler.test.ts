import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProfileScheduler } from './useProfileScheduler';

describe('useProfileScheduler Hook', () => {
  it('loads corporate credentials and returns alert telemetry', () => {
    const { result } = renderHook(() => useProfileScheduler());

    expect(result.current.managingDirectorName).toBe('Arsalan Malik Bashir Ahmad');
    expect(result.current.primaryTickerMessage).toBeDefined();
    expect(Array.isArray(result.current.alerts)).toBe(true);
    expect(result.current.highestSeverity).toMatch(/CRITICAL|WARNING|NOTICE|CLEAR/);
  });
});
