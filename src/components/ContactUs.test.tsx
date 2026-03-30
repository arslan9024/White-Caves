/**
 * ContactUs.test.tsx — Smoke tests for ContactUs component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock Config
vi.mock('../config/constants', () => ({
  Config: {
    COMPANY: {
      NAME: 'White Caves',
      ADDRESS: '123 Test Street, Dubai',
      EMAIL: 'info@whitecaves.com',
      PHONE: '+971-555-0000',
    },
  },
}));

import ContactUs from './ContactUs';

describe('ContactUs', () => {
  it('renders company name in title', () => {
    render(<ContactUs />);
    expect(screen.getByText(/Contact White Caves/i)).toBeTruthy();
  });

  it('renders address', () => {
    render(<ContactUs />);
    expect(screen.getByText(/123 Test Street, Dubai/)).toBeTruthy();
  });

  it('renders email', () => {
    render(<ContactUs />);
    expect(screen.getByText(/info@whitecaves.com/)).toBeTruthy();
  });

  it('renders office hours', () => {
    render(<ContactUs />);
    expect(screen.getByText(/Mon - Fri: 9:00 AM - 6:00 PM/)).toBeTruthy();
    expect(screen.getByText(/Sat: 10:00 AM - 4:00 PM/)).toBeTruthy();
  });

  it('renders website', () => {
    render(<ContactUs />);
    expect(screen.getByText(/www.whitecaves.com/)).toBeTruthy();
  });
});
