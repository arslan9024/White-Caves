import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useFloatingHeroSearchPillLogic } from './FloatingHeroSearchPill.logic';

describe('FloatingHeroSearchPill.logic', () => {
  it('manages search parameters and handles form submission', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(MemoryRouter, null, children);

    const { result } = renderHook(() => useFloatingHeroSearchPillLogic(), { wrapper });

    expect(result.current.activeTab).toBe('all');
    expect(result.current.location).toBe('');

    act(() => {
      result.current.setLocation('Palm Jumeirah');
      result.current.setPropertyType('villa');
      result.current.setPriceRange('15m+');
      result.current.setActiveTab('primary');
    });

    expect(result.current.location).toBe('Palm Jumeirah');
    expect(result.current.propertyType).toBe('villa');
    expect(result.current.priceRange).toBe('15m+');
    expect(result.current.activeTab).toBe('primary');

    act(() => {
      result.current.handleSearch();
    });
  });
});
