import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentVersionHistoryLogic } from './DocumentVersionHistory.logic';

describe('DocumentVersionHistory.logic', () => {
  it('initializes with default version and allows switching selected version', () => {
    const { result } = renderHook(() => useDocumentVersionHistoryLogic());

    expect(result.current.VERSIONS.length).toBeGreaterThan(0);
    expect(result.current.selectedVersion).toBe('v4');
    expect(result.current.selected.id).toBe('v4');

    act(() => {
      result.current.setSelectedVersion('v2');
    });

    expect(result.current.selectedVersion).toBe('v2');
    expect(result.current.selected.version).toBe('v2.0');
    expect(result.current.selected.changes).toContain('exclusivity clause');
  });
});
