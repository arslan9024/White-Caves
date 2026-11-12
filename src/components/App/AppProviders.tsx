import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CookieConsent } from '../../components/common/CookieConsent';
import { ToastNotificationSystem } from '../../components/common/ToastNotificationSystem/ToastNotificationSystem';
import { LanguageProvider } from '../../context/LanguageContext';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { UserRoleProvider } from '../../context/UserRoleContext';
import { WorkspaceProvider } from '../../context/WorkspaceContext';
import { ThemeProvider } from '../../styles/ThemeProvider';
import { SQAErrorBoundary } from '../../components/common/SQAErrorBoundary';
import { AuthModalProvider } from '../../components/auth/AuthModalProvider';
import { StatusProvider } from '../../components/common/StatusNotification';
import { ThemeProvider as LuxuryThemeProvider } from '../../components/theme/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';
import { SEOMeta } from '../../components/common/SEOMeta/SEOMeta';
import React from 'react';
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <SQAErrorBoundary>
        <SEOMeta />
        <AuthModalProvider>
          <ThemeProvider>
            <LuxuryThemeProvider>
              <StatusProvider>
                <LanguageProvider>
                  <CurrencyProvider>
                    <UserRoleProvider>
                      <WorkspaceProvider>
                        <BrowserRouter>{children}</BrowserRouter>
                        <CookieConsent />
                        <ToastNotificationSystem />
                      </WorkspaceProvider>
                    </UserRoleProvider>
                  </CurrencyProvider>
                </LanguageProvider>
              </StatusProvider>
            </LuxuryThemeProvider>
          </ThemeProvider>
        </AuthModalProvider>
      </SQAErrorBoundary>
    </HelmetProvider>
  );
}
