import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { UserRoleProvider, DEMO_ROLE_PROFILES } from '../context/UserRoleContext';
import { UnifiedWorkspaceLayout } from './UnifiedWorkspaceLayout';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const renderLayout = (email = 'arslanmalikgoraha@gmail.com') => {
  const initialUser =
    email === 'arslanmalikgoraha@gmail.com'
      ? DEMO_ROLE_PROFILES.managing_director
      : DEMO_ROLE_PROFILES.guest;

  return render(
    <Provider store={mockStore}>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <UserRoleProvider initialUser={initialUser}>
              <BrowserRouter>
                <UnifiedWorkspaceLayout currentUserEmail={email}>
                  <div data-testid="test-child-content">Workspace Content</div>
                </UnifiedWorkspaceLayout>
              </BrowserRouter>
            </UserRoleProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('UnifiedWorkspaceLayout (4-Way Workspace Architecture)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with Founder session and Managing Director Hub', () => {
    renderLayout('arslanmalikgoraha@gmail.com');
    expect(screen.getByTestId('test-child-content')).toBeDefined();
    expect(screen.getByText(/Managing Director Hub/i)).toBeDefined();
  });

  it('renders top navbar and floating controls in layout', () => {
    renderLayout('guest@whitecaves.com');
    expect(screen.getByTestId('test-child-content')).toBeDefined();
  });
});
