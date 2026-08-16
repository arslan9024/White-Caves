import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormErrorSummaryBanner } from './FormErrorSummaryBanner';

describe('FormErrorSummaryBanner Component', () => {
  it('renders nothing when errors array is empty, and displays errors list when errors exist', () => {
    const { rerender } = render(<FormErrorSummaryBanner errors={[]} />);
    expect(screen.queryByTestId('form-error-summary-banner')).toBeNull();

    rerender(
      <FormErrorSummaryBanner
        errors={[
          { fieldId: 'passport', message: 'Valid Emirates ID or Passport is required' },
          { fieldId: 'deposit', message: 'Security deposit must be greater than zero' },
        ]}
      />
    );
    expect(screen.getByTestId('form-error-summary-banner')).toBeDefined();
    expect(screen.getByText(/Please resolve 2 validation errors/i)).toBeDefined();
    expect(screen.getByText('Valid Emirates ID or Passport is required')).toBeDefined();
    expect(screen.getByText('Security deposit must be greater than zero')).toBeDefined();
  });
});
