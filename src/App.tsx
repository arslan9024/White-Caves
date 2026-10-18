import React, { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { setLoading, type AppUser } from './store/userSlice';
import { setTheme, setActiveRole } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './styles/ThemeProvider';
import { UnifiedWorkspaceLayout } from './layouts/UnifiedWorkspaceLayout';
import PortalLayout from './components/portal/PortalLayout';
import SuspenseLoader from './components/common/SuspenseLoader';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import { SQAErrorBoundary } from './components/common/SQAErrorBoundary';
import { AuthModalProvider } from './components/auth/AuthModalProvider';
import type { RootState, AppDispatch } from './store/store';
import { selectSessionUser } from './store/selectors/sessionSelectors';
import { safeStorage } from './utils/safeStorage';
import { authFetch } from './utils/authFetch';
import {
  completeClientLogout,
  finalizeAuthenticatedSession,
  getCurrentPathWithQuery,
  getReturnToFromLocationState,
  resolvePostLoginDestination,
} from './utils/authSession';
import { getPostLoginRoute, getSessionGate, getSessionRole } from './utils/routing';
import {
  isCreatorSuperUserEmail,
  normalizeRoleForUserContext,
  CANONICAL_SUPERUSER_ROLE,
} from './utils/superUserAccess';
import { lazyRetry } from './utils/lazyRetry';

// Lazy-load components not needed for initial render (performance optimization)
const UniversalComponents = lazyRetry(() => import('./components/layout/UniversalComponents'));
const RoleGateway = lazyRetry(() => import('./components/RoleGateway'));

// All pages lazy-loaded for optimal bundle splitting
const ProfilePage = lazyRetry(() => import('./pages/crm/ProfilePage'));
const PendingApprovalPage = lazyRetry(() => import('./pages/auth/PendingApprovalPage'));
const SignInPage = lazyRetry(() => import('./pages/auth/SignInPage'));
const HomePage = lazyRetry(() => import('./pages/HomePage'));
const ServerStatusPage = lazyRetry(() => import('./pages/ServerStatusPage'));
// Removed CompanyDashboard

// ─── Types ──────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function resolveEffectiveRole(user: { role?: string; email?: string } | null): string | null {
  if (isCreatorSuperUserEmail(user?.email, user?.role)) return CANONICAL_SUPERUSER_ROLE;
  return normalizeRoleForUserContext(user?.role, user?.email);
}

function getRoleLandingPath(role: string | null | undefined, email?: string): string {
  return getPostLoginRoute(role, email);
}

const LEGACY_DASHBOARD_REDIRECT_ROUTES: Array<{ path: string; to: string }> = [
  { path: '/lion/dashboard', to: '/crm?tab=overview&cockpit=md' },
  { path: '/owner/dashboard', to: '/crm?tab=overview&cockpit=md' },
  { path: '/md/dashboard', to: '/crm?tab=overview&cockpit=md' },
  { path: '/buyer/dashboard', to: '/crm' },
  { path: '/seller/dashboard', to: '/crm' },
  { path: '/leasing-agent/dashboard', to: '/crm' },
  { path: '/secondary-sales-agent/dashboard', to: '/crm' },
  { path: '/landlord/dashboard', to: '/landlord-portal' },
  { path: '/tenant/dashboard', to: '/tenant-portal' },
];

const LEGACY_OWNER_REDIRECT_ROUTES: Array<{ path: string; to: string }> = [
  { path: '/owner/business-model', to: '/crm?tab=overview&cockpit=md' },
  { path: '/owner/client-services', to: '/crm?tab=overview&cockpit=md' },
  { path: '/modern-dashboard', to: '/crm?tab=overview&cockpit=md' },
];

// ─── Protected Route ────────────────────────────────────────────────────

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);
  if (isAuthLoading) {
    return <SuspenseLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: getCurrentPathWithQuery(location.pathname, location.search, location.hash) }}
      />
    );
  }

  const gate = getSessionGate(user);
  if (gate) {
    return (
      <Navigate
        to={gate}
        replace
        state={{ from: getCurrentPathWithQuery(location.pathname, location.search, location.hash) }}
      />
    );
  }

  if (allowedRoles) {
    const normalizedUserRole = getSessionRole(user.role);
    const normalizedAllowedRoles = new Set(
      allowedRoles.map(role => getSessionRole(role)).filter((role): role is string => Boolean(role))
    );

    if (!normalizedUserRole || !normalizedAllowedRoles.has(normalizedUserRole)) {
      return <Navigate to={getRoleLandingPath(user.role, user.email)} replace />;
    }
  }

  return <>{children}</>;
}

