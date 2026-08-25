import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentComplianceChecklistLogic } from './DocumentComplianceChecklist.logic';

describe('DocumentComplianceChecklist.logic', () => {
  it('initializes compliance items and toggles item completion', () => {
    const { result } = renderHook(() => useDocumentComplianceChecklistLogic());

    expect(result.current.items.length).toBeGreaterThan(0);
    const initialPass = result.current.passCount;

    act(() => {
      result.current.toggle('c4');
    });

    expect(result.current.passCount).toBe(initialPass + 1);
  });
});
