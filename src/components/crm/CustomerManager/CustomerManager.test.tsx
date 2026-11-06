// FILE: src/components/crm/CustomerManager/CustomerManager.test.tsx
/**
 * White Caves Real Estate LLC - Customer Manager Unit & Integration Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CustomerManagerView } from './CustomerManagerView';
import {
  execute18StepPipelineTransition,
  validateCustomerKycRequirements,
} from './CustomerManager.workflow';
import { CANONICAL_CUSTOMERS } from './CustomerManager.data';
import { CustomerManagerFallback } from './CustomerManager.fallback';
import { CustomerTelemetry } from './CustomerManager.telemetry';
import { getCustomerI18n } from './CustomerManager.i18n';
import {
  saveCustomersCache,
  loadCustomersCache,
  getCustomerByTuringId,
  indexCustomersInMemory,
} from './CustomerManager.cache';
import { calculateCustomerLeadScoreOffThread } from './CustomerManager.workers';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CustomerManager Module Tests (12-Way Blueprint)', () => {
  beforeEach(() => {
    localStorage.clear();
    indexCustomersInMemory(CANONICAL_CUSTOMERS);
    CustomerTelemetry.clear();
  });

  // --- Tier 1 & 2: View and Logic Integration ---
  it('renders CustomerManagerView with title and metric cards', () => {
    renderWithRouter(<CustomerManagerView />);
    expect(screen.getByText(/Customer & Lead Management System/i)).toBeInTheDocument();
    expect(screen.getByTestId('metric-total-customers')).toBeInTheDocument();
    expect(screen.getByTestId('metric-qualified-leads')).toBeInTheDocument();
    expect(screen.getByTestId('metric-active-buyers')).toBeInTheDocument();
    expect(screen.getByTestId('metric-kyc-rate')).toBeInTheDocument();
  });

  it('filters customers when clicking category filters', () => {
    renderWithRouter(<CustomerManagerView />);
    const leadBtn = screen.getByTestId('filter-lead');
    fireEvent.click(leadBtn);
    expect(screen.getByText(/Tariq Mansoor/i)).toBeInTheDocument();
  });

  it('filters customers based on search query', () => {
    renderWithRouter(<CustomerManagerView />);
    const searchInput = screen.getByTestId('customer-search-input');
    fireEvent.change(searchInput, { target: { value: 'Hassan Al-Nuaimi' } });
    expect(screen.getByText(/Hassan Al-Nuaimi/i)).toBeInTheDocument();
  });

  it('opens detail modal when a customer card is clicked and closes it', () => {
    renderWithRouter(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-001');
    fireEvent.click(card);

    expect(screen.getByTestId('customer-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Hassan Al-Nuaimi/i).length).toBeGreaterThan(0);

    const closeBtn = screen.getByTestId('close-customer-modal');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('customer-detail-modal')).not.toBeInTheDocument();
  });

  it('advances customer to next step in 18-step transaction workflow', () => {
    renderWithRouter(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-002');
    fireEvent.click(card);

    const advanceBtn = screen.getByTestId('advance-step-btn');
    fireEvent.click(advanceBtn);
    expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
  });

  it('allows verifying KYC directly from the modal', () => {
    renderWithRouter(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-006');
    fireEvent.click(card);

    const verifyBtn = screen.getByTestId('verify-kyc-btn');
    fireEvent.click(verifyBtn);
    expect(screen.queryByTestId('verify-kyc-btn')).not.toBeInTheDocument();
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('logs a new touchpoint interaction via the modal form', () => {
    renderWithRouter(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-001');
    fireEvent.click(card);

    const noteInput = screen.getByTestId('interaction-note-input');
    const submitBtn = screen.getByTestId('add-interaction-btn');

    fireEvent.change(noteInput, { target: { value: 'Sent updated tenancy contract for review.' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Sent updated tenancy contract for review.')).toBeInTheDocument();
  });

  it('opens registration drawer and onboards a new customer', () => {
    renderWithRouter(<CustomerManagerView />);
    const onboardBtn = screen.getByTestId('onboard-client-btn');
    fireEvent.click(onboardBtn);

    expect(screen.getByTestId('customer-registration-drawer')).toBeInTheDocument();

    const nameInput = screen.getByTestId('customer-name-input');
    const emailInput = screen.getByTestId('customer-email-input');
    const submitBtn = screen.getByTestId('submit-customer-btn');

    fireEvent.change(nameInput, { target: { value: 'Rashid Al-Maktoum' } });
    fireEvent.change(emailInput, { target: { value: 'rashid@maktoum.ae' } });
    fireEvent.click(submitBtn);

    expect(screen.queryByTestId('customer-registration-drawer')).not.toBeInTheDocument();
    expect(screen.getByText('Rashid Al-Maktoum')).toBeInTheDocument();
  });

  // --- Tier 7: Stateless Workflow Chains ---
  it('validates 18-step pipeline transition function correctly', () => {
    const invalidSkip = execute18StepPipelineTransition(1, 5);
    expect(invalidSkip.success).toBe(false);

    const validAdvance = execute18StepPipelineTransition(1, 2);
    expect(validAdvance.success).toBe(true);
    expect(validAdvance.nextStep).toBe(2);
    expect(validAdvance.nextStepName).toBe('INTAKE_AND_QUALIFICATION');
  });

  it('validates customer KYC requirements helper', () => {
    const validCustomer = CANONICAL_CUSTOMERS[0];
    const validation = validateCustomerKycRequirements(validCustomer);
    expect(validation.compliant).toBe(true);
    expect(validation.missingFields.length).toBe(0);
  });

  // --- Tier 8: Failure Boundary ---
  it('renders CustomerManagerFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <CustomerManagerFallback
        error="AML Sovereign Registry Timeout"
        errorId="ERR-CUST-503"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('customer-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-CUST-503')).toBeInTheDocument();
    expect(screen.getByText(/AML Sovereign Registry Timeout/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('customer-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('customer-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks customer telemetry events and delivers to queue with non-blocking dispatch', () => {
    CustomerTelemetry.track('KYC_AML_VERIFIED', {
      customerId: 'CUST-001',
      actorRole: 'MANAGING_DIRECTOR',
    });

    const events = CustomerTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('KYC_AML_VERIFIED');
    expect(lastEvent.customerId).toBe('CUST-001');
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getCustomerI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('العملاء');

    const enI18n = getCustomerI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Client');

    const esI18n = getCustomerI18n('es');
    expect(esI18n.workspaceTitle).toContain('Clientes');

    const ruI18n = getCustomerI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Клиентов');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists customers cache and provides O(1) lookups by Turing ID', () => {
    saveCustomersCache(CANONICAL_CUSTOMERS);
    const cached = loadCustomersCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(CANONICAL_CUSTOMERS.length);

    const lookupById = getCustomerByTuringId('CUST-001');
    expect(lookupById).toBeDefined();
    expect(lookupById?.fullName).toBe('Hassan Al-Nuaimi');

    const lookupByCode = getCustomerByTuringId('WC-CUST-001');
    expect(lookupByCode?.id).toBe('CUST-001');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('computes customer lead score off-thread with AML attestation', async () => {
    const result = await calculateCustomerLeadScoreOffThread({
      customerId: 'CUST-001',
      budgetAED: 5000000,
      currentStep: 15,
      interactionCount: 6,
      kycVerified: true,
    });

    expect(result.customerId).toBe('CUST-001');
    expect(result.intentScore).toBeGreaterThanOrEqual(70);
    expect(result.verificationToken).toContain('ATTEST-AML-CUST-001');
    expect(result.meritBonusXp).toBeGreaterThanOrEqual(100);
  });
});
