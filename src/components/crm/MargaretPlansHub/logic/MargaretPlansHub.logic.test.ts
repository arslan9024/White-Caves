import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMargaretPlansHubLogic } from './MargaretPlansHub.logic';
import { MARGARET_PLANS_DOCS } from '../../../../data/margaretPlansDocsRegistry';

describe('MargaretPlansHub.logic', () => {
  it('initializes with default values and all plans', () => {
    const { result } = renderHook(() => useMargaretPlansHubLogic());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.activeDoc).toBeNull();
    expect(result.current.filteredDocs.length).toBe(MARGARET_PLANS_DOCS.length);
  });

  it('filters plans by category and search query', () => {
    const { result } = renderHook(() => useMargaretPlansHubLogic());

    act(() => {
      result.current.setSelectedCategory('frontend');
    });
    expect(result.current.filteredDocs.length).toBe(1);
    expect(result.current.filteredDocs[0].code).toBe('PLAN-DES-01');

    act(() => {
      result.current.setSelectedCategory('all');
      result.current.setSearchQuery('Finance');
    });
    expect(result.current.filteredDocs.some((d) => d.code === 'PLAN-FIN-01')).toBe(true);
  });

  it('opens and closes plan viewer overlay', () => {
    const { result } = renderHook(() => useMargaretPlansHubLogic());

    act(() => {
      result.current.handleOpenDoc(MARGARET_PLANS_DOCS[0]);
    });
    expect(result.current.activeDoc?.code).toBe('PLAN-MST-01');

    act(() => {
      result.current.handleCloseDoc();
    });
    expect(result.current.activeDoc).toBeNull();
  });

  it('handles print window invocation safely', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const { result } = renderHook(() => useMargaretPlansHubLogic());

    act(() => {
      result.current.handlePrint();
    });
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
