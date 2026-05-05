import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LeasingAcquisition } from './LeasingAcquisition';

// ── minimal Redux store (LeasingAcquisition renders without Redux but Provider avoids warnings) ──

const makeStore = () =>
  configureStore({
    reducer: { _placeholder: (s: null = null) => s },
  });

const renderPage = () =>
  render(
    <Provider store={makeStore()}>
      <LeasingAcquisition />
    </Provider>
  );

// ── helpers ─────────────────────────────────────────────────────────────────

/** Build a minimal fetch Response */
const makeResponse = (ok: boolean, body: Record<string, unknown> = {}): Response =>
  ({
    ok,
    status: ok ? 200 : 422,
    json: vi.fn().mockResolvedValue(body),
  }) as unknown as Response;

// ── initial fetch stub (empty inventory) ────────────────────────────────────

const emptyInventoryResponse = (): Response => makeResponse(true, { data: [] });

// ── suite ────────────────────────────────────────────────────────────────────

describe('LeasingAcquisition — Phase 37', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Default: initial inventory load returns empty list
    fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(emptyInventoryResponse());
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── rendering ───────────────────────────────────────────────────────────────

  it('renders the page heading', async () => {
    await act(async () => {
      renderPage();
    });
    expect(screen.getByText('Leasing Acquisition Pipeline')).toBeInTheDocument();
  });

  it('renders all 4 kanban column headings', async () => {
    await act(async () => {
      renderPage();
    });
    expect(screen.getByText('Draft Collected')).toBeInTheDocument();
    expect(screen.getByText('Verified Active')).toBeInTheDocument();
    expect(screen.getByText('Under Offer')).toBeInTheDocument();
    expect(screen.getByText('Leased / Sold')).toBeInTheDocument();
  });

  it('does NOT show a toast banner on initial load', async () => {
    await act(async () => {
      renderPage();
    });
    expect(screen.queryByTestId('leasing-toast')).not.toBeInTheDocument();
  });

  // ── handleStageChange success ────────────────────────────────────────────────

  it('shows success toast after stage update succeeds', async () => {
    // First call: inventory load (returns one draft_collected property)
    const property = {
      id: 'prop-1',
      inventoryStage: 'draft_collected',
      title: 'Test Villa',
      location: 'Dubai',
      price: '1200000',
      status: 'active',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] })) // initial load
      .mockResolvedValueOnce(makeResponse(true, {})) // PATCH /stage
      .mockResolvedValueOnce(makeResponse(true, { data: [] })); // re-fetch

    await act(async () => {
      renderPage();
    });

    // Click "Move to Verified Active" button
    const moveBtn = screen.getByRole('button', { name: /Move to Verified Active/i });
    await act(async () => {
      fireEvent.click(moveBtn);
    });

    const toast = await screen.findByTestId('leasing-toast');
    expect(toast).toHaveTextContent('Stage updated successfully');
    expect(toast).toHaveAttribute('role', 'status');
  });

  it('shows error toast when stage update API returns error', async () => {
    const property = {
      id: 'prop-2',
      inventoryStage: 'draft_collected',
      title: 'Unit B',
      location: 'Marina',
      price: '900000',
      status: 'active',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockResolvedValueOnce(makeResponse(false, { error: 'Permission denied' }))
      .mockResolvedValueOnce(makeResponse(true, { data: [] }));

    await act(async () => {
      renderPage();
    });

    const moveBtn = screen.getByRole('button', { name: /Move to Verified Active/i });
    await act(async () => {
      fireEvent.click(moveBtn);
    });

    const toast = await screen.findByTestId('leasing-toast');
    expect(toast).toHaveTextContent('Permission denied');
    expect(toast).toHaveAttribute('role', 'alert');
  });

  it('shows error toast when stage update throws (network error)', async () => {
    const property = {
      id: 'prop-3',
      inventoryStage: 'verified_active',
      title: 'Unit C',
      location: 'JVC',
      price: '700000',
      status: 'active',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockRejectedValueOnce(new Error('Network failure'));

    await act(async () => {
      renderPage();
    });

    const moveBtn = screen.getByRole('button', { name: /Move to Under Offer/i });
    await act(async () => {
      fireEvent.click(moveBtn);
    });

    const toast = await screen.findByTestId('leasing-toast');
    expect(toast).toHaveTextContent('Error updating stage');
    expect(toast).toHaveAttribute('role', 'alert');
  });

  // ── handleHandover success / error ──────────────────────────────────────────

  it('shows success toast after handover succeeds', async () => {
    const property = {
      id: 'prop-4',
      inventoryStage: 'leased_sold',
      title: 'Leased Unit',
      location: 'Downtown',
      price: '1500000',
      status: 'leased',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockResolvedValueOnce(makeResponse(true, {}))
      .mockResolvedValueOnce(makeResponse(true, { data: [] }));

    await act(async () => {
      renderPage();
    });

    const handoverBtn = screen.getByRole('button', { name: /Complete Handover/i });
    await act(async () => {
      fireEvent.click(handoverBtn);
    });

    const toast = await screen.findByTestId('leasing-toast');
    expect(toast).toHaveTextContent('Key Handover completed');
    expect(toast).toHaveAttribute('role', 'status');
  });

  it('shows error toast when handover API fails', async () => {
    const property = {
      id: 'prop-5',
      inventoryStage: 'leased_sold',
      title: 'Villa X',
      location: 'Palm',
      price: '5000000',
      status: 'leased',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockResolvedValueOnce(makeResponse(false, {}));

    await act(async () => {
      renderPage();
    });

    const handoverBtn = screen.getByRole('button', { name: /Complete Handover/i });
    await act(async () => {
      fireEvent.click(handoverBtn);
    });

    const toast = await screen.findByTestId('leasing-toast');
    expect(toast).toHaveTextContent('Failed to complete handover');
    expect(toast).toHaveAttribute('role', 'alert');
  });

  // ── never calls window.alert() ──────────────────────────────────────────────

  it('never calls window.alert() on any user action', async () => {
    const property = {
      id: 'prop-6',
      inventoryStage: 'draft_collected',
      title: 'Unit D',
      location: 'Business Bay',
      price: '800000',
      status: 'active',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockResolvedValueOnce(makeResponse(true, {}))
      .mockResolvedValueOnce(makeResponse(true, { data: [] }));

    await act(async () => {
      renderPage();
    });

    const moveBtn = screen.getByRole('button', { name: /Move to Verified Active/i });
    await act(async () => {
      fireEvent.click(moveBtn);
    });

    expect(alertSpy).not.toHaveBeenCalled();
  });

  // ── toast data-testid presence ───────────────────────────────────────────────

  it('toast has data-testid="leasing-toast" after success action', async () => {
    const property = {
      id: 'prop-7',
      inventoryStage: 'leased_sold',
      title: 'Apt Y',
      location: 'Jumeirah',
      price: '1100000',
      status: 'leased',
    };
    fetchSpy
      .mockResolvedValueOnce(makeResponse(true, { data: [property] }))
      .mockResolvedValueOnce(makeResponse(true, {}))
      .mockResolvedValueOnce(makeResponse(true, { data: [] }));

    await act(async () => {
      renderPage();
    });

    const handoverBtn = screen.getByRole('button', { name: /Complete Handover/i });
    await act(async () => {
      fireEvent.click(handoverBtn);
    });

    expect(screen.getByTestId('leasing-toast')).toBeInTheDocument();
  });
});
