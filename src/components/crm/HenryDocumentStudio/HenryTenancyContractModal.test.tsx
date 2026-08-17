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
    expect(screen.getByText(/Page 1: Contract Details/i)).toBeDefined();
    expect(screen.getByText(/1. Property & Owner/i)).toBeDefined();
    expect(screen.getByText(/2. Tenant KYC/i)).toBeDefined();
    expect(screen.getByText(/3. Lease & Terms/i)).toBeDefined();
    expect(screen.getByText(/4. Sign & Finalize/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<HenryTenancyContractModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('navigates between the 4 wizard steps cleanly', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    // Step 1 -> Step 2
    fireEvent.click(screen.getByText(/2. Tenant KYC/i));
    expect(screen.getByText(/Upload & Ingest Tenant Emirates ID or Passport/i)).toBeDefined();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByText(/3. Lease & Terms/i));
    expect(screen.getByText(/Lease Period & Financial Configuration/i)).toBeDefined();

    // Step 3 -> Step 4
    fireEvent.click(screen.getByText(/4. Sign & Finalize/i));
    expect(screen.getByText(/Legal Endorsement & Signatures/i)).toBeDefined();
  });

  it('loads sample preset and resets to blank template on button clicks', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    const loadSampleBtn = screen.getByText(/Load Sample Preset/i);
    fireEvent.click(loadSampleBtn);

    expect(screen.getAllByDisplayValue(/AKRAM DIB NEHME/i).length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue(/VIRIDIS A/i)).toBeDefined();
    expect(screen.getByDisplayValue(/504/i)).toBeDefined();

    const resetBlankBtn = screen.getByText(/Official Blank Template/i);
    fireEvent.click(resetBlankBtn);

    expect(screen.queryByDisplayValue(/AKRAM DIB NEHME/i)).toBeNull();
  });
});
