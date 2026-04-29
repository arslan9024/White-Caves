/**
 * OnboardingGateway — Unit Tests
 * Tests: rendering, role selection, navigation, safeStorage persistence,
 * animation states, footer link
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockSetJSON = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    setJSON: (...args: unknown[]) => mockSetJSON(...args),
    getJSON: vi.fn(),
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('./OnboardingGateway.styles', () => ({
  StyledOnboardingGateway: ({ children }: React.PropsWithChildren) => <div data-testid="gateway">{children}</div>,
  StyledGatewayContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  StyledGatewayHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  StyledGatewayTitle: ({ children }: React.PropsWithChildren) => <h1>{children}</h1>,
  StyledGatewaySubtitle: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  StyledGatewayDivider: () => <hr />,
  StyledRoleTilesGrid: ({ children }: React.PropsWithChildren) => <div data-testid="tiles-grid">{children}</div>,
  StyledOnboardingRoleTile: ({ children, onClick, ...props }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <div data-testid="role-tile" onClick={onClick}>{children}</div>
  ),
  StyledTileAccentBar: () => <div />,
  StyledTileIconWrapper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  StyledTileTextContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  StyledTileTitle: ({ children }: React.PropsWithChildren) => <h3 data-testid="tile-title">{children}</h3>,
  StyledTileSubtitle: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  StyledTileDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  StyledTileArrow: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  StyledGatewayFooter: ({ children }: React.PropsWithChildren) => <footer>{children}</footer>,
  StyledFooterText: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  StyledFooterLink: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <a {...props}>{children}</a>,
}));

import OnboardingGateway from './OnboardingGateway';

describe('OnboardingGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ────── Basic Rendering ──────

  it('renders the gateway title', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText('How can we assist you today?')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText('Select your role to access personalized features and services')).toBeInTheDocument();
  });

  // ────── Role Tiles ──────

  it('renders all 4 role tiles', () => {
    render(<OnboardingGateway />);
    const tiles = screen.getAllByTestId('role-tile');
    expect(tiles).toHaveLength(4);
  });

  it('renders seller tile', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText('Sell or List Property')).toBeInTheDocument();
    expect(screen.getByText('List your property with us')).toBeInTheDocument();
  });

  it('renders buyer tile', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText('Buy a Property')).toBeInTheDocument();
    expect(screen.getByText('Find your dream home')).toBeInTheDocument();
  });

  it('renders tenant tile', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText('Rent or Lease')).toBeInTheDocument();
    expect(screen.getByText('Find your next home')).toBeInTheDocument();
  });

  it('renders agent tile', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText("I'm an Agent")).toBeInTheDocument();
    expect(screen.getByText('Staff & Team Portal')).toBeInTheDocument();
  });

  it('renders tile descriptions', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText(/get property valuations/i)).toBeInTheDocument();
    expect(screen.getByText(/browse listings, compare/i)).toBeInTheDocument();
    expect(screen.getByText(/browse rental properties/i)).toBeInTheDocument();
    expect(screen.getByText(/access performance dashboards/i)).toBeInTheDocument();
  });

  // ────── Role Selection & Navigation ──────

  it('saves role to safeStorage and navigates on seller click', () => {
    render(<OnboardingGateway />);
    fireEvent.click(screen.getByText('Sell or List Property'));

    expect(mockSetJSON).toHaveBeenCalledWith('preferredRole', expect.objectContaining({
      role: 'seller',
      locked: false,
      fromGateway: true,
    }));

    // Navigation happens after 400ms timeout
    vi.advanceTimersByTime(400);
    expect(mockNavigate).toHaveBeenCalledWith('/seller/dashboard');
  });

  it('navigates to buyer dashboard on buyer click', () => {
    render(<OnboardingGateway />);
    fireEvent.click(screen.getByText('Buy a Property'));

    vi.advanceTimersByTime(400);
    expect(mockNavigate).toHaveBeenCalledWith('/buyer/dashboard');
    expect(mockSetJSON).toHaveBeenCalledWith('preferredRole', expect.objectContaining({
      role: 'buyer',
    }));
  });

  it('navigates to landlord dashboard on tenant click', () => {
    render(<OnboardingGateway />);
    fireEvent.click(screen.getByText('Rent or Lease'));

    vi.advanceTimersByTime(400);
    expect(mockNavigate).toHaveBeenCalledWith('/landlord/dashboard');
    expect(mockSetJSON).toHaveBeenCalledWith('preferredRole', expect.objectContaining({
      role: 'landlord',
    }));
  });

  it('navigates to signin on agent click', () => {
    render(<OnboardingGateway />);
    fireEvent.click(screen.getByText("I'm an Agent"));

    vi.advanceTimersByTime(400);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
    expect(mockSetJSON).toHaveBeenCalledWith('preferredRole', expect.objectContaining({
      role: 'agent',
    }));
  });

  it('sets selectedAt timestamp in ISO format', () => {
    const mockDate = new Date('2026-03-01T10:00:00.000Z');
    vi.setSystemTime(mockDate);

    render(<OnboardingGateway />);
    fireEvent.click(screen.getByText('Buy a Property'));

    expect(mockSetJSON).toHaveBeenCalledWith('preferredRole', expect.objectContaining({
      selectedAt: '2026-03-01T10:00:00.000Z',
    }));
  });

  // ────── Footer ──────

  it('renders footer with contact link', () => {
    render(<OnboardingGateway />);
    expect(screen.getByText(/not sure where to start/i)).toBeInTheDocument();
    expect(screen.getByText('Contact our team')).toBeInTheDocument();
  });

  it('contact link points to /contact', () => {
    render(<OnboardingGateway />);
    const link = screen.getByText('Contact our team');
    expect(link).toHaveAttribute('href', '/contact');
  });
});
