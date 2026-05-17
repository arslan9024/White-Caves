/**
 * TenantScreeningPage — Unit Tests
 * Tests: render, tab switching, screening checklist, pending applications,
 * guidelines/red flags, best practices, checkbox interaction, progress bars
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import TenantScreeningPage from './TenantScreeningPage';

const MOCK_TENANTS = [
  {
    id: 't1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@example.com',
    phone: '+971501111111',
    status: 'documents_pending',
    createdAt: '2026-04-01T00:00:00.000Z',
    income: 300000,
  },
  {
    id: 't2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+971502222222',
    status: 'under_review',
    createdAt: '2026-04-02T00:00:00.000Z',
    income: 216000,
  },
  {
    id: 't3',
    name: 'Mohammed Khan',
    email: 'mohammed@example.com',
    phone: '+971503333333',
    status: 'approved',
    createdAt: '2026-04-03T00:00:00.000Z',
    income: 540000,
  },
];

// ═══════════════════════════════════════════════════════════════════

describe('TenantScreeningPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: MOCK_TENANTS }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the page header', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Tenant Screening')).toBeDefined();
    expect(screen.getByText('Verify tenant credentials and manage applications')).toBeDefined();
  });

  it('renders all three tabs', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Screening Checklist')).toBeDefined();
    expect(screen.getByText('Pending Applications')).toBeDefined();
    expect(screen.getByText('Guidelines')).toBeDefined();
  });

  // ── Screening Checklist Tab (default) ──────────────────────────
  it('shows screening checklist tab by default', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Identity Verification')).toBeDefined();
    expect(screen.getByText('Employment & Income')).toBeDefined();
    expect(screen.getByText('Rental History')).toBeDefined();
  });

  it('renders all identity verification items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Valid Emirates ID')).toBeDefined();
    expect(screen.getByText('Valid Passport with UAE Visa')).toBeDefined();
    expect(screen.getByText(/Visa validity check/i)).toBeDefined();
  });

  it('renders all employment & income items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText(/Salary Certificate/i)).toBeDefined();
    expect(screen.getByText('Employment Contract')).toBeDefined();
    expect(screen.getByText(/Bank Statements/i)).toBeDefined();
  });

  it('renders all rental history items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Previous landlord reference')).toBeDefined();
    expect(screen.getByText('Previous tenancy contract')).toBeDefined();
    expect(screen.getByText(/No rental dispute history/i)).toBeDefined();
  });

  it('shows Required badges on required items', () => {
    render(<TenantScreeningPage />);
    const requiredBadges = screen.getAllByText('Required');
    // Identity: 3 required, Employment: 2 required (Certificate + Bank), Rental: 1 required (RDC)
    expect(requiredBadges.length).toBe(6);
  });

  it('renders checkboxes for all checklist items', () => {
    render(<TenantScreeningPage />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 3 identity + 3 employment + 3 rental = 9
    expect(checkboxes.length).toBe(9);
  });

  it('toggles checkbox state', () => {
    render(<TenantScreeningPage />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0] as HTMLInputElement;

    expect(firstCheckbox.checked).toBe(false);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
  });

  // ── Pending Applications Tab ───────────────────────────────────
  it('switches to Pending Applications tab', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText('Tenant Applications')).toBeDefined();
    });
  });

  it('shows all pending applications', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText('Ahmed Al-Rashid')).toBeDefined();
      expect(screen.getByText('Sarah Johnson')).toBeDefined();
      expect(screen.getByText('Mohammed Khan')).toBeDefined();
    });
  });

  it('shows email for each application', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText('ahmed@example.com')).toBeDefined();
      expect(screen.getByText('sarah@example.com')).toBeDefined();
      expect(screen.getByText('mohammed@example.com')).toBeDefined();
    });
  });

  it('shows income information', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText(/Income: AED 300,000\/yr/)).toBeDefined();
      expect(screen.getByText(/Income: AED 216,000\/yr/)).toBeDefined();
      expect(screen.getByText(/Income: AED 540,000\/yr/)).toBeDefined();
    });
  });

  it('shows status badges', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText('Documents pending')).toBeDefined();
      expect(screen.getByText('Under review')).toBeDefined();
      expect(screen.getByText('Approved')).toBeDefined();
    });
  });

  it('shows phone details', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      expect(screen.getByText(/Phone: \+971501111111/)).toBeDefined();
      expect(screen.getByText(/Phone: \+971502222222/)).toBeDefined();
      expect(screen.getByText(/Phone: \+971503333333/)).toBeDefined();
    });
  });

  it('shows added date details', async () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    await waitFor(() => {
      const addedLabels = screen.getAllByText(/Added:/);
      expect(addedLabels.length).toBe(3);
    });
  });

  // ── Guidelines Tab ─────────────────────────────────────────────
  it('switches to Guidelines tab', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));
    expect(screen.getByText('Red Flags to Watch')).toBeDefined();
    expect(screen.getByText('Best Practices')).toBeDefined();
  });

  it('shows all red flags', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    expect(screen.getByText('Salary less than 3x monthly rent')).toBeDefined();
    expect(screen.getByText('Visa expiring within 6 months')).toBeDefined();
    expect(screen.getByText('Previous rental disputes or evictions')).toBeDefined();
    expect(screen.getByText('Bounced cheques history')).toBeDefined();
    expect(screen.getByText('Inconsistent employment history')).toBeDefined();
  });

  it('shows warning icons for red flags', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    const flagIcons = screen.getAllByText('⚠️');
    expect(flagIcons.length).toBe(5);
  });

  it('shows all best practices', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    expect(
      screen.getByText('Always verify original documents before accepting copies')
    ).toBeDefined();
    expect(screen.getByText(/Check visa validity and employment status/i)).toBeDefined();
    expect(screen.getByText(/Contact previous landlords/i)).toBeDefined();
    expect(screen.getByText(/Verify salary through employment letter/i)).toBeDefined();
    expect(screen.getByText(/Run basic background check through DED/i)).toBeDefined();
  });

  // ── Tab Switching Round-trip ───────────────────────────────────
  it('switches between all tabs correctly', async () => {
    render(<TenantScreeningPage />);

    // Default is checklist
    expect(screen.getByText('Identity Verification')).toBeDefined();

    // Switch to applications
    fireEvent.click(screen.getByText('Pending Applications'));
    await waitFor(() => {
      expect(screen.getByText('Ahmed Al-Rashid')).toBeDefined();
    });

    // Switch to guidelines
    fireEvent.click(screen.getByText('Guidelines'));
    expect(screen.getByText('Red Flags to Watch')).toBeDefined();

    // Switch back to checklist
    fireEvent.click(screen.getByText('Screening Checklist'));
    expect(screen.getByText('Identity Verification')).toBeDefined();
  });

  // ── Active Tab Styling ─────────────────────────────────────────
  it('applies active class to current tab button', () => {
    render(<TenantScreeningPage />);
    const checklistTab = screen.getByText('Screening Checklist').closest('button');
    expect(checklistTab?.className).toContain('active');
  });

  it('moves active class when switching tabs', () => {
    render(<TenantScreeningPage />);

    fireEvent.click(screen.getByText('Pending Applications'));
    const appTab = screen.getByText('Pending Applications').closest('button');
    expect(appTab?.className).toContain('active');

    const checklistTab = screen.getByText('Screening Checklist').closest('button');
    expect(checklistTab?.className).not.toContain('active');
  });
});
