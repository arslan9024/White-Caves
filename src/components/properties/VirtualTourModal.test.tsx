import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualTourModal } from './VirtualTourModal';

describe('VirtualTourModal (DOM-05 / 3D Matterport & VR Viewer)', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<VirtualTourModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with default property details, mode tabs, and room navigation hotspots', () => {
    const handleClose = vi.fn();
    render(
      <VirtualTourModal
        isOpen={true}
        onClose={handleClose}
        propertyTitle="Signature Villa — Palm Jumeirah"
        propertyLocation="Frond G, Palm Jumeirah, Dubai"
      />
    );

    expect(screen.getByTestId('virtual-tour-modal')).toBeInTheDocument();
    expect(screen.getByText('Signature Villa — Palm Jumeirah')).toBeInTheDocument();
    expect(screen.getByText('Frond G, Palm Jumeirah, Dubai')).toBeInTheDocument();

    // Mode toggles
    expect(screen.getByText(/360° Panorama/i)).toBeInTheDocument();
    expect(screen.getByText(/2D\/3D Floorplan/i)).toBeInTheDocument();

    // Twilight toggle
    const twilightBtn = screen.getByText(/Daylight Mode/i);
    fireEvent.click(twilightBtn);
    expect(screen.getByText(/Twilight Sunset/i)).toBeInTheDocument();

    // Room hotspots
    const masterSuiteBtn = screen.getByRole('button', { name: /Master Royal Suite/i });
    fireEvent.click(masterSuiteBtn);
    expect(screen.getByText(/Master Royal Suite \(Click to Walk Through\)/i)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
