import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MultiStepFormProgressBar } from './MultiStepFormProgressBar';

describe('MultiStepFormProgressBar Component', () => {
  it('renders multi-step progress bar and marks completed steps with checkmark', () => {
    render(<MultiStepFormProgressBar currentStep={2} />);
    expect(screen.getByTestId('multi-step-form-progress-bar')).toBeDefined();
    expect(screen.getByText('Client KYC')).toBeDefined();
    expect(screen.getByText('Unit Selection')).toBeDefined();
    expect(screen.getByText('Payment Schedule')).toBeDefined();
    expect(screen.getByText('Form B Execution')).toBeDefined();
    expect(screen.getByText('✓')).toBeDefined();
  });
});
