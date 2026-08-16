import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePannellumVRViewerLogic } from './PannellumVRViewer.logic';

describe('usePannellumVRViewerLogic Hook', () => {
  it('initializes with default active room and staging state', () => {
    const { result } = renderHook(() => usePannellumVRViewerLogic());
    expect(result.current.activeRoom).toBe('Living Room');
    expect(result.current.isVirtualStagingActive).toBe(true);
  });

  it('selects active room and toggles virtual staging mode', () => {
    const { result } = renderHook(() => usePannellumVRViewerLogic());
    act(() => {
      result.current.selectRoom('Master Bedroom');
    });
    expect(result.current.activeRoom).toBe('Master Bedroom');

    act(() => {
      result.current.toggleVirtualStaging();
    });
    expect(result.current.isVirtualStagingActive).toBe(false);
  });
});
