import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZoeBusinessHubLogic } from './ZoeBusinessHub.logic';
import { ZOE_BUSINESS_DOCS } from '../../../../data/zoeBusinessDocsRegistry';

describe('ZoeBusinessHub.logic', () => {
  it('initializes with default values and all documents', () => {
    const { result } = renderHook(() => useZoeBusinessHubLogic());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.activeDoc).toBeNull();
    expect(result.current.filteredDocs.length).toBe(ZOE_BUSINESS_DOCS.length);
  });

  it('filters documents by category and search query', () => {
    const { result } = renderHook(() => useZoeBusinessHubLogic());

    act(() => {
      result.current.setSelectedCategory('corporate');
    });
    expect(result.current.filteredDocs.length).toBe(1);
    expect(result.current.filteredDocs[0].code).toBe('DOC-BUS-01');

    act(() => {
      result.current.setSelectedCategory('all');
      result.current.setSearchQuery('Ejari');
    });
    expect(result.current.filteredDocs.some((d) => d.code === 'DOC-BUS-04')).toBe(true);
  });

  it('opens and closes document viewer overlay', () => {
    const { result } = renderHook(() => useZoeBusinessHubLogic());

    act(() => {
      result.current.handleOpenDoc(ZOE_BUSINESS_DOCS[0]);
    });
    expect(result.current.activeDoc?.code).toBe('DOC-BUS-01');

    act(() => {
      result.current.handleCloseDoc();
    });
    expect(result.current.activeDoc).toBeNull();
  });

  it('handles print window invocation safely', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const { result } = renderHook(() => useZoeBusinessHubLogic());

    act(() => {
      result.current.handlePrint();
    });
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
