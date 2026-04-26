/**
 * AboutPage.test.tsx — Smoke tests for About page
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock hooks & dependencies
vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

// Mock Footer to avoid complex dependencies
vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

// Mock WhatsAppButton
vi.mock('../components/WhatsAppButton', () => ({
  default: () => <div data-testid="whatsapp-btn">WhatsApp</div>,
}));

// Mock AppLayout to just render children
vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import AboutPage from './AboutPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );
}

describe('AboutPage', () => {
  it('renders hero heading', () => {
    renderPage();
    expect(screen.getByText('About White Caves')).toBeTruthy();
  });

  it('renders hero subtitle', () => {
    renderPage();
    expect(screen.getByText(/Premier Luxury Real Estate Agency/)).toBeTruthy();
  });

  it('renders intro section heading', () => {
    renderPage();
    expect(screen.getByText('Your Gateway to Luxury Living in Dubai')).toBeTruthy();
  });

  it('renders company stats', () => {
    renderPage();
    expect(screen.getByText('500+')).toBeTruthy();
    expect(screen.getByText('Properties Sold')).toBeTruthy();
    expect(screen.getByText('1000+')).toBeTruthy();
    expect(screen.getByText('Happy Clients')).toBeTruthy();
    expect(screen.getByText('15+')).toBeTruthy();
    expect(screen.getByText('50+')).toBeTruthy();
  });

  it('renders team members', () => {
    renderPage();
    expect(screen.getByText('Meet Our Team')).toBeTruthy();
    expect(screen.getByText('Ahmed Al Rashid')).toBeTruthy();
    expect(screen.getByText('Sarah Thompson')).toBeTruthy();
    expect(screen.getByText('Mohammed Hassan')).toBeTruthy();
    expect(screen.getByText('Elena Rodriguez')).toBeTruthy();
  });

  it('renders team member roles', () => {
    renderPage();
    expect(screen.getByText('CEO & Founder')).toBeTruthy();
    expect(screen.getByText('Head of Sales')).toBeTruthy();
    expect(screen.getByText('Senior Property Consultant')).toBeTruthy();
    expect(screen.getByText('Marketing Director')).toBeTruthy();
  });

  it('renders milestones section', () => {
    renderPage();
    expect(screen.getByText('Our Journey')).toBeTruthy();
    expect(screen.getByText('2009')).toBeTruthy();
    expect(screen.getByText('Company Founded')).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('Market Leader')).toBeTruthy();
  });

  it('renders all 6 milestones', () => {
    renderPage();
    const years = ['2009', '2012', '2015', '2018', '2021', '2024'];
    years.forEach((year) => {
      expect(screen.getByText(year)).toBeTruthy();
    });
  });

  it('renders Footer and WhatsApp components', () => {
    renderPage();
    expect(screen.getByTestId('footer')).toBeTruthy();
    expect(screen.getByTestId('whatsapp-btn')).toBeTruthy();
  });
});
