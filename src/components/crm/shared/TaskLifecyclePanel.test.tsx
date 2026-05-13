/**
 * TaskLifecyclePanel — Unit Tests
 *
 * Covers: stage track rendering, active/done/future states, actions log,
 * expand/collapse, result card, failed/cancelled terminal states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ─────────────────────────────────────────────────────────

vi.mock('./TaskLifecyclePanel.css', () => ({}));

vi.mock('lucide-react', () => {
  const icon =
    (name: string) =>
    ({ size, className }: { size?: number; className?: string }) =>
      <span data-testid={`icon-${name}`} className={className} />;
  return {
    CheckCircle: icon('check-circle'),
    Circle: icon('circle'),
    Clock: icon('clock'),
    XCircle: icon('x-circle'),
    AlertTriangle: icon('alert-triangle'),
    Loader2: icon('loader2'),
    ChevronDown: icon('chevron-down'),
    ChevronRight: icon('chevron-right'),
    User: icon('user'),
    Calendar: icon('calendar'),
    Zap: icon('zap'),
    Flag: icon('flag'),
  };
});

import TaskLifecyclePanel from './TaskLifecyclePanel';
import type { Task } from '../../../store/slices/aiAssistant/types';

// ── Fixtures ──────────────────────────────────────────────────────

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't1',
  title: 'Sync tenant database',
  priority: 'high',
  status: 'in_progress',
  assignedTo: 'laila',
  dueDate: new Date(Date.now() + 86400000).toISOString(),
  lifecycleStage: 'in_progress',
  actions: [
    {
      id: 'ta_1',
      type: 'task_created',
      description: 'Task was created',
      actor: 'system',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'success',
    },
    {
      id: 'ta_2',
      type: 'started',
      description: 'Work started on task',
      actor: 'laila',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success',
      result: '23 records loaded',
    },
  ],
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 1800000).toISOString(),
  ...overrides,
});

// ── Tests ─────────────────────────────────────────────────────────

describe('TaskLifecyclePanel', () => {
  it('renders without crashing', () => {
    render(<TaskLifecyclePanel task={makeTask()} />);
    expect(document.querySelector('.task-lifecycle-panel')).toBeTruthy();
  });

  it('shows all 5 ordered stage nodes', () => {
    render(<TaskLifecyclePanel task={makeTask()} />);
    const track = document.querySelector('.lc-stage-track');
    expect(track).toBeTruthy();
    const nodes = document.querySelectorAll('.lc-stage-node');
    // 5 ordered stages (created, queued, in_progress, pending_review, completed)
    expect(nodes.length).toBeGreaterThanOrEqual(5);
  });

  it('marks in_progress stage as active', () => {
    render(<TaskLifecyclePanel task={makeTask({ lifecycleStage: 'in_progress' })} />);
    const activeNode = document.querySelector('.lc-stage-node.stage-active');
    expect(activeNode).toBeTruthy();
    expect(activeNode?.textContent).toContain('In Progress');
  });

  it('marks completed stage correctly', () => {
    render(
      <TaskLifecyclePanel
        task={makeTask({
          lifecycleStage: 'completed',
          status: 'completed',
          completedAt: new Date().toISOString(),
        })}
      />,
    );
    // Completed stage is marked active
    const activeNode = document.querySelector('.lc-stage-node.stage-active');
    expect(activeNode?.textContent).toContain('Completed');
  });

  it('shows failed terminal badge when stage is failed', () => {
    render(
      <TaskLifecyclePanel
        task={makeTask({
          lifecycleStage: 'failed',
          completedAt: new Date().toISOString(),
        })}
      />,
    );
    const failedNode = document.querySelector('.lc-stage-node.stage-failed');
    expect(failedNode).toBeTruthy();
    expect(failedNode?.textContent).toContain('Failed');
  });

  it('shows cancelled terminal badge when stage is cancelled', () => {
    render(
      <TaskLifecyclePanel
        task={makeTask({
          lifecycleStage: 'cancelled',
          completedAt: new Date().toISOString(),
        })}
      />,
    );
    const cancelledNode = document.querySelector('.lc-stage-node.stage-cancelled');
    expect(cancelledNode).toBeTruthy();
  });

  it('shows actions count in the toggle button', () => {
    const task = makeTask();
    render(<TaskLifecyclePanel task={task} />);
    const countBadge = document.querySelector('.lc-count-badge');
    expect(countBadge?.textContent).toBe('2');
  });

  it('actions list is collapsed by default', () => {
    render(<TaskLifecyclePanel task={makeTask()} />);
    expect(document.querySelector('.lc-actions-list')).toBeNull();
  });

  it('actions list expands when defaultExpanded=true', () => {
    render(<TaskLifecyclePanel task={makeTask()} defaultExpanded />);
    expect(document.querySelector('.lc-actions-list')).toBeTruthy();
  });

  it('toggles actions list on button click', () => {
    render(<TaskLifecyclePanel task={makeTask()} />);
    const toggleBtn = document.querySelector('.lc-section-toggle') as HTMLButtonElement;
    expect(document.querySelector('.lc-actions-list')).toBeNull();
    fireEvent.click(toggleBtn);
    expect(document.querySelector('.lc-actions-list')).toBeTruthy();
    fireEvent.click(toggleBtn);
    expect(document.querySelector('.lc-actions-list')).toBeNull();
  });

  it('renders all action rows when expanded', () => {
    render(<TaskLifecyclePanel task={makeTask()} defaultExpanded />);
    const rows = document.querySelectorAll('.action-row');
    expect(rows.length).toBe(2);
  });

  it('shows action type and description', () => {
    render(<TaskLifecyclePanel task={makeTask()} defaultExpanded />);
    expect(screen.getByText('task_created')).toBeTruthy();
    expect(screen.getByText('Task was created')).toBeTruthy();
    expect(screen.getByText('23 records loaded')).toBeTruthy();
  });

  it('shows "No actions recorded" for empty actions', () => {
    render(<TaskLifecyclePanel task={makeTask({ actions: [] })} defaultExpanded />);
    expect(screen.getByText('No actions recorded yet.')).toBeTruthy();
  });

  it('renders result card when task.result is present', () => {
    const task = makeTask({
      lifecycleStage: 'completed',
      result: {
        outcome: 'success',
        summary: '23 units imported successfully',
        completedAt: new Date().toISOString(),
        metrics: { units: 23 },
      },
    });
    render(<TaskLifecyclePanel task={task} />);
    expect(screen.getByText('23 units imported successfully')).toBeTruthy();
    expect(screen.getByText('✓ Completed')).toBeTruthy();
  });

  it('result card shows error message for failed outcome', () => {
    const task = makeTask({
      lifecycleStage: 'failed',
      result: {
        outcome: 'failed',
        summary: 'Import crashed',
        completedAt: new Date().toISOString(),
        errorMessage: 'Connection timeout',
      },
    });
    render(<TaskLifecyclePanel task={task} />);
    expect(screen.getByText('Connection timeout')).toBeTruthy();
    expect(screen.getByText('✗ Failed')).toBeTruthy();
  });

  it('result card shows partial outcome correctly', () => {
    const task = makeTask({
      lifecycleStage: 'pending_review',
      result: {
        outcome: 'partial',
        summary: '10 of 23 units imported',
        completedAt: new Date().toISOString(),
      },
    });
    render(<TaskLifecyclePanel task={task} />);
    expect(screen.getByText('⚠ Partially completed')).toBeTruthy();
  });

  it('applies custom color via CSS custom property', () => {
    render(<TaskLifecyclePanel task={makeTask()} color="#FF6B35" />);
    const panel = document.querySelector('.task-lifecycle-panel') as HTMLElement;
    expect(panel.style.getPropertyValue('--lc-accent')).toBe('#FF6B35');
  });

  it('renders meta row with stage label', () => {
    render(<TaskLifecyclePanel task={makeTask({ lifecycleStage: 'in_progress' })} />);
    const metaRow = document.querySelector('.lc-meta-row');
    expect(metaRow?.textContent).toContain('In Progress');
  });
});
