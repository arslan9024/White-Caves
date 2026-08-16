import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmlKycVerificationPanel } from './AmlKycVerificationPanel';

describe('AmlKycVerificationPanel Component', () => {
  it('renders AML KYC verification panel and triggers screening check', () => {
    render(<AmlKycVerificationPanel />);
    expect(screen.getByTestId('aml-kyc-verification-panel')).toBeDefined();
    expect(screen.getByText(/AML \/ KYC Verification Panel/i)).toBeDefined();
    expect(screen.getByText(/CBUAE AML 2024/i)).toBeDefined();
    expect(screen.getByText(/Run AML Screening/i)).toBeDefined();

    // Run AML Screening
    const verifyBtn = screen.getByText(/Run AML Screening/i);
    fireEvent.click(verifyBtn);
    expect(screen.getByText(/AML Risk Classification/i)).toBeDefined();
    expect(screen.getByText(/LOW RISK/i)).toBeDefined();
  });
});
