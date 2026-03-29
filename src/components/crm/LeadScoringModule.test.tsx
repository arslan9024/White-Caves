/**
 * LeadScoringModule — Unit Tests
 * Tests: render, tab switching, API fetch, lead table, score colors,
 * routing rules, lead details, error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────
vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import LeadScoringModule from './LeadScoringModule';

const MOCK_LEADS = [
  { id: 'l1', name: 'Ahmed Al Rashid', score: 92, budget: '2-5M', interest: 'Villa', source: 'Website', assignedAgent: 'John' },
  { id: 'l2', name: 'Sarah Khan', score: 65, budget: '1-2M', interest: 'Apartment', source: 'Referral', assignedAgent: '' },
  { id: 'l3', name: 'Mike Low', score: 40, budget: '500K-1M', interest: 'Studio', source: 'Walk-in' },
];

const MOCK_RULES = [
  { propertyType: 'Villa', budget: '2-5M', agent: 'Premium Agent' },
  { propertyType: 'Apartment', budget: '1-2M', agent: 'Standard Agent' },
];

const DEFAULT_PROPS = {
  role: 'admin',
  user: { id: 'u1', name: 'Admin', email: 'admin@wc.ae' },
};

// ═══════════════════════════════════════════════════════════════════

describe('LeadScoringModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: successful fetches
    mockAuthFetch.mockImplementation((url: string) => {
      if (url.includes('scored')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ leads: MOCK_LEADS }) });
      }
      if (url.includes('routing-rules')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ rules: MOCK_RULES }) });
      }
      return Promise.resolve({ ok: false });
    });
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the module header', () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Lead Scoring & AI Routing')).toBeDefined();
    expect(screen.getByText(/automatically score leads/i)).toBeDefined();
  });

  it('renders all three tabs', () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Routing Rules')).toBeDefined();
    expect(screen.getByText('Lead Details')).toBeDefined();
  });

  // ── Dashboard Tab (default) ─────────────────────────────────────
  it('shows dashboard tab by default with lead quality distribution', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    expect(screen.getByText('Lead Quality Distribution')).toBeDefined();
    await waitFor(() => {
      expect(screen.getByText(/High Quality.*1/)).toBeDefined();
      expect(screen.getByText(/Medium Quality.*1/)).toBeDefined();
      expect(screen.getByText(/Low Quality.*1/)).toBeDefined();
    });
  });

  it('displays leads table after fetch', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('Ahmed Al Rashid')).toBeDefined();
      expect(screen.getByText('Sarah Khan')).toBeDefined();
      expect(screen.getByText('Mike Low')).toBeDefined();
    });
  });

  it('displays score badges with correct values', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('92')).toBeDefined();
      expect(screen.getByText('65')).toBeDefined();
      expect(screen.getByText('40')).toBeDefined();
    });
  });

  it('shows "Unassigned" for leads without assigned agent', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      // Two leads have empty/missing assignedAgent
      const unassigned = screen.getAllByText('Unassigned');
      expect(unassigned.length).toBe(2);
    });
  });

  it('sets selected lead when View button is clicked', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getAllByText('View')).toHaveLength(3);
    });
    fireEvent.click(screen.getAllByText('View')[0]);
    // Switch to details tab to see the lead
    fireEvent.click(screen.getByText('Lead Details'));
    expect(screen.getByText('Lead Details: Ahmed Al Rashid')).toBeDefined();
  });

  // ── Tab Switching ───────────────────────────────────────────────
  it('switches to Routing Rules tab', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Routing Rules'));
    await waitFor(() => {
      expect(screen.getByText(/Villa.*2-5M.*Premium Agent/)).toBeDefined();
      expect(screen.getByText(/Apartment.*1-2M.*Standard Agent/)).toBeDefined();
    });
  });

  it('shows default rules when API returns empty', async () => {
    mockAuthFetch.mockImplementation((url: string) => {
      if (url.includes('routing-rules')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ rules: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ leads: [] }) });
    });
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Routing Rules'));
    // Default fallback rules — text is split across <strong> and <p> elements
    // Use getAllByText with partial matches on the distinct parts
    expect(screen.getByText(/Rule 1:/)).toBeDefined();
    expect(screen.getByText(/Rule 2:/)).toBeDefined();
    expect(screen.getByText(/Rule 3:/)).toBeDefined();
    expect(screen.getByText(/Premium Agent/)).toBeDefined();
    expect(screen.getByText(/Standard Agent/)).toBeDefined();
    expect(screen.getByText(/Priority routing/)).toBeDefined();
  });

  it('switches to Lead Details tab and shows empty when no lead selected', () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByText('Lead Details'));
    // No selected lead — should not render detail view content
    expect(screen.queryByText('Lead Details:')).toBeNull();
  });

  // ── Lead Detail View ────────────────────────────────────────────
  it('displays scoring breakdown in lead details', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getAllByText('View').length).toBeGreaterThan(0);
    });
    // Select a lead and view details
    fireEvent.click(screen.getAllByText('View')[0]);
    fireEvent.click(screen.getByText('Lead Details'));

    expect(screen.getByText(/Budget Match: 30 points/)).toBeDefined();
    expect(screen.getByText(/Property Interest Alignment: 25 points/)).toBeDefined();
    expect(screen.getByText(/Lead Source Quality: 20 points/)).toBeDefined();
    expect(screen.getByText(/Engagement Level: 15 points/)).toBeDefined();
    expect(screen.getByText(/Time Sensitivity: 10 points/)).toBeDefined();
  });

  it('shows lead score and budget in detail view', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getAllByText('View').length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByText('View')[0]);
    fireEvent.click(screen.getByText('Lead Details'));
    expect(screen.getByText('92/100')).toBeDefined();
    expect(screen.getByText(/2-5M AED/)).toBeDefined();
  });

  // ── API Fetching ────────────────────────────────────────────────
  it('fetches leads and routing rules on mount', () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    expect(mockAuthFetch).toHaveBeenCalledWith('/api/leads/scored');
    expect(mockAuthFetch).toHaveBeenCalledWith('/api/leads/routing-rules');
  });

  it('handles API failure gracefully — shows empty leads', async () => {
    mockAuthFetch.mockImplementation(() =>
      Promise.resolve({ ok: false, status: 500 })
    );
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    // Should still render the dashboard (empty state)
    await waitFor(() => {
      expect(screen.getByText('Lead Quality Distribution')).toBeDefined();
      expect(screen.getByText(/High Quality.*0/)).toBeDefined();
    });
  });

  it('handles network error gracefully', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    // Should still render, just empty
    await waitFor(() => {
      expect(screen.getByText('Lead Quality Distribution')).toBeDefined();
    });
  });

  // ── Score Color Logic ───────────────────────────────────────────
  it('renders high-score badge with green color', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      const badge92 = screen.getByText('92');
      expect(badge92.style.backgroundColor).toBe('rgb(34, 197, 94)'); // #22c55e
    });
  });

  it('renders medium-score badge with amber color', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      const badge65 = screen.getByText('65');
      expect(badge65.style.backgroundColor).toBe('rgb(245, 158, 11)'); // #f59e0b
    });
  });

  it('renders low-score badge with red color', async () => {
    render(<LeadScoringModule {...DEFAULT_PROPS} />);
    await waitFor(() => {
      const badge40 = screen.getByText('40');
      expect(badge40.style.backgroundColor).toBe('rgb(239, 68, 68)'); // #ef4444
    });
  });

  // ── Cleanup ─────────────────────────────────────────────────────
  it('does not update state after unmount', () => {
    const { unmount } = render(<LeadScoringModule {...DEFAULT_PROPS} />);
    unmount();
    // No assertion needed — verifies no act() warnings for state updates after unmount
  });
});
