import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_t, tag: string) =>
        ({ children, ...p }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag as string, p, children),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import LeadTimeline from './LeadTimeline';

const MOCK_ACTIVITIES = [
  {
    id: 'a0',
    type: 'inquiry',
    title: 'Inquiry captured',
    description: 'Web form inquiry captured and routed into CRM.',
    createdAt: new Date().toISOString(),
    userName: 'White Caves',
  },
  {
    id: 'a1',
    type: 'call',
    title: 'Call logged',
    description: 'Called lead, left voicemail',
    createdAt: new Date().toISOString(),
    userName: 'Agent A',
  },
  {
    id: 'a2',
    type: 'whatsapp',
    title: 'WhatsApp touchpoint',
    description: 'Sent property brochure',
    createdAt: new Date().toISOString(),
    userName: 'Agent B',
  },
  {
    id: 'a3',
    type: 'task',
    title: 'Task update',
    description: 'Reminder scheduled for tomorrow',
    createdAt: new Date().toISOString(),
    userName: 'Agent A',
  },
  {
    id: 'a4',
    type: 'viewing',
    title: 'Viewing milestone',
    description: 'Viewing scheduled at 3pm',
    createdAt: new Date().toISOString(),
    userName: 'Agent A',
  },
];

function renderWithRouter(ui: React.ReactElement, route = '/') {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('LeadTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: MOCK_ACTIVITIES }),
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<LeadTimeline leadId="lead-123" />);
    expect(screen.getByText('Lead Timeline')).toBeDefined();
  });

  it('renders all inquiry/task filter pills', () => {
    renderWithRouter(<LeadTimeline leadId="lead-123" />);
    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('Inquiry')).toBeDefined();
    expect(screen.getByText('Call')).toBeDefined();
    expect(screen.getByText('WhatsApp')).toBeDefined();
    expect(screen.getByText('Task')).toBeDefined();
    expect(screen.getByText('Viewing')).toBeDefined();
    expect(screen.getByText('Offer')).toBeDefined();
  });

  it('renders activities after fetch', async () => {
    renderWithRouter(<LeadTimeline leadId="lead-123" />);
    await waitFor(() => expect(screen.getByText('Called lead, left voicemail')).toBeDefined());
  });

  it('shows empty ghost state when no leadId provided', () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ activities: [] }) });
    renderWithRouter(<LeadTimeline />);
    // no fetch triggered without resolvedId — ghost state shown immediately
    expect(screen.getByText('No activities yet')).toBeDefined();
  });

  it('Add Note button toggles form', () => {
    renderWithRouter(<LeadTimeline leadId="lead-123" />);
    const btn = screen.getByLabelText('Add note');
    fireEvent.click(btn);
    expect(screen.getByLabelText('Note content')).toBeDefined();
  });

  it('resolves leadId from URL search param', async () => {
    renderWithRouter(<LeadTimeline />, '/?leadId=lead-456');
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/leads/lead-456/timeline')
      )
    );
  });
});
