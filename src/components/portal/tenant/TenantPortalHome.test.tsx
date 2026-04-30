/**
 * TenantPortalHome.test.tsx
 * Tests for Phase 2.13 — Tenant home dashboard
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantPortalHome from './TenantPortalHome';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockTenant = {
  id: 'tenant-1',
  email: 'tenant@whitecaves.ae',
  name: 'Fatima Al-Mansoori',
  role: 'tenant',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockTenant,
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

describe('TenantPortalHome', () => {
  it('renders welcome banner with user name', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-welcome-banner')).toHaveTextContent('Fatima Al-Mansoori');
  });

  it('renders all three metric cards', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-metric-next-payment')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-lease')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-maintenance')).toBeInTheDocument();
  });

  it('shows next payment amount', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-metric-payment-value')).toHaveTextContent('AED 8,000');
  });

  it('renders all quick link tiles', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-quick-link-lease')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-payments')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-documents')).toBeInTheDocument();
  });

  it('calls onNavigate when a quick link is clicked', () => {
    const onNavigate = vi.fn();
    renderWithStore(<TenantPortalHome onNavigate={onNavigate} />);

    fireEvent.click(screen.getByTestId('tenant-quick-link-maintenance'));
    expect(onNavigate).toHaveBeenCalledWith('maintenance');

    fireEvent.click(screen.getByTestId('tenant-quick-link-payments'));
    expect(onNavigate).toHaveBeenCalledWith('payments');
  });

  it('shows login message when unauthenticated', () => {
    renderWithStore(<TenantPortalHome />, {
      user: { currentUser: null, isLoading: false, error: null },
    });

    expect(
      screen.getByText(/You must be logged in to view the Tenant Portal/i)
    ).toBeInTheDocument();
  });
});
