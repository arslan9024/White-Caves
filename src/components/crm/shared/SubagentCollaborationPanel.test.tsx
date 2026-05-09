import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../../services/subagentOrchestrationService', () => ({
  subagentOrchestrationService: {
    getStatus: vi.fn(),
    createTask: vi.fn(),
  },
}));

import SubagentCollaborationPanel from './SubagentCollaborationPanel';
import { subagentOrchestrationService } from '../../../services/subagentOrchestrationService';

const mGetStatus = subagentOrchestrationService.getStatus as ReturnType<typeof vi.fn>;
const mCreateTask = subagentOrchestrationService.createTask as ReturnType<typeof vi.fn>;

const makeStatusResponse = (overrides?: Partial<{ tasks: Array<Record<string, unknown>> }>) => ({
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
    tasks: overrides?.tasks ?? [],
  },
});

describe('SubagentCollaborationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mGetStatus.mockResolvedValue(makeStatusResponse());
    mCreateTask.mockResolvedValue({ success: true, data: { id: 't-1' } });
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
});
