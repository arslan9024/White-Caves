/**
 * RelationshipErdVisualizer.test.tsx
 * Tests for RUP/UML ERD Diagram Visualizer Component
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RelationshipErdVisualizer } from './RelationshipErdVisualizer';

describe('RelationshipErdVisualizer', () => {
  it('renders header, UML structural badges, and controls', () => {
    render(<RelationshipErdVisualizer />);

    expect(screen.getByTestId('relationship-erd-visualizer')).toBeInTheDocument();
    expect(
      screen.getByText(/Strict Entity-Relationship Diagram \(ERD\) & Schema Topologies/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('erd-view-canvas-btn')).toBeInTheDocument();
    expect(screen.getByTestId('erd-view-table-btn')).toBeInTheDocument();
  });

  it('toggles between Canvas (UML) view and Table Matrix view', () => {
    render(<RelationshipErdVisualizer />);

    const tableBtn = screen.getByTestId('erd-view-table-btn');
    fireEvent.click(tableBtn);

    expect(
      screen.getByText(/UML Multiplicity & Composition Cascade Registry/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Foreign Key Binding')).toBeInTheDocument();

    const canvasBtn = screen.getByTestId('erd-view-canvas-btn');
    fireEvent.click(canvasBtn);

    expect(screen.queryByText('Foreign Key Binding')).not.toBeInTheDocument();
  });

  it('filters relationship links when toggling UML type', () => {
    render(<RelationshipErdVisualizer />);

    // Switch to table view to easily check filtered relations
    const tableBtn = screen.getByTestId('erd-view-table-btn');
    fireEvent.click(tableBtn);

    const compositionBtn = screen.getByRole('button', { name: /Composition/i });
    fireEvent.click(compositionBtn);

    expect(screen.getAllByText(/Composition \(Cascade\)/i).length).toBeGreaterThan(0);
  });
});
