import React, { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setLoading } from './store/userSlice';
import { setTheme } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './styles/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import SuspenseLoader from './components/common/SuspenseLoader';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import type { RootState, AppDispatch } from './store/store';
import type { RoleKey } from './config/ROLE_TAB_MAPPING';
import { safeStorage } from './utils/safeStorage';
import { authFetch } from './utils/authFetch';

// Lazy-load components not needed for initial render (performance optimization)
const UniversalComponents = lazy(() => import('./components/layout/UniversalComponents'));
const RoleGateway = lazy(() => import('./components/RoleGateway'));

// All pages lazy-loaded for optimal bundle splitting
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const PendingApprovalPage = lazy(() => import('./pages/auth/PendingApprovalPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

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

// ─── Protected Route ────────────────────────────────────────────────────

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const isAuthLoading = useSelector((state: RootState) => state.user.isLoading);
  const [userData, setUserData] = useState<UserRoleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Wait until auth check completes before making redirect decisions
    if (isAuthLoading) return;
    if (!user) {
      // No authenticated user — skip role lookup
      setUserData(null);
      setIsLoading(false);
      return;
    }
    // SECURITY: Use server-issued user.role as source of truth, not localStorage.
    // localStorage 'userRole' is only used for sub-role preference (e.g., which dashboard view),
    // but the server role must always gate access.
    const serverRole = user.role;
    const stored = safeStorage.getJSON<UserRoleData>('userRole');
    if (stored && typeof stored.role === 'string') {
      // Validate that the stored role is consistent with the server role.
      // Owners/admins can select any sub-view; others must match server role.
      const isPrivileged = serverRole === 'owner' || serverRole === 'admin' || serverRole === 'super_user';
      const effectiveRole = isPrivileged ? stored.role : (serverRole ?? stored.role);
      setUserData({ ...stored, role: effectiveRole });
    } else {
      setUserData(serverRole ? { role: serverRole } as UserRoleData : null);
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

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to={`/${userData.role}/dashboard`} replace />;
  }

  return <>{children}</>;
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

// Leasing Agent Sub-Pages
const TenantScreeningPage = lazy(() => import('./pages/leasing-agent/TenantScreeningPage'));
const ContractManagementPage = lazy(() => import('./pages/leasing-agent/ContractManagementPage'));

// Sales Agent Sub-Pages
const SalesPipelinePage = lazy(() => import('./pages/secondary-sales-agent/SalesPipelinePage'));

// Unified Dashboard (replaces role-specific dashboards)
const UnifiedDashboardPage = lazy(() => import('./pages/UnifiedDashboardPage'));
const NadiaPage = lazy(() => import('./pages/NadiaPage'));

// Owner/MD Sub-Pages (BusinessModelPage, ClientServicesPage removed — redirected to /modern-dashboard)
const SystemHealthPage = lazy(() => import('./pages/owner/SystemHealthPage'));
const WhatsAppDashboardPage = lazy(() => import('./pages/owner/WhatsAppDashboardPage'));
const WhatsAppChatbotPage = lazy(() => import('./pages/owner/WhatsAppChatbotPage'));
const WhatsAppAnalyticsPage = lazy(() => import('./pages/owner/WhatsAppAnalyticsPage'));
const WhatsAppSettingsPage = lazy(() => import('./pages/owner/WhatsAppSettingsPage'));

// CRM Management Pages
const CRMHubPage = lazy(() => import('./pages/crm/CRMHubPage'));
const LeadManagementPage = lazy(() => import('./pages/crm/LeadManagementPage'));
const PropertyManagementPage = lazy(() => import('./pages/crm/PropertyManagementPage'));
const AgentPerformancePage = lazy(() => import('./pages/crm/AgentPerformancePage'));

// Public Pages
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Auth Pages
const UAEPassSuccessPage = lazy(() => import('./pages/auth/UAEPassSuccessPage'));
const SignContractPage = lazy(() => import('./pages/SignContractPage'));
const DesignSystemTest = lazy(() => import('./pages/DesignSystemTest'));

// Analytics & utilities - lazy-loaded to reduce initial bundle
const BiometricPrompt = lazy(() => import('./features/auth/components/BiometricLogin').then(m => ({ default: m.BiometricPrompt })).catch((err) => {
  log.warn('BiometricPrompt module failed to load:', err instanceof Error ? err.message : String(err));
  return { default: () => null };  // Gracefully degrade — biometric is optional
}));
const WebVitalsTracker = lazy(() => import('./components/analytics/WebVitalsTracker'));
const LazySpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })));
import { StatusProvider } from './components/common/StatusNotification';
import { createLogger } from './utils/logger';

