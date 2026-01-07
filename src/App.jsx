import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/design-system.css'
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
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

  const handleRoleSelect = (role) => {
    localStorage.setItem('userRole', JSON.stringify({
      role,
      selectedAt: new Date().toISOString(),
      locked: true
    }));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signin" element={user ? <Navigate to="/select-role" replace /> : <SignInPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" replace />} />
        <Route path="/select-role" element={
          user ? <RoleGateway user={user} onRoleSelect={handleRoleSelect} /> : <Navigate to="/signin" replace />
        } />
        <Route path="/pending-approval" element={user ? <PendingApprovalPage /> : <Navigate to="/signin" replace />} />
        
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/buyer/mortgage-calculator" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <MortgageCalculatorPage />
          </ProtectedRoute>
        } />
        <Route path="/buyer/dld-fees" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <DLDFeesPage />
          </ProtectedRoute>
        } />
        <Route path="/buyer/title-deed-registration" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <TitleDeedRegistrationPage />
          </ProtectedRoute>
        } />
        
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/seller/pricing-tools" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <PricingToolsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <LandlordDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/landlord/rental-management" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <RentalManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/leasing-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <LeasingAgentDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/tenant-screening" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <TenantScreeningPage />
          </ProtectedRoute>
        } />
        <Route path="/leasing-agent/contracts" element={
          <ProtectedRoute allowedRoles={['leasing-agent']}>
            <ContractManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/secondary-sales-agent/dashboard" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <SalesAgentDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/secondary-sales-agent/sales-pipeline" element={
          <ProtectedRoute allowedRoles={['secondary-sales-agent']}>
            <SalesPipelinePage />
          </ProtectedRoute>
        } />
        
        <Route path="/tenant/dashboard" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/owner/business-model" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <BusinessModelPage />
          </ProtectedRoute>
        } />
        <Route path="/owner/client-services" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <ClientServicesPage />
          </ProtectedRoute>
        } />
        <Route path="/owner/system-health" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <SystemHealthPage />
          </ProtectedRoute>
        } />
        
        <Route path="/sign/:token" element={<SignContractPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
