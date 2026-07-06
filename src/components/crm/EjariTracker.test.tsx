import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EjariTracker, { type EjariLease } from './EjariTracker';

// ── Mocks ─────────────────────────────────────────────────────────────────
const mockAuthFetch = vi.hoisted(() => vi.fn());
vi.mock('../../utils/authFetch', () => ({ authFetch: mockAuthFetch }));

// ── Fixtures ──────────────────────────────────────────────────────────────

function makeLease(overrides: Partial<EjariLease> = {}): EjariLease {
  return {
    id: 'lease-001',
    tenantName: 'Alice Ahmed',
    propertyAddress: 'Unit 4B, Downtown Dubai',
    ejariNumber: 'EJ-2025-0001',
    ejariStatus: 'registered',
    ejariRegistrationDate: '2025-01-15T00:00:00Z',
    ejariExpiryDate: '2026-01-14T00:00:00Z',
    ...overrides,
  };
}

// ── 1. Loading state ───────────────────────────────────────────────────────
describe('EjariTracker — loading state', () => {
  it('shows loading indicator while fetching', () => {
    mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
    render(<EjariTracker />);
    expect(screen.getByRole('status', { name: /loading ejari/i })).toBeTruthy();
  });
});

// ── 2. Error state ────────────────────────────────────────────────────────
describe('EjariTracker — error state', () => {
  it('shows error message when fetch fails', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));
    render(<EjariTracker />);
    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /ejari load error/i })).toBeTruthy();
    });
    expect(screen.getByText(/network error/i)).toBeTruthy();
  });
});

// ── 3. Empty state ────────────────────────────────────────────────────────
describe('EjariTracker — empty state', () => {
  it('shows empty message when no leases are returned', async () => {
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    render(<EjariTracker />);
    await waitFor(() => {
      expect(screen.getByText(/no leases found/i)).toBeTruthy();
    });
  });

  it('shows empty message when leases prop is an empty array', () => {
    render(<EjariTracker leases={[]} />);
    expect(screen.getByText(/no leases found/i)).toBeTruthy();
  });
});

// ── 4. Rendering leases ───────────────────────────────────────────────────
describe('EjariTracker — renders lease rows', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all columns for a registered lease', () => {
    const lease = makeLease();
    render(<EjariTracker leases={[lease]} />);

    expect(screen.getByText('Alice Ahmed')).toBeTruthy();
    expect(screen.getByText('Unit 4B, Downtown Dubai')).toBeTruthy();
    expect(screen.getByText('EJ-2025-0001')).toBeTruthy();
    expect(screen.getByLabelText(/ejari status: registered/i)).toBeTruthy();
  });

  it('shows "—" when ejariNumber is null', () => {
    render(<EjariTracker leases={[makeLease({ ejariNumber: null })]} />);
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1);
  });

  it('renders multiple rows', () => {
    const leases = [
      makeLease({ id: 'l-1', tenantName: 'Alice' }),
      makeLease({ id: 'l-2', tenantName: 'Bob' }),
    ];
    render(<EjariTracker leases={leases} />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('flags a lease expiring within 30 days', () => {
    const soon = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const lease = makeLease({ ejariExpiryDate: soon });
    const { container } = render(<EjariTracker leases={[lease]} />);
    const row = container.querySelector('[data-expiring="true"]');
    expect(row).toBeTruthy();
  });

  it('does not flag a lease expiring in more than 30 days', () => {
    const far = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
    const lease = makeLease({ ejariExpiryDate: far });
    const { container } = render(<EjariTracker leases={[lease]} />);
    const row = container.querySelector('[data-expiring="false"]');
    expect(row).toBeTruthy();
  });

  it('disables "Mark Registered" button for already-registered lease', () => {
    render(<EjariTracker leases={[makeLease({ ejariStatus: 'registered' })]} />);
    const btn = screen.getByRole('button', { name: /mark lease-001 as registered/i });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables "Mark Registered" for a pending lease', () => {
    render(<EjariTracker leases={[makeLease({ ejariStatus: 'pending' })]} />);
    const btn = screen.getByRole('button', { name: /mark lease-001 as registered/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

// ── 5. Update Ejari status ────────────────────────────────────────────────
describe('EjariTracker — update Ejari status', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls PATCH endpoint when "Mark Registered" is clicked', async () => {
    const user = userEvent.setup();
    const lease = makeLease({ ejariStatus: 'pending' });
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: { ...lease, ejariStatus: 'registered' } }),
    });

    render(<EjariTracker leases={[lease]} />);
    await user.click(screen.getByRole('button', { name: /mark lease-001 as registered/i }));

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/compliance/ejari/lease-001',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('updates badge to Registered after successful PATCH', async () => {
    const user = userEvent.setup();
    const lease = makeLease({ ejariStatus: 'pending' });
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: {} }),
    });

    render(<EjariTracker leases={[lease]} />);
    expect(screen.getByLabelText(/ejari status: pending/i)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /mark lease-001 as registered/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/ejari status: registered/i)).toBeTruthy();
    });
  });

  it('shows update error when PATCH returns success:false', async () => {
    const user = userEvent.setup();
    const lease = makeLease({ ejariStatus: 'pending' });
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: 'Permission denied' }),
    });

    render(<EjariTracker leases={[lease]} />);
    await user.click(screen.getByRole('button', { name: /mark lease-001 as registered/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /update error/i })).toBeTruthy();
    });
    expect(screen.getByText(/permission denied/i)).toBeTruthy();
  });

  it('shows update error when PATCH throws a network error', async () => {
    const user = userEvent.setup();
    const lease = makeLease({ ejariStatus: 'expired' });
    mockAuthFetch.mockRejectedValue(new Error('Timeout'));

    render(<EjariTracker leases={[lease]} />);
    await user.click(screen.getByRole('button', { name: /mark lease-001 as registered/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /update error/i })).toBeTruthy();
    });
  });
});

// ── 6. Data fetching (no initial leases prop) ─────────────────────────────
describe('EjariTracker — data fetching', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches leases from /api/compliance/leases?ejari=true on mount', async () => {
    const lease = makeLease();
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [lease] }),
    });

    render(<EjariTracker />);

    await waitFor(() => {
      expect(screen.getByText('Alice Ahmed')).toBeTruthy();
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/compliance/leases')
    );
  });

  it('does not fetch when leases prop is provided', () => {
    render(<EjariTracker leases={[makeLease()]} />);
    expect(mockAuthFetch).not.toHaveBeenCalled();
  });
});
