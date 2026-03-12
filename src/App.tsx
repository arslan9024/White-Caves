import React, { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
import { setTheme } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './styles/ThemeProvider';
import GlobalStyle from './styles/globalStyles';
import AppLayout from './components/layout/AppLayout';
import UniversalComponents from './components/layout/UniversalComponents';
import RoleGateway from './components/RoleGateway';
import SuspenseLoader from './components/common/SuspenseLoader';
import type { RootState, AppDispatch } from './store/store';
import type { RoleKey } from './config/ROLE_TAB_MAPPING';

// Critical auth pages - loaded immediately (needed early)
import SignInPage from './pages/auth/SignInPage';
import ProfilePage from './pages/auth/ProfilePage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import HomePage from './pages/HomePage';

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
  const [userData, setUserData] = useState<UserRoleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch {
        setUserData(null);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
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

// Owner/MD Sub-Pages
const BusinessModelPage = lazy(() => import('./pages/owner/BusinessModelPage'));
const ClientServicesPage = lazy(() => import('./pages/owner/ClientServicesPage'));
const SystemHealthPage = lazy(() => import('./pages/owner/SystemHealthPage'));
const WhatsAppDashboardPage = lazy(() => import('./pages/owner/WhatsAppDashboardPage'));
const WhatsAppChatbotPage = lazy(() => import('./pages/owner/WhatsAppChatbotPage'));
const WhatsAppAnalyticsPage = lazy(() => import('./pages/owner/WhatsAppAnalyticsPage'));
const WhatsAppSettingsPage = lazy(() => import('./pages/owner/WhatsAppSettingsPage'));

// Public Pages
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Auth Pages
const UAEPassSuccessPage = lazy(() => import('./pages/auth/UAEPassSuccessPage'));
const SignContractPage = lazy(() => import('./pages/SignContractPage'));
const DesignSystemTest = lazy(() => import('./pages/DesignSystemTest'));

// Analytics
import { BiometricPrompt } from './features/auth/components/BiometricLogin';
import { StatusProvider } from './components/common/StatusNotification';
import { SpeedInsights } from '@vercel/speed-insights/react';
import WebVitalsTracker from './components/analytics/WebVitalsTracker';

// ─── App Component ──────────────────────────────────────────────────────

function App(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/@me');
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      } catch {
        // Auth check failed silently — user stays logged out
      }
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  const handleRoleSelect = (role: string): void => {
    localStorage.setItem('userRole', JSON.stringify({
      role,
      selectedAt: new Date().toISOString(),
      locked: true,
    }));
  };

  return (
    <ThemeProvider>
      <GlobalStyle />
      <StatusProvider>
        <LanguageProvider>
          <BrowserRouter>
            <SpeedInsights />
            <WebVitalsTracker />
            <UniversalComponents />
            {user && <BiometricPrompt />}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <PropertiesPage />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <AboutPage />
                </Suspense>
              } />
              <Route path="/services" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <ServicesPage />
                </Suspense>
              } />
              <Route path="/careers" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <CareersPage />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <ContactPage />
                </Suspense>
              } />
              <Route path="/signin" element={user ? <Navigate to="/select-role" replace /> : <SignInPage />} />
              <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
              <Route path="/auth/uaepass-success" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <UAEPassSuccessPage />
                </Suspense>
              } />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" replace />} />
              <Route path="/select-role" element={
                user ? <RoleGateway user={user} onRoleSelect={handleRoleSelect} /> : <Navigate to="/signin" replace />
              } />
              <Route path="/pending-approval" element={user ? <PendingApprovalPage /> : <Navigate to="/signin" replace />} />

              {/* ==================== UNIFIED DASHBOARD ==================== */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== ROLE-SPECIFIC SUB-PAGES ==================== */}
              <Route path="/buyer/mortgage-calculator" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <MortgageCalculatorPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/dld-fees" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <DLDFeesPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/title-deed-registration" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <TitleDeedRegistrationPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/seller/pricing-tools" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <PricingToolsPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/landlord/rental-management" element={
                <ProtectedRoute allowedRoles={['landlord']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <RentalManagementPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/leasing-agent/tenant-screening" element={
                <ProtectedRoute allowedRoles={['leasing-agent']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <TenantScreeningPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/leasing-agent/contracts" element={
                <ProtectedRoute allowedRoles={['leasing-agent']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <ContractManagementPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/secondary-sales-agent/sales-pipeline" element={
                <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <SalesPipelinePage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== ALL DASHBOARD ROUTES → UNIFIED ==================== */}
              <Route path="/lion/dashboard" element={
                <ProtectedRoute allowedRoles={['lion', 'owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/dashboard" element={
                <ProtectedRoute allowedRoles={['owner', 'lion']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/md/dashboard" element={
                <ProtectedRoute allowedRoles={['owner', 'md', 'managing_director', 'lion']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/buyer/dashboard" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/seller/dashboard" element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/landlord/dashboard" element={
                <ProtectedRoute allowedRoles={['landlord']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/leasing-agent/dashboard" element={
                <ProtectedRoute allowedRoles={['leasing-agent']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/secondary-sales-agent/dashboard" element={
                <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/tenant/dashboard" element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <UnifiedDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== LEGACY OWNER ROUTES (DEPRECATED) ==================== */}
              <Route path="/owner/business-model" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <BusinessModelPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/client-services" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <ClientServicesPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/system-health" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <SystemHealthPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <WhatsAppDashboardPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/chatbot" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <WhatsAppChatbotPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/analytics" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <WhatsAppAnalyticsPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/owner/whatsapp/settings" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <AppLayout>
                    <Suspense fallback={<SuspenseLoader />}>
                      <WhatsAppSettingsPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* ==================== OTHER ROUTES ==================== */}
              <Route path="/sign/:token" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <SignContractPage />
                </Suspense>
              } />
              <Route path="/design-system" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <DesignSystemTest />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<SuspenseLoader />}>
                  <NotFoundPage />
                </Suspense>
              } />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </StatusProvider>
    </ThemeProvider>
  );
}

export default App;
