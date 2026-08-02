import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBottomNavLogic } from './BottomNav.logic';

describe('useBottomNavLogic', () => {
  it('returns 5 navigation tabs', () => {
    const { result } = renderHook(() => useBottomNavLogic('/'));
    expect(result.current.tabs.length).toBe(5);
  });

  it('correctly identifies active route', () => {
    const { result } = renderHook(() => useBottomNavLogic('/crm/leads'));
    expect(result.current.isActive('/crm/leads')).toBe(true);
    expect(result.current.isActive('/properties')).toBe(false);
  });
});
