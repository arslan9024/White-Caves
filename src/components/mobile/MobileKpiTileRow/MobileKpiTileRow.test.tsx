/**
 * MobileKpiTileRow.test.tsx — Unit Tests
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileKpiTileRow } from './MobileKpiTileRow';

describe('MobileKpiTileRow', () => {
  it('renders the KPI tile scroll row', () => {
    render(<MobileKpiTileRow />);
    expect(screen.getByTestId('mobile-kpi-tile-row')).toBeDefined();
  });

  it('renders New Leads and Revenue KPI tiles', () => {
    render(<MobileKpiTileRow />);
    expect(screen.getByText('New Leads')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
  });

  it('shows delta badges', () => {
    render(<MobileKpiTileRow />);
    expect(screen.getByText('+12%')).toBeDefined();
    expect(screen.getByText('+8%')).toBeDefined();
  });
});
