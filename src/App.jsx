import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/reset.css'
import './styles/skeleton-loader.css'
import './App.css'
import './styles/theme.css'
import './styles/design-system.css'
import './styles/crm-layout.css'
import './styles/rtl.css'
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
import { setTheme } from './store/navigationSlice';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/layout/AppLayout';
import UniversalComponents from './components/layout/UniversalComponents';
import RoleGateway from './components/RoleGateway';
import SignInPage from './pages/auth/SignInPage';
import ProfilePage from './pages/auth/ProfilePage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';

// ============ PAGE LOADER COMPONENT ============
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// ============ LAZY LOADED PAGE IMPORTS ============
// Buyer Pages
const BuyerDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-buyer" */ './pages/buyer/BuyerDashboardPage')
);
const MortgageCalculatorPage = lazy(() => 
  import(/* webpackChunkName: "page-buyer" */ './pages/buyer/MortgageCalculatorPage')
);
const DLDFeesPage = lazy(() => 
  import(/* webpackChunkName: "page-buyer" */ './pages/buyer/DLDFeesPage')
);
const TitleDeedRegistrationPage = lazy(() => 
  import(/* webpackChunkName: "page-buyer" */ './pages/buyer/TitleDeedRegistrationPage')
);

// Seller Pages
const SellerDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-seller" */ './pages/seller/SellerDashboardPage')
);
const PricingToolsPage = lazy(() => 
  import(/* webpackChunkName: "page-seller" */ './pages/seller/PricingToolsPage')
);

// Landlord Pages
const LandlordDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-landlord" */ './pages/landlord/LandlordDashboardPage')
);
const RentalManagementPage = lazy(() => 
  import(/* webpackChunkName: "page-landlord" */ './pages/landlord/RentalManagementPage')
);

// Leasing Agent Pages
const LeasingAgentDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-leasing" */ './pages/leasing-agent/LeasingAgentDashboardPage')
);
const TenantScreeningPage = lazy(() => 
  import(/* webpackChunkName: "page-leasing" */ './pages/leasing-agent/TenantScreeningPage')
);
const ContractManagementPage = lazy(() => 
  import(/* webpackChunkName: "page-leasing" */ './pages/leasing-agent/ContractManagementPage')
);

// Secondary Sales Agent Pages
const SalesAgentDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-secondary-sales" */ './pages/secondary-sales-agent/SalesAgentDashboardPage')
);
const SalesPipelinePage = lazy(() => 
  import(/* webpackChunkName: "page-secondary-sales" */ './pages/secondary-sales-agent/SalesPipelinePage')
);

// Tenant Pages
const TenantDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-tenant" */ './pages/tenant/TenantDashboardPage')
);

// Owner/MD Pages
const MDDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/MDDashboardPage')
);
const BusinessModelPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/BusinessModelPage')
);
const ClientServicesPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/ClientServicesPage')
);
const SystemHealthPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/SystemHealthPage')
);
const WhatsAppDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/WhatsAppDashboardPage')
);
const WhatsAppChatbotPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/WhatsAppChatbotPage')
);
const WhatsAppAnalyticsPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/WhatsAppAnalyticsPage')
);
const WhatsAppSettingsPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/WhatsAppSettingsPage')
);
const ModernDashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/ModernDashboardPage')
);
const CRMWorkspacePage = lazy(() => 
  import(/* webpackChunkName: "page-owner" */ './pages/owner/CRMWorkspacePage')
);

// Public Pages
const ServicesPage = lazy(() => 
  import(/* webpackChunkName: "page-public" */ './pages/ServicesPage')
);
const CareersPage = lazy(() => 
  import(/* webpackChunkName: "page-public" */ './pages/CareersPage')
);
const AboutPage = lazy(() => 
  import(/* webpackChunkName: "page-public" */ './pages/AboutPage')
);
const PropertiesPage = lazy(() => 
  import(/* webpackChunkName: "page-public" */ './pages/PropertiesPage')
);