const log = createLogger('App');

// ─── App Component ──────────────────────────────────────────────────────

function App(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);

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
        if (err instanceof DOMException && err.name === 'AbortError') return;
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
    const savedTheme = safeStorage.get('theme', 'light')!;
    document.documentElement.setAttribute('data-theme', savedTheme);
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  const handleRoleSelect = (role: string): void => {
    safeStorage.setJSON('userRole', {
      role,
      selectedAt: new Date().toISOString(),
      locked: true,
    });
  };

  return (
    <ThemeProvider>
      <StatusProvider>
        <LanguageProvider>
          <BrowserRouter>
            {/* Accessibility: skip-to-content link (WCAG 2.1 Level A) */}
            <a
              href="#main-content"
              className="skip-to-content"
            >
              Skip to main content
            </a>
            <Suspense fallback={null}>
              <LazySpeedInsights />
            </Suspense>
            <Suspense fallback={null}>
              <WebVitalsTracker />
            </Suspense>
            <Suspense fallback={null}>
              <UniversalComponents />
            </Suspense>
            {user && <Suspense fallback={null}><BiometricPrompt onClose={() => {}} /></Suspense>}
            <main id="main-content" role="main">
            <Routes>
              <Route path="/" element={
                <RouteErrorBoundary section="Home">
                  <Suspense fallback={<SuspenseLoader />}>
                    <HomePage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/properties" element={
                <RouteErrorBoundary section="Properties">
                  <Suspense fallback={<SuspenseLoader />}>
                    <PropertiesPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/property/:id" element={
                <RouteErrorBoundary section="PropertyDetail">
                  <Suspense fallback={<SuspenseLoader />}>
                    <PropertyDetailPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/about" element={
                <RouteErrorBoundary section="About">
                  <Suspense fallback={<SuspenseLoader />}>
                    <AboutPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/services" element={
                <RouteErrorBoundary section="Services">
                  <Suspense fallback={<SuspenseLoader />}>
                    <ServicesPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/careers" element={
                <RouteErrorBoundary section="Careers">
                  <Suspense fallback={<SuspenseLoader />}>
                    <CareersPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/contact" element={
                <RouteErrorBoundary section="Contact">
                  <Suspense fallback={<SuspenseLoader />}>
                    <ContactPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/signin" element={user ? <Navigate to="/select-role" replace /> : <RouteErrorBoundary section="Sign In"><Suspense fallback={<SuspenseLoader />}><SignInPage /></Suspense></RouteErrorBoundary>} />
              <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
              <Route path="/auth/uaepass-success" element={
                <RouteErrorBoundary section="UAE Pass">
                  <Suspense fallback={<SuspenseLoader />}>
                    <UAEPassSuccessPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              <Route path="/profile" element={user ? <RouteErrorBoundary section="Profile"><Suspense fallback={<SuspenseLoader />}><ProfilePage /></Suspense></RouteErrorBoundary> : <Navigate to="/signin" replace />} />
              <Route path="/select-role" element={
                user ? <RouteErrorBoundary section="Role Selection"><Suspense fallback={<SuspenseLoader />}><RoleGateway user={user} onRoleSelect={handleRoleSelect} /></Suspense></RouteErrorBoundary> : <Navigate to="/signin" replace />
              } />
              <Route path="/pending-approval" element={user ? <RouteErrorBoundary section="Pending Approval"><Suspense fallback={<SuspenseLoader />}><PendingApprovalPage /></Suspense></RouteErrorBoundary> : <Navigate to="/signin" replace />} />

              {/* ==================== UNIFIED DASHBOARD ==================== */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <RouteErrorBoundary section="Dashboard">
                      <Suspense fallback={<SuspenseLoader />}>
                        <UnifiedDashboardPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== ROLE-SPECIFIC SUB-PAGES ==================== */}
              <Route path="/buyer/mortgage-calculator" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Mortgage Calculator">
                      <Suspense fallback={<SuspenseLoader />}>
                        <MortgageCalculatorPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/dld-fees" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <RouteErrorBoundary section="DLD Fees">
                      <Suspense fallback={<SuspenseLoader />}>
                        <DLDFeesPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/title-deed-registration" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Title Deed Registration">
                      <Suspense fallback={<SuspenseLoader />}>
                        <TitleDeedRegistrationPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/favorites" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Favorite Listings">
                      <Suspense fallback={<SuspenseLoader />}>
                        <FavoriteListingsPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/saved-searches" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Saved Searches">
                      <Suspense fallback={<SuspenseLoader />}>
                        <SavedSearchesPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/seller/pricing-tools" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Pricing Tools">
                      <Suspense fallback={<SuspenseLoader />}>
                        <PricingToolsPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/landlord/rental-management" element={
                <ProtectedRoute allowedRoles={['landlord']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Rental Management">
                      <Suspense fallback={<SuspenseLoader />}>
                        <RentalManagementPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/leasing-agent/tenant-screening" element={
                <ProtectedRoute allowedRoles={['leasing-agent']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Tenant Screening">
                      <Suspense fallback={<SuspenseLoader />}>
                        <TenantScreeningPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/leasing-agent/contracts" element={
                <ProtectedRoute allowedRoles={['leasing-agent']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Contracts">
                      <Suspense fallback={<SuspenseLoader />}>
                        <ContractManagementPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/secondary-sales-agent/sales-pipeline" element={
                <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Sales Pipeline">
                      <Suspense fallback={<SuspenseLoader />}>
                        <SalesPipelinePage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== ALL DASHBOARD ROUTES → UNIFIED ==================== */}
              {/* Role-specific dashboard paths redirect to unified /dashboard */}
              <Route path="/lion/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/owner/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/md/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/buyer/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/seller/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/landlord/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/leasing-agent/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/secondary-sales-agent/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/tenant/dashboard" element={<Navigate to="/dashboard" replace />} />

              {/* ==================== LEGACY OWNER ROUTES → Redirect to Dashboard ==================== */}
              <Route path="/owner/business-model" element={<Navigate to="/dashboard" replace />} />
              <Route path="/owner/client-services" element={<Navigate to="/dashboard" replace />} />
              <Route path="/modern-dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/owner/system-health" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="System Health">
                      <Suspense fallback={<SuspenseLoader />}>
                        <SystemHealthPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="WhatsApp">
                      <Suspense fallback={<SuspenseLoader />}>
                        <WhatsAppDashboardPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/chatbot" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="WhatsApp Chatbot">
                      <Suspense fallback={<SuspenseLoader />}>
                        <WhatsAppChatbotPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/analytics" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="WhatsApp Analytics">
                      <Suspense fallback={<SuspenseLoader />}>
                        <WhatsAppAnalyticsPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/settings" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="WhatsApp Settings">
                      <Suspense fallback={<SuspenseLoader />}>
                        <WhatsAppSettingsPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== CRM MANAGEMENT ROUTES ==================== */}
              <Route path="/owner/crm" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="CRM Hub">
                      <Suspense fallback={<SuspenseLoader />}>
                        <CRMHubPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/crm/leads" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Lead Management">
                      <Suspense fallback={<SuspenseLoader />}>
                        <LeadManagementPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/crm/properties" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Property Management">
                      <Suspense fallback={<SuspenseLoader />}>
                        <PropertyManagementPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/crm/agents" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <RouteErrorBoundary section="Agent Performance">
                      <Suspense fallback={<SuspenseLoader />}>
                        <AgentPerformancePage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* Nadia AI CRM — WhatsApp Business API Dashboard */}
              <Route path="/nadia" element={
                <ProtectedRoute>
                  <AppLayout>
                    <RouteErrorBoundary section="Nadia AI">
                      <Suspense fallback={<SuspenseLoader />}>
                        <NadiaPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== OTHER ROUTES ==================== */}
              <Route path="/sign/:token" element={
                <RouteErrorBoundary section="Contract Signing">
                  <Suspense fallback={<SuspenseLoader />}>
                    <SignContractPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
              {import.meta.env.DEV && (
                <Route path="/design-system" element={
                  <RouteErrorBoundary section="Design System">
                    <Suspense fallback={<SuspenseLoader />}>
                      <DesignSystemTest />
                    </Suspense>
                  </RouteErrorBoundary>
                } />
              )}
              <Route path="*" element={
                <RouteErrorBoundary section="Not Found">
                  <Suspense fallback={<SuspenseLoader />}>
                    <NotFoundPage />
                  </Suspense>
                </RouteErrorBoundary>
              } />
            </Routes>
            </main>
          </BrowserRouter>
        </LanguageProvider>
      </StatusProvider>
    </ThemeProvider>
  );
}

export default App;
