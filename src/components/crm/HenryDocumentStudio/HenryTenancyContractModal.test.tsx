import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryTenancyContractModal } from './HenryTenancyContractModal';
import henryTenancyContractTemplateService from '../../../services/HenryTenancyContractTemplateService';

describe('HenryTenancyContractModal — Interactive Split-Pane DLD Preparation Wizard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    henryTenancyContractTemplateService.resetDraft();
  });

  it('renders modal with split screen layout and DLD title when isOpen is true', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('henry-tenancy-modal')).toBeDefined();
    expect(screen.getByText(/Prepare New Tenancy Contract/i)).toBeDefined();
    expect(screen.getByText(/DLD Unified Form/i)).toBeDefined();
    expect(screen.getByText(/1. Property Specs/i)).toBeDefined();
    expect(screen.getByText(/2. Property Owner/i)).toBeDefined();
    expect(screen.getByText(/3. Tenant KYC/i)).toBeDefined();
    expect(screen.getByText(/4. Lease & Financials/i)).toBeDefined();
    expect(screen.getByText(/5. Sign & Finalize/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<HenryTenancyContractModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('navigates between the 5 wizard stages cleanly', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    // Stage 1 -> Stage 2 (Property Owner)
    fireEvent.click(screen.getByText(/2. Property Owner/i));
    expect(screen.getByText(/Stage 2: Property Owner & Lessor Contacts/i)).toBeDefined();

    // Stage 2 -> Stage 3 (Tenant KYC)
    fireEvent.click(screen.getByText(/3. Tenant KYC/i));
    expect(screen.getByText(/Stage 3: Tenant Information & KYC/i)).toBeDefined();

    // Stage 3 -> Stage 4 (Lease & Financials)
    fireEvent.click(screen.getByText(/4. Lease & Financials/i));
    expect(screen.getByText(/Stage 4: Contract Period & Financial Schedules/i)).toBeDefined();

    // Stage 4 -> Stage 5 (Sign & Finalize)
    fireEvent.click(screen.getByText(/5. Sign & Finalize/i));
    expect(screen.getByText(/Stage 5: Digital Endorsements & E-Sign Finalization/i)).toBeDefined();
  });

  it('loads Camelia 608 and Janusia XH2858B benchmark samples on button clicks', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    // Click Camelia 608 Sample
    const cameliaBtn = screen.getByText(/Camelia 608 Sample/i);
    fireEvent.click(cameliaBtn);
    expect(screen.getByDisplayValue(/CAMELIA/i)).toBeDefined();
    expect(screen.getByDisplayValue(/608/i)).toBeDefined();

    // Click Janusia XH2858B Sample
    const janusiaBtn = screen.getByText(/Janusia XH2858B Sample/i);
    fireEvent.click(janusiaBtn);
    expect(screen.getByDisplayValue(/Janusia/i)).toBeDefined();
    expect(screen.getByDisplayValue(/XH2858B/i)).toBeDefined();
    expect(screen.getByDisplayValue(/918014964/i)).toBeDefined();

    // Click Blank Template
    const blankBtn = screen.getByText(/Blank Template/i);
    fireEvent.click(blankBtn);
    expect(screen.queryByDisplayValue(/Janusia/i)).toBeNull();
  });
});
