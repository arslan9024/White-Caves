/**
 * LandlordPortalHome.test.tsx
 * Tests for Phase 2.13 — Landlord home dashboard
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordPortalHome from './LandlordPortalHome';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockLandlord = {
  id: 'landlord-1',
  email: 'landlord@whitecaves.ae',
  name: 'Khalid Al-Rashid',
  role: 'landlord',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockLandlord,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });

const renderWithStore = (
  component: React.ReactElement,
  preloadedState?: PreloadedState<RootState>
) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('LandlordPortalHome', () => {
  it('renders welcome banner with user name', () => {
    renderWithStore(<LandlordPortalHome />);

    expect(screen.getByTestId('landlord-welcome-banner')).toHaveTextContent('Khalid Al-Rashid');
  });

  it('renders all four metric cards', () => {
    renderWithStore(<LandlordPortalHome />);

    expect(screen.getByTestId('landlord-metric-properties')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-tenants')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-rent')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-maintenance')).toBeInTheDocument();
  });

  it('renders quick link tiles', () => {
    renderWithStore(<LandlordPortalHome />);

    expect(screen.getByTestId('landlord-quick-link-properties')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-tenants')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-payments')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-documents')).toBeInTheDocument();
  });

  it('calls onNavigate when a quick link is clicked', () => {
    const onNavigate = vi.fn();
    renderWithStore(<LandlordPortalHome onNavigate={onNavigate} />);

    fireEvent.click(screen.getByTestId('landlord-quick-link-properties'));
    expect(onNavigate).toHaveBeenCalledWith('properties');

    fireEvent.click(screen.getByTestId('landlord-quick-link-maintenance'));
    expect(onNavigate).toHaveBeenCalledWith('maintenance');
  });

  it('shows login message when unauthenticated', () => {
    renderWithStore(<LandlordPortalHome />, {
      user: { currentUser: null, isLoading: false, error: null },
    });

    expect(
      screen.getByText(/You must be logged in to view the Landlord Portal/i)
    ).toBeInTheDocument();
  });
});
