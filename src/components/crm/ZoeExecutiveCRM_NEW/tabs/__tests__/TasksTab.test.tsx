import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TasksTab from '../TasksTab';

describe('TasksTab', () => {
  const mockTasks = [
    {
      id: 'task-1',
      title: 'Review Escrow Settlement for Palm Villa',
      status: 'pending',
      priority: 'high',
      dueDate: '2026-11-10',
      assignee: 'Zoe (COO)',
    },
    {
      id: 'task-2',
      title: 'Verify DLD Title Deeds Submission',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2026-11-12',
      assignee: 'Clara (Dept 01)',
    },
    {
      id: 'task-3',
      title: 'Quarterly VAT Audit Sign-Off',
      status: 'completed',
      priority: 'low',
      dueDate: '2026-11-01',
      assignee: 'Invoice & FinTech Core',
    },
  ];

  it('renders all tasks by default when filterStatus is all', () => {
    const handleFilterChange = vi.fn();
    render(
      <TasksTab
        tasks={mockTasks}
        filterStatus="all"
        onFilterChange={handleFilterChange}
      />
    );

    expect(screen.getByText(/Review Escrow Settlement/i)).toBeInTheDocument();
    expect(screen.getByText(/Verify DLD Title Deeds Submission/i)).toBeInTheDocument();
    expect(screen.getByText(/Quarterly VAT Audit Sign-Off/i)).toBeInTheDocument();
  });

  it('filters tasks properly based on filterStatus', () => {
    const handleFilterChange = vi.fn();
    render(
      <TasksTab
        tasks={mockTasks}
        filterStatus="pending"
        onFilterChange={handleFilterChange}
      />
    );

    expect(screen.getByText(/Review Escrow Settlement/i)).toBeInTheDocument();
    expect(screen.queryByText(/Verify DLD Title Deeds Submission/i)).not.toBeInTheDocument();
  });

  it('triggers onFilterChange when clicking filter buttons', () => {
    const handleFilterChange = vi.fn();
    render(
      <TasksTab
        tasks={mockTasks}
        filterStatus="all"
        onFilterChange={handleFilterChange}
      />
    );

    const pendingBtn = screen.getByRole('button', { name: /Pending/i });
    fireEvent.click(pendingBtn);
    expect(handleFilterChange).toHaveBeenCalledWith('pending');
  });
});
