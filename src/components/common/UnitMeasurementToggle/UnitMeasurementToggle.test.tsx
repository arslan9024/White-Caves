import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitMeasurementToggle } from './UnitMeasurementToggle';

describe('UnitMeasurementToggle Component', () => {
  it('renders unit measurement toggle and handles unit changes', () => {
    const onUnitChange = vi.fn();
    render(<UnitMeasurementToggle onUnitChange={onUnitChange} />);
    expect(screen.getByTestId('unit-measurement-toggle')).toBeDefined();
    expect(screen.getByText('SqFt')).toBeDefined();
    expect(screen.getByText('SqM')).toBeDefined();

    const sqmBtn = screen.getByText('SqM');
    fireEvent.click(sqmBtn);
    expect(onUnitChange).toHaveBeenCalledWith('SqM');
  });
});
