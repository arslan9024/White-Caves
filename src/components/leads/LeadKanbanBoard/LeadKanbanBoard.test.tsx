/**
 * LeadKanbanBoard.test.tsx — Test Suite (4-Way Component Architecture)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadKanbanBoard } from './LeadKanbanBoard';

describe('LeadKanbanBoard', () => {
  it('renders all 6 pipeline columns', () => {
    render(<LeadKanbanBoard />);
    expect(screen.getByTestId('kanban-column-new')).toBeTruthy();
    expect(screen.getByTestId('kanban-column-contacted')).toBeTruthy();
    expect(screen.getByTestId('kanban-column-viewing')).toBeTruthy();
    expect(screen.getByTestId('kanban-column-offer')).toBeTruthy();
    expect(screen.getByTestId('kanban-column-closed')).toBeTruthy();
    expect(screen.getByTestId('kanban-column-lost')).toBeTruthy();
  });

  it('renders lead cards with name and budget', () => {
    render(<LeadKanbanBoard />);
    expect(screen.getByText('Ahmed Al Mansouri')).toBeTruthy();
    expect(screen.getByText('AED 2.5M')).toBeTruthy();
  });
});
