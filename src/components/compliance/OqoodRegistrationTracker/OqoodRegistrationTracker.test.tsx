import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OqoodRegistrationTracker } from './OqoodRegistrationTracker';

describe('OqoodRegistrationTracker Component', () => {
  it('renders Oqood off-plan registration tracker and shows payment milestones', () => {
    render(<OqoodRegistrationTracker />);
    expect(screen.getByTestId('oqood-registration-tracker')).toBeDefined();
    expect(screen.getByText(/Oqood Off-Plan Registration Tracker/i)).toBeDefined();
    expect(screen.getByText(/DLD Interim Registry/i)).toBeDefined();
    expect(screen.getByText(/EMAAR South Heights/i)).toBeDefined();
    expect(screen.getByText(/Booking Amount \(10%\)/i)).toBeDefined();
    expect(screen.getByText(/Façade Completion/i)).toBeDefined();
  });
});
