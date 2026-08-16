import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessCardApprovalWorkflow } from './AccessCardApprovalWorkflow';

describe('AccessCardApprovalWorkflow Component', () => {
  it('renders access card request queue and authorizes pending RFID cards', () => {
    render(<AccessCardApprovalWorkflow />);
    expect(screen.getByTestId('access-card-approval-workflow')).toBeDefined();
    expect(screen.getByText(/Building Access Card & RFID Barrier Permit Workflow/i)).toBeDefined();
    expect(screen.getByText(/SECURITY INTEGRATION/i)).toBeDefined();
    expect(screen.getByText(/Sir Jonathan Hayes/i)).toBeDefined();
    expect(screen.getByText(/✓ ISSUED & ACTIVE/i)).toBeDefined();

    const authBtns = screen.getAllByRole('button', { name: /Authorize RFID Card/i });
    expect(authBtns.length).toBeGreaterThan(0);
    fireEvent.click(authBtns[0]);
    expect(screen.getAllByText(/✓ ISSUED & ACTIVE/i).length).toBe(2);
  });
});
