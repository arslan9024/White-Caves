import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkLeadActionToolbarLogic } from './BulkLeadActionToolbar.logic';

describe('BulkLeadActionToolbar.logic', () => {
  it('manages confirmation action state for assign, tag, delete', () => {
    const { result } = renderHook(() => useBulkLeadActionToolbarLogic(5));

    expect(result.current.confirmAction).toBeNull();

    act(() => {
      result.current.handleAssign();
    });
    expect(result.current.confirmAction).toBe('assign');

    act(() => {
      result.current.handleConfirm();
    });
    expect(result.current.confirmAction).toBeNull();

    act(() => {
      result.current.handleDelete();
    });
    expect(result.current.confirmAction).toBe('delete');

    act(() => {
      result.current.handleCancel();
    });
    expect(result.current.confirmAction).toBeNull();
  });
});
