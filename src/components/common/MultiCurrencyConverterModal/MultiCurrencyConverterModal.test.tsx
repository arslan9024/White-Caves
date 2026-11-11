import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MultiCurrencyConverterModal from './MultiCurrencyConverterModal';
import { CurrencyProvider } from '../../../context/CurrencyContext';

const renderModal = (props = {}) => {
  return render(
    <CurrencyProvider>
      <MultiCurrencyConverterModal isOpen={true} onClose={vi.fn()} {...props} />
    </CurrencyProvider>
  );
};

describe('MultiCurrencyConverterModal Component', () => {
  it('renders modal header, base AED input, and conversion grid', () => {
    renderModal({ baseAmountAED: 10000000, propertyTitle: 'Palm Crown Villa' });

    expect(screen.getByTestId('multi-currency-modal-container')).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Multi-Currency & Crypto Escrow Converter/i)).toBeInTheDocument();
    expect(screen.getByText('Palm Crown Villa')).toBeInTheDocument();
    expect(screen.getByTestId('input-base-aed')).toHaveValue(10000000);
  });

  it('displays all supported currencies including RUB and BTC', () => {
    renderModal();

    expect(screen.getByTestId('currency-tile-AED')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-USD')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-EUR')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-GBP')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-SAR')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-CNY')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-INR')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-RUB')).toBeInTheDocument();
    expect(screen.getByTestId('currency-tile-BTC')).toBeInTheDocument();
  });

  it('updates converted values when base AED input changes', () => {
    renderModal({ baseAmountAED: 3672500 });

    const input = screen.getByTestId('input-base-aed');
    fireEvent.change(input, { target: { value: '7345000' } });

    // USD rate is 3.6725 => 7,345,000 AED / 3.6725 = 2,000,000 USD
    expect(screen.getByText('$ 2,000,000')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <CurrencyProvider>
        <MultiCurrencyConverterModal isOpen={true} onClose={handleClose} />
      </CurrencyProvider>
    );

    const closeBtn = screen.getByTestId('btn-close-currency-modal');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
