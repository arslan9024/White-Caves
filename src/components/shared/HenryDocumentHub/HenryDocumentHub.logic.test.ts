import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHenryDocumentHubLogic, WIZARD_STEPS } from './HenryDocumentHub.logic';

describe('HenryDocumentHub.logic', () => {
  it('initializes on step 1 with 5 wizard steps', () => {
    const { result } = renderHook(() => useHenryDocumentHubLogic());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.steps.length).toBe(5);
    expect(result.current.selectedForm).toBe('Form A');
  });

  it('steps forward and backward through the workflow', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useHenryDocumentHubLogic());

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.isProcessing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current.currentStep).toBe(2);
    expect(result.current.isProcessing).toBe(false);

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(1);

    vi.useRealTimers();
  });
});
