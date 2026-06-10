import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_t, tag: string) => {
      const Tag = tag as keyof JSX.IntrinsicElements;
      return ({ children, ...p }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(Tag as string, p, children);
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import AgentTaskCockpit from './AgentTaskCockpit';

const MOCK_LEADS = [
  { id: '1', name: 'Ahmad Al Mansouri', phone: '+971501234567', status: 'new',       createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(), slaRisk: 'breached', priorityRank: 1, nextAction: 'Respond immediately' },
  { id: '2', name: 'Sara Khalid',        phone: '+971509876543', status: 'contacted', createdAt: new Date().toISOString(), slaRisk: 'healthy', priorityRank: 2, nextAction: 'Advance follow-up' },
  { id: '3', name: 'Rashed Ibrahim',     phone: '+971551234567', status: 'new',       createdAt: new Date(Date.now() + 48 * 3600_000).toISOString(), slaRisk: 'healthy', priorityRank: 3, nextAction: 'Advance follow-up' },
];

describe('AgentTaskCockpit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            columns: {
              overdue: [MOCK_LEADS[0]],
              today: [MOCK_LEADS[1]],
              upcoming: [MOCK_LEADS[2]],
            },
            summary: {
              total: 3,
              breached: 1,
              today: 1,
            },
          },
        }),
    });
  });

  it('renders without crashing', () => {
    render(<AgentTaskCockpit />);
    expect(screen.getByText('Agent Task Cockpit')).toBeDefined();
  });

  it('shows Overdue column heading', async () => {
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText('Overdue')).toBeDefined());
  });

  it('shows Today column heading', async () => {
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText('Today')).toBeDefined());
  });

  it('shows Upcoming column heading', async () => {
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText('Upcoming')).toBeDefined());
  });

  it('renders lead names after fetch', async () => {
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText('Ahmad Al Mansouri')).toBeDefined());
  });

  it('renders priority and next action details', async () => {
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText(/Priority #1/i)).toBeDefined());
    expect(screen.getByText('Respond immediately')).toBeDefined();
  });

  it('shows error state on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    render(<AgentTaskCockpit />);
    await waitFor(() => expect(screen.getByText(/Failed to load tasks/i)).toBeDefined());
  });
});

