/**
 * White Caves Real Estate LLC - Customer Manager Unit & Integration Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CustomerManagerView } from './CustomerManagerView';
import {
  execute18StepPipelineTransition,
  validateCustomerKycRequirements,
} from './CustomerManager.workflow';
import { CANONICAL_CUSTOMERS } from './CustomerManager.data';

describe('CustomerManager Module Tests', () => {
  it('renders CustomerManagerView with title and metric cards', () => {
    render(<CustomerManagerView />);
    expect(screen.getByText(/Customer & Lead Management System/i)).toBeInTheDocument();
    expect(screen.getByTestId('metric-total-customers')).toBeInTheDocument();
    expect(screen.getByTestId('metric-qualified-leads')).toBeInTheDocument();
    expect(screen.getByTestId('metric-active-buyers')).toBeInTheDocument();
    expect(screen.getByTestId('metric-kyc-rate')).toBeInTheDocument();
  });

  it('filters customers when clicking category filters', () => {
    render(<CustomerManagerView />);
    const leadBtn = screen.getByTestId('filter-lead');
    fireEvent.click(leadBtn);
    expect(screen.getByText(/Tariq Mansoor/i)).toBeInTheDocument();
  });

  it('filters customers based on search query', () => {
    render(<CustomerManagerView />);
    const searchInput = screen.getByTestId('customer-search-input');
    fireEvent.change(searchInput, { target: { value: 'Hassan Al-Nuaimi' } });
    expect(screen.getByText(/Hassan Al-Nuaimi/i)).toBeInTheDocument();
  });

  it('opens detail modal when a customer card is clicked and closes it', () => {
    render(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-001');
    fireEvent.click(card);

    expect(screen.getByTestId('customer-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Hassan Al-Nuaimi/i).length).toBeGreaterThan(0);

    const closeBtn = screen.getByTestId('close-customer-modal');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('customer-detail-modal')).not.toBeInTheDocument();
  });

  it('advances customer to next step in 18-step transaction workflow', () => {
    render(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-002');
    fireEvent.click(card);

    const advanceBtn = screen.getByTestId('advance-step-btn');
    fireEvent.click(advanceBtn);
    expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
  });

  it('allows verifying KYC directly from the modal', () => {
    render(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-006');
    fireEvent.click(card);

    const verifyBtn = screen.getByTestId('verify-kyc-btn');
    fireEvent.click(verifyBtn);
    expect(screen.queryByTestId('verify-kyc-btn')).not.toBeInTheDocument();
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('logs a new touchpoint interaction via the modal form', () => {
    render(<CustomerManagerView />);
    const card = screen.getByTestId('customer-card-CUST-001');
    fireEvent.click(card);

    const noteInput = screen.getByTestId('interaction-note-input');
    const submitBtn = screen.getByTestId('add-interaction-btn');

    fireEvent.change(noteInput, { target: { value: 'Sent updated tenancy contract for review.' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Sent updated tenancy contract for review.')).toBeInTheDocument();
  });

  it('opens registration drawer and onboards a new customer', () => {
    render(<CustomerManagerView />);
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
});
