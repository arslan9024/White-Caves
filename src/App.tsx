import React, { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { setUser, setLoading } from './store/userSlice';
import { setTheme, setActiveRole } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './styles/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import PortalLayout from './components/portal/PortalLayout';
import SuspenseLoader from './components/common/SuspenseLoader';
import RouteErrorBoundary from './components/RouteErrorBoundary';
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
import type { RootState, AppDispatch } from './store/store';
import { selectSessionUser } from './store/selectors/sessionSelectors';
import { safeStorage } from './utils/safeStorage';
import { authFetch } from './utils/authFetch';
import {
  CANONICAL_SUPERUSER_ROLE,
  isCreatorSuperUserEmail,
  normalizeRoleForUserContext,
} from './utils/superUserAccess';

// Lazy-load components not needed for initial render (performance optimization)
const UniversalComponents = lazy(() => import('./components/layout/UniversalComponents'));
const RoleGateway = lazy(() => import('./components/RoleGateway'));

// All pages lazy-loaded for optimal bundle splitting
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const PendingApprovalPage = lazy(() => import('./pages/auth/PendingApprovalPage'));
const HomePage = lazy(() => import('./pages/HomePage.tsx'));

// ─── Types ──────────────────────────────────────────────────────────────

interface UserRoleData {
  role: string;
  selectedAt: string;
  locked: boolean;
  status?: string;
}

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function resolveEffectiveRole(
  user: { role?: string; email?: string } | null,
  storedRoleData: UserRoleData | null
): string | null {
  if (isCreatorSuperUserEmail(user?.email)) return CANONICAL_SUPERUSER_ROLE;

  const serverRole = normalizeRoleForUserContext(user?.role, user?.email);
  const storedRole = normalizeRoleForUserContext(storedRoleData?.role, user?.email);

  if (storedRoleData && typeof storedRoleData.role === 'string') {
    return serverRole ?? storedRole;
  }

  return serverRole;
}

function getRoleLandingPath(role: string | null | undefined, email?: string): string {
  const normalizedRole = normalizeRoleForUserContext(role, email);

  if (normalizedRole === 'landlord' || normalizedRole === 'property-owner') {
    return '/landlord-portal';
  }

  if (normalizedRole === 'tenant') {
    return '/tenant-portal';
  }

  return '/crm';
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
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);
  const [userData, setUserData] = useState<UserRoleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Wait until auth check completes before making redirect decisions
    if (isAuthLoading) return;
    if (!user) {
      // No authenticated user — skip role lookup
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserData(null);
      setIsLoading(false);
      return;
    }
    // SECURITY: Use server-issued user.role as source of truth, not localStorage.
    // localStorage 'userRole' is only used for sub-role preference (e.g., which dashboard view),
    // but the server role must always gate access.
    const stored = safeStorage.getJSON<UserRoleData>('userRole');
    const effectiveRole = resolveEffectiveRole(user, stored);

    if (stored && typeof stored.role === 'string' && effectiveRole) {
      setUserData({ ...stored, role: effectiveRole });
    } else {
      setUserData(effectiveRole ? ({ role: effectiveRole } as UserRoleData) : null);
    }
    setIsLoading(false);
  }, [user, isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return <SuspenseLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!userData) {
    return <Navigate to="/select-role" replace />;
  }

  if (userData.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (allowedRoles) {
    const normalizedUserRole = normalizeRoleForUserContext(userData.role, user?.email);
    const normalizedAllowedRoles = new Set(
      allowedRoles
        .map(role => normalizeRoleForUserContext(role, user?.email))
        .filter((role): role is string => Boolean(role))
    );

    if (!normalizedUserRole || !normalizedAllowedRoles.has(normalizedUserRole)) {
      return <Navigate to={getRoleLandingPath(userData.role, user?.email)} replace />;
    }
  }

  return <>{children}</>;
}

function DashboardEntryRoute() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectSessionUser(state));
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);
  const currentActiveRole = useSelector((state: RootState) => state.navigation?.activeRole);
  const { info } = useStatus();
  const hasShownSigninNotice = useRef(false);
  const storedRoleData = safeStorage.getJSON<UserRoleData>('userRole');
  const effectiveRole = resolveEffectiveRole(user, storedRoleData);

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
    return <Navigate to="/signin" replace />;
  }

  if (effectiveRole === 'landlord' || effectiveRole === 'property-owner') {
    return <Navigate to="/landlord-portal" replace />;
  }

  if (effectiveRole === 'tenant') {
    return <Navigate to="/tenant-portal" replace />;
  }

  return (
    <AppLayout>
      <RouteErrorBoundary section="Dashboard">
        <Suspense fallback={<SuspenseLoader />}>
          <UnifiedDashboardPage />
        </Suspense>
      </RouteErrorBoundary>
    </AppLayout>
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
const UnifiedDashboardPage = lazy(() => import('./pages/UnifiedDashboardPage'));
const NadiaPage = lazy(() => import('./pages/NadiaPage'));

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

const log = createLogger('App');

// ─── App Component ──────────────────────────────────────────────────────

function App(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectSessionUser(state));

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
          if (controller.signal.aborted) return;
          if (response.ok) {
            const result = await response.json();
            dispatch(setUser(result.data));
          } else {
            safeStorage.remove('token');
            dispatch(setLoading(false));
          }
        } else {
          dispatch(setLoading(false));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Avoid indefinite loading states during navigation/StrictMode aborts in development
          dispatch(setLoading(false));
          return;
        }
        // Auth check failed — user stays logged out
        log.warn('Auth check failed:', err instanceof Error ? err.message : 'Unknown error');
        safeStorage.remove('token');
        dispatch(setLoading(false));
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
      <AppLayout>
        <RouteErrorBoundary section={section}>
          <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
        </RouteErrorBoundary>
      </AppLayout>
    </ProtectedRoute>
  );

  const renderPublicPage = (page: ReactNode, section: string): ReactNode => (
    <RouteErrorBoundary section={section}>
      <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
    </RouteErrorBoundary>
  );

  const renderSignedInPage = (page: ReactNode, section: string): ReactNode =>
    user ? renderPublicPage(page, section) : <Navigate to="/signin" replace />;

  const renderGuestOnlyPage = (page: ReactNode, section: string): ReactNode =>
    user ? <Navigate to="/profile" replace /> : renderPublicPage(page, section);

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
      allowedRoles: ['landlord'],
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
      allowedRoles: ['landlord'],
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

  return (
    <ThemeProvider>
      <StatusProvider>
        <LanguageProvider>
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
                <Route path="/login" element={<Navigate to="/signin" replace />} />
                <Route
                  path="/signup"
                  element={renderGuestOnlyPage(<SignInPage />, 'Sign Up')}
                />
                <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
                <Route
                  path="/profile"
                  element={renderSignedInPage(<ProfilePage />, 'Profile')}
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

                {/* ==================== UNIFIED DASHBOARD ==================== */}
                <Route
                  path="/crm"
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
                    element={renderProtectedAppPage(route.page, route.section, route.allowedRoles)}
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
                    element={renderProtectedAppPage(route.page, route.section, route.allowedRoles)}
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
                <Route
                  path="*"
                  element={renderPublicPage(<NotFoundPage />, 'Not Found')}
                />
              </Routes>
            </main>
          </BrowserRouter>
        </LanguageProvider>
      </StatusProvider>
    </ThemeProvider>
  );
}

export default App;
