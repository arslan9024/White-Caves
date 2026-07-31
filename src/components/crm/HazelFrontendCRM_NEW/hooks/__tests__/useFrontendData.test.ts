import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFrontendData } from '../useFrontendData';

describe('useFrontendData', () => {
  it('returns data', () => {
    const { result } = renderHook(() => useFrontendData());
    expect(result.current.components).toBeDefined();
  });
});