/**
 * CadenceRuleAdmin tests — W18.1-P0-018
 *
 * Covers:
 *   - List rendering (loading, error, empty, populated)
 *   - Create rule flow
 *   - Toggle active/inactive
 *   - Edit rule flow
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockAuthFetch = vi.fn();

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import CadenceRuleAdmin from './CadenceRuleAdmin';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const RULE_FIXTURE = {
  id: 'rule-aabbccddee112233',
  name: 'Hot Lead Sequence',
  description: 'Rapid engagement for hot leads',
  isActive: true,
  priority: 10,
  leadTiers: ['hot'],
  leadSources: [],
  dealTypes: [],
  channelSequence: [
    { stepNumber: 1, channel: 'whatsapp', delayMs: 300000, templateName: 'hot_initial', description: 'First touch' },
  ],
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  dailyCapPerLead: 3,
  cooldownHours: 24,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

const RULE_FIXTURE_2 = {
  ...RULE_FIXTURE,
  id: 'rule-bbccddee11223344',
  name: 'Warm Lead Nurture',
  description: null,
  isActive: false,
  priority: 5,
  leadTiers: ['warm'],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CadenceRuleAdmin (W18.1-P0-018)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ───────────────────────────────────────────────────────────

  it('shows loading state initially', () => {
    mockAuthFetch.mockReturnValue(new Promise(() => undefined)); // never resolves
    render(<CadenceRuleAdmin />);
    expect(screen.getByLabelText('Loading cadence rules')).toBeInTheDocument();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('shows error message when loading fails', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent('Unauthorized');
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('shows empty state when no rules exist', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() =>
      expect(screen.getByText(/no cadence rules yet/i)).toBeInTheDocument(),
    );
  });

  // ── List rendering ──────────────────────────────────────────────────────────

  it('renders list of rules after load', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [RULE_FIXTURE, RULE_FIXTURE_2] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());
    expect(screen.getByText('Warm Lead Nurture')).toBeInTheDocument();
    expect(screen.getByText('Rapid engagement for hot leads')).toBeInTheDocument();
  });

  it('shows active/inactive status correctly', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [RULE_FIXTURE, RULE_FIXTURE_2] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());
    const activeCells = screen.getAllByText('Active');
    const inactiveCells = screen.getAllByText('Inactive');
    expect(activeCells.length).toBeGreaterThanOrEqual(1);
    expect(inactiveCells.length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct number of steps per rule', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [RULE_FIXTURE] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());
    expect(screen.getByText('1 steps')).toBeInTheDocument();
  });

  // ── Create flow ─────────────────────────────────────────────────────────────

  it('opens create form when New Rule button is clicked', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() =>
      expect(screen.getByLabelText('Create new cadence rule')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    expect(screen.getByLabelText('Create cadence rule form')).toBeInTheDocument();
    expect(screen.getByLabelText('Rule name')).toBeInTheDocument();
  });

  it('creates a new rule and adds it to the list', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: RULE_FIXTURE }) });

    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByLabelText('Create new cadence rule')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    fireEvent.change(screen.getByLabelText('Rule name'), { target: { value: 'Hot Lead Sequence' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Rule' }));

    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    const [createUrl, createOpts] = mockAuthFetch.mock.calls[1] as [string, RequestInit];
    expect(createUrl).toBe('/api/follow-ups/rules');
    expect(createOpts.method).toBe('POST');

    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());
  });

  it('shows submit error when create fails', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Name already exists' }) });

    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByLabelText('Create new cadence rule')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    fireEvent.change(screen.getByLabelText('Rule name'), { target: { value: 'Duplicate Rule' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Rule' }));

    await waitFor(() => expect(screen.getByText(/name already exists/i)).toBeInTheDocument());
  });

  it('closes form and does not create when Cancel is clicked', async () => {
    mockAuthFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByLabelText('Create new cadence rule')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Create new cadence rule'));
    expect(screen.getByLabelText('Create cadence rule form')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByLabelText('Create cadence rule form')).not.toBeInTheDocument();
    expect(mockAuthFetch).toHaveBeenCalledTimes(1); // only the initial load
  });

  // ── Toggle flow ─────────────────────────────────────────────────────────────

  it('deactivates a rule when Deactivate button is clicked', async () => {
    const deactivated = { ...RULE_FIXTURE, isActive: false };
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [RULE_FIXTURE] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: deactivated }) });

    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Deactivate Hot Lead Sequence'));

    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    const [toggleUrl, toggleOpts] = mockAuthFetch.mock.calls[1] as [string, RequestInit];
    expect(toggleUrl).toContain('/api/follow-ups/rules/rule-aabbccddee112233');
    expect(toggleOpts.method).toBe('PATCH');
    const body = JSON.parse(toggleOpts.body as string) as { isActive: boolean };
    expect(body.isActive).toBe(false);
  });

  it('activates an inactive rule when Activate button is clicked', async () => {
    const activated = { ...RULE_FIXTURE_2, isActive: true };
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [RULE_FIXTURE_2] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: activated }) });

    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Warm Lead Nurture')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Activate Warm Lead Nurture'));

    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    const body = JSON.parse((mockAuthFetch.mock.calls[1] as [string, RequestInit])[1].body as string) as { isActive: boolean };
    expect(body.isActive).toBe(true);
  });

  // ── Edit flow ───────────────────────────────────────────────────────────────

  it('opens edit form pre-populated with rule data', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [RULE_FIXTURE] }),
    });
    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Edit Hot Lead Sequence'));
    expect(screen.getByLabelText('Edit cadence rule form')).toBeInTheDocument();
    expect(screen.getByLabelText('Rule name')).toHaveValue('Hot Lead Sequence');
  });

  it('submits PATCH when editing an existing rule', async () => {
    const updated = { ...RULE_FIXTURE, name: 'Hot Lead Sequence v2' };
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [RULE_FIXTURE] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: updated }) });

    render(<CadenceRuleAdmin />);
    await waitFor(() => expect(screen.getByText('Hot Lead Sequence')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Edit Hot Lead Sequence'));
    fireEvent.change(screen.getByLabelText('Rule name'), { target: { value: 'Hot Lead Sequence v2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalledTimes(2));
    const [editUrl, editOpts] = mockAuthFetch.mock.calls[1] as [string, RequestInit];
    expect(editUrl).toContain('/api/follow-ups/rules/rule-aabbccddee112233');
    expect(editOpts.method).toBe('PATCH');

    await waitFor(() => expect(screen.getByText('Hot Lead Sequence v2')).toBeInTheDocument());
  });
});
