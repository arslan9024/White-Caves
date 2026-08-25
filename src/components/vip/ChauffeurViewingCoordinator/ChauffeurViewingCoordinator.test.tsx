import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChauffeurViewingCoordinator } from './ChauffeurViewingCoordinator';

describe('ChauffeurViewingCoordinator', () => {
  it('renders VIP transport options and books time slot', () => {
    render(<ChauffeurViewingCoordinator />);

    expect(screen.getByTestId('chauffeur-viewing-coordinator')).toBeDefined();
    expect(screen.getAllByText(/Luxury Chauffeur/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Private Jet Transfer/i)).toBeDefined();
    expect(screen.getByText(/Superyacht Arrival/i)).toBeDefined();
    expect(screen.getByText(/Helicopter Viewing/i)).toBeDefined();

    const bookBtn = screen.getByText(/Confirm Booking/i);
    fireEvent.click(bookBtn);

    expect(screen.getByText(/Booked!/i)).toBeDefined();
  });
});
