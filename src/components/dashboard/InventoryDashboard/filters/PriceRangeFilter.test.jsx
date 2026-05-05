import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PriceRangeFilter from './PriceRangeFilter';

describe('PriceRangeFilter — alert elimination', () => {
  it('shows inline validation alert when min is greater than max', () => {
    const onChange = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<PriceRangeFilter onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Min Price'), { target: { value: '500000' } });
    fireEvent.change(screen.getByLabelText('Max Price'), { target: { value: '100000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    const banner = screen.getByRole('alert');
    expect(banner).toHaveTextContent('Min price should be less than max price');
    expect(banner).toHaveAttribute('data-testid', 'price-range-validation');
    expect(onChange).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('clears validation and calls onChange for valid range', () => {
    const onChange = vi.fn();

    render(<PriceRangeFilter onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Min Price'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Max Price'), { target: { value: '500000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(screen.queryByTestId('price-range-validation')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(100000, 500000);
  });
});
