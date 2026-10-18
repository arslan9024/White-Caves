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
    expect(screen.getByText(/Official DLD Unified Template/i)).toBeDefined();
    expect(screen.getByText(/1. Title Deed & Unit/i)).toBeDefined();
    expect(screen.getByText(/2. Landlord KYC/i)).toBeDefined();
    expect(screen.getByText(/3. Tenant Docs/i)).toBeDefined();
    expect(screen.getByText(/4. Financials/i)).toBeDefined();
    expect(screen.getByText(/5. Special Terms/i)).toBeDefined();
    expect(screen.getByText(/6. Review & Export/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<HenryTenancyContractModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('navigates between the 6 wizard stages cleanly', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose} />);

    // Stage 1 -> Stage 2 (Landlord KYC)
    fireEvent.click(screen.getByText(/2. Landlord KYC/i));
    expect(screen.getByText(/Stage 2: Owner & Lessor Information/i)).toBeDefined();

    // Stage 2 -> Stage 3 (Tenant Docs)
    fireEvent.click(screen.getByText(/3. Tenant Docs/i));
    expect(screen.getByText(/Stage 3: Tenant Information & KYC/i)).toBeDefined();

    // Stage 3 -> Stage 4 (Financials)
    fireEvent.click(screen.getByText(/4. Financials/i));
    expect(screen.getByText(/Stage 4: Contract Period & Financial Schedules/i)).toBeDefined();

    // Stage 4 -> Stage 5 (Special Terms)
    fireEvent.click(screen.getByText(/5. Special Terms/i));
    expect(screen.getByText(/Stage 5: Additional Terms & Special Addenda/i)).toBeDefined();

    // Stage 5 -> Stage 6 (Review & Export)
    fireEvent.click(screen.getByText(/6. Review & Export/i));
    expect(screen.getByText(/Stage 6: Final Review & Document Export/i)).toBeDefined();
  });

  it('never replaces manually entered contract fields with benchmark samples and resets explicitly', () => {
    render(<HenryTenancyContractModal isOpen={true} onClose={mockOnClose}
      initialData={{ buildingName: 'SYNTHETIC BUILDING', propertyNo: 'TEST-42' }} />);

    // Click Camelia 608 Sample
    const cameliaBtn = screen.getByTitle(/Load benchmark sample: Camelia 608/i);
    fireEvent.click(cameliaBtn);
    expect(screen.getByText('Benchmark preview only. It cannot populate a live contract.')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(/CAMELIA/i)).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('SYNTHETIC BUILDING')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TEST-42')).toBeInTheDocument();

    // Click Janusia XH2858B Sample
    const janusiaBtn = screen.getByTitle(/Load benchmark sample: Janusia XH2858B/i);
    fireEvent.click(janusiaBtn);
    expect(screen.queryByDisplayValue(/Janusia|XH2858B|918014964/i)).not.toBeInTheDocument();
    expect(henryTenancyContractTemplateService.loadActiveDraft()).toMatchObject({
      buildingName: 'SYNTHETIC BUILDING', propertyNo: 'TEST-42',
    });

    // Click Blank Template
    const blankBtn = screen.getByTitle(/Reset to fresh blank official DLD template/i);
    fireEvent.click(blankBtn);
    expect(screen.queryByDisplayValue(/Janusia/i)).toBeNull();
    expect(screen.queryByDisplayValue('SYNTHETIC BUILDING')).not.toBeInTheDocument();
    expect(henryTenancyContractTemplateService.loadActiveDraft().buildingName).toBe('');
  });
});
