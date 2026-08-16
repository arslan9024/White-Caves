import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WebXRHeadsetViewer } from './WebXRHeadsetViewer';

describe('WebXRHeadsetViewer Component', () => {
  it('renders WebXR room walkthrough and switches to WebXR mode', () => {
    render(<WebXRHeadsetViewer />);
    expect(screen.getByTestId('webxr-headset-viewer')).toBeDefined();
    expect(screen.getByText(/WebXR Immersive Room Walkthrough/i)).toBeDefined();
    expect(screen.getByText('360° VR')).toBeDefined();
    expect(screen.getByText('WebXR Mode')).toBeDefined();

    // Switch to WebXR Mode
    const webxrBtn = screen.getByText('WebXR Mode');
    fireEvent.click(webxrBtn);
    expect(screen.getByText(/Immersive WebXR — Head tracking active/i)).toBeDefined();
  });
});
