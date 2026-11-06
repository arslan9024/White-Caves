/**
 * White Caves Real Estate LLC - Entity & Relationship Unit Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RelationshipManagerView } from './RelationshipManagerView';
import { CANONICAL_RELATIONSHIPS } from './RelationshipManager.data';

describe('RelationshipManager Suite (7-Category Architecture Standard)', () => {
  it('renders workspace title, metrics deck, and canonical chain summary', () => {
    render(<RelationshipManagerView initialChains={CANONICAL_RELATIONSHIPS} />);

    expect(screen.getByText(/Entities & Relational Matrix Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Relationship Chain/i)).toBeInTheDocument();
    expect(screen.getByText(/Entities in Mesh/i)).toBeInTheDocument();
    expect(screen.getByText(/Relational Edges/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Revenue Booked/i)).toBeInTheDocument();

    expect(screen.getByTestId('entity-node-user-001')).toBeInTheDocument();
    expect(screen.getByTestId('entity-node-emp-001')).toBeInTheDocument();
    expect(screen.getByTestId('entity-node-reproperty-001')).toBeInTheDocument();
    expect(screen.getByTestId('entity-node-deal-001')).toBeInTheDocument();
  });

  it('switches between relationship chains (REL-001 to REL-002)', () => {
    render(<RelationshipManagerView initialChains={CANONICAL_RELATIONSHIPS} />);

    const switchBtn = screen.getByTestId('switch-chain-REL-002');
    fireEvent.click(switchBtn);

    expect(screen.getByText(/Palm Jumeirah VIP Beachfront Acquisition/i)).toBeInTheDocument();
    expect(screen.getByTestId('entity-node-emp-002')).toBeInTheDocument();
  });

  it('filters nodes by search input', () => {
    render(<RelationshipManagerView initialChains={CANONICAL_RELATIONSHIPS} />);

    const searchInput = screen.getByTestId('relationship-search-input');
    fireEvent.change(searchInput, { target: { value: 'tenant-001' } });

    expect(screen.getByText('Hassan Al-Nuaimi (tenant-001)')).toBeInTheDocument();
    expect(screen.queryByText('Managing Director Role')).not.toBeInTheDocument();
  });

  it('opens node detail modal when clicking Inspect Node', () => {
    render(<RelationshipManagerView initialChains={CANONICAL_RELATIONSHIPS} />);

    const inspectBtn = screen.getByTestId('inspect-node-user-001');
    fireEvent.click(inspectBtn);

    expect(screen.getByTestId('entity-node-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/arslanmalikgoraha@gmail.com/i).length).toBeGreaterThan(0);

    // Close modal
    const closeBtn = screen.getByTestId('close-node-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('entity-node-modal')).not.toBeInTheDocument();
  });

  it('auto-opens entity modal when selectedEntityId prop is provided (deep link)', () => {
    render(
      <RelationshipManagerView
        selectedEntityId="deal-001"
        initialChains={CANONICAL_RELATIONSHIPS}
      />
    );

    expect(screen.getByTestId('entity-node-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Deal WC-D-2026-001/i).length).toBeGreaterThan(0);
  });

  it('triggers navigation callback when clicking deep route jump button', () => {
    const onNavigate = vi.fn();
    render(
      <RelationshipManagerView
        selectedEntityId="emp-001"
        initialChains={CANONICAL_RELATIONSHIPS}
        onNavigateToDeepRoute={onNavigate}
      />
    );

    const jumpBtn = screen.getByTestId('jump-to-route-btn');
    fireEvent.click(jumpBtn);

    expect(onNavigate).toHaveBeenCalledWith('/dashboard/employees/EMP-001');
  });

  it('switches between Entities Hub, Relationships Matrix, and UML ERD tabs', () => {
    render(<RelationshipManagerView initialChains={CANONICAL_RELATIONSHIPS} />);

    // Switch to Entities Hub
    const entitiesTab = screen.getByTestId('tab-entities-hub');
    fireEvent.click(entitiesTab);
    expect(screen.getByTestId('relationship-entities-hub')).toBeInTheDocument();
    expect(screen.getByTestId('create-entity-btn')).toBeInTheDocument();
    expect(screen.getByText('All Entities')).toBeInTheDocument();

    // Switch to UML ERD
    const erdTab = screen.getByTestId('tab-uml-erd');
    fireEvent.click(erdTab);
    expect(screen.getByTestId('relationship-erd-visualizer')).toBeInTheDocument();
    expect(screen.getByText(/Strict Entity-Relationship Diagram/i)).toBeInTheDocument();
    expect(screen.getByTestId('erd-interactive-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('erd-zoom-in-btn')).toBeInTheDocument();
    expect(screen.getByTestId('erd-entity-inspector')).toBeInTheDocument();

    // Click zoom in and reset
    fireEvent.click(screen.getByTestId('erd-zoom-in-btn'));
    fireEvent.click(screen.getByTestId('erd-zoom-reset-btn'));

    // Select node on canvas
    const userNode = screen.getByTestId('erd-canvas-node-User');
    fireEvent.click(userNode);
    expect(screen.getByTestId('erd-entity-inspector')).toBeInTheDocument();

    // Switch view mode to table
    const tableBtn = screen.getByTestId('erd-view-table-btn');
    fireEvent.click(tableBtn);
    expect(
      screen.getByText(/UML Multiplicity & Composition Cascade Registry/i)
    ).toBeInTheDocument();

    // Switch back to canvas
    const canvasBtn = screen.getByTestId('erd-view-canvas-btn');
    fireEvent.click(canvasBtn);
    expect(screen.getByTestId('erd-interactive-canvas')).toBeInTheDocument();

    // Switch back to Relationships Matrix
    const relTab = screen.getByTestId('tab-relationships-matrix');
    fireEvent.click(relTab);
    expect(screen.getByTestId('relationship-matrix-flow')).toBeInTheDocument();
  });
});
