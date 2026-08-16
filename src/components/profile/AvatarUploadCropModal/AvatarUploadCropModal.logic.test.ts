import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAvatarUploadCropModalLogic } from './AvatarUploadCropModal.logic';

describe('useAvatarUploadCropModalLogic Hook', () => {
  it('initializes with default zoom level and null preview URL', () => {
    const { result } = renderHook(() => useAvatarUploadCropModalLogic());
    expect(result.current.zoomLevel).toBe(1);
    expect(result.current.previewUrl).toBeNull();
  });

  it('updates zoom level and handles file select with object URL', () => {
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-avatar');

    const { result } = renderHook(() => useAvatarUploadCropModalLogic());
    act(() => {
      result.current.setZoomLevel(1.5);
    });
    expect(result.current.zoomLevel).toBe(1.5);

    const mockFile = new File(['mock image content'], 'avatar.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileSelect(mockEvent);
    });
    expect(result.current.previewUrl).toBe('blob:http://localhost/mock-avatar');
  });
});
