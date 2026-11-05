/**
 * White Caves Real Estate LLC - Statutory Wizards Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatutoryWizardModal } from './StatutoryWizardModal';

describe('StatutoryWizardModal Component', () => {
  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(
      <StatutoryWizardModal
        isOpen={false}
        onClose={handleClose}
        flowType="FORM_A_SELLER_AGREEMENT"
      />
    );

    expect(screen.queryByTestId('statutory-wizard-backdrop')).toBeNull();
  });

  it('renders Form A Seller Agreement step 1 correctly', () => {
    const handleClose = vi.fn();
    render(
      <StatutoryWizardModal
        isOpen={true}
        onClose={handleClose}
        flowType="FORM_A_SELLER_AGREEMENT"
        targetTitle="DAMAC Hills 2 Villa"
      />
    );

    expect(screen.getByTestId('statutory-wizard-modal')).toBeInTheDocument();
    expect(screen.getByText(/DLD Form A: Seller Agency Listing Agreement/i)).toBeInTheDocument();
    expect(screen.getByTestId('statutory-input-titleDeedNumber')).toBeInTheDocument();
    expect(screen.getByText(/Target Context: DAMAC Hills 2 Villa/i)).toBeInTheDocument();
  });

  it('advances through steps and fires onComplete with deliverable token', () => {
    const handleClose = vi.fn();
    const handleComplete = vi.fn();
    render(
      <StatutoryWizardModal
        isOpen={true}
        onClose={handleClose}
        onComplete={handleComplete}
        flowType="FORM_A_SELLER_AGREEMENT"
      />
    );

    // Step 1 -> Next
    const nextBtn = screen.getByTestId('statutory-next-btn');
    fireEvent.click(nextBtn);

    // Step 2
    expect(screen.getByText(/Step 2 of 3/i)).toBeInTheDocument();
    fireEvent.click(nextBtn);

    // Step 3
    expect(screen.getByText(/Step 3 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Attest & Issue Deliverable/i)).toBeInTheDocument();

    // Final step complete
    fireEvent.click(nextBtn);

    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        flowType: 'FORM_A_SELLER_AGREEMENT',
        resultToken: 'TRAKHEESI_PERMIT_AUTH_CONFIRMED',
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders Ejari Tenancy flow properly', () => {
    const handleClose = vi.fn();
    render(
      <StatutoryWizardModal
        isOpen={true}
        onClose={handleClose}
        flowType="EJARI_TENANCY_ATTESTATION"
      />
    );

    expect(screen.getByText(/Ejari Tenancy Contract Registration/i)).toBeInTheDocument();
    expect(screen.getByTestId('statutory-input-dewaPremiseNumber')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <StatutoryWizardModal
        isOpen={true}
        onClose={handleClose}
        flowType="PDC_CHEQUE_REGISTRATION"
      />
    );

    const closeBtn = screen.getByTestId('close-statutory-wizard');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
