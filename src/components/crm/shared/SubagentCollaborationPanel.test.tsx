import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../services/subagentOrchestrationService', () => ({
  subagentOrchestrationService: {
    getStatus: vi.fn(),
    getSnapshots: vi.fn(),
    createTask: vi.fn(),
    updateTaskState: vi.fn(),
    exportSnapshot: vi.fn(),
    restoreSnapshot: vi.fn(),
  },
}));

import SubagentCollaborationPanel from './SubagentCollaborationPanel';
import { subagentOrchestrationService } from '../../../services/subagentOrchestrationService';

const mGetStatus = subagentOrchestrationService.getStatus as ReturnType<typeof vi.fn>;
const mGetSnapshots = subagentOrchestrationService.getSnapshots as ReturnType<typeof vi.fn>;
const mCreateTask = subagentOrchestrationService.createTask as ReturnType<typeof vi.fn>;
const mUpdateTaskState = subagentOrchestrationService.updateTaskState as ReturnType<typeof vi.fn>;
const mExportSnapshot = subagentOrchestrationService.exportSnapshot as ReturnType<typeof vi.fn>;
const mRestoreSnapshot = subagentOrchestrationService.restoreSnapshot as ReturnType<typeof vi.fn>;

const makeStatusResponse = (
  overrides?: Partial<{ tasks: Array<Record<string, unknown>>; metrics: Record<string, unknown> }>
) => ({
  success: true,
  data: {
    profiles: {},
    collaborationGraph: [],
    quota: {
      weeklyPremiumRemaining: 25,
      businessDaysRemaining: 5,
      dailyCap: 5,
      premiumConsumedToday: 1,
      premiumRemainingToday: 4,
    },
    metrics: overrides?.metrics ?? {
      totalTasks: 0,
      queuedTasks: 0,
      runningTasks: 0,
      doneTasks: 0,
      failedTasks: 0,
      blockedTasks: 0,
      premiumTasks: 0,
      standardTasks: 0,
      freeTasks: 0,
      lastTaskCreatedAt: null,
    },
    tasks: overrides?.tasks ?? [],
  },
});

