import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdaArchitectureHubLogic } from './AdaArchitectureHub.logic';
import { ADA_ARCHITECTURE_DOCS } from '../../../../data/adaArchitectureDocsRegistry';

describe('AdaArchitectureHub.logic', () => {
  it('initializes with default values and all architecture docs', () => {
    const { result } = renderHook(() => useAdaArchitectureHubLogic());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.activeDoc).toBeNull();
    expect(result.current.filteredDocs.length).toBe(ADA_ARCHITECTURE_DOCS.length);
  });

  it('filters docs by category and search query', () => {
    const { result } = renderHook(() => useAdaArchitectureHubLogic());

    act(() => {
      result.current.setSelectedCategory('sdlc');
    });
    expect(result.current.filteredDocs.length).toBe(1);
    expect(result.current.filteredDocs[0].code).toBe('ADA-SDLC-01');

    act(() => {
      result.current.setSelectedCategory('all');
      result.current.setSearchQuery('Security');
    });
    expect(result.current.filteredDocs.some((d) => d.code === 'ADA-SEC-01')).toBe(true);
  });

  it('opens and closes architecture viewer overlay', () => {
    const { result } = renderHook(() => useAdaArchitectureHubLogic());

    act(() => {
      result.current.handleOpenDoc(ADA_ARCHITECTURE_DOCS[0]);
    });
    expect(result.current.activeDoc?.code).toBe('ADA-ARCH-01');

    act(() => {
      result.current.handleCloseDoc();
    });
    expect(result.current.activeDoc).toBeNull();
  });

  it('handles print window invocation safely', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const { result } = renderHook(() => useAdaArchitectureHubLogic());

    act(() => {
      result.current.handlePrint();
    });
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
