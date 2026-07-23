/**
 * Dashboard Components — barrel export
 */
export {
  DashboardSubTabRenderer,
  getDashboardComponent,
  getAllRegisteredComponents,
} from './DashboardRenderer';

// Buyer
export {
  BuyerOverview,
  SavedProperties,
  ViewingSchedule,
  PriceAlerts,
  BuyerOffers,
} from './BuyerTabs';

// Seller
export {
  SellerListings,
  SellerInquiries,
  MarketInsights,
  ReceivedOffers,
  SellerAnalytics,
} from './SellerTabs';

// Landlord
export {
  LandlordProperties,
  TenantManagement,
  MaintenanceRequests,
  FinancialSummary,
  LeaseManagement,
} from './LandlordTabs';

// Tenant
export {
  TenantOverview,
  TenantLease,
  TenantPayments,
  TenantMaintenance,
  TenantDocuments,
} from './TenantTabs';

// Agent (Leasing + Sales)
export {
  LeasingPipeline,
  LeasingProperties,
  LeaseContracts,
  LeasingViewings,
  TenantApplications,
  LeaseRenewals,
  SalesPipeline,
  SalesLeads,
  ActiveDeals,
  AgentPerformance,
} from './AgentTabs';

// Owner / Admin
export {
  OwnerOverview,
  BusinessAnalytics,
  WhatsAppDashboard,
  SystemHealth,
  SystemSettings,
} from './OwnerTabs';

// Phase 7 dashboard widgets
export { default as DashboardConfigurator } from './DashboardConfigurator';
export { default as DashboardKPITile } from './KPITile';
export { FunnelChart, GaugeChart, HeatmapChart, SankeyChart, TimelineChart } from './charts';
