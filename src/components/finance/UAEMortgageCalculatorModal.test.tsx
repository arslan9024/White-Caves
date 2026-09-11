import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UAEMortgageCalculatorModal } from './UAEMortgageCalculatorModal';

describe('UAEMortgageCalculatorModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<UAEMortgageCalculatorModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('uae-mortgage-calculator-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true with default values', () => {
    render(<UAEMortgageCalculatorModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('uae-mortgage-calculator-modal')).toBeInTheDocument();
    expect(screen.getByText(/UAE Mortgage & Transaction Fee Calculator/i)).toBeInTheDocument();
    
    // Default property value is 3,200,000
    expect(screen.getByText('AED 3,200,000')).toBeInTheDocument();
  });

  it('calculates the DLD transfer fee correctly based on property price', () => {
    render(<UAEMortgageCalculatorModal isOpen={true} onClose={vi.fn()} />);
    
    // For 3,200,000 AED, DLD fee (4%) is 128,000
    expect(screen.getByText('AED 128,000')).toBeInTheDocument();
  });

  it('calculates down payment correctly', () => {
    render(<UAEMortgageCalculatorModal isOpen={true} onClose={vi.fn()} />);
    
    // For 3,200,000 AED at 20% down payment
    expect(screen.getByText('AED 640,000')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<UAEMortgageCalculatorModal isOpen={true} onClose={handleClose} />);
    
    fireEvent.click(screen.getByText('✕'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
