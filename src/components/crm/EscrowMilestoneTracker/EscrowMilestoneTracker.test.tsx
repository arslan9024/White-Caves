import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EscrowMilestoneTracker from './EscrowMilestoneTracker';

describe('EscrowMilestoneTracker Component', () => {
  it('renders project header, trustee bank, and compliance rating correctly', () => {
    render(<EscrowMilestoneTracker />);

    expect(screen.getByTestId('escrow-milestone-tracker')).toBeInTheDocument();
    expect(screen.getByText(/White Caves Reserve · Palm Crown Residence/i)).toBeInTheDocument();
    expect(screen.getByText(/Emirates NBD Escrow Trustee Division/i)).toBeInTheDocument();
    expect(screen.getByText(/Escrow Rating: AAA/i)).toBeInTheDocument();
    expect(screen.getByText(/Law No. 8 & 50\/2022 Compliant/i)).toBeInTheDocument();
  });

  it('renders all 5 milestone steps on the visual stepper track', () => {
    render(<EscrowMilestoneTracker />);

    expect(screen.getByTestId('escrow-stepper-track')).toBeInTheDocument();
    expect(screen.getByTestId('step-node-m1')).toBeInTheDocument();
    expect(screen.getByTestId('step-node-m2')).toBeInTheDocument();
    expect(screen.getByTestId('step-node-m3')).toBeInTheDocument();
    expect(screen.getByTestId('step-node-m4')).toBeInTheDocument();
    expect(screen.getByTestId('step-node-m5')).toBeInTheDocument();
  });

  it('switches selected milestone details on stepper node click', () => {
    render(<EscrowMilestoneTracker />);

    const stepNodeM2 = screen.getByTestId('step-node-m2');
    fireEvent.click(stepNodeM2);

    expect(screen.getByText(/DLD-MS-02: Raft Foundation & Substructure Completion/i)).toBeInTheDocument();
    expect(screen.getByText(/DLD-INSP-2026-02/i)).toBeInTheDocument();
  });

  it('triggers audit request and updates status to under_audit', () => {
    const handleAuditVerification = vi.fn();
    render(<EscrowMilestoneTracker onAuditVerification={handleAuditVerification} />);

    // Select m4 which is in_progress
    const stepNodeM4 = screen.getByTestId('step-node-m4');
    fireEvent.click(stepNodeM4);

    const auditBtn = screen.getByTestId('btn-request-audit');
    fireEvent.click(auditBtn);

    expect(handleAuditVerification).toHaveBeenCalledWith('m4');
    expect(screen.getByTestId('escrow-action-alert')).toBeInTheDocument();
    expect(screen.getByText(/DLD Law 50\/2022 Technical Audit requested/i)).toBeInTheDocument();
  });

  it('approves disbursement and clears funds from escrow', () => {
    const handleDisburseRequest = vi.fn();
    render(<EscrowMilestoneTracker onDisburseRequest={handleDisburseRequest} />);

    // Select m3 (under_audit)
    const stepNodeM3 = screen.getByTestId('step-node-m3');
    fireEvent.click(stepNodeM3);

    const approveBtn = screen.getByTestId('btn-approve-disbursement');
    fireEvent.click(approveBtn);

    expect(handleDisburseRequest).toHaveBeenCalledWith('m3', 3700000);
    expect(screen.getByTestId('escrow-action-alert')).toBeInTheDocument();
    expect(screen.getByText(/cleared for AED 3,700,000 release from Escrow/i)).toBeInTheDocument();
  });
});
