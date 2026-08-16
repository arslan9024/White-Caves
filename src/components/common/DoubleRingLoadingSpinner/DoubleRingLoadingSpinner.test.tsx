import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DoubleRingLoadingSpinner } from './DoubleRingLoadingSpinner';

describe('DoubleRingLoadingSpinner Component', () => {
  it('renders double ring loading spinner and label', () => {
    render(<DoubleRingLoadingSpinner size={56} label="Encrypting Vault Key..." />);
    expect(screen.getByTestId('double-ring-loading-spinner')).toBeDefined();
    expect(screen.getByText(/Encrypting Vault Key.../i)).toBeDefined();
  });
});
