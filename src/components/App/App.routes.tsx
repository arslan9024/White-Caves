import { type ReactNode } from 'react';
import React from 'react';
import { HomePage } from './App.pages';
import { PricingPage } from './App.pages';
import { GoalsGalleryPage } from './App.pages';
import { MortgageCalculatorPage } from './App.pages';
import { DLDFeesPage } from './App.pages';
import { TitleDeedRegistrationPage } from './App.pages';
import { FavoriteListingsPage } from './App.pages';
import { SavedSearchesPage } from './App.pages';
import { PricingToolsPage } from './App.pages';
import { RentalManagementPage } from './App.pages';
import { LandlordPortalPage } from './App.pages';
import { TenantPortalPage } from './App.pages';
import { TenantScreeningPage } from './App.pages';
import { ContractManagementPage } from './App.pages';
import { SalesPipelinePage } from './App.pages';
import { LeasingAcquisition } from './App.pages';
import { LeasingOperationsHub } from './App.pages';
import { ViewingsPage } from './App.pages';
import { SystemHealthPage } from './App.pages';
import { LoginSecurityPage } from './App.pages';
import { WhatsAppDashboardPage } from './App.pages';
import { WhatsAppChatbotPage } from './App.pages';
import { WhatsAppAnalyticsPage } from './App.pages';
import { WhatsAppSettingsPage } from './App.pages';
import { GovernanceDashboard } from './App.pages';
import { PropertiesPage } from './App.pages';
import { PropertyDetailPage } from './App.pages';
import { AboutPage } from './App.pages';
import { ServicesPage } from './App.pages';
import { CareersPage } from './App.pages';
import { ContactPage } from './App.pages';
import { PrivacyPolicyPage } from './App.pages';
import { TermsPage } from './App.pages';
import { ToolsPage } from './App.pages';
import { AIIntelligencePage } from './App.pages';
import { OffPlanPortalPage } from './App.pages';
import { UAEPassSuccessPage } from './App.pages';
import { SignContractPage } from './App.pages';
import { ValuationPage } from './App.pages';
import { MarketIntelligencePage } from './App.pages';
export const portalRoutes: Array<{
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
export const ownerWhatsAppRoutes: Array<{ path: string; section: string; page: ReactNode }> = [
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
export const roleSpecificAppRoutes: Array<{
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
    path: '/leasing-ops',
    section: 'Leasing Operations Hub',
    page: <LeasingOperationsHub />,
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
export const ownerCrmRedirectRoutes: Array<{ path: string; to: string }> = [
  { path: '/owner/crm', to: '/crm?tab=overview&cockpit=md' },
  { path: '/owner/crm/leads', to: '/crm?tab=leads&cockpit=md' },
  { path: '/owner/crm/properties', to: '/crm?tab=properties&cockpit=md' },
  { path: '/owner/crm/agents', to: '/crm?tab=agents&cockpit=md' },
];
export const ownerUtilityRoutes: Array<{
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
  {
    path: '/owner/governance',
    section: 'Governance Dashboard',
    page: <GovernanceDashboard />,
    allowedRoles: ['owner'],
  },
];
export const publicRoutes: Array<{ path: string; section: string; page: ReactNode }> = [
  { path: '/', section: 'Home', page: <HomePage /> },
  { path: '/properties', section: 'Properties', page: <PropertiesPage /> },
  { path: '/property/:id', section: 'PropertyDetail', page: <PropertyDetailPage /> },
  { path: '/about', section: 'About', page: <AboutPage /> },
  { path: '/services', section: 'Services', page: <ServicesPage /> },
  { path: '/pricing', section: 'Pricing', page: <PricingPage /> },
  { path: '/careers', section: 'Careers', page: <CareersPage /> },
  { path: '/contact', section: 'Contact', page: <ContactPage /> },
  {
    path: '/privacy-policy',
    section: 'Privacy Policy',
    page: <PrivacyPolicyPage />,
  },
  { path: '/terms', section: 'Terms', page: <TermsPage /> },
  { path: '/tools', section: 'Tools', page: <ToolsPage /> },
  { path: '/goals', section: 'Goals Gallery', page: <GoalsGalleryPage /> },
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
