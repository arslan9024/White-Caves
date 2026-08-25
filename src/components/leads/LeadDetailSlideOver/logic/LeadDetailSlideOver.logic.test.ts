import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadDetailSlideOverLogic } from './LeadDetailSlideOver.logic';

describe('LeadDetailSlideOver.logic', () => {
  it('initializes with default lead data and active timeline tab', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useLeadDetailSlideOverLogic(onClose));

    expect(result.current.lead.name).toBe('Ahmed Al Mansouri');
    expect(result.current.lead.budget).toBe('AED 2,500,000');
    expect(result.current.activeTab).toBe('timeline');
    expect(result.current.lead.events.length).toBe(4);
  });

  it('switches between timeline and details tabs', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useLeadDetailSlideOverLogic(onClose));

    act(() => {
      result.current.setActiveTab('details');
    });
    expect(result.current.activeTab).toBe('details');

    act(() => {
      result.current.setActiveTab('timeline');
    });
    expect(result.current.activeTab).toBe('timeline');
  });

  it('triggers onClose callback correctly', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useLeadDetailSlideOverLogic(onClose));

    result.current.onClose();
    expect(onClose).toHaveBeenCalled();
  });
});
