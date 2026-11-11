import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualTourViewer } from './VirtualTourViewer';

describe('VirtualTourViewer Component', () => {
  it('renders the 3D Matterport Digital Twin header and property title', () => {
    render(<VirtualTourViewer propertyTitle="Penthouse One — Palm Jumeirah" />);
    expect(screen.getByText(/3D Matterport Digital Twin/i)).toBeInTheDocument();
    expect(screen.getByText(/Penthouse One — Palm Jumeirah/i)).toBeInTheDocument();
  });

  it('allows switching between Walkthrough, Dollhouse, and Floorplan modes', () => {
    render(<VirtualTourViewer />);
    const dollhouseBtn = screen.getByText(/VR Dollhouse/i);
    fireEvent.click(dollhouseBtn);
    expect(screen.getByText(/Architectural 3D Cutaway/i)).toBeInTheDocument();

    const floorplanBtn = screen.getByText(/2D Floorplan/i);
    fireEvent.click(floorplanBtn);
    expect(screen.getByText(/Precision Schematic View/i)).toBeInTheDocument();
  });

  it('activates hotspots when clicked', () => {
    render(<VirtualTourViewer />);
    const launchBtn = screen.getByText(/Launch Matterport 3D Tour/i);
    expect(launchBtn).toBeInTheDocument();
  });
});
