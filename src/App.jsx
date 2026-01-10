import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/reset.css'
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
    const role = userData.role;
    const validRoles = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'secondary-sales-agent', 'md'];
    if (validRoles.includes(role)) {
      return <Navigate to={`/${role}/dashboard`} replace />;
    }
    return <Navigate to="/select-role" replace />;
  }

  return children;
}

import BuyerDashboardPage from './pages/buyer/BuyerDashboardPage';
import MortgageCalculatorPage from './pages/buyer/MortgageCalculatorPage';
import DLDFeesPage from './pages/buyer/DLDFeesPage';
import TitleDeedRegistrationPage from './pages/buyer/TitleDeedRegistrationPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import PricingToolsPage from './pages/seller/PricingToolsPage';
import LandlordDashboardPage from './pages/landlord/LandlordDashboardPage';
import RentalManagementPage from './pages/landlord/RentalManagementPage';
import LeasingAgentDashboardPage from './pages/leasing-agent/LeasingAgentDashboardPage';
import TenantScreeningPage from './pages/leasing-agent/TenantScreeningPage';
import ContractManagementPage from './pages/leasing-agent/ContractManagementPage';
import SalesAgentDashboardPage from './pages/secondary-sales-agent/SalesAgentDashboardPage';
import SalesPipelinePage from './pages/secondary-sales-agent/SalesPipelinePage';
import NotFoundPage from './pages/NotFoundPage';
import SignContractPage from './pages/SignContractPage';
import SystemHealthPage from './pages/owner/SystemHealthPage';
import TenantDashboardPage from './pages/tenant/TenantDashboardPage';
import MDDashboardPage from './pages/owner/MDDashboardPage';
import BusinessModelPage from './pages/owner/BusinessModelPage';
import ClientServicesPage from './pages/owner/ClientServicesPage';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import PropertiesPage from './pages/PropertiesPage';
import AboutPage from './pages/AboutPage';
import WhatsAppDashboardPage from './pages/owner/WhatsAppDashboardPage';
import WhatsAppChatbotPage from './pages/owner/WhatsAppChatbotPage';
import WhatsAppAnalyticsPage from './pages/owner/WhatsAppAnalyticsPage';
import WhatsAppSettingsPage from './pages/owner/WhatsAppSettingsPage';
import ModernDashboardPage from './pages/owner/ModernDashboardPage';
import UAEPassSuccessPage from './pages/auth/UAEPassSuccessPage';
import { BiometricPrompt } from './features/auth/components/BiometricLogin';
import { StatusProvider } from './components/common/StatusNotification';
import { SpeedInsights } from '@vercel/speed-insights/react';
import WebVitalsTracker from './components/analytics/WebVitalsTracker';
import DesignSystemTest from './pages/DesignSystemTest';

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
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={user ? <Navigate to="/select-role" replace /> : <SignInPage />} />
        <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/auth/uaepass-success" element={<UAEPassSuccessPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" replace />} />
        <Route path="/select-role" element={
          user ? <RoleGateway user={user} onRoleSelect={handleRoleSelect} /> : <Navigate to="/signin" replace />
        } />
        <Route path="/pending-approval" element={user ? <PendingApprovalPage /> : <Navigate to="/signin" replace />} />
        
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <AppLayout><BuyerDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/buyer/mortgage-calculator" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <AppLayout><MortgageCalculatorPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/buyer/dld-fees" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <AppLayout><DLDFeesPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/buyer/title-deed-registration" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <AppLayout><TitleDeedRegistrationPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AppLayout><SellerDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/seller/pricing-tools" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AppLayout><PricingToolsPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <AppLayout><LandlordDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/landlord/rental-management" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <AppLayout><RentalManagementPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leasing-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <AppLayout><LeasingAgentDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/tenant-screening" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <AppLayout><TenantScreeningPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/contracts" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <AppLayout><ContractManagementPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/secondary-sales-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <AppLayout><SalesAgentDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/secondary-sales-agent/sales-pipeline" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <AppLayout><SalesPipelinePage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tenant/dashboard" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <AppLayout><TenantDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/md/dashboard" element={
          <ProtectedRoute allowedRoles={['md']}>
            <MDDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/md/business-model" element={
          <ProtectedRoute allowedRoles={['md']}>
            <BusinessModelPage />
          </ProtectedRoute>
        } />
        <Route path="/md/client-services" element={
          <ProtectedRoute allowedRoles={['md']}>
            <ClientServicesPage />
          </ProtectedRoute>
        } />
        <Route path="/md/system-health" element={
          <ProtectedRoute allowedRoles={['md']}>
            <SystemHealthPage />
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp" element={
          <ProtectedRoute allowedRoles={['md']}>
            <WhatsAppDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/chatbot" element={
          <ProtectedRoute allowedRoles={['md']}>
            <WhatsAppChatbotPage />
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/analytics" element={
          <ProtectedRoute allowedRoles={['md']}>
            <WhatsAppAnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/md/whatsapp/settings" element={
          <ProtectedRoute allowedRoles={['md']}>
            <WhatsAppSettingsPage />
          </ProtectedRoute>
        } />
        
        {/* Legacy owner routes - redirect to md */}
        <Route path="/owner/*" element={<Navigate to="/md/dashboard" replace />} />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute allowedRoles={['md']}>
            <ModernDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/sign/:token" element={<SignContractPage />} />
        <Route path="/design-system" element={<DesignSystemTest />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
  </StatusProvider>
  );
}

export default App
