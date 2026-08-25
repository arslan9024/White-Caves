import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHenryTenancyContractModalLogic } from './HenryTenancyContractModal.logic';

describe('HenryTenancyContractModal.logic', () => {
  it('initializes draft data and step navigation for tenancy preparation wizard', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useHenryTenancyContractModalLogic({
        isOpen: true,
        onClose,
      })
    );

    expect(result.current.activeStep).toBe(1);
    expect(result.current.contractData).toBeDefined();

    act(() => {
      result.current.setActiveStep(2);
    });

    expect(result.current.activeStep).toBe(2);
  });
});
