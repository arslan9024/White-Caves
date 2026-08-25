import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../../../store/authSlice';
import { ThemeProvider } from '../../../../../context/ThemeContext';
import { LanguageProvider } from '../../../../../context/LanguageContext';
import { CurrencyProvider } from '../../../../../context/CurrencyContext';
import { UserRoleProvider } from '../../../../../context/UserRoleContext';
import { useUserPreferencesDropdownLogic } from './UserPreferencesDropdown.logic';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore({
  reducer: { auth: authReducer },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(Provider, { store: mockStore },
    React.createElement(ThemeProvider, null,
      React.createElement(LanguageProvider, null,
        React.createElement(CurrencyProvider, null,
          React.createElement(UserRoleProvider, null, children)
        )
      )
    )
  )
);

describe('UserPreferencesDropdown.logic', () => {
  it('initializes context handlers and supports navigation and theme switching', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useUserPreferencesDropdownLogic({ onClose }), { wrapper });

    expect(result.current.themeMode).toBeDefined();
    expect(result.current.language).toBeDefined();
    expect(result.current.currency).toBeDefined();

    act(() => {
      result.current.setThemeMode('dark');
    });

    expect(result.current.themeMode).toBe('dark');

    act(() => {
      result.current.handleNavigate('/dashboard');
    });

    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
