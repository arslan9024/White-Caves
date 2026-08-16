import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionConfettiTrigger } from './TransactionConfettiTrigger';

describe('TransactionConfettiTrigger Component', () => {
  it('renders deal closure celebration and triggers dismissal handler', () => {
    const onDismiss = vi.fn();
    render(
      <TransactionConfettiTrigger 
        dealTitle="Sky Villa Penthouse" 
        dealAmount="AED 95,000,000" 
        onDismiss={onDismiss} 
      />
    );
    expect(screen.getByTestId('transaction-confetti-trigger')).toBeDefined();
    expect(screen.getByText(/TRANSACTION CLOSED/i)).toBeDefined();
    expect(screen.getByText(/Sky Villa Penthouse/i)).toBeDefined();
    expect(screen.getByText(/AED 95,000,000/i)).toBeDefined();

    const continueBtn = screen.getByText(/✓ Continue to Conveyancing/i);
    fireEvent.click(continueBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
