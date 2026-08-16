import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PoaValidationPortal } from './PoaValidationPortal';

describe('PoaValidationPortal Component', () => {
  it('renders POA notary document validation portal and verifies legal capacity', () => {
    render(<PoaValidationPortal />);
    expect(screen.getByTestId('poa-validation-portal')).toBeDefined();
    expect(screen.getByText(/Power of Attorney \(POA\) Notary Verification Portal/i)).toBeDefined();
    expect(screen.getByText(/DUBAI COURTS NOTARY/i)).toBeDefined();
    expect(screen.getByText(/POA Notarization Number/i)).toBeDefined();

    const verifyBtn = screen.getByRole('button', { name: /Verify POA Legal Capacity & 2-Year Rule/i });
    fireEvent.click(verifyBtn);
    expect(screen.getByText(/POA Status: LEGAL & ACTIVE/i)).toBeDefined();
    expect(screen.getByText(/DLD TRUSTEE READY/i)).toBeDefined();
    expect(screen.getByText(/RERA Conveyancing Directive:/i)).toBeDefined();
  });
});
