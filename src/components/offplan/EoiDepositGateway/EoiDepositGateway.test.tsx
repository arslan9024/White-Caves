import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EoiDepositGateway } from './EoiDepositGateway';

describe('EoiDepositGateway Component', () => {
  it('renders EOI token deposit gateway and locks priority queue', () => {
    render(<EoiDepositGateway />);
    expect(screen.getByTestId('eoi-deposit-gateway')).toBeDefined();
    expect(screen.getByText(/Launch Day EOI Token & Deposit Collection Gateway/i)).toBeDefined();
    expect(screen.getByText(/TOKENIZED ALLOCATION/i)).toBeDefined();
    expect(screen.getByText(/Refundable EOI Token/i)).toBeDefined();
    expect(screen.getAllByText(/50,000/i).length).toBeGreaterThan(0);

    const payBtn = screen.getByRole('button', { name: /Secure Launch Priority/i });
    fireEvent.click(payBtn);
    expect(screen.getByText(/EOI Token Received & Priority Queue Locked!/i)).toBeDefined();
  });
});