describe('SubagentCollaborationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mGetStatus.mockResolvedValue(makeStatusResponse());
    mGetSnapshots.mockResolvedValue({ success: true, data: [] });
    mCreateTask.mockResolvedValue({ success: true, data: { id: 't-1' } });
    mUpdateTaskState.mockResolvedValue({ success: true, data: { id: 't-1' } });
    mExportSnapshot.mockResolvedValue({
      success: true,
      data: { fileName: 'orch-snapshot-1.json' },
    });
    mRestoreSnapshot.mockResolvedValue({
      success: true,
      data: { snapshot: { fileName: 'orch-snapshot-1.json' } },
    });
  });

  it('renders default prompt when no assistant is selected', async () => {
    render(<SubagentCollaborationPanel />);

    expect(await screen.findByText(/select an assistant to view role/i)).toBeInTheDocument();
    expect(
      screen.getByText(/select an assistant to assign orchestration tasks/i)
    ).toBeInTheDocument();
  });

  it('shows selected assistant role and model policy details', async () => {
    render(<SubagentCollaborationPanel assistantId="linda" />);

    expect(await screen.findByText(/whatsapp orchestration agent/i)).toBeInTheDocument();
    expect(screen.getByText(/model tier:/i)).toBeInTheDocument();
    expect(screen.getByText(/premium allowed:/i)).toBeInTheDocument();
  });

  it('uses API status quota values when available', async () => {
    mGetStatus.mockResolvedValueOnce(
      makeStatusResponse({
        tasks: [],
      })
    );

    render(
      <SubagentCollaborationPanel
        assistantId="henry"
        weeklyPremiumRemaining={99}
        businessDaysRemaining={9}
      />
    );

    const weeklyLine = await screen.findByText(/weekly remaining:/i);
    const dailyLine = screen.getByText(/daily premium cap:/i);

    expect(weeklyLine).toHaveTextContent('Weekly remaining:');
    expect(weeklyLine).toHaveTextContent('25');
    expect(weeklyLine).toHaveTextContent('Business days left:');
    expect(dailyLine).toHaveTextContent('Daily premium cap:');
    expect(dailyLine).toHaveTextContent('Consumed:');
    expect(dailyLine).toHaveTextContent('Remaining:');
  });

  it('renders runtime task metrics from orchestration status payload', async () => {
    mGetStatus.mockResolvedValueOnce(
      makeStatusResponse({
        metrics: {
          totalTasks: 7,
          queuedTasks: 2,
          runningTasks: 1,
          doneTasks: 3,
          failedTasks: 1,
          blockedTasks: 0,
          premiumTasks: 2,
          standardTasks: 5,
          freeTasks: 0,
          lastTaskCreatedAt: null,
        },
      })
    );

    render(<SubagentCollaborationPanel assistantId="henry" />);

    expect(await screen.findByText(/runtime task metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total:/i)).toHaveTextContent('7');
    expect(screen.getByText(/Done:/i)).toHaveTextContent('3');
    expect(screen.getByText(/Premium tasks:/i)).toHaveTextContent('2');
  });

  it('renders snapshot list and exports a snapshot', async () => {
    mGetSnapshots
      .mockResolvedValueOnce({
        success: true,
        data: [{ fileName: 'orch-snapshot-a.json', createdAt: '2026-05-12', taskCount: 3 }],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [
          { fileName: 'orch-snapshot-a.json', createdAt: '2026-05-12', taskCount: 3 },
          { fileName: 'orch-snapshot-b.json', createdAt: '2026-05-13', taskCount: 4 },
        ],
      });

    render(<SubagentCollaborationPanel assistantId="henry" />);

    expect(await screen.findByText(/persistence snapshots/i)).toBeInTheDocument();
    expect(screen.getByText(/orch-snapshot-a.json/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /export snapshot/i }));

    await waitFor(() => {
      expect(mExportSnapshot).toHaveBeenCalledWith('henry-panel');
    });
  });

  it('restores latest snapshot from snapshot action button', async () => {
    mGetSnapshots
      .mockResolvedValueOnce({
        success: true,
        data: [{ fileName: 'orch-snapshot-latest.json', createdAt: '2026-05-13', taskCount: 2 }],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [{ fileName: 'orch-snapshot-latest.json', createdAt: '2026-05-13', taskCount: 2 }],
      });

    render(<SubagentCollaborationPanel assistantId="henry" />);

    const restoreButton = await screen.findByRole('button', { name: /restore latest/i });
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mRestoreSnapshot).toHaveBeenCalledWith('orch-snapshot-latest.json');
    });
  });

  it('assigns a task and refreshes assistant task list', async () => {
    mGetStatus.mockResolvedValueOnce(makeStatusResponse({ tasks: [] })).mockResolvedValueOnce(
      makeStatusResponse({
        tasks: [
          {
            id: 't-2',
            assistantId: 'henry',
            taskType: 'review',
            title: 'Review legal handoff package',
            state: 'queued',
            requestedTier: 'standard',
            blockedReason: null,
            createdAt: new Date().toISOString(),
          },
        ],
      })
    );

    render(<SubagentCollaborationPanel assistantId="henry" />);

    const input = await screen.findByPlaceholderText(/draft ai handoff rules/i);
    fireEvent.change(input, { target: { value: 'Review legal handoff package' } });

    fireEvent.click(screen.getByRole('button', { name: /assign task/i }));

    await waitFor(() => {
      expect(mCreateTask).toHaveBeenCalledWith({
        assistantId: 'henry',
        taskType: 'review',
        title: 'Review legal handoff package',
        requestedTier: 'standard',
      });
    });

    expect(await screen.findByText(/review legal handoff package/i)).toBeInTheDocument();
    expect(mGetStatus).toHaveBeenCalledTimes(2);
  });

  it('shows status error when status loading fails', async () => {
    mGetStatus.mockRejectedValueOnce(new Error('Status API unavailable'));

    render(<SubagentCollaborationPanel assistantId="linda" />);

    expect(await screen.findByText(/status api unavailable/i)).toBeInTheDocument();
  });

  it('shows assign-task error and re-enables submit when task creation fails', async () => {
    mGetStatus.mockResolvedValueOnce(makeStatusResponse({ tasks: [] }));
    mCreateTask.mockRejectedValueOnce(new Error('Task creation failed'));

    render(<SubagentCollaborationPanel assistantId="henry" />);

    const input = await screen.findByPlaceholderText(/draft ai handoff rules/i);
    fireEvent.change(input, { target: { value: 'Escalate compliance evidence gap' } });

    const button = screen.getByRole('button', { name: /assign task/i });
    fireEvent.click(button);

    expect(await screen.findByText(/task creation failed/i)).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(input).toHaveValue('Escalate compliance evidence gap');
  });

  it('blocks premium task assignment for non-premium assistants', async () => {
    render(<SubagentCollaborationPanel assistantId="linda" />);

    const input = await screen.findByPlaceholderText(/draft ai handoff rules/i);
    fireEvent.change(input, { target: { value: 'Run premium strategy synthesis' } });

    fireEvent.change(screen.getByLabelText(/requested model tier/i), {
      target: { value: 'premium' },
    });

    expect(screen.getByText(/not permitted to use premium tier/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assign task/i })).toBeDisabled();
  });

  it('requires context gate approval for premium-capable gated assistants', async () => {
    render(<SubagentCollaborationPanel assistantId="mira" />);

    const input = await screen.findByPlaceholderText(/draft ai handoff rules/i);
    fireEvent.change(input, { target: { value: 'Implement orchestration endpoint' } });

    fireEvent.change(screen.getByLabelText(/requested model tier/i), {
      target: { value: 'premium' },
    });

    expect(screen.getByText(/requires context gate approval/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/context gate approved for premium requests/i));

    await waitFor(() => {
      expect(screen.queryByText(/requires context gate approval/i)).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /assign task/i })).toBeEnabled();
  });

  it('updates task state from queued to running via task action button', async () => {
    mGetStatus
      .mockResolvedValueOnce(
        makeStatusResponse({
          tasks: [
            {
              id: 'task-q1',
              assistantId: 'henry',
              taskType: 'review',
              title: 'Review compliance bundle',
              state: 'queued',
              requestedTier: 'standard',
              blockedReason: null,
              createdAt: new Date().toISOString(),
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        makeStatusResponse({
          tasks: [
            {
              id: 'task-q1',
              assistantId: 'henry',
              taskType: 'review',
              title: 'Review compliance bundle',
              state: 'running',
              requestedTier: 'standard',
              blockedReason: null,
              createdAt: new Date().toISOString(),
            },
          ],
        })
      );

    render(<SubagentCollaborationPanel assistantId="henry" />);

    const runningBtn = await screen.findByLabelText(
      /set task review compliance bundle to running/i
    );
    fireEvent.click(runningBtn);

    await waitFor(() => {
      expect(mUpdateTaskState).toHaveBeenCalledWith('task-q1', 'running', undefined);
    });

    expect(mGetStatus).toHaveBeenCalledTimes(2);
  });
});
