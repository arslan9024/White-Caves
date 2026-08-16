import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LuxuryTooltip } from './LuxuryTooltip';

describe('LuxuryTooltip Component', () => {
  it('renders children and displays tooltip bubble on hover', () => {
    render(
      <LuxuryTooltip text="Verified DLD Permit">
        <button>Permit Badge</button>
      </LuxuryTooltip>
    );
    expect(screen.getByTestId('luxury-tooltip')).toBeDefined();
    expect(screen.getByText('Permit Badge')).toBeDefined();

    // Hover to reveal tooltip
    const wrapper = screen.getByTestId('luxury-tooltip');
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText('Verified DLD Permit')).toBeDefined();

    // Mouse leave hides tooltip
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByText('Verified DLD Permit')).toBeNull();
  });
});
