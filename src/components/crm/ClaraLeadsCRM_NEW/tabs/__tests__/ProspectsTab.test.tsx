/**
 * ProspectsTab.test.tsx — Batch 31
 * Comprehensive tests for ProspectsTab component
 * Covers: rendering, add lead form, filters, search, lead cards,
 *         engage/qualify/delete actions, empty state, form validation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ─── Mock useLeadsData hook ─────────────────────────────────────────────
const mockAddLead = vi.fn();
const mockUpdateLead = vi.fn();
const mockDeleteLead = vi.fn();
const mockSetFilterStatus = vi.fn();
const mockSetFilterStage = vi.fn();
const mockSetSearchQuery = vi.fn();
const mockUseLeadsData = vi.fn();

vi.mock('../../hooks/useLeadsData', () => ({
  useLeadsData: () => mockUseLeadsData(),
}));

import ProspectsTab from '../ProspectsTab';

// ─── Helpers ────────────────────────────────────────────────────────────
function makeLead(overrides: Record<string, unknown> = {}) {
  return {
    id: `lead-${Math.random().toString(36).slice(2)}`,
    name: 'Test Corp',
    type: 'commercial',
    size: 'medium',
    status: 'contacted',
    value: 50000,
    stage: 'initial_contact',
    email: 'test@corp.com',
    phone: '+1-555-0111',
    notes: 'Some notes',
    probability: 50,
    ...overrides,
  };
}

function defaultHookReturn(overrides: Record<string, unknown> = {}) {
  const leads = [
    makeLead({ id: 'lead-1', name: 'Alpha Corp', status: 'qualified', value: 150000, stage: 'proposal', email: 'alpha@corp.com' }),
    makeLead({ id: 'lead-2', name: 'Beta Inc', status: 'interested', value: 50000, stage: 'discovery', email: 'beta@inc.com' }),
    makeLead({ id: 'lead-3', name: 'Gamma LLC', status: 'contacted', value: 30000, stage: 'initial_contact' }),
  ];
  return {
    filteredLeads: leads,
    filterStatus: 'all',
    setFilterStatus: mockSetFilterStatus,
    filterStage: 'all',
    setFilterStage: mockSetFilterStage,
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery,
    addLead: mockAddLead,
    updateLead: mockUpdateLead,
    deleteLead: mockDeleteLead,
    stats: {
      totalLeads: 3,
      totalValue: 230000,
    },
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('ProspectsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLeadsData.mockReturnValue(defaultHookReturn());
    // Mock confirm for delete
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  // ── Rendering ──

  it('renders the Prospects & Leads heading', () => {
    render(<ProspectsTab />);
    expect(screen.getByText('Prospects & Leads')).toBeInTheDocument();
  });

  it('displays summary stats', () => {
    render(<ProspectsTab />);
    expect(screen.getByText(/3 total/)).toBeInTheDocument();
    expect(screen.getByText(/\$230K pipeline/)).toBeInTheDocument();
  });

  it('renders the + Add Lead button', () => {
    render(<ProspectsTab />);
    expect(screen.getByText('+ Add Lead')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<ProspectsTab />);
    expect(screen.getByPlaceholderText('Search leads...')).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    render(<ProspectsTab />);
    // "All Status" default option
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
  });

  it('renders stage filter dropdown', () => {
    render(<ProspectsTab />);
    expect(screen.getByDisplayValue('All Stages')).toBeInTheDocument();
  });

  // ── Lead Cards ──

  it('renders all lead cards', () => {
    render(<ProspectsTab />);
    expect(screen.getByText('Alpha Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
    expect(screen.getByText('Gamma LLC')).toBeInTheDocument();
  });

  it('displays lead value', () => {
    render(<ProspectsTab />);
    expect(screen.getByText(/\$150,000/)).toBeInTheDocument();
  });

  it('displays lead stage with underscores replaced', () => {
    render(<ProspectsTab />);
    // Text 'initial contact' appears both in the select options and the lead card
    expect(screen.getAllByText('initial contact').length).toBeGreaterThanOrEqual(1);
  });

  it('displays lead probability', () => {
    render(<ProspectsTab />);
    expect(screen.getAllByText(/50%/).length).toBeGreaterThan(0);
  });

  it('displays lead email when present', () => {
    render(<ProspectsTab />);
    expect(screen.getByText(/alpha@corp\.com/)).toBeInTheDocument();
  });

  it('renders Engage, Qualify, and Delete buttons on each card', () => {
    render(<ProspectsTab />);
    const engageButtons = screen.getAllByText('Engage');
    const qualifyButtons = screen.getAllByText('Qualify');
    const deleteButtons = screen.getAllByText('Delete');
    expect(engageButtons.length).toBe(3);
    expect(qualifyButtons.length).toBe(3);
    expect(deleteButtons.length).toBe(3);
  });

  // ── Lead Actions ──

  it('calls updateLead with "interested" when Engage is clicked', () => {
    render(<ProspectsTab />);
    const engageButtons = screen.getAllByText('Engage');
    fireEvent.click(engageButtons[0]);
    expect(mockUpdateLead).toHaveBeenCalledWith('lead-1', { status: 'interested' });
  });

  it('calls updateLead with "qualified" when Qualify is clicked', () => {
    render(<ProspectsTab />);
    const qualifyButtons = screen.getAllByText('Qualify');
    fireEvent.click(qualifyButtons[1]);
    expect(mockUpdateLead).toHaveBeenCalledWith('lead-2', { status: 'qualified' });
  });

  it('calls deleteLead when Delete is clicked and confirmed', () => {
    render(<ProspectsTab />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(window.confirm).toHaveBeenCalledWith('Delete this lead?');
    expect(mockDeleteLead).toHaveBeenCalledWith('lead-1');
  });

  it('does not delete when confirm is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ProspectsTab />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteLead).not.toHaveBeenCalled();
  });

  // ── Filters ──

  it('calls setSearchQuery on search input change', async () => {
    render(<ProspectsTab />);
    const search = screen.getByPlaceholderText('Search leads...');
    await userEvent.type(search, 'Alpha');
    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  it('calls setFilterStatus on status dropdown change', () => {
    render(<ProspectsTab />);
    const statusSelect = screen.getByDisplayValue('All Status');
    fireEvent.change(statusSelect, { target: { value: 'qualified' } });
    expect(mockSetFilterStatus).toHaveBeenCalledWith('qualified');
  });

  it('calls setFilterStage on stage dropdown change', () => {
    render(<ProspectsTab />);
    const stageSelect = screen.getByDisplayValue('All Stages');
    fireEvent.change(stageSelect, { target: { value: 'proposal' } });
    expect(mockSetFilterStage).toHaveBeenCalledWith('proposal');
  });

  // ── Add Lead Form ──

  it('shows form when + Add Lead is clicked', () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));
    expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('hides form when Cancel is clicked', () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));
    expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Company Name')).not.toBeInTheDocument();
  });

  it('shows all form fields', () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));
    expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Deal Value')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument();
  });

  it('calls addLead on form submission with valid data', async () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));

    const nameInput = screen.getByPlaceholderText('Company Name');
    await userEvent.type(nameInput, 'New Corp');

    const form = nameInput.closest('form')!;
    fireEvent.submit(form);

    expect(mockAddLead).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Corp',
      type: 'commercial',
      size: 'medium',
      status: 'contacted',
      stage: 'initial_contact',
    }));
  });

  it('resets form after successful submission', async () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));

    await userEvent.type(screen.getByPlaceholderText('Company Name'), 'New Corp');
    const form = screen.getByPlaceholderText('Company Name').closest('form')!;
    fireEvent.submit(form);

    // Form should be hidden after submission
    expect(screen.queryByPlaceholderText('Company Name')).not.toBeInTheDocument();
  });

  it('updates form fields on change', async () => {
    render(<ProspectsTab />);
    fireEvent.click(screen.getByText('+ Add Lead'));

    const emailInput = screen.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'test@new.com');
    expect(emailInput).toHaveValue('test@new.com');
  });

  // ── Empty State ──

  it('shows empty state when no leads match', () => {
    mockUseLeadsData.mockReturnValue(defaultHookReturn({ filteredLeads: [] }));
    render(<ProspectsTab />);
    expect(screen.getByText(/No leads found/)).toBeInTheDocument();
  });

  // ── Lead Card Details ──

  it('shows phone when present', () => {
    render(<ProspectsTab />);
    // All 3 leads have same phone, and text includes emoji prefix
    expect(screen.getAllByText(/\+1-555-0111/).length).toBeGreaterThan(0);
  });

  it('shows notes when present', () => {
    render(<ProspectsTab />);
    // All 3 leads have "Some notes", and text includes emoji prefix
    expect(screen.getAllByText(/Some notes/).length).toBeGreaterThan(0);
  });
});
