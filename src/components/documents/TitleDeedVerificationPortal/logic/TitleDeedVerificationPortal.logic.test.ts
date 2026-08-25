import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTitleDeedVerificationPortalLogic } from './TitleDeedVerificationPortal.logic';

describe('TitleDeedVerificationPortal.logic', () => {
  it('verifies existing title deed and handles reset', async () => {
    const { result } = renderHook(() => useTitleDeedVerificationPortalLogic());

    expect(result.current.status).toBe('idle');

    act(() => {
      result.current.setQuery('1234567890');
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.status).toBe('verified');
    expect(result.current.result?.ownerName).toBe('Ahmed Al Mansouri');
    expect(result.current.result?.propertyAddress).toContain('Bloom Heights');

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
  });
});
