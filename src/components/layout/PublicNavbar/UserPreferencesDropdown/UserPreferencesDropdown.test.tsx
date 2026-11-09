import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../../store/authSlice';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { LanguageProvider } from '../../../../context/LanguageContext';
import { CurrencyProvider } from '../../../../context/CurrencyContext';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../../../../context/UserRoleContext';
import { UserPreferencesDropdown } from './UserPreferencesDropdown';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const renderDropdown = (
  userProps = null,
  onClose = vi.fn(),
  initialUser = DEMO_ROLE_PROFILES.managing_director
) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <UserRoleProvider initialUser={initialUser}>
              <UserPreferencesDropdown user={userProps} onClose={onClose} />
            </UserRoleProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('UserPreferencesDropdown (4-Way Component)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with default managing director user and role simulator', () => {
    renderDropdown();
    expect(screen.getByTestId('user-preferences-dropdown')).toBeDefined();
    expect(screen.getByTestId('active-role-badge')).toBeDefined();
    expect(screen.getByTestId('role-simulator-select')).toBeDefined();
  });

  it('hides administrative role simulator for non-L5 guest users', () => {
    renderDropdown(null, vi.fn(), DEMO_ROLE_PROFILES.guest);
    expect(screen.getByTestId('user-preferences-dropdown')).toBeDefined();
    expect(screen.queryByTestId('role-simulator-select')).toBeNull();
  });

  it('renders theme, language, and currency options', () => {
    renderDropdown();
    expect(screen.getByTestId('pref-theme-light')).toBeDefined();
    expect(screen.getByTestId('pref-theme-dark')).toBeDefined();
    expect(screen.getByTestId('pref-lang-en')).toBeDefined();
    expect(screen.getByTestId('pref-lang-ar')).toBeDefined();
    expect(screen.getByTestId('pref-curr-aed')).toBeDefined();
  });

  it('allows selecting a role from the 14-role simulator for L5 users', () => {
    const onClose = vi.fn();
    renderDropdown(null, onClose);

    const selectBox = screen.getByTestId('role-simulator-select');
    fireEvent.change(selectBox, { target: { value: 'tenant' } });

    expect(onClose).toHaveBeenCalled();
  });

  it('renders avatar pencil button and inline edit profile link, and opens crop modal', () => {
    renderDropdown();
    const avatarEditBtn = screen.getByTestId('edit-avatar-btn');
    const inlineEditBtn = screen.getByTestId('inline-edit-profile-btn');
    expect(avatarEditBtn).toBeDefined();
    expect(inlineEditBtn).toBeDefined();

    // Clicking avatar pencil triggers the crop modal
    fireEvent.click(avatarEditBtn);
    expect(screen.getByText(/Crop & Adjust Profile Picture/i)).toBeDefined();

    // Clicking inline edit profile navigates to /profile
    fireEvent.click(inlineEditBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
