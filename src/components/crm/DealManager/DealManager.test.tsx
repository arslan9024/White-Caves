// FILE: src/components/crm/DealManager/DealManager.test.tsx
/**
 * White Caves Real Estate LLC - Deal Manager Unit Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DealManagerView } from './DealManagerView';
import { CANONICAL_DEALS } from './DealManager.data';
import { executeValidateDealGates, calculateDealCommission } from './DealManager.workflow';
import { DealManagerFallback } from './DealManager.fallback';
import { DealTelemetry } from './DealManager.telemetry';
import { DEAL_TRANSLATIONS, getDealI18n } from './DealManager.i18n';
import {
  saveDealsCache,
  loadDealsCache,
  getDealByTuringId,
  indexDealsInMemory,
} from './DealManager.cache';
import { calculateDealFinancialsOffThread } from './DealManager.workers';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DealManager Suite (12-Way Co-Location Blueprint)', () => {
  beforeEach(() => {
    localStorage.clear();
    indexDealsInMemory(CANONICAL_DEALS);
    DealTelemetry.clear();
  });

  // --- Tier 1 & 2: Presentational & Logic Integration ---
  it('renders workspace title, metrics deck, and canonical deal cards', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    expect(screen.getByText(/Deal Tracking & Revenue Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Deals Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Gross Commission/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed Sales Volume/i)).toBeInTheDocument();

    expect(screen.getByText('DAMAC Hills 2 Luxury Villa Annual Lease')).toBeInTheDocument();
    expect(screen.getByTestId('deal-card-DEAL-001')).toBeInTheDocument();
  });

  it('filters deals by type toggle (Leasing vs Sales)', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const salesBtn = screen.getByTestId('toggle-type-sales');
    fireEvent.click(salesBtn);

    expect(
      screen.getByText('Palm Jumeirah Signature Beachfront Villa Acquisition')
    ).toBeInTheDocument();
    expect(screen.queryByText('DAMAC Hills 2 Luxury Villa Annual Lease')).not.toBeInTheDocument();
  });

  it('filters deals by search query', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const searchInput = screen.getByTestId('deal-search-input');
    fireEvent.change(searchInput, { target: { value: 'Il Primo' } });

    expect(screen.getByText('Il Primo Full-Floor Sky Penthouse Sale')).toBeInTheDocument();
    expect(screen.queryByText('DAMAC Hills 2 Luxury Villa Annual Lease')).not.toBeInTheDocument();
  });

  it('opens deal inspection detail modal and closes on button trigger', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const inspectBtn = screen.getByTestId('inspect-deal-DEAL-001');
    fireEvent.click(inspectBtn);

    expect(screen.getByTestId('deal-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/CHQ-1001/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hassan Al-Nuaimi/i).length).toBeGreaterThan(0);

    const closeBtn = screen.getByTestId('close-deal-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('deal-detail-modal')).not.toBeInTheDocument();
  });

  it('auto-opens detail modal when selectedDealId prop is provided (deep link)', () => {
    renderWithRouter(<DealManagerView selectedDealId="DEAL-003" initialDeals={CANONICAL_DEALS} />);

    expect(screen.getByTestId('deal-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Sir Arthur Pendelton/i).length).toBeGreaterThan(0);
  });

  it('advances deal stage via modal status select', () => {
    renderWithRouter(<DealManagerView selectedDealId="DEAL-002" initialDeals={CANONICAL_DEALS} />);

    const statusSelect = screen.getByTestId('deal-status-select');
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } });

    expect(screen.getAllByText(/Revenue Booked/i).length).toBeGreaterThan(0);
  });

  it('opens create drawer and registers a new deal', () => {
    renderWithRouter(<DealManagerView initialDeals={CANONICAL_DEALS} />);

    const createBtn = screen.getByTestId('create-deal-btn');
    fireEvent.click(createBtn);

    expect(screen.getByTestId('deal-edit-drawer')).toBeInTheDocument();

    const titleInput = screen.getByTestId('deal-title-input');
    fireEvent.change(titleInput, { target: { value: 'Downtown Dubai Penthouse Lease' } });

    const clientInput = screen.getByTestId('deal-client-input');
    fireEvent.change(clientInput, { target: { value: 'Karim Benzema' } });

    const saveBtn = screen.getByTestId('save-deal-btn');
    fireEvent.click(saveBtn);

    expect(screen.queryByTestId('deal-edit-drawer')).not.toBeInTheDocument();
    expect(screen.getByText('Downtown Dubai Penthouse Lease')).toBeInTheDocument();
  });

  // --- Tier 7: Stateless Workflow Chains ---
  it('validates deal gates correctly in workflow', () => {
    const completedDeal = CANONICAL_DEALS[0];
    const result = executeValidateDealGates(completedDeal);

    expect(result.gates.titleDeedGate).toBe(true);
    expect(result.gates.kycGate).toBe(true);
    expect(result.gates.offerGate).toBe(true);
    expect(result.gates.pdcScheduleGate).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('calculates deal commission and UAE VAT correctly', () => {
    const leasingCalc = calculateDealCommission(180000, 'LEASING');
    expect(leasingCalc.commissionAED).toBe(9000); // 5%
    expect(leasingCalc.vatAED).toBe(450); // 5% VAT on commission

    const salesCalc = calculateDealCommission(45000000, 'SALES');
    expect(salesCalc.commissionAED).toBe(900000); // 2%
    expect(salesCalc.vatAED).toBe(45000);
  });

  // --- Tier 8: Granular Failure Boundaries ---
  it('renders DealManagerFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <DealManagerFallback
        error="DLD Gateway Ejari Handshake Timeout"
        errorId="ERR-DLD-504"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('deal-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-DLD-504')).toBeInTheDocument();
    expect(screen.getByText(/DLD Gateway Ejari Handshake Timeout/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('deal-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('deal-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks telemetry events and delivers to queue with non-blocking dispatch', () => {
    DealTelemetry.track('ESCROW_AUDIT', {
      dealId: 'DEAL-001',
      actorRole: 'MANAGING_DIRECTOR',
      valueAED: 180000,
    });

    const events = DealTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('ESCROW_AUDIT');
    expect(lastEvent.dealId).toBe('DEAL-001');
    expect(lastEvent.valueAED).toBe(180000);
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getDealI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('الصفقات');
    expect(arI18n.stages.COMPLETED).toContain('إتمام');

    const enI18n = getDealI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Deals');

    const esI18n = getDealI18n('es');
    expect(esI18n.workspaceTitle).toContain('Operaciones');

    const ruI18n = getDealI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Сделок');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists deals cache and provides O(1) lookups by Turing ID', () => {
    saveDealsCache(CANONICAL_DEALS);
    const cached = loadDealsCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(CANONICAL_DEALS.length);

    const lookupById = getDealByTuringId('DEAL-001');
    expect(lookupById).toBeDefined();
    expect(lookupById?.clientName).toBe('Hassan Al-Nuaimi');

    const lookupByDealNumber = getDealByTuringId('WC-D-2026-001');
    expect(lookupByDealNumber?.id).toBe('DEAL-001');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('computes deal financials off-thread with 5% VAT and +500 XP bonus', async () => {
    const result = await calculateDealFinancialsOffThread({
      dealId: 'DEAL-001',
      valueAED: 200000,
      dealType: 'LEASING',
      commissionRate: 5,
    });

    expect(result.dealId).toBe('DEAL-001');
    expect(result.grossCommissionAED).toBe(10000); // 5% of 200k
    expect(result.vatAmountAED).toBe(500); // 5% VAT on 10k
    expect(result.netCommissionAED).toBe(9500);
    expect(result.meritBonusXp).toBe(500); // Law 10: Gamified Merit XP
    expect(result.complianceAttestationToken).toContain('ATTEST-FTA-DEAL-001');
  });
});
