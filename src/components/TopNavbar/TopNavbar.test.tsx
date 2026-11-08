import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../context/UserRoleContext';
import { TopNavbar } from './TopNavbar';
import { ExecutiveTopNavbar } from '../dashboard/ExecutiveTopNavbar';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const renderNavbar = (ui: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <UserRoleProvider initialUser={DEMO_ROLE_PROFILES.managing_director}>
              <BrowserRouter>{ui}</BrowserRouter>
            </UserRoleProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('Unified Merged TopNavbar (Consolidation & Even Wings)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the central overhanging logo exclusively in dead center', () => {
    renderNavbar(<TopNavbar />);
    const logoImg = screen.getByAltText(/White Caves Logo/i);
    expect(logoImg).toBeDefined();
    expect(logoImg.getAttribute('src')).toBe('/company-logo.jpg');
  });

  it('renders left navigation wing with platform links', () => {
    renderNavbar(<TopNavbar />);
    expect(screen.getByText(/Corporate HQ/i)).toBeDefined();
    expect(screen.getByText(/Primary Market/i)).toBeDefined();
    expect(screen.getByText(/Secondary Market/i)).toBeDefined();
  });

  it('renders right navigation wing with notifications and profile trigger', () => {
    renderNavbar(<TopNavbar />);

    expect(screen.getByLabelText(/Notifications/i)).toBeDefined();
    expect(screen.getByTestId('profile-trigger')).toBeDefined();
  });

  it('renders profile trigger and opens shared UserPreferencesDropdown with centralized telemetry, role badge, navigation and theme controls', () => {
    renderNavbar(<TopNavbar />);
    const profileTrigger = screen.getByTestId('profile-trigger');
    expect(profileTrigger).toBeDefined();

    // Initially dropdown is closed
    expect(screen.queryByTestId('user-preferences-dropdown')).toBeNull();

    // Click trigger opens shared UserPreferencesDropdown
    fireEvent.click(profileTrigger);
    expect(screen.getByTestId('user-preferences-dropdown')).toBeDefined();

    // Centralized theme controls inside the profile dropdown
    expect(screen.getByTestId('pref-theme-light')).toBeDefined();
    expect(screen.getByTestId('pref-theme-dark')).toBeDefined();

    // Centralized role badge inside the profile dropdown
    expect(screen.getByTestId('active-role-badge')).toBeDefined();

    // Centralized telemetry row inside the profile dropdown
    expect(screen.getByTestId('dropdown-telemetry-row')).toBeDefined();
    expect(screen.getByText(/DLD:/i)).toBeDefined();
    expect(screen.getByText('1388443')).toBeDefined();
    expect(screen.getByText(/RERA:/i)).toBeDefined();
    expect(screen.getByText('44483')).toBeDefined();
    expect(screen.getByText(/Zoe:/i)).toBeDefined();
    expect(screen.getByText('121')).toBeDefined();

    // Centralized CRM Hub navigation link inside the profile dropdown
    expect(screen.getByText(/CRM Hub & Master Pipeline/i)).toBeDefined();
  });

  it('theme toggle works from inside profile dropdown for full page switching', () => {
    renderNavbar(<TopNavbar />);
    const profileTrigger = screen.getByTestId('profile-trigger');
    fireEvent.click(profileTrigger);

    const lightBtn = screen.getByTestId('pref-theme-light');
    expect(lightBtn).toBeDefined();

    // Toggle theme
    fireEvent.click(lightBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBeDefined();
  });

  it('ExecutiveTopNavbar renders the exact consolidated TopNavbar with sticky positioning', () => {
    renderNavbar(<ExecutiveTopNavbar />);
    expect(screen.getByTestId('top-navbar')).toBeDefined();
    expect(screen.getByAltText(/White Caves Logo/i)).toBeDefined();
  });
});
