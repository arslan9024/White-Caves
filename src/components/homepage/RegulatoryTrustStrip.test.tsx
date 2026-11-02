import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RegulatoryTrustStrip from './RegulatoryTrustStrip';

describe('RegulatoryTrustStrip Component', () => {
  it('renders official RERA license badge', () => {
    render(<RegulatoryTrustStrip />);
    expect(screen.getByText(/RERA Certified Broker/i)).toBeInTheDocument();
    expect(screen.getByText('ORN 44483')).toBeInTheDocument();
  });

  it('renders official DET Commercial License badge', () => {
    render(<RegulatoryTrustStrip />);
    expect(screen.getByText(/DET Commercial License/i)).toBeInTheDocument();
    expect(screen.getByText('Lic. 1388443')).toBeInTheDocument();
  });

  it('renders Ejari and Developer badges', () => {
    render(<RegulatoryTrustStrip />);
    expect(screen.getByText(/Ejari Authorized Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Prime Developer Direct/i)).toBeInTheDocument();
  });
});
