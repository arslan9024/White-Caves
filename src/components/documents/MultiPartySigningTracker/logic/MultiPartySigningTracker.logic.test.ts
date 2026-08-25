import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMultiPartySigningTrackerLogic } from './MultiPartySigningTracker.logic';

describe('MultiPartySigningTracker.logic', () => {
  it('advances signer statuses and calculates signed count', () => {
    const { result } = renderHook(() => useMultiPartySigningTrackerLogic());

    expect(result.current.signers.length).toBe(5);
    const initialSigned = result.current.signedCount;

    // Advance 'sg2' from 'opened' -> 'signed'
    act(() => {
      result.current.advanceStatus('sg2');
    });

    expect(result.current.signedCount).toBe(initialSigned + 1);
    expect(result.current.signers.find(s => s.id === 'sg2')?.status).toBe('signed');
  });
});
