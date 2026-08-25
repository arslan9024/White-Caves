import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HenryTitleDeedScannerView } from './HenryTitleDeedScannerView';

describe('HenryTitleDeedScannerView', () => {
  it('renders Title Deed scanner studio with DLD property extraction form', () => {
    render(<HenryTitleDeedScannerView />);

    expect(screen.getByText(/3.19.3 Scan Title Deed \/ Oqood/i)).toBeInTheDocument();
    expect(screen.getByText(/Property Presets/i)).toBeInTheDocument();
  });
});
