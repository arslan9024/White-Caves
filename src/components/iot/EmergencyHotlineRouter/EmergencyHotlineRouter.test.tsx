import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmergencyHotlineRouter } from './EmergencyHotlineRouter';

describe('EmergencyHotlineRouter Component', () => {
  it('renders emergency maintenance hotline router and on-duty engineers', () => {
    render(<EmergencyHotlineRouter />);
    expect(screen.getByTestId('emergency-hotline-router')).toBeDefined();
    expect(screen.getByText(/24\/7 Emergency Maintenance Hotline & Engineer Auto-Router/i)).toBeDefined();
    expect(screen.getByText(/LIVE DISPATCH/i)).toBeDefined();
    expect(screen.getByText(/Eng. Tariq Al Nuaimi/i)).toBeDefined();
    expect(screen.getByText(/Eng. Ramesh Patel/i)).toBeDefined();
  });
});
