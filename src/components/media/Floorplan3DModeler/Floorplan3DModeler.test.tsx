import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Floorplan3DModeler } from './Floorplan3DModeler';

describe('Floorplan3DModeler Component', () => {
  it('renders 3D floorplan modeler and selects room modules', () => {
    render(<Floorplan3DModeler />);
    expect(screen.getByTestId('floorplan-3d-modeler')).toBeDefined();
    expect(screen.getByText(/Interactive 3D Floorplan/i)).toBeDefined();
    expect(screen.getAllByText(/Master Bedroom/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Living Room/i).length).toBeGreaterThan(0);

    // Select different room
    const kitchen = screen.getAllByText(/Kitchen/i)[0];
    fireEvent.click(kitchen);
    expect(screen.getByTestId('floorplan-3d-modeler')).toBeDefined();
  });
});