interface GuestOnlyRouteProps {
  children: ReactNode;
}

function GuestOnlyRoute({ children }: GuestOnlyRouteProps): React.JSX.Element {
  const location = useLocation();
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);

  if (isAuthLoading) return <SuspenseLoader />;
  if (!user) return <>{children}</>;

  const returnTo = getReturnToFromLocationState(location.state);
  return <Navigate to={resolvePostLoginDestination({ user, returnTo })} replace />;
}

function DashboardEntryRoute() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);
  const currentActiveRole = useSelector((state: RootState) => state.navigation?.activeRole);
  const { info } = useStatus();
  const hasShownSigninNotice = useRef(false);
  const effectiveRole = resolveEffectiveRole(user);

  useEffect(() => {
    if (!isAuthLoading && !user && !hasShownSigninNotice.current) {
      info('Please sign in to access CRM', {
        title: 'Authentication Required',
        duration: 4500,
      });
      hasShownSigninNotice.current = true;
    }
  }, [isAuthLoading, user, info]);

  // Sync the effective role into the navigation slice so the dashboard always
  // renders with the correct tab set (especially on first login with no localStorage).
  useEffect(() => {
    if (effectiveRole && effectiveRole !== currentActiveRole) {
      dispatch(setActiveRole(effectiveRole));
      safeStorage.setJSON('userRole', {
        role: effectiveRole,
        selectedAt: new Date().toISOString(),
        locked: true,
      });
    }
  }, [effectiveRole, currentActiveRole, dispatch]);

  if (isAuthLoading) {
    return <SuspenseLoader />;
  }

  // Unauthenticated access: redirect home
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: getCurrentPathWithQuery(location.pathname, location.search, location.hash) }}
      />
    );
  }

  if (
    getSessionRole(effectiveRole) === 'landlord' ||
    getSessionRole(effectiveRole) === 'property_owner'
  ) {
    return <Navigate to="/landlord-portal" replace />;
  }

  if (effectiveRole === 'tenant') {
    return <Navigate to="/tenant-portal" replace />;
  }

  return (
    <UnifiedWorkspaceLayout>
      <RouteErrorBoundary section="Dashboard">
        <Suspense fallback={<SuspenseLoader />}>
          <UnifiedDashboardPage />
        </Suspense>
      </RouteErrorBoundary>
    </UnifiedWorkspaceLayout>
  );
}

function SignInRedirect() {
  const location = useLocation();
  return (
    <Navigate
      to="/signin"
      replace
      state={{ from: getCurrentPathWithQuery(location.pathname, location.search, location.hash) }}
    />
  );
}

// ==================== LAZY-LOADED PAGES ====================

// Buyer Sub-Pages
const MortgageCalculatorPage = lazy(() => import('./pages/buyer/MortgageCalculatorPage'));
const DLDFeesPage = lazy(() => import('./pages/buyer/DLDFeesPage'));
const TitleDeedRegistrationPage = lazy(() => import('./pages/buyer/TitleDeedRegistrationPage'));
const FavoriteListingsPage = lazy(() => import('./pages/buyer/FavoriteListings'));
const SavedSearchesPage = lazy(() => import('./pages/buyer/SavedSearches'));

// Seller Sub-Pages
const PricingToolsPage = lazy(() => import('./pages/seller/PricingToolsPage'));

// Landlord Sub-Pages
const RentalManagementPage = lazy(() => import('./pages/landlord/RentalManagementPage'));
const LandlordPortalPage = lazy(() => import('./pages/landlord/LandlordPortalPage'));

// Tenant Sub-Pages
const TenantPortalPage = lazy(() => import('./pages/tenant/TenantPortalPage'));

// Leasing Agent Sub-Pages
const TenantScreeningPage = lazy(() => import('./pages/leasing-agent/TenantScreeningPage'));
const ContractManagementPage = lazy(() => import('./pages/leasing-agent/ContractManagementPage'));

