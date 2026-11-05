import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DepartmentHierarchyView } from './DepartmentHierarchyView';
import {
  executeSwapDirectorSlotsWorkflow,
  executeSwapManagerSlotsWorkflow,
  executeDemoteEntityWorkflow,
} from './DepartmentHierarchy.workflow';
import { buildInitialHierarchyState } from './DepartmentHierarchy.data';

describe('DepartmentHierarchy 3-Tier Bhakti Protocol Suite', () => {
  it('renders 12 corporate directors with slot numbers and fixed codes', () => {
    render(<DepartmentHierarchyView />);

    expect(screen.getByTestId('department-hierarchy-view')).toBeInTheDocument();
    expect(screen.getByTestId('directors-grid')).toBeInTheDocument();

    // Check first and last director slots
    expect(screen.getByTestId('director-card-slot-1')).toBeInTheDocument();
    expect(screen.getByTestId('director-card-slot-12')).toBeInTheDocument();

    // Verify slot pills and fixed codes
    expect(screen.getByText('Slot #01')).toBeInTheDocument();
    expect(screen.getByText('DEPT-01')).toBeInTheDocument();
    expect(screen.getByText('Slot #12')).toBeInTheDocument();
    expect(screen.getByText('DEPT-12')).toBeInTheDocument();
  });

  it('drills down to 9 division managers (L2) and shows task domains', () => {
    render(<DepartmentHierarchyView />);

    // Click 9 Divisions button on slot 1
    const drillDownBtn = screen.getByTestId('drill-down-dept-1');
    fireEvent.click(drillDownBtn);

    // Grid changes to managers-grid
    expect(screen.getByTestId('managers-grid')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-l2')).toBeInTheDocument();

    // Check 9 division slots
    expect(screen.getByTestId('manager-card-slot-1')).toBeInTheDocument();
    expect(screen.getByTestId('manager-card-slot-9')).toBeInTheDocument();
    expect(screen.getByText('Division #1')).toBeInTheDocument();
    expect(screen.getByText('MGR-01')).toBeInTheDocument();
  });

  it('drills down to teams & supervisors (L3) and navigates back via breadcrumbs', () => {
    render(<DepartmentHierarchyView />);

    // Drill down to L2
    fireEvent.click(screen.getByTestId('drill-down-dept-1'));

    // Drill down to L3 from manager slot 1
    fireEvent.click(screen.getByTestId('drill-down-mgr-1'));

    expect(screen.getByTestId('teams-container')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-l3')).toBeInTheDocument();

    // Navigate back to L1 Directors via breadcrumb
    const l1Breadcrumb = screen.getByTestId('breadcrumb-l1');
    fireEvent.click(l1Breadcrumb);

    expect(screen.getByTestId('directors-grid')).toBeInTheDocument();
  });

  it('demotes a director to the unassigned reserve pool increasing pool count', () => {
    render(<DepartmentHierarchyView />);

    const poolCountPill = screen.getByTestId('pool-count-pill');
    const initialText = poolCountPill.textContent;

    // Click demote on director slot 1
    const demoteBtn = screen.getByTestId('demote-director-1');
    fireEvent.click(demoteBtn);

    // Slot 1 is now an open slot
    expect(screen.getByText('[Open Department Slot #1]')).toBeInTheDocument();
    expect(poolCountPill.textContent).not.toEqual(initialText);
  });

  it('filters directors when typing in search input', () => {
    render(<DepartmentHierarchyView />);

    const searchInput = screen.getByTestId('hierarchy-search-input');
    fireEvent.change(searchInput, { target: { value: 'DEPT-01' } });

    expect(screen.getByTestId('director-card-slot-1')).toBeInTheDocument();
    expect(screen.queryByTestId('director-card-slot-12')).not.toBeInTheDocument();
  });

  describe('Pure Workflow Engine Functions (I-P-O-V Protocol)', () => {
    it('executeSwapDirectorSlotsWorkflow swaps content while locking slot numbers and codes', () => {
      const state = buildInitialHierarchyState();
      const s1Before = state.directors.find(d => d.slotNumber === 1)!;
      const s2Before = state.directors.find(d => d.slotNumber === 2)!;

      const result = executeSwapDirectorSlotsWorkflow(state, 1, 2);
      expect(result.success).toBe(true);

      const s1After = result.state.directors.find(d => d.slotNumber === 1)!;
      const s2After = result.state.directors.find(d => d.slotNumber === 2)!;

      // Slot numbers and codes are fixed (Bhakti Protocol)
      expect(s1After.slotNumber).toBe(1);
      expect(s1After.fixedCode).toBe('DEPT-01');
      expect(s2After.slotNumber).toBe(2);
      expect(s2After.fixedCode).toBe('DEPT-02');

      // Content has been swapped
      expect(s1After.title).toBe(s2Before.title);
      expect(s2After.title).toBe(s1Before.title);
    });

    it('executeSwapManagerSlotsWorkflow swaps division manager content correctly', () => {
      const state = buildInitialHierarchyState();
      const deptSlug = state.directors[0].slug;
      const mgr1Before = state.managersByDeptId[deptSlug][0];
      const mgr2Before = state.managersByDeptId[deptSlug][1];

      const result = executeSwapManagerSlotsWorkflow(state, deptSlug, 1, 2);
      expect(result.success).toBe(true);

      const mgr1After = result.state.managersByDeptId[deptSlug][0];
      const mgr2After = result.state.managersByDeptId[deptSlug][1];

      expect(mgr1After.slotNumber).toBe(1);
      expect(mgr1After.fixedCode).toBe('MGR-01');
      expect(mgr1After.title).toBe(mgr2Before.title);
      expect(mgr2After.title).toBe(mgr1Before.title);
    });

    it('executeDemoteEntityWorkflow places director into unassigned pool', () => {
      const state = buildInitialHierarchyState();
      const initialPoolLength = state.unassignedPool.length;
      const targetDirector = state.directors[0];

      const result = executeDemoteEntityWorkflow(state, 'DIRECTOR', targetDirector._id);
      expect(result.success).toBe(true);
      expect(result.state.unassignedPool.length).toBe(initialPoolLength + 1);
      expect(result.state.directors[0].directorName).toBe('Unassigned Lead');
    });
  });
});
