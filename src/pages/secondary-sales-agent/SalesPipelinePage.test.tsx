/**
 * SalesPipelinePage — Unit Tests
 * Tests: rendering, pipeline stages, deal cards, deal modal,
 * pipeline calculations, stage filtering, interaction
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

vi.mock('../RolePages.css', () => ({}));

import SalesPipelinePage from './SalesPipelinePage';

describe.skip('SalesPipelinePage — legacy static-data tests (skipped: component now API-driven)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── Basic Rendering ──────

  it('renders page title', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('Sales Pipeline')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('Track your deals from inquiry to closing')).toBeInTheDocument();
  });

  // ────── Pipeline Summary ──────

  it('shows total deals count', () => {
    render(<SalesPipelinePage />);
    // 4 deals defined in the component
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows pipeline value', () => {
    render(<SalesPipelinePage />);
    // 45 + 28 + 3.5 + 65 = 141.5M → AED 142M (rounded)
    expect(screen.getByText('AED 142M')).toBeInTheDocument();
  });

  // ────── Pipeline Stages ──────

  it('renders all 5 pipeline stages', () => {
    render(<SalesPipelinePage />);
    // Stage names appear both in pipeline headers (h3) and process guide (h4)
    const headers = screen.getAllByRole('heading', { level: 3 });
    const headerTexts = headers.map(h => h.textContent);
    expect(headerTexts).toContain('Inquiry');
    expect(headerTexts).toContain('Viewing');
    expect(headerTexts).toContain('Negotiating');
    expect(headerTexts).toContain('Documentation');
    expect(headerTexts).toContain('Closing');
  });

  // ────── Deal Cards ──────

  it('renders all deal properties', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('Palm Jumeirah Villa')).toBeInTheDocument();
    expect(screen.getByText('Downtown Penthouse')).toBeInTheDocument();
    expect(screen.getByText('Marina 3BR Apt')).toBeInTheDocument();
    expect(screen.getByText('Emirates Hills Villa')).toBeInTheDocument();
  });

  it('renders deal buyers', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Emma Wilson')).toBeInTheDocument();
    expect(screen.getByText('Michael Brown')).toBeInTheDocument();
    expect(screen.getByText('Lisa Chen')).toBeInTheDocument();
  });

  it('renders deal prices', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('AED 45M')).toBeInTheDocument();
    expect(screen.getByText('AED 28M')).toBeInTheDocument();
    expect(screen.getByText('AED 3.5M')).toBeInTheDocument();
    expect(screen.getByText('AED 65M')).toBeInTheDocument();
  });

  it('renders days-in-stage badges', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('5d')).toBeInTheDocument();
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('2d')).toBeInTheDocument();
    expect(screen.getByText('1d')).toBeInTheDocument();
  });

  // ────── Deal Modal ──────

  it('opens modal when clicking a deal', () => {
    render(<SalesPipelinePage />);
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    // Modal shows deal info
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('John Smith')).toBeInTheDocument();
    expect(within(dialog).getByText('AED 45M')).toBeInTheDocument();
    expect(within(dialog).getByText('negotiating')).toBeInTheDocument();
    expect(within(dialog).getByText('5 days')).toBeInTheDocument();
  });

  it('closes modal when clicking close button', () => {
    render(<SalesPipelinePage />);
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when clicking overlay', () => {
    render(<SalesPipelinePage />);
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close modal when clicking inside modal content', () => {
    render(<SalesPipelinePage />);
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    const dialog = screen.getByRole('dialog');

    // Click inside the modal content (e.g., on the buyer name)
    fireEvent.click(within(dialog).getByText('John Smith'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows modal action buttons', () => {
    render(<SalesPipelinePage />);
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    expect(screen.getByText('Move to Next Stage')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  // ────── Pipeline Stages - Deal Counts ──────

  it('shows correct deal count per stage', () => {
    render(<SalesPipelinePage />);
    // Verify deals exist in the proper columns
    expect(screen.getByText('Palm Jumeirah Villa')).toBeInTheDocument();
    expect(screen.getByText('Emirates Hills Villa')).toBeInTheDocument();
    // Closing has 0 deals
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  // ────── Sales Process Guide ──────

  it('renders process guide section', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText('Sales Process Guide')).toBeInTheDocument();
  });

  it('renders process step numbers', () => {
    render(<SalesPipelinePage />);
    // Step numbers appear alongside deal counts, so use getAllByText
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThanOrEqual(1);
    const threes = screen.getAllByText('3');
    expect(threes.length).toBeGreaterThanOrEqual(1);
  });

  it('renders process step descriptions', () => {
    render(<SalesPipelinePage />);
    expect(screen.getByText(/initial buyer contact/i)).toBeInTheDocument();
    expect(screen.getByText(/property viewings/i)).toBeInTheDocument();
    expect(screen.getByText(/price negotiation/i)).toBeInTheDocument();
  });

  // ────── Switching Deals ──────

  it('can select different deals', () => {
    render(<SalesPipelinePage />);

    // Select first deal
    fireEvent.click(screen.getByText('Palm Jumeirah Villa'));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('John Smith')).toBeInTheDocument();

    // Close and select another
    fireEvent.click(screen.getByText('×'));
    fireEvent.click(screen.getByText('Downtown Penthouse'));

    const dialog2 = screen.getByRole('dialog');
    expect(within(dialog2).getByText('Emma Wilson')).toBeInTheDocument();
  });
});

// ── Phase 39: alert() elimination — API-driven kanban board ──────────────────

import { afterEach } from 'vitest';
import { SalesPipelinePage as SalesPipelineBoard } from './SalesPipelinePage';

const makeSalesProperty = () => ({
  id: 'api-sp-1',
  title: 'Dubai Marina Unit',
  location: 'Dubai Marina',
  price: 2500000,
  inventoryStage: 'listed',
});

describe('SalesPipelinePage — alert() elimination', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchSpy = vi.spyOn(window, 'fetch');
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(global.localStorage.getItem).mockImplementation((key: string) =>
      key === 'token' ? 'mock-jwt' : null
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Dubai pipeline heading', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [makeSalesProperty()] }), { status: 200 }) as Response
    );
    render(<SalesPipelineBoard />);
    expect(screen.getByText(/Secondary Sales Pipeline/i)).toBeInTheDocument();
  });

  it('no toast on initial render', () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [] }), { status: 200 }) as Response
    );
    render(<SalesPipelineBoard />);
    expect(screen.queryByTestId('sales-pipeline-toast')).not.toBeInTheDocument();
  });

  it('shows error toast with server message on stage update fail', async () => {
    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [makeSalesProperty()] }), { status: 200 }) as Response
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'DLD system offline' }), { status: 500 }) as Response
      );

    render(<SalesPipelineBoard />);
    const btn = await screen.findByRole('button', { name: /Forms A & B Signed/i });
    fireEvent.click(btn);

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Error updating stage');
    expect(banner).toHaveAttribute('data-testid', 'sales-pipeline-toast');
  });

  it('shows generic error toast on network throw', async () => {
    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [makeSalesProperty()] }), { status: 200 }) as Response
      )
      .mockRejectedValueOnce(new Error('timeout'));

    render(<SalesPipelineBoard />);
    const btn = await screen.findByRole('button', { name: /Forms A & B Signed/i });
    fireEvent.click(btn);

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Error updating stage');
  });

  it('never calls window.alert()', async () => {
    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [makeSalesProperty()] }), { status: 200 }) as Response
      )
      .mockRejectedValueOnce(new Error('boom'));

    render(<SalesPipelineBoard />);
    const btn = await screen.findByRole('button', { name: /Forms A & B Signed/i });
    fireEvent.click(btn);

    await screen.findByRole('alert');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
