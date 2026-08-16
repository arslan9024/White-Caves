import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VrFullscreenModal } from './VrFullscreenModal';

describe('VrFullscreenModal Component', () => {
  it('renders VR fullscreen trigger button and opens modal on click', () => {
    render(<VrFullscreenModal />);
    const trigger = screen.getByTestId('vr-fullscreen-trigger');
    expect(trigger).toBeDefined();
    expect(screen.getByText(/Enter Fullscreen VR/i)).toBeDefined();

    // Click trigger to open modal
    fireEvent.click(trigger);
    expect(screen.getByTestId('vr-fullscreen-modal')).toBeDefined();
    expect(screen.getByText(/360° Panoramic Mode/i)).toBeDefined();

    // Close modal
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(screen.getByTestId('vr-fullscreen-modal')).toBeDefined();
  });
});
