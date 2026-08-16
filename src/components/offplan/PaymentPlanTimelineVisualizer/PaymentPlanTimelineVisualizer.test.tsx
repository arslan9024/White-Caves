import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentPlanTimelineVisualizer } from './PaymentPlanTimelineVisualizer';

describe('PaymentPlanTimelineVisualizer Component', () => {
  it('renders payment plan visualizer with default milestones', () => {
    render(<PaymentPlanTimelineVisualizer />);
    expect(screen.getByTestId('payment-plan-timeline-visualizer')).toBeDefined();
    expect(screen.getByText(/Payment Plan Timeline/i)).toBeDefined();
    expect(screen.getAllByText(/Booking/i).length).toBeGreaterThan(0);
  });

  it('switches to 50/50 plan tab and displays construction milestones', () => {
    render(<PaymentPlanTimelineVisualizer />);
    const tab5050 = screen.getByRole('button', { name: /50\/50 Plan/i });
    fireEvent.click(tab5050);
    expect(screen.getByText(/Construction Milestone 1/i)).toBeDefined();
  });
});
