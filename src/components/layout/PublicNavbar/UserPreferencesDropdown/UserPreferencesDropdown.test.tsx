import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../../store/authSlice';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { LanguageProvider } from '../../../../context/LanguageContext';
import { CurrencyProvider } from '../../../../context/CurrencyContext';
import { UserRoleProvider } from '../../../../context/UserRoleContext';
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

const renderDropdown = (userProps = null, onClose = vi.fn()) => {
  return render(
    <Provider store={mockStore}>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <UserRoleProvider>
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

  it('renders correctly with default guest user', () => {
    renderDropdown();
    expect(screen.getByTestId('user-preferences-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('active-role-badge')).toBeInTheDocument();
    expect(screen.getByTestId('role-simulator-select')).toBeInTheDocument();
  });

  it('renders theme, language, and currency options', () => {
    renderDropdown();
    expect(screen.getByTestId('pref-theme-light')).toBeInTheDocument();
    expect(screen.getByTestId('pref-theme-dark')).toBeInTheDocument();
    expect(screen.getByTestId('pref-lang-en')).toBeInTheDocument();
    expect(screen.getByTestId('pref-lang-ar')).toBeInTheDocument();
    expect(screen.getByTestId('pref-curr-aed')).toBeInTheDocument();
  });

  it('allows selecting a role from the 14-role simulator', () => {
    const onClose = vi.fn();
    renderDropdown(null, onClose);

    const selectBox = screen.getByTestId('role-simulator-select');
    fireEvent.change(selectBox, { target: { value: 'tenant' } });

    expect(onClose).toHaveBeenCalled();
  });
});
