import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCavesFloatingSearch } from './CavesFloatingSearch.logic';

describe('useCavesFloatingSearch logic hook', () => {
  it('initializes modal closed with default filters', () => {
    const { result } = renderHook(() => useCavesFloatingSearch());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.filters.searchTerm).toBe('');
    expect(result.current.filters.community).toBe('All');
  });

  it('opens and closes modal cleanly', () => {
    const { result } = renderHook(() => useCavesFloatingSearch());

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('updates specific filter values', () => {
    const { result } = renderHook(() => useCavesFloatingSearch());

    act(() => {
      result.current.updateFilter('community', 'DAMAC Hills 2');
    });

    expect(result.current.filters.community).toBe('DAMAC Hills 2');
  });
});
