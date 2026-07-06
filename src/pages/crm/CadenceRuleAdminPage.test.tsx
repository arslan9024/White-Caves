/**
 * CadenceRuleAdminPage Tests — P0-018
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockAuthFetch = vi.fn();
vi.mock('../../hooks/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }));
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));
vi.mock('./styles/CrmPageStyles', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  ActionBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PrimaryButton: ({
    children,
    onClick,
    disabled,
    'aria-label': al,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label'?: string }) => (
    <button onClick={onClick} disabled={disabled} aria-label={al}>
      {children}
    </button>
  ),
  SecondaryButton: ({
    children,
    onClick,
    disabled,
    'aria-label': al,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label'?: string }) => (
    <button onClick={onClick} disabled={disabled} aria-label={al}>
      {children}
    </button>
  ),
}));

import CadenceRuleAdminPage from './CadenceRuleAdminPage';

const MOCK_RULES = [
  {
    id: 'rule-1',
    name: 'Hot Lead Nurture',
    description: '3-step hot lead sequence',
    isActive: true,
    priority: 10,
    leadTiers: ['hot'],
    leadSources: ['website'],
    channelSequence: [
      { channel: 'whatsapp', delayMs: 300000 },
      { channel: 'email', delayMs: 86400000 },
    ],
    createdAt: '2026-06-01T00:00:00.000Z',
  },
];

describe('CadenceRuleAdminPage — P0-018', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: MOCK_RULES }),
    });
  });

  it('renders page title and loads cadence rules', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cadence Rules/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Hot Lead Nurture')).toBeInTheDocument();
    });
  });

  it('shows rule priority and status', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByLabelText('Status: active')).toBeInTheDocument();
  });

  it('shows number of channel steps', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens create modal when New Rule button is clicked', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));
    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('New Cadence Rule')).toBeInTheDocument();
    });
  });

  it('opens edit modal when Edit button is clicked', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));
    fireEvent.click(screen.getByLabelText('Edit rule Hot Lead Nurture'));
    await waitFor(() => {
      expect(screen.getByText('Edit Cadence Rule')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Hot Lead Nurture')).toBeInTheDocument();
  });

  it('creates a new rule with valid name', async () => {
    const reloadData = [
      ...MOCK_RULES,
      {
        id: 'rule-2',
        name: 'Cold Lead Revival',
        description: null,
        isActive: true,
        priority: 0,
        leadTiers: [],
        leadSources: [],
        channelSequence: [{ channel: 'email', delayMs: 3600000 }],
        createdAt: '2026-06-19T00:00:00.000Z',
      },
    ];

    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: MOCK_RULES }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: reloadData[1] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: reloadData }) });

    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));

    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    await waitFor(() => screen.getByRole('dialog'));

    fireEvent.change(screen.getByLabelText('Rule Name *'), {
      target: { value: 'Cold Lead Revival' },
    });

    fireEvent.click(screen.getByLabelText('Create cadence rule'));
    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/follow-ups/rules',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('disables Save when rule name is empty', async () => {
    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));
    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    await waitFor(() => screen.getByRole('dialog'));

    const saveBtn = screen.getByLabelText('Create cadence rule');
    expect(saveBtn).toBeDisabled();
  });

  it('deactivates an active rule', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: MOCK_RULES }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Hot Lead Nurture'));

    fireEvent.click(screen.getByLabelText('Deactivate rule Hot Lead Nurture'));
    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/follow-ups/rules/rule-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  it('shows error banner on API failure', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    });

    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unauthorized');
    });
  });

  it('shows empty state when no rules exist', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(
      <MemoryRouter>
        <CadenceRuleAdminPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No cadence rules yet/i)).toBeInTheDocument();
    });
  });
});
