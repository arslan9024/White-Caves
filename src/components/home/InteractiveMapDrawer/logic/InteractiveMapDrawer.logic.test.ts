import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInteractiveMapDrawerLogic } from './InteractiveMapDrawer.logic';

describe('InteractiveMapDrawer.logic', () => {
  it('manages selected pin and drawer state', () => {
    const { result } = renderHook(() => useInteractiveMapDrawerLogic());

    expect(result.current.pins.length).toBe(3);
    expect(result.current.selectedProperty?.id).toBe('PIN-1');

    act(() => {
      result.current.selectPin(result.current.pins[1]);
    });

    expect(result.current.selectedProperty?.id).toBe('PIN-2');

    act(() => {
      result.current.closeDrawer();
    });

    expect(result.current.selectedProperty).toBeNull();
  });
});
