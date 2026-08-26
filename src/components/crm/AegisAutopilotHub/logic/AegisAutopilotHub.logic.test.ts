import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAegisAutopilotHubLogic } from './AegisAutopilotHub.logic';
import { AEGIS_ORCHESTRATOR_DOCS } from '../../../../data/aegisOrchestratorDocsRegistry';

describe('AegisAutopilotHub.logic', () => {
  it('initializes with default values and all modules', () => {
    const { result } = renderHook(() => useAegisAutopilotHubLogic());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.activeDoc).toBeNull();
    expect(result.current.filteredDocs.length).toBe(AEGIS_ORCHESTRATOR_DOCS.length);
  });

  it('filters docs by category and search query', () => {
    const { result } = renderHook(() => useAegisAutopilotHubLogic());

    act(() => {
      result.current.setSelectedCategory('telemetry');
    });
    expect(result.current.filteredDocs.length).toBe(1);
    expect(result.current.filteredDocs[0].code).toBe('AEGIS-STS-01');

    act(() => {
      result.current.setSelectedCategory('all');
      result.current.setSearchQuery('Swarm');
    });
    expect(result.current.filteredDocs.some((d) => d.code === 'AEGIS-AGNT-01')).toBe(true);
  });

  it('opens and closes viewer overlay', () => {
    const { result } = renderHook(() => useAegisAutopilotHubLogic());

    act(() => {
      result.current.handleOpenDoc(AEGIS_ORCHESTRATOR_DOCS[0]);
    });
    expect(result.current.activeDoc?.code).toBe('AEGIS-STS-01');

    act(() => {
      result.current.handleCloseDoc();
    });
    expect(result.current.activeDoc).toBeNull();
  });

  it('handles print window invocation safely', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const { result } = renderHook(() => useAegisAutopilotHubLogic());

    act(() => {
      result.current.handlePrint();
    });
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });
});
