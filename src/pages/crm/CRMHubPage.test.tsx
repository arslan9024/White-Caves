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

const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let mockSearchParamTab = 'dept_summary';
let mockSearchParamTile: string | null = null;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      {
        get: (key: string) => {
          if (key === 'tab') return mockSearchParamTab;
          if (key === 'tile') return mockSearchParamTile;
          return null;
        },
      },
      mockSetSearchParams,
    ],
  };
});

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

const createMockStore = () => {
  return configureStore({
    reducer: {
      crmData: crmDataReducer,
      user: userReducer,
      auth: authReducer,
    },
    preloadedState: {
      user: {
        currentUser: {
          id: 'u1',
          name: 'Arslan Malik',
          role: 'managing_director',
          email: 'arslanmalikgoraha@gmail.com',
        },
        loading: false,
        error: null,
      } as unknown as ReturnType<typeof userReducer>,
      auth: {
        user: {
          id: 'u1',
          displayName: 'Arslan Malik',
          email: 'arslanmalikgoraha@gmail.com',
          role: 'managing_director',
        },
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

describe('CRMHubPage — Modern Atomic ERP Dashboard', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
    mockSearchParamTab = 'dept_summary';
    mockSearchParamTile = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Global ERP Command Core header, live ticker, and 3-Tile Sidebar', () => {
    renderPage();

    expect(screen.getByText(/White Caves Real Estate LLC — ERP Command Core/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Meta-Tag:/i)).toBeInTheDocument();

    expect(screen.getByText(/USD \/ AED:/i)).toBeInTheDocument();
    expect(screen.getByText(/DLD Daily Volume:/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'DLD Market Intelligence' })).toBeInTheDocument();

    expect(screen.getByTestId('md-command-strip')).toBeInTheDocument();
    expect(screen.getByText(/1. MD Office \(MD Suite\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Corporate Departments \(12 Depts\)/i)).toBeInTheDocument();
    expect(screen.getByText(/3. AI Command Center/i)).toBeInTheDocument();
  });

  it('renders Department Executive Overview with mission scope cards and launchpad', () => {
    mockSearchParamTile = 'corporate';
    renderPage();

    expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/🎯 Mission Operational Scope/i)).toBeInTheDocument();
    expect(screen.getByText(/⚡ Operational Sub-Nodes Launchpad/i)).toBeInTheDocument();
  });

  it('toggles collapsible top header bar', () => {
    renderPage();

    const hideHeaderBtn = screen.getByTitle('Collapse Top Header Bar');
    fireEvent.click(hideHeaderBtn);

    expect(screen.getByTitle('Expand Top Header Bar')).toBeInTheDocument();

    const showHeaderBtn = screen.getByTitle('Expand Top Header Bar');
    fireEvent.click(showHeaderBtn);

    expect(screen.getByTitle('Collapse Top Header Bar')).toBeInTheDocument();
  });

  it('toggles sidebar collapse state cleanly', () => {
    renderPage();

    const toggleBtn = screen.getByTitle('Collapse Sidebar');
    fireEvent.click(toggleBtn);

    expect(screen.getByTitle('Expand Sidebar')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Expand Sidebar'));
    expect(screen.getByTitle('Collapse Sidebar')).toBeInTheDocument();
  });

  it('opens and switches to Tile 1 (MD Sovereign Suite)', () => {
    mockSearchParamTile = 'corporate';
    renderPage();

    const mdTile = screen.getByText(/1. MD Office \(MD Suite\)/i);
    fireEvent.click(mdTile);

    expect(screen.getByText(/Office of the Managing Director \(MD Suite\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 7 \(Ultimate Sovereign Access\)/i)).toBeInTheDocument();
  });

  it('opens Tile 3 AI Command Center and selects an AI Assistant with URL update', async () => {
    renderPage();

    const aiTile = screen.getByText(/3. AI Command Center/i);
    fireEvent.click(aiTile);

    expect(screen.getAllByText(/Nadia AI/i).length).toBeGreaterThanOrEqual(1);
    expect(mockSetSearchParams).toHaveBeenCalled();
  });
});
