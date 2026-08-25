import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ExecutiveKpiFlightDeck } from './ExecutiveKpiFlightDeck';

describe('ExecutiveKpiFlightDeck', () => {
  it('renders executive flight deck with telemetry KPIs', () => {
    render(<ExecutiveKpiFlightDeck />);

    expect(screen.getByTestId('executive-kpi-flight-deck')).toBeInTheDocument();
    expect(screen.getByText(/Executive Flight Deck — Real-Time KPI Telemetry/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Closed Volume/i)).toBeInTheDocument();
    expect(screen.getByText(/Managed Asset Portfolio/i)).toBeInTheDocument();
  });
});
