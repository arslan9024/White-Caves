import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHeroSectionLogic, DESTINATION_TAGS } from './HeroSection.logic';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useHeroSectionLogic Hook', () => {
  it('initializes with default state and destination tags', () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedTag).toBe('Palm Jumeirah');
    expect(result.current.destinationTags).toEqual(DESTINATION_TAGS);
  });

  it('selects tag and updates search term', () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    act(() => {
      result.current.selectTag('Downtown Dubai');
    });
    expect(result.current.selectedTag).toBe('Downtown Dubai');
    expect(result.current.searchTerm).toBe('Downtown Dubai');
  });

  it('navigates with search parameter on form submit', () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    act(() => {
      result.current.setSearchTerm('Marina');
    });
    act(() => {
      result.current.handleSearchSubmit(mockEvent);
    });
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/properties?search=Marina');
  });
});
