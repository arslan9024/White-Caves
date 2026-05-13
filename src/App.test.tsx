/**
 * App.test.tsx — Batch 31
 * Comprehensive tests for App root component
 * Covers: routing, auth state, protected routes, role redirects,
 *         theme initialization, lazy-loaded pages, ProtectedRoute logic
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';

// ─── Mock modules before import ─────────────────────────────────────────

// Mock safeStorage — use vi.hoisted to avoid hoisting issues
const { mockSafeStorage, mockAuthFetch } = vi.hoisted(() => ({
  mockSafeStorage: {
    get: vi.fn((_key: string, fallback?: string) => fallback ?? null),
    getJSON: vi.fn((_key: string) => null),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
  mockAuthFetch: vi.fn(),
}));

vi.mock('./utils/safeStorage', () => ({
  safeStorage: mockSafeStorage,
}));

vi.mock('./utils/authFetch', () => ({
  authFetch: (...args: any[]) => mockAuthFetch(...args),
}));

// Mock logger
vi.mock('./utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// Mock ThemeProvider
vi.mock('./styles/ThemeProvider', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
}));

// Mock LanguageProvider
vi.mock('./context/LanguageContext', () => ({
  LanguageProvider: ({ children }: any) => <div data-testid="language-provider">{children}</div>,
}));

// Mock StatusProvider
vi.mock('./components/common/StatusNotification', () => ({
  StatusProvider: ({ children }: any) => <div data-testid="status-provider">{children}</div>,
  useStatus: () => ({
    notifications: [],
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clear: vi.fn(),
  }),
}));

// Mock AppLayout
vi.mock('./components/layout/AppLayout', () => ({
  default: ({ children }: any) => <div data-testid="app-layout">{children}</div>,
}));

// Mock SuspenseLoader
vi.mock('./components/common/SuspenseLoader', () => ({
  default: () => <div data-testid="suspense-loader">Loading...</div>,
}));

// Mock RouteErrorBoundary
vi.mock('./components/RouteErrorBoundary', () => ({
  default: ({ children, section }: any) => (
    <div data-testid={`error-boundary-${section}`}>{children}</div>
  ),
}));

// Mock lazy-loaded page components with simple stubs
vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/PropertiesPage', () => ({
  default: () => <div data-testid="properties-page">Properties Page</div>,
}));

vi.mock('./pages/AboutPage', () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('./pages/ServicesPage', () => ({
  default: () => <div data-testid="services-page">Services Page</div>,
}));

vi.mock('./pages/CareersPage', () => ({
  default: () => <div data-testid="careers-page">Careers Page</div>,
}));

vi.mock('./pages/ContactPage', () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>,
}));

vi.mock('./pages/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page">404 Not Found</div>,
}));

vi.mock('./pages/auth/SignInPage', () => ({
  default: () => <div data-testid="signin-page">Sign In</div>,
}));

vi.mock('./pages/auth/ProfilePage', () => ({
  default: () => <div data-testid="profile-page">Profile</div>,
}));

vi.mock('./pages/auth/PendingApprovalPage', () => ({
  default: () => <div data-testid="pending-page">Pending Approval</div>,
}));

vi.mock('./pages/auth/UAEPassSuccessPage', () => ({
  default: () => <div data-testid="uaepass-page">UAE Pass</div>,
}));

vi.mock('./pages/UnifiedDashboardPage', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));

vi.mock('./pages/buyer/MortgageCalculatorPage', () => ({
  default: () => <div data-testid="mortgage-page">Mortgage Calculator</div>,
}));

vi.mock('./pages/buyer/DLDFeesPage', () => ({
  default: () => <div data-testid="dld-fees-page">DLD Fees</div>,
}));

vi.mock('./pages/buyer/TitleDeedRegistrationPage', () => ({
  default: () => <div data-testid="title-deed-page">Title Deed</div>,
}));

vi.mock('./pages/seller/PricingToolsPage', () => ({
  default: () => <div data-testid="pricing-tools-page">Pricing Tools</div>,
}));

vi.mock('./pages/landlord/RentalManagementPage', () => ({
  default: () => <div data-testid="rental-page">Rental Management</div>,
}));

vi.mock('./pages/landlord/LandlordPortalPage', () => ({
  default: () => <div data-testid="landlord-portal-page">Landlord Portal</div>,
}));

vi.mock('./pages/tenant/TenantPortalPage', () => ({
  default: () => <div data-testid="tenant-portal-page">Tenant Portal</div>,
}));

vi.mock('./pages/leasing-agent/TenantScreeningPage', () => ({
  default: () => <div data-testid="tenant-screening-page">Tenant Screening</div>,
}));

vi.mock('./pages/leasing-agent/ContractManagementPage', () => ({
  default: () => <div data-testid="contracts-page">Contract Management</div>,
}));

vi.mock('./pages/secondary-sales-agent/SalesPipelinePage', () => ({
  default: () => <div data-testid="pipeline-page">Sales Pipeline</div>,
}));

vi.mock('./pages/owner/SystemHealthPage', () => ({
  default: () => <div data-testid="system-health-page">System Health</div>,
}));

vi.mock('./pages/owner/WhatsAppDashboardPage', () => ({
  default: () => <div data-testid="whatsapp-page">WhatsApp Dashboard</div>,
}));

vi.mock('./pages/owner/WhatsAppChatbotPage', () => ({
  default: () => <div data-testid="whatsapp-chatbot-page">WhatsApp Chatbot</div>,
}));

vi.mock('./pages/owner/WhatsAppAnalyticsPage', () => ({
  default: () => <div data-testid="whatsapp-analytics-page">WhatsApp Analytics</div>,
}));

vi.mock('./pages/owner/WhatsAppSettingsPage', () => ({
  default: () => <div data-testid="whatsapp-settings-page">WhatsApp Settings</div>,
}));

vi.mock('./pages/crm/CRMHubPage', () => ({
  default: () => <div data-testid="crm-hub-page">CRM Hub</div>,
}));

vi.mock('./pages/crm/LeadManagementPage', () => ({
  default: () => <div data-testid="lead-management-page">Lead Management</div>,
}));

vi.mock('./pages/crm/PropertyManagementPage', () => ({
  default: () => <div data-testid="property-management-page">Property Management</div>,
}));

vi.mock('./pages/crm/AgentPerformancePage', () => ({
  default: () => <div data-testid="agent-performance-page">Agent Performance</div>,
}));

vi.mock('./pages/SignContractPage', () => ({
  default: () => <div data-testid="sign-contract-page">Sign Contract</div>,
}));

vi.mock('./pages/DesignSystemTest', () => ({
  default: () => <div data-testid="design-system-page">Design System</div>,
}));

vi.mock('./components/RoleGateway', () => ({
  default: ({ onRoleSelect }: any) => (
    <div data-testid="role-gateway">
      <button onClick={() => onRoleSelect('buyer')}>Select Buyer</button>
    </div>
  ),
}));

// Mock optional components (can fail to load)
vi.mock('./components/layout/UniversalComponents', () => ({
  default: () => <div data-testid="universal-components" />,
}));

vi.mock('./features/auth/components/BiometricLogin', () => ({
  BiometricPrompt: () => <div data-testid="biometric-prompt" />,
}));

vi.mock('./components/analytics/WebVitalsTracker', () => ({
  default: () => <div data-testid="web-vitals-tracker" />,
}));

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

// ─── Mock Redux ─────────────────────────────────────────────────────────
const { mockReduxState, mockDispatchFn } = vi.hoisted(() => ({
  mockReduxState: {
    currentUser: null as any,
    isLoading: false,
  },
  mockDispatchFn: vi.fn((action: any) => action),
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: any) => {
    const state = {
      user: {
        currentUser: mockReduxState.currentUser,
        isLoading: mockReduxState.isLoading,
      },
      navigation: {
        theme: 'light',
      },
    };
    return selector(state);
  },
  useDispatch: () => mockDispatchFn,
}));

vi.mock('./store/userSlice', () => ({
  setUser: vi.fn((data: any) => ({ type: 'user/setUser', payload: data })),
  setLoading: vi.fn((val: boolean) => ({ type: 'user/setLoading', payload: val })),
}));

vi.mock('./store/navigationSlice', () => ({
  setTheme: vi.fn((theme: string) => ({ type: 'navigation/setTheme', payload: theme })),
}));

// Now import the component
import App from './App';

// ─── Helper to render with specific route ───────────────────────────────
// BrowserRouter is inside App, so we need to set window.location before render
function renderAtRoute(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReduxState.currentUser = null;
    mockReduxState.isLoading = false;
    mockSafeStorage.get.mockReturnValue(null);
    mockSafeStorage.getJSON.mockReturnValue(null);
    mockAuthFetch.mockResolvedValue({ ok: false });
    window.history.pushState({}, '', '/');
  });

  // ── Core Rendering ──

  it('renders without crashing', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('renders ThemeProvider wrapper', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('renders LanguageProvider wrapper', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    expect(screen.getByTestId('language-provider')).toBeInTheDocument();
  });

  it('renders StatusProvider wrapper', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    expect(screen.getByTestId('status-provider')).toBeInTheDocument();
  });

  it('renders skip-to-content link for accessibility', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('renders main content area with correct role', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(main?.getAttribute('role')).toBe('main');
  });

  // ── Public Routes ──

  it('renders HomePage at root route', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('renders PropertiesPage at /properties', async () => {
    await act(async () => {
      renderAtRoute('/properties');
    });
    await waitFor(() => {
      expect(screen.getByTestId('properties-page')).toBeInTheDocument();
    });
  });

  it('renders AboutPage at /about', async () => {
    await act(async () => {
      renderAtRoute('/about');
    });
    await waitFor(() => {
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });
  });

  it('renders ServicesPage at /services', async () => {
    await act(async () => {
      renderAtRoute('/services');
    });
    await waitFor(() => {
      expect(screen.getByTestId('services-page')).toBeInTheDocument();
    });
  });

  it('renders CareersPage at /careers', async () => {
    await act(async () => {
      renderAtRoute('/careers');
    });
    await waitFor(() => {
      expect(screen.getByTestId('careers-page')).toBeInTheDocument();
    });
  });

  it('renders ContactPage at /contact', async () => {
    await act(async () => {
      renderAtRoute('/contact');
    });
    await waitFor(() => {
      expect(screen.getByTestId('contact-page')).toBeInTheDocument();
    });
  });

  it('renders NotFoundPage at unknown route', async () => {
    await act(async () => {
      renderAtRoute('/some-nonexistent-page');
    });
    await waitFor(() => {
      expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    });
  });

  // ── Auth Routes ──

  it('renders SignInPage at /signin when not logged in', async () => {
    await act(async () => {
      renderAtRoute('/signin');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });

  it('renders SignInPage at /signup when not logged in', async () => {
    await act(async () => {
      renderAtRoute('/signup');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });

  it('redirects /signin to /dashboard when logged in', async () => {
    mockReduxState.currentUser = { id: '1', role: 'buyer', email: 'test@test.com' };
    await act(async () => {
      renderAtRoute('/signin');
    });
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('redirects /signup to /dashboard when logged in', async () => {
    mockReduxState.currentUser = { id: '1', role: 'buyer', email: 'test@test.com' };
    await act(async () => {
      renderAtRoute('/signup');
    });
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('redirects /auth/signin to /signin', async () => {
    await act(async () => {
      renderAtRoute('/auth/signin');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });

  it('redirects /login to /signin', async () => {
    await act(async () => {
      renderAtRoute('/login');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });

  // ── Profile Route ──

  it('redirects /profile to /signin when not logged in', async () => {
    await act(async () => {
      renderAtRoute('/profile');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });

  it('renders ProfilePage at /profile when logged in', async () => {
    mockReduxState.currentUser = { id: '1', role: 'buyer', email: 'test@test.com' };
    await act(async () => {
      renderAtRoute('/profile');
    });
    await waitFor(() => {
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });
  });

  // ── Auth Initialization ──

  it('dispatches setLoading(true) on mount', async () => {
    await act(async () => {
      renderAtRoute('/');
    });
    const { setLoading } = await import('./store/userSlice');
    expect(setLoading).toHaveBeenCalledWith(true);
  });

  it('checks token on mount via authFetch', async () => {
    mockSafeStorage.get.mockReturnValue('test-token');
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: '1', role: 'buyer' } }),
    });
    await act(async () => {
      renderAtRoute('/');
    });
    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/auth/profile',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('sets theme from localStorage on mount', async () => {
    mockSafeStorage.get.mockReturnValue('dark');
    await act(async () => {
      renderAtRoute('/');
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('removes token if auth check fails', async () => {
    mockSafeStorage.get.mockReturnValue('bad-token');
    mockAuthFetch.mockResolvedValue({ ok: false });
    await act(async () => {
      renderAtRoute('/');
    });
    await waitFor(() => {
      expect(mockSafeStorage.remove).toHaveBeenCalledWith('token');
    });
  });

  // ── Dashboard Route Redirects ──

  it('redirects /lion/dashboard to /dashboard', async () => {
    mockReduxState.currentUser = { id: '1', role: 'owner', email: 'test@test.com' };
    mockSafeStorage.getJSON.mockReturnValue({ role: 'owner', selectedAt: '', locked: true } as any);
    await act(async () => {
      renderAtRoute('/lion/dashboard');
    });
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('redirects /modern-dashboard to /dashboard', async () => {
    mockReduxState.currentUser = { id: '1', role: 'owner', email: 'test@test.com' };
    mockSafeStorage.getJSON.mockReturnValue({ role: 'owner', selectedAt: '', locked: true } as any);
    await act(async () => {
      renderAtRoute('/modern-dashboard');
    });
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('redirects /crm to /dashboard', async () => {
    mockReduxState.currentUser = { id: '1', role: 'owner', email: 'test@test.com' };
    mockSafeStorage.getJSON.mockReturnValue({ role: 'owner', selectedAt: '', locked: true } as any);
    await act(async () => {
      renderAtRoute('/crm');
    });
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  // ── Protected Route ──

  it('redirects unauthenticated user from /dashboard to /', async () => {
    mockReduxState.isLoading = false;
    mockReduxState.currentUser = null;
    await act(async () => {
      renderAtRoute('/dashboard');
    });
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('shows dashboard when user has server role but no localStorage role data', async () => {
    mockReduxState.currentUser = { id: '1', role: 'buyer', email: 'test@test.com' };
    mockSafeStorage.getJSON.mockReturnValue(null);
    await act(async () => {
      renderAtRoute('/dashboard');
    });
    // ProtectedRoute uses server role as fallback, so dashboard renders
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('redirects landlord from /dashboard to /landlord-portal', async () => {
    mockReduxState.currentUser = { id: '1', role: 'landlord', email: 'landlord@test.com' };
    mockSafeStorage.getJSON.mockReturnValue(null);

    await act(async () => {
      renderAtRoute('/dashboard');
    });

    await waitFor(() => {
      expect(screen.getByTestId('landlord-portal-page')).toBeInTheDocument();
    });
  });

  it('redirects tenant from /dashboard to /tenant-portal using server role as source of truth', async () => {
    mockReduxState.currentUser = { id: '1', role: 'tenant', email: 'tenant@test.com' };
    mockSafeStorage.getJSON.mockReturnValue({ role: 'owner', selectedAt: '', locked: true } as any);

    await act(async () => {
      renderAtRoute('/dashboard');
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-portal-page')).toBeInTheDocument();
    });
  });

  // ── Select Role Route ──

  it('renders RoleGateway at /select-role when logged in', async () => {
    mockReduxState.currentUser = { id: '1', role: 'buyer', email: 'test@test.com' };
    await act(async () => {
      renderAtRoute('/select-role');
    });
    await waitFor(() => {
      expect(screen.getByTestId('role-gateway')).toBeInTheDocument();
    });
  });

  it('redirects /select-role to /signin when not logged in', async () => {
    await act(async () => {
      renderAtRoute('/select-role');
    });
    await waitFor(() => {
      expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    });
  });
});
