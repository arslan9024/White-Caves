import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/reset.css'
import './App.css'
import './styles/theme.css'
import './styles/design-system.css'
import './styles/rtl.css'
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
import { setTheme } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './styles/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import UniversalComponents from './components/layout/UniversalComponents';
import RoleGateway from './components/RoleGateway';
import SuspenseLoader from './components/common/SuspenseLoader';

// Critical auth pages - loaded immediately (needed early)
import SignInPage from './pages/auth/SignInPage';
import ProfilePage from './pages/auth/ProfilePage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import HomePage from './pages/HomePage';

function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector(state => state.user.currentUser);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {
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

  return children;
}

// ==================== LAZY-LOADED PAGES ====================
// These are split into separate chunks and loaded only when accessed

// Buyer Pages
const BuyerDashboardPage = lazy(() => import('./pages/buyer/BuyerDashboardPage'));
const MortgageCalculatorPage = lazy(() => import('./pages/buyer/MortgageCalculatorPage'));
const DLDFeesPage = lazy(() => import('./pages/buyer/DLDFeesPage'));
const TitleDeedRegistrationPage = lazy(() => import('./pages/buyer/TitleDeedRegistrationPage'));

// Seller Pages
const SellerDashboardPage = lazy(() => import('./pages/seller/SellerDashboardPage'));
const PricingToolsPage = lazy(() => import('./pages/seller/PricingToolsPage'));

// Landlord Pages
const LandlordDashboardPage = lazy(() => import('./pages/landlord/LandlordDashboardPage'));
const RentalManagementPage = lazy(() => import('./pages/landlord/RentalManagementPage'));

// Leasing Agent Pages
const LeasingAgentDashboardPage = lazy(() => import('./pages/leasing-agent/LeasingAgentDashboardPage'));
const TenantScreeningPage = lazy(() => import('./pages/leasing-agent/TenantScreeningPage'));
const ContractManagementPage = lazy(() => import('./pages/leasing-agent/ContractManagementPage'));

// Sales Agent Pages
const SalesAgentDashboardPage = lazy(() => import('./pages/secondary-sales-agent/SalesAgentDashboardPage'));
const SalesPipelinePage = lazy(() => import('./pages/secondary-sales-agent/SalesPipelinePage'));

// Tenant Pages
const TenantDashboardPage = lazy(() => import('./pages/tenant/TenantDashboardPage'));

// Unified Dashboard (NEW - replaces role-specific dashboards)
const UnifiedDashboardPage = lazy(() => import('./pages/UnifiedDashboardPage'));

// Owner/MD Pages (Legacy - will be deprecated)
const OwnerDashboardPage = lazy(() => import('./pages/owner/OwnerDashboardPage'));
const BusinessModelPage = lazy(() => import('./pages/owner/BusinessModelPage'));
const ClientServicesPage = lazy(() => import('./pages/owner/ClientServicesPage'));
const SystemHealthPage = lazy(() => import('./pages/owner/SystemHealthPage'));
const WhatsAppDashboardPage = lazy(() => import('./pages/owner/WhatsAppDashboardPage'));
const WhatsAppChatbotPage = lazy(() => import('./pages/owner/WhatsAppChatbotPage'));
const WhatsAppAnalyticsPage = lazy(() => import('./pages/owner/WhatsAppAnalyticsPage'));
const WhatsAppSettingsPage = lazy(() => import('./pages/owner/WhatsAppSettingsPage'));

// Public Pages (critical paths)
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

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/@me');
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      } catch (error) {
      }
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  const handleRoleSelect = (role) => {
    localStorage.setItem('userRole', JSON.stringify({
      role,
      selectedAt: new Date().toISOString(),
      locked: true
    }));
  };

  return (
  <ThemeProvider>
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
        
        {/* ==================== UNIFIED DASHBOARD FOR ALL ROLES ==================== */}
        {/* Normal users (non-super-user) use this route */}
        {/* They see only their role-specific data filtered */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <UnifiedDashboardPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* ==================== BUYER ROUTES ==================== */}
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <BuyerDashboardPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } />
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
        
        {/* ==================== SELLER ROUTES ==================== */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <SellerDashboardPage />
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
        
        {/* ==================== LANDLORD ROUTES ==================== */}
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <LandlordDashboardPage />
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
        
        {/* ==================== LEASING AGENT ROUTES ==================== */}
        <Route path="/leasing-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <LeasingAgentDashboardPage />
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
        
        {/* ==================== SALES AGENT ROUTES ==================== */}
        <Route path="/secondary-sales-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <SalesAgentDashboardPage />
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
        
        {/* ==================== TENANT ROUTES ==================== */}
        <Route path="/tenant/dashboard" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <TenantDashboardPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* ==================== UNIFIED DASHBOARD (NEW) ==================== */}
        {/* Lion/Owner Super User Dashboard - All features accessible */}
        <Route path="/lion/dashboard" element={
          <ProtectedRoute allowedRoles={['lion', 'owner']}>
            <AppLayout>
              <Suspense fallback={<SuspenseLoader />}>
                <UnifiedDashboardPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Backward compatibility redirects to /lion/dashboard */}
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
        
        {/* Other buyer role dashboards - using UnifiedDashboard for all roles */}
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
        {/* These routes are kept for backward compatibility but redirect to unified dashboard */}
        {/* Will be removed in Phase 6 */}
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

export default App
