import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuroraSoftwareHubLogic } from './AuroraSoftwareHub.logic';
import { AURORA_SOFTWARE_DOCS } from '../../../../data/auroraSoftwareDocsRegistry';

describe('AuroraSoftwareHub.logic', () => {
  it('initializes with default values and all documents', () => {
    const { result } = renderHook(() => useAuroraSoftwareHubLogic());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.activeDoc).toBeNull();
    expect(result.current.filteredDocs.length).toBe(AURORA_SOFTWARE_DOCS.length);
  });

  it('filters documents by category and search query', () => {
    const { result } = renderHook(() => useAuroraSoftwareHubLogic());

    act(() => {
      result.current.setSelectedCategory('srs');
    });
    expect(result.current.filteredDocs.length).toBe(1);
    expect(result.current.filteredDocs[0].code).toBe('DOC-SWE-01');

    act(() => {
      result.current.setSelectedCategory('all');
      result.current.setSearchQuery('REST');
    });
    expect(result.current.filteredDocs.some((d) => d.code === 'DOC-SWE-04')).toBe(true);
  });

  it('opens and closes document viewer overlay', () => {
    const { result } = renderHook(() => useAuroraSoftwareHubLogic());

    act(() => {
      result.current.handleOpenDoc(AURORA_SOFTWARE_DOCS[0]);
    });
    expect(result.current.activeDoc?.code).toBe('DOC-SWE-01');

    act(() => {
      result.current.handleCloseDoc();
    });
    expect(result.current.activeDoc).toBeNull();
  });

  it('handles print window invocation safely', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const { result } = renderHook(() => useAuroraSoftwareHubLogic());

    act(() => {
      result.current.handlePrint();
    });
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
