import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PublicNavbar } from './PublicNavbar';
import { LanguageProvider } from '../../../context/LanguageContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import { CurrencyProvider } from '../../../context/CurrencyContext';
import { UserRoleProvider } from '../../../context/UserRoleContext';

const createMockStore = () =>
  configureStore({
    reducer: {
      session: () => ({ user: null, token: null }),
      auth: () => ({ user: null, isAuthenticated: false }),
      preferences: () => ({ theme: 'dark', language: 'en', currency: 'AED' }),
      properties: () => ({ items: [], favorites: [] }),
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <UserRoleProvider>{ui}</UserRoleProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('PublicNavbar Component & Internationalization Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PublicNavbar and displays translated labels without raw keys', () => {
    renderWithProviders(<PublicNavbar />);

    // Verify List Property CTA is displayed properly and NOT as "nav.listProperty"
    const listBtns = screen.getAllByText(/List Property/i);
    expect(listBtns.length).toBeGreaterThan(0);
    expect(screen.queryByText(/nav\.listProperty/i)).toBeNull();

    // Verify Services & Company links are displayed properly and NOT as "nav.services" or "nav.company"
    expect(screen.getByText(/^Services$/i)).toBeDefined();
    expect(screen.getByText(/^Company$/i)).toBeDefined();
    expect(screen.queryByText(/nav\.services/i)).toBeNull();
    expect(screen.queryByText(/nav\.company/i)).toBeNull();
  });
});
