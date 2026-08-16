import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualStagingCanvas } from './VirtualStagingCanvas';

describe('VirtualStagingCanvas Component', () => {
  it('renders virtual staging canvas and toggles staging mode', () => {
    render(<VirtualStagingCanvas roomName="Penthouse Living Room" />);
    expect(screen.getByTestId('virtual-staging-canvas')).toBeDefined();
    expect(screen.getByText(/AI Virtual Staging/i)).toBeDefined();
    expect(screen.getByText(/Penthouse Living Room/i)).toBeDefined();
    expect(screen.getByText(/Show Staged/i)).toBeDefined();

    // Toggle staging mode
    const toggleBtn = screen.getByText(/Show Staged/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/AI Staging: ON/i)).toBeDefined();
  });
});
