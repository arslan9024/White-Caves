import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import './styles/design-system.css'
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
    return <Navigate to={`/${userData.role}/dashboard`} replace />;
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
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
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
import UAEPassSuccessPage from './pages/auth/UAEPassSuccessPage';

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
  <LanguageProvider>
    <BrowserRouter>
      <UniversalComponents />
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
        
        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><OwnerDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/business-model" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><BusinessModelPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/client-services" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><ClientServicesPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/system-health" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><SystemHealthPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/whatsapp" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><WhatsAppDashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/whatsapp/chatbot" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><WhatsAppChatbotPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/whatsapp/analytics" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><WhatsAppAnalyticsPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/whatsapp/settings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppLayout><WhatsAppSettingsPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/sign/:token" element={<SignContractPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </LanguageProvider>
  );
}

export default App
