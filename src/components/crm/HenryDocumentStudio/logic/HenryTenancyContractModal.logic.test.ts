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
  it('does not mint tokens, change status or copy a synthetic signing URL', () => {
    const clipboard = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText: clipboard } });
    try {
      const { result } = renderHook(() => useHenryTenancyContractModalLogic({ isOpen: true, onClose: vi.fn() }));
      const before = result.current.contractData;
      act(() => result.current.handleGenerateEsignLink());
      expect(result.current.contractData).toBe(before);
      expect(result.current.statusMessage).toContain('No link was generated, copied or sent');
      expect(clipboard).not.toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });
});
