import { lazy } from 'react';
import { lazyRetry } from '../../utils/lazyRetry';
import { createLogger } from '../../utils/logger';
import React from 'react';
const log = createLogger('App');
export const UniversalComponents = lazyRetry(
  () => import('../../components/layout/UniversalComponents')
);
export const RoleGateway = lazyRetry(() => import('../../components/RoleGateway'));
export const ProfilePage = lazyRetry(() => import('../../pages/crm/ProfilePage'));
export const PendingApprovalPage = lazyRetry(() => import('../../pages/auth/PendingApprovalPage'));
export const SignInPage = lazyRetry(() => import('../../pages/auth/SignInPage'));
export const HomePage = lazyRetry(() => import('../../pages/HomePage'));
export const ServerStatusPage = lazyRetry(() => import('../../pages/ServerStatusPage'));
export const PricingPage = lazyRetry(() => import('../../pages/PricingPage'));
export const GoalsGalleryPage = lazyRetry(() => import('../../pages/goals/GoalsGalleryPage'));
export const MortgageCalculatorPage = lazy(
  () => import('../../pages/buyer/MortgageCalculatorPage')
);
export const DLDFeesPage = lazy(() => import('../../pages/buyer/DLDFeesPage'));
export const TitleDeedRegistrationPage = lazy(
  () => import('../../pages/buyer/TitleDeedRegistrationPage')
);
export const FavoriteListingsPage = lazy(() => import('../../pages/buyer/FavoriteListings'));
export const SavedSearchesPage = lazy(() => import('../../pages/buyer/SavedSearches'));
export const PricingToolsPage = lazy(() => import('../../pages/seller/PricingToolsPage'));
export const RentalManagementPage = lazy(() => import('../../pages/landlord/RentalManagementPage'));
export const LandlordPortalPage = lazy(() => import('../../pages/landlord/LandlordPortalPage'));
export const TenantPortalPage = lazy(() => import('../../pages/tenant/TenantPortalPage'));
export const BuyerPortalPage = lazy(() => import('../../pages/buyer/BuyerPortalPage'));
export const SellerPortalPage = lazy(() => import('../../pages/seller/SellerPortalPage'));
export const TenantScreeningPage = lazy(
  () => import('../../pages/leasing-agent/TenantScreeningPage')
);
export const ContractManagementPage = lazy(
  () => import('../../pages/leasing-agent/ContractManagementPage')
);
export const SalesPipelinePage = lazy(
  () => import('../../pages/secondary-sales-agent/SalesPipelinePage')
);
export const LeasingAcquisition = lazy(() => import('../../pages/LeasingAcquisition'));
export const LeasingOperationsHub = lazy(() => import('../../pages/LeasingOperationsHub'));
export const LindaWhatsAppCRMPage = lazy(() => import('../../components/crm/LindaWhatsAppCRM'));
export const CRMHubPage = lazy(() => import('../../pages/crm/CRMHubPage'));
export const ModernDashboardPage = lazy(() => import('../../pages/dashboard/ModernDashboardPage'));
export const ViewingsPage = lazy(() => import('../../pages/crm/ViewingsPage'));
export const NadiaPage = lazy(() => import('../../pages/NadiaPage'));
export const ArgentinaGoalPage = lazy(() => import('../../pages/goals/ArgentinaGoalPage'));
export const SystemHealthPage = lazy(() => import('../../pages/owner/SystemHealthPage'));
export const LoginSecurityPage = lazy(() => import('../../pages/owner/LoginSecurityPage'));
export const WhatsAppDashboardPage = lazy(() => import('../../pages/owner/WhatsAppDashboardPage'));
export const WhatsAppChatbotPage = lazy(() => import('../../pages/owner/WhatsAppChatbotPage'));
export const WhatsAppAnalyticsPage = lazy(() => import('../../pages/owner/WhatsAppAnalyticsPage'));
export const WhatsAppSettingsPage = lazy(() => import('../../pages/owner/WhatsAppSettingsPage'));
export const GovernanceDashboard = lazy(
  () => import('../../pages/crm/GovernanceDashboard/GovernanceDashboard')
);
export const PropertiesPage = lazy(() => import('../../pages/PropertiesPage'));
export const PropertyDetailPage = lazy(() => import('../../pages/PropertyDetailPage'));
export const AboutPage = lazy(() => import('../../pages/AboutPage'));
export const ServicesPage = lazy(() => import('../../pages/ServicesPage'));
export const CareersPage = lazy(() => import('../../pages/CareersPage'));
export const ContactPage = lazy(() => import('../../pages/ContactPage'));
export const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));
export const PrivacyPolicyPage = lazy(() => import('../../pages/PrivacyPolicyPage'));
export const TermsPage = lazy(() => import('../../pages/TermsPage'));
export const ToolsPage = lazy(() => import('../../pages/ToolsPage'));
export const AIIntelligencePage = lazy(() => import('../../pages/AIIntelligencePage'));
export const OffPlanPortalPage = lazy(() => import('../../pages/OffPlanPortalPage'));
export const PWAInstallPrompt = lazy(() =>
  import('../../components/pwa/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt }))
);
export const UAEPassSuccessPage = lazy(() => import('../../pages/auth/UAEPassSuccessPage'));
export const SignContractPage = lazy(() => import('../../pages/SignContractPage'));
export const DesignSystemTest = lazy(() => import('../../pages/DesignSystemTest'));
export const ValuationPage = lazy(() => import('../../pages/ValuationPage'));
export const MarketIntelligencePage = lazy(() => import('../../pages/MarketIntelligencePage'));
export const BiometricPrompt = lazy(() =>
  import('../../features/auth/components/BiometricLogin')
    .then(m => ({ default: m.BiometricPrompt }))
    .catch(err => {
      log.warn(
        'BiometricPrompt module failed to load:',
        err instanceof Error ? err.message : String(err)
      );
      return { default: () => null }; // Gracefully degrade — biometric is optional
    })
);
export const WebVitalsTracker = lazy(() => import('../../components/analytics/WebVitalsTracker'));
