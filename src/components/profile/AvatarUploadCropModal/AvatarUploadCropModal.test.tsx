import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AvatarUploadCropModal } from './AvatarUploadCropModal';

describe('AvatarUploadCropModal Component', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<AvatarUploadCropModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open and handles close action', () => {
    const onClose = vi.fn();
    render(<AvatarUploadCropModal isOpen={true} onClose={onClose} />);
    expect(screen.getByTestId('avatar-upload-crop-modal')).toBeDefined();
    expect(screen.getByText(/Executive Avatar Photo Upload/i)).toBeDefined();
    expect(screen.getByText(/Circular Zoom Level/i)).toBeDefined();
    expect(screen.getByText(/Select Image File/i)).toBeDefined();

    const applyBtn = screen.getByRole('button', { name: /Apply Crop & Save Avatar/i });
    fireEvent.click(applyBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