// Sales Agent Sub-Pages
const SalesPipelinePage = lazy(() => import('./pages/secondary-sales-agent/SalesPipelinePage'));

// Leasing Acquisition (Sprint 1)
const LeasingAcquisition = lazy(() => import('./pages/LeasingAcquisition'));

// Unified Dashboard (replaces role-specific dashboards)
const UnifiedDashboardPage = lazy(() => import('./pages/crm/UnifiedDashboardPage'));
const ViewingsPage = lazy(() => import('./pages/crm/ViewingsPage'));
const NadiaPage = lazy(() => import('./pages/NadiaPage'));

// Goals Pages
const ArgentinaGoalPage = lazy(() => import('./pages/goals/ArgentinaGoalPage'));

// Owner/MD Sub-Pages (BusinessModelPage, ClientServicesPage removed — redirected to /modern-dashboard)
const SystemHealthPage = lazy(() => import('./pages/owner/SystemHealthPage'));
const LoginSecurityPage = lazy(() => import('./pages/owner/LoginSecurityPage'));
const WhatsAppDashboardPage = lazy(() => import('./pages/owner/WhatsAppDashboardPage'));
const WhatsAppChatbotPage = lazy(() => import('./pages/owner/WhatsAppChatbotPage'));
const WhatsAppAnalyticsPage = lazy(() => import('./pages/owner/WhatsAppAnalyticsPage'));
const WhatsAppSettingsPage = lazy(() => import('./pages/owner/WhatsAppSettingsPage'));

// Public Pages
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));

// Phase 7 / 8 stubs
const AIIntelligencePage = lazy(() => import('./pages/AIIntelligencePage'));
const OffPlanPortalPage = lazy(() => import('./pages/OffPlanPortalPage'));

