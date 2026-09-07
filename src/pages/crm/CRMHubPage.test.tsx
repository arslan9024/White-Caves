/**
 * CRMHubPage.test.tsx
 *
 * Comprehensive unit test suite for White Caves ERP Dashboard & Sidebar.
 * Validates Header, Live Ticker, 3-Tile Sidebar, SearchableSelect, and Viewport engine.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import { CurrencyProvider } from '../../context/CurrencyContext';

// ── Mocks ────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let mockSearchParamTab = 'dept_summary';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      { get: (key: string) => (key === 'tab' ? mockSearchParamTab : null) },
      mockSetSearchParams,
    ],
  };
});

// Mock lazy-loaded CRM modules
vi.mock('../../components/crm/ClaraLeadsCRM_NEW', () => ({
  default: () => <div data-testid="ClaraLeadsCRM">ClaraLeadsCRM Module</div>,
}));
vi.mock('../../components/crm/MaryInventoryCRM_NEW', () => ({
  default: () => <div data-testid="MaryInventoryCRM">MaryInventoryCRM Module</div>,
}));
vi.mock('../../components/crm/SophiaSalesCRM_NEW', () => ({
  default: () => <div data-testid="SophiaSalesCRM">SophiaSalesCRM Module</div>,
}));
vi.mock('../../components/crm/ZoeExecutiveCRM_NEW', () => ({
  default: () => <div data-testid="ZoeExecutiveCRM">ZoeExecutiveCRM Module</div>,
}));
vi.mock('../../components/crm/TheodoraFinanceCRM_NEW', () => ({
  default: () => <div data-testid="TheodoraFinanceCRM">TheodoraFinanceCRM Module</div>,
}));
vi.mock('../../components/crm/DaisyLeasingCRM_NEW', () => ({
  default: () => <div data-testid="DaisyLeasingCRM">DaisyLeasingCRM Module</div>,
}));
vi.mock('../../components/crm/NadiaWhatsAppCRM', () => ({
  default: () => <div data-testid="NadiaWhatsAppCRM">NadiaWhatsAppCRM Module</div>,
}));

// Mock UI components
vi.mock('../../components/ui', () => ({
  Badge: ({
    children,
    variant,
    size,
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
  }) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

vi.mock('../../components/common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

import CRMHubPage from './CRMHubPage';
import crmDataReducer from '../../store/crmDataSlice';
import userReducer from '../../store/userSlice';
import authReducer from '../../store/authSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = () => {
  return configureStore({
    reducer: {
      crmData: crmDataReducer,
      user: userReducer,
      auth: authReducer,
    },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Arslan Malik', role: 'owner', email: 'arslan@whitecaves.ae' },
        loading: false,
        error: null,
      } as unknown as ReturnType<typeof userReducer>,
      auth: {
        user: { id: 'u1', displayName: 'Arslan Malik', email: 'arslan@whitecaves.ae', role: 'owner' },
        token: 'tok',
        refreshToken: null,
        session: {
          isLoggedIn: true,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 30,
        loading: false,
        error: null,
      } as ReturnType<typeof authReducer>,
    },
  });
};

const renderPage = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <LanguageProvider>
        <CurrencyProvider>
          <MemoryRouter>
            <CRMHubPage />
          </MemoryRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </Provider>
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('CRMHubPage — Modern Atomic ERP Dashboard', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockSearchParamTab = 'dept_summary';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the canonical Executive Command Center without legacy dashboard chrome', async () => {
    renderPage();
    expect(await screen.findByText(/Executive Command Center/i)).toBeInTheDocument();
    expect(screen.queryByText(/DLD Daily Volume:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/3. AI Command Center/i)).not.toBeInTheDocument();
  });

  it('renders decision-oriented live reporting modules', async () => {
    renderPage();
    expect(await screen.findByText(/Lead activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion funnel/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory aging/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent performance/i)).toBeInTheDocument();
  });
});
