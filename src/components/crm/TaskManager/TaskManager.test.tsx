import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskManagerView } from './TaskManagerView';
import {
  executeCreateTaskWorkflow,
  executeUpdateTaskWorkflow,
  executeAdvanceTaskStatusWorkflow,
  executeTaskFunctionalRunWorkflow,
} from './TaskManager.workflow';
import { buildCanonical200Tasks } from './TaskManager.data';

describe('TaskManager 200+ Statutory & Operational Suite', () => {
  it('renders 200 tasks catalog with header, metrics, and cards', () => {
    render(<TaskManagerView />);

    expect(screen.getByTestId('task-manager-view')).toBeInTheDocument();
    expect(screen.getByTestId('task-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('tasks-cards-grid')).toBeInTheDocument();

    // Check TSK-001 card
    expect(screen.getByTestId('task-card-TSK-001')).toBeInTheDocument();
    expect(
      screen.getByText('Verify RERA Broker Card Active Status & Renewals')
    ).toBeInTheDocument();
    expect(screen.getByText('RERA / DLD')).toBeInTheDocument();
  });

  it('filters tasks dynamically via search input', () => {
    render(<TaskManagerView />);

    const searchInput = screen.getByTestId('task-search-input');
    fireEvent.change(searchInput, { target: { value: 'TSK-008' } });

    expect(screen.getByTestId('task-card-TSK-008')).toBeInTheDocument();
    expect(screen.queryByTestId('task-card-TSK-001')).not.toBeInTheDocument();
  });

  it('filters tasks by operational pillar', () => {
    render(<TaskManagerView />);

    const pillarSelect = screen.getByTestId('pillar-filter-select');
    fireEvent.change(pillarSelect, { target: { value: 'pillar-1' } });

    expect(screen.getByTestId('task-card-TSK-001')).toBeInTheDocument();
  });

  it('advances task status from PENDING to IN_PROGRESS', () => {
    render(<TaskManagerView />);

    const advanceBtn = screen.getByTestId('advance-task-TSK-001');
    fireEvent.click(advanceBtn);

    expect(
      screen.getByText(/status transitioned from PENDING to IN_PROGRESS/i)
    ).toBeInTheDocument();
  });

  it('opens task registration drawer when clicking Register New Task', () => {
    render(<TaskManagerView />);

    const addBtn = screen.getByTestId('add-task-btn');
    fireEvent.click(addBtn);

    expect(screen.getByText('Register New Dubai Statutory Task')).toBeInTheDocument();
    expect(screen.getByText('Register Task')).toBeInTheDocument();
  });

  it('verifies that buildCanonical200Tasks generates at least 200 tasks with full reporting chains', () => {
    const tasks = buildCanonical200Tasks();
    expect(tasks.length).toBeGreaterThanOrEqual(200);

    // Verify reporting chain integrity across all tasks
    tasks.forEach(t => {
      expect(t.reportingChain).toBeDefined();
      expect(t.reportingChain.supervisorName).toBeTruthy();
      expect(t.reportingChain.managerName).toBeTruthy();
      expect(t.reportingChain.directorName).toBeTruthy();
      expect(t.reportingChain.executiveReviewer).toBeTruthy();
    });
  });

  describe('Pure Task Workflow Engine (I-P-O-V Protocol)', () => {
    it('executeCreateTaskWorkflow generates task with sequential code and reporting chain', () => {
      const initial = buildCanonical200Tasks();
      const payload = {
        title: 'Custom Golden Visa Escrow Liaison',
        pillarId: 'pillar-1',
        pillarName: 'Pillar I: Legal & Regulatory',
        category: 'REGULATORY' as const,
        statutoryAuthority: 'GDRFA',
        description: 'Expedited processing for 2M AED real estate investor visa.',
        priority: 'CRITICAL' as const,
        status: 'PENDING' as const,
        defaultSla: '2 Hours',
        reportingChain: {
          supervisorName: 'Supervisor Amira',
          supervisorCode: 'SUP-01',
          managerName: 'Manager Farooq',
          managerCode: 'MGR-01',
          directorName: 'Adv. Tariq Mansoor',
          directorCode: 'DIR-01',
          executiveReviewer: 'Sophia Al-Hashemi',
        },
      };

      const result = executeCreateTaskWorkflow(initial, payload);
      expect(result.success).toBe(true);
      expect(result.tasks.length).toBe(initial.length + 1);
      expect(result.tasks[0].taskCode).toMatch(/^TSK-\d+/);
    });

    it('executeAdvanceTaskStatusWorkflow updates status and recalculates completion rate', () => {
      const initial = buildCanonical200Tasks();
      const result = executeAdvanceTaskStatusWorkflow(initial, 'task-tsk-001', 'COMPLETED');

      expect(result.success).toBe(true);
      const updated = result.tasks.find(t => t._id === 'task-tsk-001')!;
      expect(updated.status).toBe('COMPLETED');
      expect(updated.completionRate).toBe(100);
    });

    it('executeTaskFunctionalRunWorkflow processes atomic task and outputs verification artifacts', () => {
      const initial = buildCanonical200Tasks();
      const task = initial[0];
      const result = executeTaskFunctionalRunWorkflow(task, {
        plotNumber: 'PLT-58204-DH2',
        ownerName: 'White Caves Real Estate Holdings LLC',
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe('COMPLETED');
      expect(result.verificationPassed).toBe(true);
      expect(result.awardedXp).toBeGreaterThan(0);
      expect(result.outputs.documentType).toBeDefined();
    });
  });

  it('opens TaskExecutionWorkbench when clicking Run (δ) on a task card', () => {
    render(<TaskManagerView />);

    const runBtn = screen.getByTestId('run-task-TSK-001');
    fireEvent.click(runBtn);

    expect(screen.getByTestId('task-execution-workbench')).toBeInTheDocument();
    expect(screen.getByText('Stage 1: Input Parameters')).toBeInTheDocument();
    expect(screen.getAllByText(/Run Task Execution/i).length).toBeGreaterThan(0);
  });
});