// Phase 10 — PWA install prompt (loaded only after first paint)
const PWAInstallPrompt = lazy(() =>
  import('./components/pwa/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt }))
);

// Auth Pages
const UAEPassSuccessPage = lazy(() => import('./pages/auth/UAEPassSuccessPage'));
const SignContractPage = lazy(() => import('./pages/SignContractPage'));
const DesignSystemTest = lazy(() => import('./pages/DesignSystemTest'));
const ValuationPage = lazy(() => import('./pages/ValuationPage'));
const MarketIntelligencePage = lazy(() => import('./pages/MarketIntelligencePage'));

// Analytics & utilities - lazy-loaded to reduce initial bundle
const BiometricPrompt = lazy(() =>
  import('./features/auth/components/BiometricLogin')
    .then(m => ({ default: m.BiometricPrompt }))
    .catch(err => {
      log.warn(
        'BiometricPrompt module failed to load:',
        err instanceof Error ? err.message : String(err)
      );
      return { default: () => null }; // Gracefully degrade — biometric is optional
    })
);
const WebVitalsTracker = lazy(() => import('./components/analytics/WebVitalsTracker'));
import { StatusProvider, useStatus } from './components/common/StatusNotification';
import { createLogger } from './utils/logger';
import { useSocket } from './hooks/useSocket';
// W17-002: Framer Motion — AnimatePresence page transitions
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const log = createLogger('App');

// ─── W17-002: Page transition helpers ───────────────────────────────────────

interface PageTransitionProps {
  children: ReactNode;
}

/** Fades pages in/out; passes children through when reduced motion is preferred. */
function PageTransition({ children }: PageTransitionProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Rendered inside <BrowserRouter> so useLocation() is in Router context.
 * Uses pathname as AnimatePresence key so every route change triggers a fade.
 */
function LocationKeyWrapper({ children }: PageTransitionProps): React.JSX.Element {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{children}</PageTransition>
    </AnimatePresence>
  );
}

function App(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const [authReady, setAuthReady] = useState(false);

  // Initialise real-time Socket.io connection — connects when auth token is
  // present, disconnects on logout, and pushes server events into Redux.
  useSocket();

  useEffect(() => {
    const controller = new AbortController();
    // Mark auth as loading before async check begins
    dispatch(setLoading(true));
    const checkAuth = async () => {
      try {
        const token = safeStorage.get('token');

        if (token) {
          const response = await authFetch('/api/auth/profile', { signal: controller.signal });
          if (controller.signal.aborted || safeStorage.get('token') !== token) return;
          if (response.ok) {
            const result = (await response.json()) as { data?: unknown };
            if (
              !result.data ||
              typeof result.data !== 'object' ||
              !('id' in result.data) ||
              !('email' in result.data) ||
              !('role' in result.data)
            ) {
              throw new Error('Authentication profile response is incomplete');
            }
            finalizeAuthenticatedSession({
              dispatch,
              user: result.data as AppUser,
              token,
              provider: safeStorage.get('loginProvider') ?? 'bootstrap',
              rememberMe: Boolean(safeStorage.getJSON<boolean>('rememberMe')),
            });
          } else {
            completeClientLogout(dispatch);
            dispatch(setLoading(false));
          }
        } else {
          completeClientLogout(dispatch);
          dispatch(setLoading(false));
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        // Auth check failed — user stays logged out
        log.warn('Auth check failed:', err instanceof Error ? err.message : 'Unknown error');
        completeClientLogout(dispatch);
        dispatch(setLoading(false));
      } finally {
        if (!controller.signal.aborted) setAuthReady(true);
      }
    };
    checkAuth();
    return () => controller.abort();
  }, [dispatch]);

  useEffect(() => {
    const savedTheme = safeStorage.get('theme', 'light');
    const themeValue = savedTheme ?? 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    dispatch(setTheme(themeValue));
  }, [dispatch]);

  const handleRoleSelect = (role: string): void => {
    safeStorage.setJSON('userRole', {
      role,
      selectedAt: new Date().toISOString(),
      locked: true,
    });
  };

  const renderProtectedAppPage = (
    page: ReactNode,
    section: string,
    allowedRoles?: string[]
  ): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <UnifiedWorkspaceLayout>
        <RouteErrorBoundary section={section}>
          <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
        </RouteErrorBoundary>
      </UnifiedWorkspaceLayout>
    </ProtectedRoute>
  );

  const renderPublicPage = (page: ReactNode, section: string): ReactNode => (
    <RouteErrorBoundary section={section}>
      <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
    </RouteErrorBoundary>
  );

  const renderSignedInPage = (page: ReactNode, section: string): ReactNode => {
    if (!user) return <SignInRedirect />;
    const gate = getSessionGate(user);
    const sectionGate =
      section === 'Profile'
        ? '/profile'
        : section === 'Role Selection'
          ? '/select-role'
          : '/pending-approval';
    if (gate && gate !== sectionGate) return <Navigate to={gate} replace />;
    if (!gate && section !== 'Profile') {
      return <Navigate to={resolvePostLoginDestination({ user })} replace />;
    }
    return renderPublicPage(page, section);
  };

  const renderGuestOnlyPage = (page: ReactNode, section: string): ReactNode => (
    <GuestOnlyRoute>
      <RouteErrorBoundary section={section}>
        <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
      </RouteErrorBoundary>
    </GuestOnlyRoute>
  );

  const renderProtectedPortalPage = (
    page: ReactNode,
    section: string,
    portalType: 'landlord' | 'tenant',
    allowedRoles: string[]
  ): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PortalLayout portalType={portalType}>
        <RouteErrorBoundary section={section}>
          <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
        </RouteErrorBoundary>
      </PortalLayout>
    </ProtectedRoute>
  );

  const renderProtectedRedirect = (to: string, allowedRoles?: string[]): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Navigate to={to} replace />
    </ProtectedRoute>
  );

  const portalRoutes: Array<{
    path: string;
    section: string;
    portalType: 'landlord' | 'tenant';
    page: ReactNode;
    allowedRoles: string[];
  }> = [
    {
      path: '/landlord-portal',
      section: 'Landlord Portal',
      portalType: 'landlord',
      page: <LandlordPortalPage />,
      allowedRoles: ['landlord', 'property_owner'],
    },
    {
      path: '/tenant-portal',
      section: 'Tenant Portal',
      portalType: 'tenant',
      page: <TenantPortalPage />,
      allowedRoles: ['tenant'],
    },
  ];

  const ownerWhatsAppRoutes: Array<{ path: string; section: string; page: ReactNode }> = [
    { path: '/owner/whatsapp', section: 'WhatsApp', page: <WhatsAppDashboardPage /> },
    {
      path: '/owner/whatsapp/chatbot',
      section: 'WhatsApp Chatbot',
      page: <WhatsAppChatbotPage />,
    },
    {
      path: '/owner/whatsapp/analytics',
      section: 'WhatsApp Analytics',
      page: <WhatsAppAnalyticsPage />,
    },
    {
      path: '/owner/whatsapp/settings',
      section: 'WhatsApp Settings',
      page: <WhatsAppSettingsPage />,
    },
  ];

  const roleSpecificAppRoutes: Array<{
    path: string;
    section: string;
    page: ReactNode;
    allowedRoles: string[];
  }> = [
    {
      path: '/buyer/mortgage-calculator',
      section: 'Mortgage Calculator',
      page: <MortgageCalculatorPage />,
      allowedRoles: ['buyer'],
    },
    {
      path: '/buyer/dld-fees',
      section: 'DLD Fees',
      page: <DLDFeesPage />,
      allowedRoles: ['buyer'],
    },
    {
      path: '/buyer/title-deed-registration',
      section: 'Title Deed Registration',
      page: <TitleDeedRegistrationPage />,
      allowedRoles: ['buyer'],
    },
    {
      path: '/buyer/favorites',
      section: 'Favorite Listings',
      page: <FavoriteListingsPage />,
      allowedRoles: ['buyer'],
    },
    {
      path: '/buyer/saved-searches',
      section: 'Saved Searches',
      page: <SavedSearchesPage />,
      allowedRoles: ['buyer'],
    },
    {
      path: '/seller/pricing-tools',
      section: 'Pricing Tools',
      page: <PricingToolsPage />,
      allowedRoles: ['seller'],
    },
    {
      path: '/landlord/rental-management',
      section: 'Rental Management',
      page: <RentalManagementPage />,
      allowedRoles: ['landlord', 'property_owner'],
    },
    {
      path: '/leasing-agent/tenant-screening',
      section: 'Tenant Screening',
      page: <TenantScreeningPage />,
      allowedRoles: ['leasing-agent'],
    },
    {
      path: '/leasing-agent/contracts',
      section: 'Contracts',
      page: <ContractManagementPage />,
      allowedRoles: ['leasing-agent'],
    },
    {
      path: '/leasing-acquisition',
      section: 'Leasing Acquisition',
      page: <LeasingAcquisition />,
      allowedRoles: ['leasing-agent', 'owner', 'admin'],
    },
    {
      path: '/secondary-sales-agent/sales-pipeline',
      section: 'Sales Pipeline',
      page: <SalesPipelinePage />,
      allowedRoles: ['secondary-sales-agent'],
    },
    {
      path: '/crm/viewings',
      section: 'Viewings',
      page: <ViewingsPage />,
      allowedRoles: ['leasing-agent', 'secondary-sales-agent', 'owner', 'admin'],
    },
  ];

  const ownerCrmRedirectRoutes: Array<{ path: string; to: string }> = [
    { path: '/owner/crm', to: '/crm?tab=overview&cockpit=md' },
    { path: '/owner/crm/leads', to: '/crm?tab=leads&cockpit=md' },
    { path: '/owner/crm/properties', to: '/crm?tab=properties&cockpit=md' },
    { path: '/owner/crm/agents', to: '/crm?tab=agents&cockpit=md' },
  ];

  const ownerUtilityRoutes: Array<{
    path: string;
    section: string;
    page: ReactNode;
    allowedRoles: string[];
  }> = [
    {
      path: '/owner/system-health',
      section: 'System Health',
      page: <SystemHealthPage />,
      allowedRoles: ['owner'],
    },
    {
      path: '/owner/login-security',
      section: 'Login Security',
      page: <LoginSecurityPage />,
      allowedRoles: ['owner', 'admin'],
    },
  ];

  const publicRoutes: Array<{ path: string; section: string; page: ReactNode }> = [
    { path: '/', section: 'Home', page: <HomePage /> },
    { path: '/properties', section: 'Properties', page: <PropertiesPage /> },
    { path: '/property/:id', section: 'PropertyDetail', page: <PropertyDetailPage /> },
    { path: '/about', section: 'About', page: <AboutPage /> },
    { path: '/services', section: 'Services', page: <ServicesPage /> },
    { path: '/careers', section: 'Careers', page: <CareersPage /> },
    { path: '/contact', section: 'Contact', page: <ContactPage /> },
    {
      path: '/privacy-policy',
      section: 'Privacy Policy',
      page: <PrivacyPolicyPage />,
    },
    { path: '/terms', section: 'Terms', page: <TermsPage /> },
    { path: '/tools', section: 'Tools', page: <ToolsPage /> },
    {
      path: '/ai-intelligence',
      section: 'AI Intelligence',
      page: <AIIntelligencePage />,
    },
    {
      path: '/off-plan',
      section: 'Off-Plan Portal',
      page: <OffPlanPortalPage />,
    },
    {
      path: '/valuation',
      section: 'Property Valuation',
      page: <ValuationPage />,
    },
    {
      path: '/market',
      section: 'Market Intelligence',
      page: <MarketIntelligencePage />,
    },
    {
      path: '/auth/uaepass-success',
      section: 'UAE Pass',
      page: <UAEPassSuccessPage />,
    },
    {
      path: '/sign/:token',
      section: 'Contract Signing',
      page: <SignContractPage />,
    },
  ];

  if (!authReady) return <SuspenseLoader />;

  return (
    <SQAErrorBoundary>
      <AuthModalProvider>
        <ThemeProvider>
          <StatusProvider>
            <LanguageProvider>
              <WorkspaceProvider>
                <BrowserRouter>
                  {/* Accessibility: skip-to-content link (WCAG 2.1 Level A) */}
                  <a href="#main-content" className="skip-to-content">
                    Skip to main content
                  </a>
                  <SpeedInsights />
                  <Suspense fallback={null}>
                    <WebVitalsTracker />
                  </Suspense>
                  <Suspense fallback={null}>
                    <UniversalComponents />
                  </Suspense>
                  {/* Phase 10 — PWA install banner (loads after idle) */}
                  <Suspense fallback={null}>
                    <PWAInstallPrompt />
                  </Suspense>
                  {user && (
                    <Suspense fallback={null}>
                      <BiometricPrompt onClose={() => {}} />
                    </Suspense>
                  )}
                  <main id="main-content" role="main">
                    <LocationKeyWrapper>
                      <Routes>
                        {publicRoutes.map(route => (
                          <Route
                            key={`public-${route.path}`}
                            path={route.path}
                            element={renderPublicPage(route.page, route.section)}
                          />
                        ))}
                        <Route
                          path="/signin"
                          element={renderGuestOnlyPage(<SignInPage />, 'Sign In')}
                        />
                        <Route
                          path="/signup"
                          element={renderGuestOnlyPage(<SignInPage />, 'Sign Up')}
                        />
                        <Route path="/login" element={<Navigate to="/signin" replace />} />
                        <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
                        <Route
                          path="/forgot-password"
                          element={renderGuestOnlyPage(<SignInPage />, 'Forgot Password')}
                        />
                        <Route
                          path="/reset-password"
                          element={renderGuestOnlyPage(<SignInPage />, 'Reset Password')}
                        />
                        <Route
                          path="/profile"
                          element={renderSignedInPage(
                            <UnifiedWorkspaceLayout
                              currentUserEmail={user?.email ?? ''}
                              currentUserRole={user?.role}
                              currentUserAccessLevel={user?.accessLevel}
                            >
                              <RouteErrorBoundary section="Profile">
                                <Suspense fallback={<SuspenseLoader />}>
                                  <ProfilePage />
                                </Suspense>
                              </RouteErrorBoundary>
                            </UnifiedWorkspaceLayout>,
                            'Profile'
                          )}
                        />
                        <Route
                          path="/select-role"
                          element={renderSignedInPage(
                            <RoleGateway user={user ?? {}} onRoleSelect={handleRoleSelect} />,
                            'Role Selection'
                          )}
                        />
                        <Route
                          path="/pending-approval"
                          element={renderSignedInPage(<PendingApprovalPage />, 'Pending Approval')}
                        />
                        <Route
                          path="/status"
                          element={renderProtectedAppPage(<ServerStatusPage />, 'Server Status', [
                            'owner',
                          ])}
                        />

                        {/* ==================== UNIFIED DASHBOARD ==================== */}
                        <Route
                          path="/crm/:department?"
                          element={
                            <ProtectedRoute>
                              <DashboardEntryRoute />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/dashboard" element={<Navigate to="/crm" replace />} />

                        {/* ==================== ROLE-SPECIFIC SUB-PAGES ==================== */}
                        {roleSpecificAppRoutes.map(route => (
                          <Route
                            key={`role-specific-${route.path}`}
                            path={route.path}
                            element={renderProtectedAppPage(
                              route.page,
                              route.section,
                              route.allowedRoles
                            )}
                          />
                        ))}

                        {/* ==================== PORTAL ROUTES (Phase 2) ==================== */}
                        {portalRoutes.map(route => (
                          <Route
                            key={`portal-${route.path}`}
                            path={route.path}
                            element={renderProtectedPortalPage(
                              route.page,
                              route.section,
                              route.portalType,
                              route.allowedRoles
                            )}
                          />
                        ))}

                        {/* ==================== ALL DASHBOARD ROUTES → UNIFIED ==================== */}
                        {/* Role-specific dashboard paths redirect to canonical targets */}
                        {LEGACY_DASHBOARD_REDIRECT_ROUTES.map(route => (
                          <Route
                            key={`legacy-dashboard-${route.path}`}
                            path={route.path}
                            element={<Navigate to={route.to} replace />}
                          />
                        ))}

                        {/* ==================== LEGACY OWNER ROUTES → Redirect to Dashboard ==================== */}
                        {LEGACY_OWNER_REDIRECT_ROUTES.map(route => (
                          <Route
                            key={`legacy-owner-${route.path}`}
                            path={route.path}
                            element={<Navigate to={route.to} replace />}
                          />
                        ))}
                        {ownerUtilityRoutes.map(route => (
                          <Route
                            key={`owner-utility-${route.path}`}
                            path={route.path}
                            element={renderProtectedAppPage(
                              route.page,
                              route.section,
                              route.allowedRoles
                            )}
                          />
                        ))}
                        {ownerWhatsAppRoutes.map(route => (
                          <Route
                            key={`owner-whatsapp-${route.path}`}
                            path={route.path}
                            element={renderProtectedAppPage(route.page, route.section, ['owner'])}
                          />
                        ))}

                        {/* ==================== CRM MANAGEMENT ROUTES ==================== */}
                        {ownerCrmRedirectRoutes.map(route => (
                          <Route
                            key={`owner-crm-${route.path}`}
                            path={route.path}
                            element={renderProtectedRedirect(route.to, ['owner'])}
                          />
                        ))}

                        {/* Personal Goals */}
                        <Route
                          path="/owner/goals/argentina"
                          element={
                            <ProtectedRoute allowedRoles={['owner']}>
                              <UnifiedWorkspaceLayout>
                                <RouteErrorBoundary section="Argentina Goal">
                                  <Suspense fallback={<SuspenseLoader />}>
                                    <ArgentinaGoalPage />
                                  </Suspense>
                                </RouteErrorBoundary>
                              </UnifiedWorkspaceLayout>
                            </ProtectedRoute>
                          }
                        />

                        {/* Nadia AI CRM — WhatsApp Business API Dashboard */}
                        <Route
                          path="/nadia"
                          element={renderProtectedAppPage(<NadiaPage />, 'Nadia AI')}
                        />

                        {/* ==================== OTHER ROUTES ==================== */}
                        {import.meta.env.DEV && (
                          <Route
                            path="/design-system"
                            element={renderPublicPage(<DesignSystemTest />, 'Design System')}
                          />
                        )}
                        <Route path="*" element={renderPublicPage(<NotFoundPage />, 'Not Found')} />
                      </Routes>
                    </LocationKeyWrapper>
                  </main>
                </BrowserRouter>
              </WorkspaceProvider>
            </LanguageProvider>
          </StatusProvider>
        </ThemeProvider>
      </AuthModalProvider>
    </SQAErrorBoundary>
  );
}

export default App;
