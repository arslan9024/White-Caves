import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/authSlice';
import { ThemeProvider } from '../../../context/ThemeContext';
import { LanguageProvider } from '../../../context/LanguageContext';
import { CurrencyProvider } from '../../../context/CurrencyContext';
import { UserPreferencesDropdown } from './UserPreferencesDropdown';

function renderDropdown(user: any = null, onClose = vi.fn()) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return render(
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <UserPreferencesDropdown user={user} onClose={onClose} />
            </BrowserRouter>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

describe('UserPreferencesDropdown Component', () => {
  it('renders theme, language, and currency selector groups', () => {
    renderDropdown();

    expect(screen.getByTestId('dropdown-theme-selector')).toBeTruthy();
    expect(screen.getByTestId('dropdown-language-selector')).toBeTruthy();
    expect(screen.getByTestId('dropdown-currency-selector')).toBeTruthy();
  });

  it('allows user to switch theme mode directly from dropdown', () => {
    renderDropdown();

    const lightBtn = screen.getByTestId('pill-theme-light');
    fireEvent.click(lightBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    const darkBtn = screen.getByTestId('pill-theme-dark');
    fireEvent.click(darkBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('allows user to switch language directly from dropdown', () => {
    renderDropdown();

    const arBtn = screen.getByTestId('pill-lang-ar');
    fireEvent.click(arBtn);
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');

    const enBtn = screen.getByTestId('pill-lang-en');
    fireEvent.click(enBtn);
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('allows user to switch currency directly from dropdown', () => {
    renderDropdown();

    const usdBtn = screen.getByTestId('pill-curr-USD');
    fireEvent.click(usdBtn);

    const aedBtn = screen.getByTestId('pill-curr-AED');
    fireEvent.click(aedBtn);
  });

  it('renders user details when logged in', () => {
    const mockUser = {
      name: 'Arslan Malik',
      email: 'arslanmalikgoraha@gmail.com',
      photoURL: 'https://example.com/avatar.jpg',
    };

    renderDropdown(mockUser);
    expect(screen.getByText('Arslan Malik')).toBeTruthy();
    expect(screen.getByText('arslanmalikgoraha@gmail.com')).toBeTruthy();
    expect(screen.getByText(/Sign Out/i)).toBeTruthy();
  });
});
