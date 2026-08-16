import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadSlaEscalationTimer } from './LeadSlaEscalationTimer';

describe('LeadSlaEscalationTimer Component', () => {
  it('renders lead SLA escalation timer and inbound leads queue', () => {
    render(<LeadSlaEscalationTimer />);
    expect(screen.getByTestId('lead-sla-escalation-timer')).toBeDefined();
    expect(screen.getByText(/15-Minute Inbound Lead SLA & Escalation Engine/i)).toBeDefined();
    expect(screen.getByText(/P0 DISPATCH/i)).toBeDefined();
    expect(screen.getByText(/Khalid Al Mansoori/i)).toBeDefined();
    expect(screen.getByText(/David Miller/i)).toBeDefined();
  });
});
