import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PdcEscalationPanel } from './PdcEscalationPanel';

// Mock apiClient to prevent real network calls
vi.mock('../../utils/apiClient', () => ({
  apiClient: {
    patch: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('PdcEscalationPanel (UAE Law 50/2022)', () => {
  it('renders cheque details and statutory dates', () => {
    render(
      <PdcEscalationPanel
        chequeNumber="CHQ-778899"
        chequeAmountAed={65000}
        drawerName="Ali Al-Falasi"
        bankName="Mashreq Bank"
        dishonourDate="2026-11-01T00:00:00.000Z"
      />
    );

    expect(screen.getByText('CHQ-778899')).toBeInTheDocument();
    expect(screen.getByText('65,000 AED')).toBeInTheDocument();
    expect(screen.getByText('Mashreq Bank')).toBeInTheDocument();
    expect(screen.getByText('Ali Al-Falasi')).toBeInTheDocument();
    expect(screen.getByText(/PDC_BOUNCED/)).toBeInTheDocument();
  });

  it('triggers escalation to formal notice', async () => {
    const handleEscalate = vi.fn();
    render(
      <PdcEscalationPanel
        chequeNumber="CHQ-1122"
        chequeAmountAed={30000}
        onEscalated={handleEscalate}
      />
    );

    const warnBtn = screen.getByRole('button', { name: /Dispatch 30-Day Legal Warning/i });
    fireEvent.click(warnBtn);

    await waitFor(() => {
      expect(screen.getByText(/FORMAL_NOTICE_ISSUED/)).toBeInTheDocument();
      expect(handleEscalate).toHaveBeenCalledWith('FORMAL_NOTICE_ISSUED');
    });
  });
});
