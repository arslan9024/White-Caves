import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContractTemplateLibraryLogic } from './ContractTemplateLibrary.logic';

describe('ContractTemplateLibrary.logic', () => {
  it('filters templates by category and handles preview selection', () => {
    const { result } = renderHook(() => useContractTemplateLibraryLogic());

    expect(result.current.CATEGORIES.length).toBeGreaterThan(0);
    expect(result.current.filtered.length).toBeGreaterThan(0);

    act(() => {
      result.current.setActiveCategory('Sales');
    });

    expect(result.current.activeCategory).toBe('Sales');
    expect(result.current.filtered.every(t => t.category === 'Sales')).toBe(true);
  });
});