// Other Pages
const DashboardPage = lazy(() => 
  import(/* webpackChunkName: "page-dashboard" */ './pages/DashboardPage')
);
const NotFoundPage = lazy(() => 
  import(/* webpackChunkName: "page-misc" */ './pages/NotFoundPage')
);
const SignContractPage = lazy(() => 
  import(/* webpackChunkName: "page-misc" */ './pages/SignContractPage')
);
const UAEPassSuccessPage = lazy(() => 
  import(/* webpackChunkName: "page-auth" */ './pages/auth/UAEPassSuccessPage')
);
const DesignSystemTest = lazy(() => 
  import(/* webpackChunkName: "page-misc" */ './pages/DesignSystemTest')
);

// ============ ADDITIONAL IMPORTS ============
import ContactPage from './pages/ContactPage';
import { BiometricPrompt } from './features/auth/components/BiometricLogin';
import { StatusProvider } from './components/common/StatusNotification';
import { SpeedInsights } from '@vercel/speed-insights/react';
import WebVitalsTracker from './components/analytics/WebVitalsTracker';

// ============ PROTECTED ROUTE COMPONENT ============
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

  if (import.meta.env.DEV) {
    return children;
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
    const role = userData.role;
    const validRoles = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'secondary-sales-agent', 'md'];
    if (validRoles.includes(role)) {
      return <Navigate to={`/${role}/dashboard`} replace />;
    }
    return <Navigate to="/select-role" replace />;
  }

  return children;
}

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
  <StatusProvider>
  <LanguageProvider>
    <BrowserRouter>
      <SpeedInsights />
      <WebVitalsTracker />
      <UniversalComponents />
      {user && <BiometricPrompt />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* New Dual Sidebar Dashboard */}
        <Route path="/modern-dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/properties" element={
          <Suspense fallback={<PageLoader />}>
            <PropertiesPage />
          </Suspense>
        } />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/about" element={
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="/services" element={
          <Suspense fallback={<PageLoader />}>
            <ServicesPage />
          </Suspense>
        } />
        <Route path="/careers" element={
          <Suspense fallback={<PageLoader />}>
            <CareersPage />
          </Suspense>
        } />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={user ? <Navigate to="/select-role" replace /> : <SignInPage />} />
        <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/auth/uaepass-success" element={
          <Suspense fallback={<PageLoader />}>
            <UAEPassSuccessPage />
          </Suspense>
        } />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" replace />} />
        <Route path="/select-role" element={
          user ? <RoleGateway user={user} onRoleSelect={handleRoleSelect} /> : <Navigate to="/signin" replace />
        } />
        <Route path="/pending-approval" element={user ? <PendingApprovalPage /> : <Navigate to="/signin" replace />} />
        
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><BuyerDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/buyer/mortgage-calculator" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><MortgageCalculatorPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/buyer/dld-fees" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><DLDFeesPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/buyer/title-deed-registration" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><TitleDeedRegistrationPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><SellerDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/seller/pricing-tools" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><PricingToolsPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><LandlordDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/landlord/rental-management" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><RentalManagementPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/leasing-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><LeasingAgentDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/tenant-screening" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><TenantScreeningPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/contracts" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><ContractManagementPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/secondary-sales-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><SalesAgentDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/secondary-sales-agent/sales-pipeline" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><SalesPipelinePage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/tenant/dashboard" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <Suspense fallback={<PageLoader />}>
              <AppLayout><TenantDashboardPage /></AppLayout>
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/md/dashboard" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <MDDashboardPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/business-model" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <BusinessModelPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/client-services" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <ClientServicesPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/system-health" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <SystemHealthPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <WhatsAppDashboardPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/chatbot" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <WhatsAppChatbotPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/analytics" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <WhatsAppAnalyticsPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/settings" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <WhatsAppSettingsPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/md/crm" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <CRMWorkspacePage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/crm" element={
          <Suspense fallback={<PageLoader />}>
            <CRMWorkspacePage />
          </Suspense>
        } />
        
        {/* Legacy owner routes - redirect to md */}
        <Route path="/owner/*" element={<Navigate to="/md/dashboard" replace />} />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute allowedRoles={['md']}>
            <Suspense fallback={<PageLoader />}>
              <ModernDashboardPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/sign/:token" element={
          <Suspense fallback={<PageLoader />}>
            <SignContractPage />
          </Suspense>
        } />
        <Route path="/design-system" element={
          <Suspense fallback={<PageLoader />}>
            <DesignSystemTest />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
  </StatusProvider>
  );
}

export default App
