import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useESignatureCapturepadLogic } from './ESignatureCapturepad.logic';

describe('ESignatureCapturepad.logic', () => {
  it('handles signature mode switching, typing, and clear actions', () => {
    const { result } = renderHook(() => useESignatureCapturepadLogic());

    expect(result.current.mode).toBe('draw');
    expect(result.current.hasSignature).toBe(false);

    act(() => {
      result.current.setMode('type');
    });

    act(() => {
      result.current.setTypedName('Arsalan Malik');
    });

    expect(result.current.mode).toBe('type');
    expect(result.current.typedName).toBe('Arsalan Malik');

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.typedName).toBe('');
    expect(result.current.hasSignature).toBe(false);
  });

  it('handles save action in typed mode', () => {
    const { result } = renderHook(() => useESignatureCapturepadLogic());

    act(() => {
      result.current.setMode('type');
    });

    act(() => {
      result.current.setTypedName('Sarah Johnson');
    });

    act(() => {
      result.current.handleSave();
    });

    expect(result.current.saved).toBe(true);
  });
});
