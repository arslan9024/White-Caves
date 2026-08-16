import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PannellumVRViewer } from './PannellumVRViewer';

describe('PannellumVRViewer Component', () => {
  it('renders Pannellum WebGL VR viewer and toggles virtual staging and hotspots', () => {
    render(<PannellumVRViewer />);
    expect(screen.getByTestId('pannellum-vr-viewer')).toBeDefined();
    expect(screen.getByText(/Pannellum WebGL 360° VR View/i)).toBeDefined();
    expect(screen.getAllByText(/Living Room/i).length).toBeGreaterThan(0);

    // Toggle virtual staging
    const toggleBtn = screen.getByText('Disable AI Staging');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Enable AI Staging')).toBeDefined();

    // Click hotspot
    const hotspot1 = screen.getByText('1');
    fireEvent.click(hotspot1);
    expect(screen.getAllByText(/Master Bedroom/i).length).toBeGreaterThan(0);
  });
});
